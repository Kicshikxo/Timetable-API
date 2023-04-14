import { ApiProperty } from '@nestjs/swagger'
import { Platform } from '../enums/platform.enum'
export class updateDto {
    @ApiProperty({
        example: 'android',
        description: 'Платформа для обновления'
    })
    platform: Platform

    @ApiProperty({
        example: '2.0.0',
        description: 'Версия обновления'
    })
    version: string

    @ApiProperty({
        example: 'https://example.com/update.apk',
        description: 'Ссылка для загрузки обновления'
    })
    url: string

    @ApiProperty({
        example: 'update.apk',
        description: 'Название файла при загрузке'
    })
    fileName: string

    @ApiProperty({
        example: null,
        description: 'Примечания к обновлению'
    })
    releaseNoted: string | null

    @ApiProperty({
        example: new Date(),
        description: 'Дата обновления'
    })
    releaseDate: Date

    @ApiProperty({
        example: null,
        description: 'Контрольные суммы файла'
    })
    sha256checksum: string | null
}
