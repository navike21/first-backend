import { ENG, SUCCESS, WARNING } from '../../../constants'
import express from 'express'
import { TPayloadError, TPayloadSuccess, TRequest, TResponse } from '../../../types'
import { handleStringToJSON, responseError, responseSuccess } from '../../../utils'
import { ProjectModel } from '../models'
import { Error } from 'mongoose'
import { projectMessage } from '../languages'

class ProjectController {
  private static getHeaderLanguage(request: TRequest): string {
    return request.headers['accept-language'] ?? ENG
  }

  private sendSuccessResponse = <T>(
    response: TResponse,
    data: T,
    message: string,
    code: number = 200
  ) => {
    const payload: TPayloadSuccess<T> = {
      code,
      data,
      message,
      status: SUCCESS
    }
    responseSuccess(response, payload)
  }

  private handleError = (
    response: TResponse,
    error: Error,
    defaultMessage: string = 'An error occurred'
  ) => {
    console.error(error)
    const errorProps = error
    const errorParsed = handleStringToJSON(errorProps.message)
    const payloadError: TPayloadError = {
      error: {
        code: 500,
        message: errorParsed.message || defaultMessage,
        data: errorParsed.data || null
      },
      status: WARNING
    }
    responseError(response, payloadError)
  }

  private validateProjectData = (data: any) => {
    if (!data.name || !data.description) {
      throw new Error(
        JSON.stringify({
          error: {
            code: 400,
            message: 'Name and description are required'
          },
          status: WARNING
        })
      )
    }
  }

  getAllProjects = async (request: TRequest, response: TResponse) => {
    const lang = ProjectController.getHeaderLanguage(request)
    const { multipleFoundProject, multipleNotFoundProject } = projectMessage[lang]
    try {
      const projects = await ProjectModel.find().lean()
      this.sendSuccessResponse(
        response,
        projects,
        projects.length === 0 ? multipleNotFoundProject : multipleFoundProject,
        200
      )
    } catch (error) {
      this.handleError(response, error as Error)
    }
  }

  getProjectById = async (request: TRequest, response: TResponse) => {
    const lang = ProjectController.getHeaderLanguage(request)
    const { notFoundProject, singleFoundProject } = projectMessage[lang]
    try {
      const { id } = request.params
      const project = await ProjectModel.findById(id).lean()
      if (!project) throw new Error(notFoundProject)
      this.sendSuccessResponse(response, project, singleFoundProject)
    } catch (error) {
      this.handleError(response, error as Error, notFoundProject)
    }
  }

  createProject = async (request: express.Request, response: TResponse) => {
    const lang = ProjectController.getHeaderLanguage(request)
    const { createdProject } = projectMessage[lang]
    try {
      this.validateProjectData(request.body)
      const { name, description } = request.body
      const projectPayload = {
        name,
        description,
        createdAt: new Date(),
        client: '60f1b3b3b3b3b3b3b3b3b3b3'
      }
      const project = await ProjectModel.create(projectPayload)
      this.sendSuccessResponse(response, project, createdProject, 201)
    } catch (error) {
      this.handleError(response, error as Error)
    }
  }

  updateProject = async (request: TRequest, response: TResponse) => {
    try {
      const { id } = request.params
      this.validateProjectData(request.body)
      const project = await ProjectModel.findByIdAndUpdate(id, request.body, {
        new: true,
        lean: true
      })
      if (!project) throw new Error('Project not found')
      this.sendSuccessResponse(response, project, 'Project updated')
    } catch (error) {
      this.handleError(response, error as Error, 'Project not found or invalid data')
    }
  }

  deleteProject = async (request: TRequest, response: TResponse) => {
    try {
      const { id } = request.params
      await ProjectModel.findByIdAndDelete(id)
      this.sendSuccessResponse(response, null, 'Project deleted')
    } catch (error) {
      this.handleError(response, error as Error, 'Project not found')
    }
  }

  deleteAllProjects = async (_: TRequest, response: TResponse) => {
    try {
      await ProjectModel.deleteMany()
      this.sendSuccessResponse(response, null, 'All projects deleted')
    } catch (error) {
      this.handleError(response, error as Error)
    }
  }

  getProjectByTitle = async (request: TRequest, response: TResponse) => {
    try {
      const { title } = request.params
      const project = await ProjectModel.findOne({
        title
      }).lean()
      if (!project) throw new Error('Project not found')
      this.sendSuccessResponse(response, project, 'Project found')
    } catch (error) {
      this.handleError(response, error as Error, 'Project not found')
    }
  }
}

export default new ProjectController()
