import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { createSwagger } from './swagger'
import { TimetableModule } from './timetable.module'

async function bootstrap() {
    const app = await NestFactory.create(TimetableModule)
    createSwagger(app)
    const configService = app.get(ConfigService)
    await app.listen(configService.get('PORT') ?? 3000)
}
bootstrap()
