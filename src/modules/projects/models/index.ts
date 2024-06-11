import mongoose from 'mongoose'
import { ProjectSchema } from '../schemas'

export const ProjectModel = mongoose.model('Project', ProjectSchema)
