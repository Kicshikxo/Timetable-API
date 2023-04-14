import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { TimetableModule } from './timetable.module'

export const createDocument = (app: INestApplication) => {
    const options = new DocumentBuilder()
        .setTitle('Kicshikxo Timetable API')
        .setDescription('<a href="https://github.com/Kicshikxo/Timetable-API#readme" target="_blank"><b>Документация</b></a>')
        .setVersion('')
        .addBearerAuth()
        .build()

    const document = SwaggerModule.createDocument(app, options, {
        include: [TimetableModule]
    })

    return document
}

export const createSwagger = (app: INestApplication, options?: { path?: string }) => {
    const document = createDocument(app)

    SwaggerModule.setup(options?.path ?? '/', app, document, {
        customCss: '.swagger-ui .topbar{display:none}*{outline:none!important;font-family:Rubik,sans-serif!important}',
        customCssUrl: 'https://fonts.googleapis.com/css2?family=Rubik&display=swap',
        customSiteTitle: 'Kicshikxo Timetable API'
    })
}
