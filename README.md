# 🧠 Brain Tumor Detection System Using Deep Learning

A full-stack web application for automated brain tumor detection and classification using ResNet50 deep learning model with Grad-CAM visualization.

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Node](https://img.shields.io/badge/node-16+-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Model Information](#model-information)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
<a id="features"></a>
## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication system
- 📤 **Image Upload** - Support for JPEG, PNG, and DICOM medical imaging formats
- 🤖 **AI-Powered Analysis** - ResNet50-based tumor classification
- 🎨 **Grad-CAM Visualization** - Visual explanation of AI decision-making
- 📊 **Multi-View Display** - Original scan, Grad-CAM overlay, and heatmap views
- 📈 **Classification Results** - Detailed probability breakdown for all tumor types
- 💾 **Scan History** - Track and manage all previous scans
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Processing** - Asynchronous scan processing with status updates

### Tumor Types Detected

- Glioma
- Meningioma
- Pituitary Tumor
- No Tumor (Healthy)

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend
- **Node.js** with Express.js
- **TypeScript** - Type-safe backend
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcrypt** - Password hashing

### AI/ML
- **Python** 3.8+
- **PyTorch** - Deep learning framework
- **ResNet50** - Pre-trained CNN model
- **Grad-CAM** - Explainable AI visualization
- **OpenCV** - Image processing
- **Pillow** - Image manipulation

## 🏗️ System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│  Frontend   │────────▶│   Backend   │────────▶│   Scanner   │
│  (React)    │   API   │  (Express)  │  Spawn  │  (Python)   │
│             │◀────────│             │◀────────│             │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              │
                              ▼
                        ┌─────────────┐
                        │             │
                        │   MongoDB   │
                        │             │
                        └─────────────┘
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version  # Should be v16+
npm --version   # Should be v8+
python --version  # Should be 3.8+
mongod --version  # Should be 4.4+
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/iamumerjz/MRI-Based-Brain-Tumor-Detection-Using-Deep-Learning-and-Vue.git
cd MRI-Based-Brain-Tumor-Detection-Using-Deep-Learning-and-Vue
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Backend `.env` Configuration:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brain-tumor-detection
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file
nano .env
```

**Frontend `.env` Configuration:**

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Scanner (Python) Setup

```bash
# Navigate to scanner directory (from root)
cd ../scanner

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Create `requirements.txt`:**

```txt
torch==2.0.1
torchvision==0.15.2
numpy==1.24.3
pillow==10.0.0
opencv-python==4.8.0.74
```

### 5. Download Pre-trained Model

Place your trained ResNet50 model file in the `scanner` directory:

```bash
cd scanner
# Your model file should be named: best_resnet50_brain_tumor.pth
```

**Model Requirements:**
- PyTorch checkpoint (.pth file)
- Must contain `model_state` and `classes` keys
- ResNet50 architecture
- Trained on brain tumor dataset

### 6. MongoDB Setup

```bash
# Start MongoDB service
# On Windows (as Administrator):
net start MongoDB

# On macOS:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# Verify MongoDB is running
mongo --eval "db.version()"
```

## 🏃 Running the Application

### Option 1: Run All Services Individually

**Terminal 1 - MongoDB:**
```bash
# Make sure MongoDB is running
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Server will start at http://localhost:5000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend will start at http://localhost:5173
```

**Terminal 4 - Test Scanner (Optional):**
```bash
cd scanner
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py path/to/test/image.jpg path/to/output/directory
```

### Option 2: Using Process Manager (Recommended)

Create a `start.sh` script in the root directory:

```bash
#!/bin/bash

# Start MongoDB
mongod &

# Start Backend
cd backend && npm run dev &

# Start Frontend
cd frontend && npm run dev &

echo "All services started!"
echo "Frontend: http://localhost:8080"
echo "Backend: http://localhost:5000"
```

Make it executable and run:
```bash
chmod +x start.sh
./start.sh
```

### Option 3: Using Docker (Advanced)

Create a `docker-compose.yml` in the root directory:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/brain-tumor-detection

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  mongo-data:
```

Run with:
```bash
docker-compose up
```

## 📁 Project Structure

```
brain-tumor-detection/
│
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── lib/             # Utilities and helpers
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   ├── config/          # Configuration files
│   │   └── server.ts        # Server entry point
│   ├── uploads/             # Uploaded scan files
│   ├── package.json
│   └── tsconfig.json
│
├── scanner/                  # Python AI scanner
│   ├── main.py              # Main inference script
│   ├── best_resnet50_brain_tumor.pth  # Trained model
│   ├── requirements.txt     # Python dependencies
│   └── venv/                # Virtual environment
│
└── README.md
```

## 📡 API Documentation

### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Scan Operations

**Upload Scan**
```http
POST /api/scan/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

scan: <file>
```

**Get Scan Details**
```http
GET /api/scan/:scanId
Authorization: Bearer <token>
```

**List All Scans**
```http
GET /api/scan/list
Authorization: Bearer <token>
```

**Get Scan Image**
```http
GET /api/scan/:scanId/images/:type
Authorization: Bearer <token>

# type can be: original, overlay, heatmap
```

**Delete Scan**
```http
DELETE /api/scan/:scanId
Authorization: Bearer <token>
```

## 🤖 Model Information

### ResNet50 Architecture

The system uses a modified ResNet50 architecture:

- **Input Size:** 224x224x3 (RGB images)
- **Pre-trained:** ImageNet weights
- **Fine-tuned:** On brain tumor dataset
- **Output Classes:** 4 (Glioma, Meningioma, Pituitary, No Tumor)
- **Activation:** Softmax for probability distribution

### Grad-CAM Visualization

Gradient-weighted Class Activation Mapping (Grad-CAM) provides visual explanations by:
1. Computing gradients of target class with respect to feature maps
2. Generating heatmap highlighting important regions
3. Overlaying heatmap on original image

### Performance Metrics

- **Accuracy:** ~95% on test set
- **Inference Time:** ~2-6 seconds per scan
- **Confidence Threshold:** 50% for positive detection

## 🖼️ Screenshots

### Landing Page
<img width="900" height="10000" alt="image" src="https://github.com/user-attachments/assets/945109dc-c546-4f2c-8dfa-55548c7d97cb" />

### Dashboard
<img width="900" height="1766" alt="image" src="https://github.com/user-attachments/assets/53e46ad5-ac77-4fd3-bb37-fcc471c28f71" />

### Scan Results
<img width="900" height="2508" alt="image" src="https://github.com/user-attachments/assets/79d029b8-edb3-48f2-997c-673ee78c4a59" />

### Grad-CAM Visualization
<img width="600" height="700" alt="image" src="https://github.com/user-attachments/assets/cf8d4217-e311-4bc9-a944-4718c27e1357" />

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongo --eval "db.version()"

# Restart MongoDB
sudo systemctl restart mongod
```

**2. Python Dependencies Error**
```bash
# Upgrade pip
pip install --upgrade pip

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**3. Port Already in Use**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

**4. CORS Issues**
- Ensure backend CORS is configured to allow frontend origin
- Check `VITE_API_URL` in frontend `.env`

**5. Model Not Found**
- Verify `best_resnet50_brain_tumor.pth` exists in `scanner/` directory
- Check file permissions

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Python Scanner Tests
```bash
cd scanner
source venv/bin/activate
python -m pytest tests/
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brain-tumor-detection
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
MAX_FILE_SIZE=52428800
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NeuroScan
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
cd backend
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
cd frontend
vercel deploy --prod
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow existing code style

## 👥 Authors

- **Muhammad Umer Ijaz** - *Initial work* - [iAmUmerJz](https://github.com/iamumerjz)

## 🙏 Acknowledgments

- ResNet50 architecture from torchvision
- Grad-CAM implementation based on original paper
- Brain tumor dataset from Kaggle
- shadcn/ui for beautiful components
- OpenAI for development assistance

## 📞 Support

For support, open an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] 3D MRI scan support
- [ ] Multi-slice analysis
- [ ] Doctor dashboard for patient management
- [ ] Export reports as PDF
- [ ] Integration with PACS systems
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard

## ⚠️ Disclaimer

This application is for educational and research purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical decisions.

---

Made with ❤️ by Muhammad Umer Ijaz
