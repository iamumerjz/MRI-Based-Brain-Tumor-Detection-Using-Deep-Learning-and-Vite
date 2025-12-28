// // backend/src/models/User.ts
// import mongoose, { Document, Schema } from 'mongoose';

// // TypeScript interface for User document
// export interface IUser extends Document {
//   _id: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
//   password: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Mongoose schema definition
// const userSchema = new Schema<IUser>(
//   {
//     name: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     password: {
//       type: String,
//       required: true
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // Export the model
// export default mongoose.model<IUser>('User', userSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', UserSchema);
