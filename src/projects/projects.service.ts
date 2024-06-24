import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Projects, ProjectsDocument } from './schema/project.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Projects.name) private projectsModule: Model<ProjectsDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.projectsModule.create(createProjectDto);
  }

  findAll() {
    return this.projectsModule.find();
  }

  findOne(id: number) {
    return this.projectsModule.findById(id);
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectsModule.findByIdAndUpdate(id, updateProjectDto, {
      new: true,
    });
  }

  remove(id: number) {
    return this.projectsModule.findByIdAndDelete(id);
  }
}
