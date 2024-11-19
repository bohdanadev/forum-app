import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(plainPassword: string): Promise<boolean>;
}

export const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: String,
    email: String,
    password: String,
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
