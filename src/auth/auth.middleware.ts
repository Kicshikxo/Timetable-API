import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { tokenDataDto } from './dto/tokenData.dto'

declare module 'express' {
    interface Request {
        timetableUserTokenData?: tokenDataDto
    }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) {}

    use(req: Request, res: Response, next: () => void) {
        req.timetableUserTokenData = this.authService.readToken(req.headers.authorization?.substring('Bearer '.length))
        if (!req.timetableUserTokenData) {
            throw new UnauthorizedException()
        }

        next()
    }
}
