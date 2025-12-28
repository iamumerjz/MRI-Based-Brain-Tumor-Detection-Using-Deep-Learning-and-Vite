import mongoose, { Document, Schema } from 'mongoose';

export interface IScan extends Document {
  userId: mongoose.Types.ObjectId;
  scanId: string;
  fileName: string;
  originalPath: string;
  overlayPath: string;
  heatmapPath: string;
  result: {
    predClass: string;
    confidence: number;
    allProbs: Record<string, number>;
    hasTumor: boolean;
    riskLevel: string;
  };
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  processingTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScanSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    scanId: {
      type: String,
      required: true,
      unique: true
    },
    fileName: {
      type: String,
      required: true
    },
    originalPath: {
      type: String,
      required: true
    },
    overlayPath: {
      type: String
    },
    heatmapPath: {
      type: String
    },
    result: {
      predClass: String,
      confidence: Number,
      allProbs: Schema.Types.Mixed,
      hasTumor: Boolean,
      riskLevel: String
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing'
    },
    error: String,
    processingTime: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IScan>('Scan', ScanSchema);