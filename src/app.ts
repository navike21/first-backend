import express, { Express } from 'express'

import { connectDataBase, corsConfig } from './config'
import { PORT } from './constants/environments'
import routers from './routers'

const app: Express = express()

app.use(express.json())

corsConfig()
connectDataBase()

app.get('/', (req, res): void => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.use('/', routers())
