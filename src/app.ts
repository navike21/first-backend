import express from 'express'
import { PORT } from './constants'
import { connectDataBase } from './connection'
import { app, corsConfig } from './configurations'
import { mainRouter } from './routers'

app.use(express.json())

corsConfig()
connectDataBase()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use('./', mainRouter())
