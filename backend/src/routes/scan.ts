import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import authMiddleware, { AuthRequest } from '../middleware/auth';
import Scan from '../models/Scan';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const authReq = req as AuthRequest;
    const userDir = path.join(uploadsDir, authReq.user!._id.toString());
    
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'scan-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|dcm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/dicom';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only DICOM, JPEG, and PNG files are allowed'));
    }
  }
});

// Upload and analyze scan
router.post('/upload', authMiddleware, upload.single('scan'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const userId = req.user!._id;
    const scanId = `SCAN-${Date.now()}`;
    const originalPath = req.file.path;

    // Create scan record
    const scan = new Scan({
      userId,
      scanId,
      fileName: req.file.originalname,
      originalPath,
      status: 'processing'
    });

    await scan.save();

    // Run Python scanner asynchronously
    runPythonScanner(scan._id.toString(), originalPath, userId.toString());

    res.status(202).json({
      message: 'Scan uploaded successfully and is being processed',
      scanId: scan._id,
      status: 'processing'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload scan' });
  }
});

// Get all scans for user
router.get('/list', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const scans = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      scans: scans.map(scan => ({
        id: scan._id,
        scanId: scan.scanId,
        fileName: scan.fileName,
        status: scan.status,
        result: scan.result,
        createdAt: scan.createdAt,
        processingTime: scan.processingTime
      }))
    });
  } catch (error) {
    console.error('List scans error:', error);
    res.status(500).json({ message: 'Failed to retrieve scans' });
  }
});

// Get specific scan details
router.get('/:scanId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { scanId } = req.params;

    const scan = await Scan.findOne({ _id: scanId, userId });

    if (!scan) {
      res.status(404).json({ message: 'Scan not found' });
      return;
    }

    res.json({
      id: scan._id,
      scanId: scan.scanId,
      fileName: scan.fileName,
      status: scan.status,
      result: scan.result,
      createdAt: scan.createdAt,
      processingTime: scan.processingTime,
      error: scan.error
    });
  } catch (error) {
    console.error('Get scan error:', error);
    res.status(500).json({ message: 'Failed to retrieve scan' });
  }
});

// Get scan images
router.get('/:scanId/images/:type', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { scanId, type } = req.params;

    const scan = await Scan.findOne({ _id: scanId, userId });

    if (!scan) {
      res.status(404).json({ message: 'Scan not found' });
      return;
    }

    let imagePath: string | undefined;
    
    if (type === 'original') {
      imagePath = scan.originalPath;
    } else if (type === 'overlay') {
      imagePath = scan.overlayPath;
    } else if (type === 'heatmap') {
      imagePath = scan.heatmapPath;
    }

    if (!imagePath || !fs.existsSync(imagePath)) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ message: 'Failed to retrieve image' });
  }
});

// Delete scan
router.delete('/:scanId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { scanId } = req.params;

    const scan = await Scan.findOne({ _id: scanId, userId });

    if (!scan) {
      res.status(404).json({ message: 'Scan not found' });
      return;
    }

    // Delete files
    [scan.originalPath, scan.overlayPath, scan.heatmapPath].forEach(filePath => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete results directory if exists
    const resultsDir = path.dirname(scan.overlayPath || '');
    if (resultsDir && fs.existsSync(resultsDir)) {
      fs.rmSync(resultsDir, { recursive: true, force: true });
    }

    await Scan.deleteOne({ _id: scanId });

    res.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    console.error('Delete scan error:', error);
    res.status(500).json({ message: 'Failed to delete scan' });
  }
});

// Helper function to run Python scanner
// Helper function to run Python scanner
async function runPythonScanner(scanId: string, imagePath: string, userId: string) {
  const startTime = Date.now();
  const userDir = path.join(uploadsDir, userId);
  const outputDir = path.join(userDir, `results-${scanId}`);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const overlayPath = path.join(outputDir, 'gradcam_overlay.png');
  const heatmapPath = path.join(outputDir, 'gradcam_heatmap.png');

  // Path to Python script
  const pythonScript = path.join(__dirname, '../../../scanner/main.py');

  // Check if Python script exists
  if (!fs.existsSync(pythonScript)) {
    console.error('Python script not found at:', pythonScript);
    await updateScanStatus(scanId, 'failed', 'Python script not found');
    return;
  }

  // Spawn Python process with BOTH image path AND output directory
  const pythonProcess = spawn('python', [pythonScript, imagePath, outputDir]);

  let stdout = '';
  let stderr = '';

  pythonProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  pythonProcess.on('close', async (code) => {
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('Python process closed with code:', code);
    console.log('STDOUT:', stdout);
    console.log('STDERR:', stderr);

    try {
      const scan = await Scan.findById(scanId);
      if (!scan) {
        console.error('Scan not found in database:', scanId);
        return;
      }

      if (code === 0 && fs.existsSync(overlayPath) && fs.existsSync(heatmapPath)) {
  // Parse output to extract results
  const result = parsePythonOutput(stdout);
  
  console.log('Parsed result:', result);
  
  // Check if it's a tumor by checking the predicted class name
  const predClassLower = result.predClass.toLowerCase();
  const isNoTumor = predClassLower.includes('no tumor') || 
                     predClassLower.includes('notumor') || 
                     predClassLower === 'normal';
  
  scan.status = 'completed';
  scan.overlayPath = overlayPath;
  scan.heatmapPath = heatmapPath;
  scan.processingTime = `${processingTime} seconds`;
  scan.result = {
    predClass: result.predClass,
    confidence: result.confidence,
    allProbs: result.allProbs,
    hasTumor: !isNoTumor, // Fixed: Set to false when "no tumor" is detected
    riskLevel: determineRiskLevel(result.predClass, result.confidence)
  };
  
  console.log('Scan completed successfully');
  console.log('hasTumor:', !isNoTumor);
} else {
        scan.status = 'failed';
        scan.error = stderr || stdout || 'Scanner failed to process image';
        console.error('Python scanner failed with code:', code);
        console.error('Error details:', stderr || stdout);
        console.error('Overlay exists:', fs.existsSync(overlayPath));
        console.error('Heatmap exists:', fs.existsSync(heatmapPath));
      }

      await scan.save();
    } catch (error) {
      console.error('Error updating scan:', error);
    }
  });

  pythonProcess.on('error', async (error) => {
    console.error('Failed to start Python process:', error);
    await updateScanStatus(scanId, 'failed', 'Failed to start scanner');
  });
}

async function updateScanStatus(scanId: string, status: string, error?: string) {
  try {
    const scan = await Scan.findById(scanId);
    if (scan) {
      scan.status = status as any;
      if (error) scan.error = error;
      await scan.save();
    }
  } catch (err) {
    console.error('Error updating scan status:', err);
  }
}

function parsePythonOutput(output: string): { predClass: string; confidence: number; allProbs: Record<string, number> } {
  console.log('=== PARSING PYTHON OUTPUT ===');
  console.log('Raw output:', output);
  
  const lines = output.split('\n');
  let predClass = 'Unknown';
  let confidence = 0;
  const allProbs: Record<string, number> = {};
  let inProbabilitySection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if we're entering the probability section
    if (trimmedLine.includes('All probabilities') || trimmedLine.includes('probabilities')) {
      inProbabilitySection = true;
      continue;
    }
    
    // Skip separator lines
    if (trimmedLine.match(/^-+$/)) {
      continue;
    }
    
    // Parse class
    if (trimmedLine.startsWith('Class:')) {
      predClass = trimmedLine.split('Class:')[1].trim();
      console.log('Found class:', predClass);
    } 
    // Parse confidence
    else if (trimmedLine.startsWith('Confidence:')) {
      const confStr = trimmedLine.split('Confidence:')[1].trim();
      confidence = parseFloat(confStr) * 100;
      console.log('Found confidence:', confidence);
    } 
    // Parse probability lines (format: "glioma      : 0.9996")
    else if (inProbabilitySection && trimmedLine.includes(':')) {
      const colonIndex = trimmedLine.lastIndexOf(':');
      if (colonIndex > 0) {
        const className = trimmedLine.substring(0, colonIndex).trim();
        const probStr = trimmedLine.substring(colonIndex + 1).trim();
        const probValue = parseFloat(probStr);
        
        if (!isNaN(probValue) && className) {
          allProbs[className] = probValue * 100;
          console.log(`Found probability: ${className} = ${probValue * 100}%`);
        }
      }
    }
  }

  console.log('Final parsed result:');
  console.log('  predClass:', predClass);
  console.log('  confidence:', confidence);
  console.log('  allProbs:', allProbs);
  console.log('=== END PARSING ===');

  return { predClass, confidence, allProbs };
}

function determineRiskLevel(predClass: string, confidence: number): string {
  const predClassLower = predClass.toLowerCase();
  
  // Check for no tumor cases
  if (predClassLower.includes('no tumor') || 
      predClassLower.includes('notumor') || 
      predClassLower === 'normal') {
    return 'Low';
  }
  
  // High-risk tumor types
  if (predClassLower.includes('glioma')) {
    return confidence > 85 ? 'High' : 'Medium';
  }
  
  // Other tumor types
  return confidence > 90 ? 'High' : 'Medium';
}

export default router;