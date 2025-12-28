import os
import sys
import torch
import torch.nn as nn
import numpy as np
from PIL import Image
from torchvision import models, transforms
import cv2

# --------------------
# CONFIG
# --------------------
# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "best_resnet50_brain_tumor.pth")
IMG_SIZE = 224

device = "cuda" if torch.cuda.is_available() else "cpu"

# --------------------
# Load checkpoint
# --------------------
if not os.path.exists(MODEL_PATH):
    print(f"ERROR: Model file not found at {MODEL_PATH}", file=sys.stderr)
    sys.exit(1)

try:
    ckpt = torch.load(MODEL_PATH, map_location=device)
    class_names = ckpt["classes"]
    num_classes = len(class_names)
except Exception as e:
    print(f"ERROR: Failed to load model: {e}", file=sys.stderr)
    sys.exit(1)

# --------------------
# Build model, load weights
# --------------------
try:
    model = models.resnet50(weights=None)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model.load_state_dict(ckpt["model_state"])
    model = model.to(device)
    model.eval()
except Exception as e:
    print(f"ERROR: Failed to build model: {e}", file=sys.stderr)
    sys.exit(1)

# --------------------
# Preprocessing (must match training)
# --------------------
preprocess = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# --------------------
# Grad CAM implementation
# --------------------
class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer

        self.features = None
        self.grads = None

        self.fwd_handle = self.target_layer.register_forward_hook(self._forward_hook)
        self.bwd_handle = self.target_layer.register_full_backward_hook(self._backward_hook)

    def _forward_hook(self, module, inp, out):
        self.features = out

    def _backward_hook(self, module, grad_in, grad_out):
        self.grads = grad_out[0]

    def remove_hooks(self):
        self.fwd_handle.remove()
        self.bwd_handle.remove()

    def generate(self, input_tensor, class_index):
        """
        input_tensor: shape [1, 3, H, W]
        class_index: int, target class for CAM
        returns: cam (H, W) in range 0..1
        """
        self.model.zero_grad()

        logits = self.model(input_tensor)
        score = logits[0, class_index]
        score.backward(retain_graph=False)

        # features: [1, C, h, w], grads: [1, C, h, w]
        grads = self.grads
        feats = self.features

        # Global average pool gradients across spatial dims to get weights
        weights = grads.mean(dim=(2, 3), keepdim=True)  # [1, C, 1, 1]
        cam = (weights * feats).sum(dim=1)              # [1, h, w]
        cam = torch.relu(cam)

        cam = cam.squeeze(0).detach().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

        cam = cv2.resize(cam, (IMG_SIZE, IMG_SIZE))
        return cam, logits.detach()

def load_image_rgb(image_path: str):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")
    img = Image.open(image_path).convert("RGB")
    return img

def predict_and_gradcam(image_path: str, output_dir: str):
    """
    Analyze image and save results to output_dir
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    out_overlay = os.path.join(output_dir, "gradcam_overlay.png")
    out_heatmap = os.path.join(output_dir, "gradcam_heatmap.png")
    
    try:
        img_pil = load_image_rgb(image_path)
    except Exception as e:
        print(f"ERROR: Failed to load image: {e}", file=sys.stderr)
        sys.exit(1)

    x = preprocess(img_pil).unsqueeze(0).to(device)

    # Use last conv block for ResNet50
    cam_engine = GradCAM(model, target_layer=model.layer4)

    # Forward for prediction
    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1).squeeze(0).cpu().numpy()

    pred_idx = int(np.argmax(probs))
    pred_class = class_names[pred_idx]
    pred_conf = float(probs[pred_idx])

    # Generate CAM for predicted class
    try:
        cam, _ = cam_engine.generate(x, class_index=pred_idx)
        cam_engine.remove_hooks()

        # Create overlay
        orig = np.array(img_pil.resize((IMG_SIZE, IMG_SIZE)))
        heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
        heatmap_rgb = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

        overlay = (0.55 * orig + 0.45 * heatmap_rgb).astype(np.uint8)

        Image.fromarray(heatmap_rgb).save(out_heatmap)
        Image.fromarray(overlay).save(out_overlay)
    except Exception as e:
        print(f"ERROR: Failed to generate Grad-CAM: {e}", file=sys.stderr)
        sys.exit(1)

    return {
        "pred_class": pred_class,
        "confidence": pred_conf,
        "all_probs": {class_names[i]: float(probs[i]) for i in range(len(class_names))},
        "overlay_path": out_overlay,
        "heatmap_path": out_heatmap,
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print('Usage: python main.py "image_path" "output_directory"', file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    try:
        result = predict_and_gradcam(image_path, output_dir)

        print("\nPrediction")
        print("----------")
        print("Class:", result["pred_class"])
        print("Confidence:", round(result["confidence"], 4))

        print("\nAll probabilities")
        print("-----------------")
        for k, v in result["all_probs"].items():
            print(f"{k:12s}: {v:.4f}")

        print("\nSaved files")
        print("-----------")
        print("Overlay:", os.path.abspath(result["overlay_path"]))
        print("Heatmap:", os.path.abspath(result["heatmap_path"]))
    except Exception as e:
        print(f"ERROR: Analysis failed: {e}", file=sys.stderr)
        sys.exit(1)