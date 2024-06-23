import express from 'express'
import { TRequest, TResponse } from '../../../types'
import { ProjectModel } from '../models'
import { Error } from 'mongoose'
import { projectMessage } from '../languages'
import { ErrorClass, HeadersClass, SuccessClass } from '../../../classes'

class ProjectController {
  private headerController: HeadersClass
  private successController: SuccessClass
  private errorController: ErrorClass

  constructor() {
    this.headerController = new HeadersClass()
    this.successController = new SuccessClass()
    this.errorController = new ErrorClass()
  }

  getAllProjects = async (request: TRequest, response: TResponse) => {
    const lang = this.headerController.getHeaderLanguage(request)
    const { multipleFoundProject, multipleNotFoundProject } = projectMessage[lang]
    try {
      const projects = await ProjectModel.find().lean()
      this.successController.sendSuccessResponse(
        response,
        projects,
        projects.length === 0 ? multipleNotFoundProject : multipleFoundProject,
        200
      )
    } catch (error) {
      this.errorController.handleError(response, error as Error)
    }
  }

  getProjectById = async (request: TRequest, response: TResponse) => {
    const lang = this.headerController.getHeaderLanguage(request)
    const { notFoundProject, singleFoundProject } = projectMessage[lang]
    try {
      const { id } = request.params
      const project = await ProjectModel.findById(id).lean()
      if (!project) throw new Error(notFoundProject)
      this.successController.sendSuccessResponse(response, project, singleFoundProject)
    } catch (error) {
      this.errorController.handleError(response, error as Error, notFoundProject)
    }
  }

  createProject = async (request: express.Request, response: TResponse) => {
    const lang = this.headerController.getHeaderLanguage(request)
    const { createdProject } = projectMessage[lang]
    try {
      const { name, description } = request.body
      const projectPayload = {
        name,
        description,
        createdAt: new Date(),
        client: '60f1b3b3b3b3b3b3b3b3b3b3'
      }
      const project = await ProjectModel.create(projectPayload)
      this.successController.sendSuccessResponse(response, project, createdProject, 201)
    } catch (error) {
      this.errorController.handleError(response, error as Error)
    }
  }

  updateProject = async (request: TRequest, response: TResponse) => {
    try {
      const { id } = request.params
      const project = await ProjectModel.findByIdAndUpdate(id, request.body, {
        new: true,
        lean: true
      })
      if (!project) throw new Error('Project not found')
      this.successController.sendSuccessResponse(response, project, 'Project updated')
    } catch (error) {
      this.errorController.handleError(
        response,
        error as Error,
        'Project not found or invalid data'
      )
    }
  }

  deleteProject = async (request: TRequest, response: TResponse) => {
    try {
      const { id } = request.params
      await ProjectModel.findByIdAndDelete(id)
      this.successController.sendSuccessResponse(response, null, 'Project deleted')
    } catch (error) {
      this.errorController.handleError(response, error as Error, 'Project not found')
    }
  }

  deleteAllProjects = async (_: TRequest, response: TResponse) => {
    try {
      await ProjectModel.deleteMany()
      this.successController.sendSuccessResponse(response, null, 'All projects deleted')
    } catch (error) {
      this.errorController.handleError(response, error as Error)
    }
  }

  getProjectByTitle = async (request: TRequest, response: TResponse) => {
    try {
      const { title } = request.params
      const project = await ProjectModel.findOne({
        title
      }).lean()
      if (!project) throw new Error('Project not found')
      this.successController.sendSuccessResponse(response, project, 'Project found')
    } catch (error) {
      this.errorController.handleError(response, error as Error, 'Project not found')
    }
  }
}

export default new ProjectController()
