import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TahuWatch API',
      version: '1.0.0',
      description: 'Personal watch list API'
    },
    servers: [
      {
        url: process.env.BASE_URL
      }
    ]
  },
  apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

export { swaggerSpec, swaggerUi }
