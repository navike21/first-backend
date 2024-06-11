import { Router } from 'express'
import ProjectController from '../controllers'

const { getAllProjects, createProject, deleteProject, deleteAllProjects, getProjectByTitle } =
  ProjectController

export default (router: Router) => {
  router.get('/projects', getAllProjects)
  router.post('/projects', createProject)
  router.delete('/projects/:id', deleteProject)
  router.delete('/projects', deleteAllProjects)
  router.get('/projects/:title', getProjectByTitle)
}
