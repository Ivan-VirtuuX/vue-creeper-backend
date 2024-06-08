import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search')
  async search(@Query('text') query: string): Promise<Product[]> {
    return this.productService.search(query);
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Get('first-by-type')
  async getFourByCategory(
    @Query('limit') limit: string,
    @Query('type') type: string,
  ) {
    const parsedLimit = parseInt(limit, 10) || 4;

    return this.productService.getFourByCategory(parsedLimit, type);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productService.getProduct(id);
  }

  @Get()
  async getProducts(@Query() { type }) {
    return this.productService.getProducts(type);
  }
}
