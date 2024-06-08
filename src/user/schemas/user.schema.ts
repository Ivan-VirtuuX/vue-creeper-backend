import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] })
  favorites: string[];

  @Prop({ type: Number, default: 0 })
  discountBalance: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
