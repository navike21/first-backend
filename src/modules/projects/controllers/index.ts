import { SUCCESS, WARNING } from '../../../constants'
import express from 'express'
import { TPayloadError, TPayloadSuccess, TRequest, TResponse } from '../../../types'
import { handleStringToJSON, responseError, responseSuccess } from '../../../utils'
import { ProjectModel } from '../models'
import { Error } from 'mongoose'

class ProjectController {
  getAllProjects = async (_: TRequest, response: TResponse) => {
    try {
      const projects = await ProjectModel.find()

      const message = projects.length === 0 ? 'No projects found' : 'Projects found'
      const status = projects.length === 0 ? WARNING : SUCCESS

      const payload: TPayloadSuccess<typeof projects> = {
        code: 200,
        data: projects,
        message,
        status
      }

      responseSuccess(response, payload)
    } catch (error) {
      console.error(error)
    }
  }

  getProjectById = async (request: TRequest, response: TResponse) => {
    try {
      const { id } = request.params

      const project = await ProjectModel.findById(id)

      const payload: TPayloadSuccess<typeof project> = {
        code: 200,
        data: project,
        message: 'Project found',
        status: SUCCESS
      }

      responseSuccess(response, payload)
    } catch (error) {
      console.error(error)
    }
  }

  createProject = async (request: express.Request, response: TResponse) => {
    try {
      const { name, description } = request.body
      const projectPayload = {
        name,
        description,
        createdAt: new Date(),
        client: '60f1b3b3b3b3b3b3b3b3b3b3'
      }
      const project = await ProjectModel.create(projectPayload).catch(error => {
        const payloadError: TPayloadError = {
          error: {
            code: 409,
            message: error.message,
            data: error.errorResponse
          },
          status: WARNING
        }

        throw new Error(JSON.stringify(payloadError))
      })
      const payload: TPayloadSuccess<typeof project> = {
        code: 201,
        data: project,
        message: 'Project created',
        status: SUCCESS
      }
      responseSuccess(response, payload)
    } catch (error) {
      const errorProps = error as Error

      const errorParsed = handleStringToJSON(errorProps.message)
      responseError(response, errorParsed)
    }
  }

  updateProject = async (request: TRequest, response: TResponse) => {
    try {
      const { id } = request.params

      const project = await ProjectModel.findByIdAndUpdate(id, request.body, { new: true })

      const payload: TPayloadSuccess<typeof project> = {
        code: 200,
        data: project,
        message: 'Project updated',
        status: SUCCESS
      }

      responseSuccess(response, payload)
    } catch (error) {
      console.error(error)
    }
  }

  deleteProject = async (request: TRequest, response: TResponse) => {
    try {
      const { id } = request.params

      await ProjectModel.findByIdAndDelete(id)

      const payload: TPayloadSuccess<null> = {
        code: 200,
        data: null,
        message: 'Project deleted',
        status: SUCCESS
      }

      responseSuccess(response, payload)
    } catch (error) {
      console.error(error)
    }
  }

  deleteAllProjects = async (_: TRequest, response: TResponse) => {
    try {
      await ProjectModel.deleteMany()

      const payload: TPayloadSuccess<null> = {
        code: 200,
        data: null,
        message: 'All projects deleted',
        status: SUCCESS
      }

      responseSuccess(response, payload)
    } catch (error) {
      console.error(error)
    }
  }

  getProjectByTitle = async (request: TRequest, response: TResponse) => {
    try {
      const { title } = request.params

      const project = await ProjectModel.findOne({ title })

      const payload: TPayloadSuccess<typeof project> = {
        code: 200,
        data: project,
        message: 'Project found',
        status: SUCCESS
      }

      responseSuccess(response, payload)
    } catch (error) {
      console.error(error)
    }
  }
}

export default new ProjectController()
