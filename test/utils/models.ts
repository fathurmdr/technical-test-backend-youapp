import mongoose from 'mongoose';
import { Profile, ProfileSchema } from '../../src/schemas/profile.schema';
import { User, UserSchema } from '../../src/schemas/user.schema';

export const userModel = mongoose.model(User.name, UserSchema);
export const profileModel = mongoose.model(Profile.name, ProfileSchema);
