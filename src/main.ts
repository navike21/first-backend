import express from 'express'
import { connectDataBase } from './connection'
import { app, corsConfig } from './configurations'
import routers from './routers'
import { PORT } from './common'

app.use(express.json())

corsConfig()
connectDataBase()

app.get('/', (req, res) => {
  res.send(`Hello World! ${PORT}`)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use('/', routers())
