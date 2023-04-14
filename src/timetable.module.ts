import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth/auth.controller'
import { AuthMiddleware } from './auth/auth.middleware'
import { AuthService } from './auth/auth.service'
import { DatabaseService } from './database.service'
import { TimetableController } from './timetable.controller'
import { TimetableService } from './timetable.service'
import { UpdatesController } from './updates/updates.controller'
import { UpdatesService } from './updates/updates.service'

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('TIMETABLE_AUTH_SECRET_KEY')
            }),
            inject: [ConfigService]
        }),
        ConfigModule.forRoot()
    ],
    controllers: [TimetableController, AuthController, UpdatesController],
    providers: [DatabaseService, TimetableService, AuthService, UpdatesService]
})
export class TimetableModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: '/timetable/weeks', method: RequestMethod.GET },
                { path: '/timetable/auth/check-login', method: RequestMethod.GET }
            )
    }
}
