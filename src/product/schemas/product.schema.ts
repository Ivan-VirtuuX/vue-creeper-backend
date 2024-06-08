import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ type: 'ObjectId', ref: 'Product' })
  _id: ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  type: string;

  @Prop()
  imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
