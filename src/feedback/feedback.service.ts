import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async create(createFeedbackDto: any): Promise<Feedback> {
    const createdFeedback = new this.feedbackModel(createFeedbackDto);

    return createdFeedback.save();
  }
}
