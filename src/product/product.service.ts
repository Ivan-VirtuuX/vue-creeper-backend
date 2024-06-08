import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productModel.findByIdAndUpdate(
      productId,
      updateProductDto,
      { new: true },
    );
    if (!existingProduct) {
      throw new NotFoundException('Товар не найден');
    }
    return existingProduct;
  }

  async deleteProduct(productId: string): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(productId);
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }
    return product;
  }

  async getProduct(productId: string): Promise<Product> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }
    return product;
  }

  async getProducts(type: string): Promise<Product[]> {
    return this.productModel.find({ type }).exec();
  }

  async getFourByCategory(limit: number, type: string): Promise<Product[]> {
    return this.productModel.find({ type }).limit(limit).exec();
  }

  async search(query: string): Promise<Product[]> {
    return await this.productModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { desc: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }
}
