import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectsDocument = Projects & Document;

@Schema({
  validateBeforeSave: true,
  timestamps: true,
})
export class Projects {
  @Prop({
    unique: true,
  })
  name: string;

  @Prop({
    type: Object,
  })
  description: Record<string, string>;

  @Prop()
  imageUrl: string;

  @Prop()
  projectUrl: string;

  @Prop({
    type: [String],
  })
  technologies: string[];

  @Prop({
    type: [String],
  })
  categories: string[];
}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);
