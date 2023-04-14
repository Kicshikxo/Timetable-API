import { Controller, Get, HttpStatus, Query, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { groupDto } from './dto/group.dto'
import { weeksResponseDto } from './dto/weeks.response.dto'
import { TimetableService } from './timetable.service'

@ApiTags('Timetable')
@Controller()
export class TimetableController {
    constructor(private readonly timetableService: TimetableService) {}

    @Get('academic-years')
    @ApiOperation({ summary: 'Получение списка учебных лет' })
    @ApiResponse({
        status: HttpStatus.OK,
        schema: {
            type: 'string[]',
            example: ['2021-2022', '2022-2023']
        },
        isArray: true,
        description: 'Список учебных лет'
    })
    async getAcademicYears(): Promise<string[]> {
        return this.timetableService.getAcademicYears()
    }

    @Get('groups')
    @ApiOperation({ summary: 'Получение списка групп' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: groupDto,
        isArray: true,
        description: 'Список групп'
    })
    @ApiQuery({
        name: 'academic-year',
        description: 'Учебный год группы (по умолчанию все)',
        type: String,
        required: false,
        example: '2022-2023'
    })
    async getGroups(@Query('academic-year') academicYear: string): Promise<groupDto[]> {
        return this.timetableService.getGroups(academicYear)
    }

    @Get('weeks')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение списка недель' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: weeksResponseDto,
        isArray: true,
        description: 'Список недель'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Невалидный токен аутентификации'
    })
    @ApiQuery({
        name: 'limit',
        description: 'Количество недель для получения (по умолчанию все)',
        type: Number,
        required: false,
        example: 42
    })
    @ApiQuery({
        name: 'offset',
        description: 'Количество пропущенных недель (по умолчанию 0)',
        type: Number,
        required: false,
        example: 3
    })
    async getWeeks(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
        @Req() req: Request
    ): Promise<weeksResponseDto> {
        return this.timetableService.getWeeks(limit, offset, req.timetableUserTokenData?.group)
    }
}
