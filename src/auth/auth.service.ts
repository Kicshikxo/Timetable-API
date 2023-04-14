import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync, hashSync } from 'bcrypt'
import { DatabaseService } from '../database.service'
import { checkLoginResponseDto } from './dto/checkLogin.response.dto'
import { loginDataDto } from './dto/login.data.dto'
import { loginResponseDto } from './dto/login.response.dto'
import { tokenDataDto } from './dto/tokenData.dto'
import { Role } from './enums/role.enum'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly databaseService: DatabaseService) {}

    async login(loginData: loginDataDto): Promise<loginResponseDto> {
        const group = `${loginData.group} ${loginData.academicYear}`

        const groupAccess = await this.databaseService.query(`SELECT password FROM group_access WHERE "group" = '${group}'`)

        if (!groupAccess.rowCount) {
            throw new BadRequestException()
        }

        const accessPassword: string = groupAccess.rows[0].password

        if (!loginData.password || !accessPassword) {
            return {
                isAdmin: false,
                groupName: loginData.group,
                groupAcademicYear: loginData.academicYear,
                token: this.jwtService.sign({ group, role: Role.Member })
            }
        }

        if (loginData.password === accessPassword) {
            return {
                isAdmin: true,
                groupName: loginData.group,
                groupAcademicYear: loginData.academicYear,
                token: this.jwtService.sign({
                    group,
                    role: Role.Admin,
                    password: hashSync(loginData.password, 8)
                })
            }
        }

        throw new UnauthorizedException()
    }

    readToken(token?: string): tokenDataDto {
        try {
            return this.jwtService.verify(token ?? '') as tokenDataDto
        } catch {
            throw new UnauthorizedException()
        }
    }

    async checkLogin(tokenData?: tokenDataDto): Promise<checkLoginResponseDto> {
        if (!tokenData) throw new UnauthorizedException()

        const groupAccess = await this.databaseService.query(
            `SELECT password FROM group_access WHERE "group" = '${tokenData.group}'`
        )

        if (groupAccess.rowCount && (!tokenData.password || compareSync(groupAccess.rows[0].password, tokenData.password))) {
            return {
                valid: true,
                isAdmin: tokenData.role == Role.Admin,
                groupName: tokenData.group.split(' ')[0],
                groupAcademicYear: tokenData.group.split(' ')[1]
            }
        } else {
            throw new UnauthorizedException()
        }
    }
}
