import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import isUpdateAvailableResponseDto from './dto/isUpdateAvailable.response.dto'
import { updateDto } from './dto/update.dto'
import { Platform } from './enums/platform.enum'
import { UpdatesService } from './updates.service'

@ApiTags('Updates')
@Controller('updates')
export class UpdatesController {
    constructor(private readonly updatesService: UpdatesService) {}

    @Get('is-available')
    @ApiOperation({ summary: 'Есть ли обновление для текущей версии' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: isUpdateAvailableResponseDto,
        description: 'Есть ли обновление'
    })
    @ApiQuery({
        name: 'platform',
        description: 'Платформа обновления',
        type: String,
        required: true,
        example: 'android'
    })
    @ApiQuery({
        name: 'version',
        description: 'Текущая версия программы',
        type: String,
        required: true,
        example: '2.0.0'
    })
    async isUpdateAvailable(
        @Query('platform') platform: Platform,
        @Query('version') version: string
    ): Promise<isUpdateAvailableResponseDto> {
        return this.updatesService.isAvailable(platform, version)
    }

    @Get('latest')
    @ApiOperation({ summary: 'Получить информацию о последнем обновлении' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: updateDto,
        description: 'Инфомация о последнем обновлении'
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Последнее обновление не найдено'
    })
    @ApiQuery({
        name: 'platform',
        description: 'Платформа обновления',
        type: String,
        required: true,
        example: 'android'
    })
    async getLatestUpdate(@Query('platform') platform: Platform): Promise<updateDto> {
        return this.updatesService.latestUpdate(platform)
    }

    @Get('all')
    @ApiOperation({ summary: 'Получить информацию о всех обновлениях' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: updateDto,
        isArray: true,
        description: 'Инфомация о всех обновлениях'
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Обновления не найдены'
    })
    @ApiQuery({
        name: 'platform',
        description: 'Платформа обновления',
        type: String,
        required: true,
        example: 'android'
    })
    @ApiQuery({
        name: 'limit',
        description: 'Количество обновлений для получения (по умолчанию все)',
        type: Number,
        required: false,
        example: 2
    })
    @ApiQuery({
        name: 'offset',
        description: 'Количество пропущенных обновлений (по умолчанию 0)',
        type: Number,
        required: false,
        example: 1
    })
    async getAllUpdates(
        @Query('platform') platform: Platform,
        @Query('limit') limit: number,
        @Query('offset') offset: number
    ): Promise<updateDto[]> {
        return this.updatesService.allUpdates(platform, limit, offset)
    }

    @Get('info')
    @ApiOperation({ summary: 'Получить информацию о обновлении' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: updateDto,
        description: 'Инфомация о обновлении'
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Обновление не найдено'
    })
    @ApiQuery({
        name: 'platform',
        description: 'Платформа обновления',
        type: String,
        required: true,
        example: 'android'
    })
    @ApiQuery({
        name: 'version',
        description: 'Версия программы',
        type: String,
        required: true,
        example: '2.0.0'
    })
    async getUpdateInfo(@Query('platform') platform: Platform, @Query('version') version: string): Promise<updateDto> {
        return this.updatesService.updateInfo(platform, version)
    }
}
