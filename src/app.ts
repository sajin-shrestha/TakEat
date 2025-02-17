import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'
import morgan from 'morgan'

import globalErrorHandler from './middlewares/globalErrorHandler'
import userRouter from './router/userRouter'
import logger from './config/logger'
import tableRouter from './router/tableRouter'

const app = express()

app.use(
  morgan('tiny', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
)

app.use(cors())
app.use(helmet())
app.use(express.json())

export const __swaggerDistPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'swagger-ui-dist'
)

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'TakEat API documentation',
      version: '1.0.0',
      description: 'API documentation for the TakEat : cafe-admin backend',
    },
    servers: [{ url: 'https://takeat.vercel.app' }],
  },
  apis: [
    process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '**', '*.js') // For Vercel (compiled JS)
      : path.join(__dirname, '**', '*.ts'), // For Local Development (TS files)
  ],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.get('/docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: '/docs/swagger.json',
    },
  })
)

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TakEat - Your Personal Cafe-Admin Panel' })
})
app.use('/api/users', userRouter)
app.use('/api/tables', tableRouter)

// Global error-handler middleware
app.use(globalErrorHandler)

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`)
  process.exit(1)
})

export default app
