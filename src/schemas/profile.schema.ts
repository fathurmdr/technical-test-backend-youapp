import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type ProfileDocument = mongoose.HydratedDocument<Profile>;

@Schema({
  timestamps: true,
})
export class Profile {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    unique: true,
  })
  user: User;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  birthday: string;

  @Prop({
    required: true,
  })
  horoscope: string;

  @Prop({
    required: true,
  })
  zodiac: string;

  @Prop({
    required: true,
  })
  height: number;

  @Prop({
    required: true,
  })
  weight: number;

  @Prop({
    required: true,
  })
  interests: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
