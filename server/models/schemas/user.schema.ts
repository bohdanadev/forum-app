import mongoose, { Schema, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  avatarUrl: string;
  notifications: Types.ObjectId[];
  comparePassword(plainPassword: string): Promise<boolean>;
}

export const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatarUrl: { type: String },
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.comparePassword = async function (
  plainPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

userSchema.index({ username: 1, email: 1 });

export const UserModel = mongoose.model('User', userSchema);
