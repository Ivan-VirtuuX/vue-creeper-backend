import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { LoginUserDto } from '@/user/dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    return await this.repository.create({
      _id: new mongoose.Types.ObjectId(),
      userId: uuidv4(),
      login: dto.login,
      password: dto.password,
      favorites: [],
      discountBalance: 0,
      createdAt: new Date(),
    });
  }

  async findAll(): Promise<User[]> {
    return await this.repository.findAll();
  }

  async findByCond(cond: LoginUserDto): Promise<User> {
    return await this.repository.findOneBy(cond);
  }
  async findById(_id: string): Promise<User> {
    return await this.repository.findOne(_id);
  }

  async addToFavorites(userId: string, productId: string) {
    return await this.repository.addToFavorites(userId, productId);
  }

  async removeFromFavorites(userId: string, productId: string) {
    return await this.repository.removeFromFavorites(userId, productId);
  }

  async getFavorites(userId: string) {
    return await this.repository.getFavorites(userId);
  }

  async getOrders(userId: string) {
    return await this.repository.getOrders(userId);
  }
}
