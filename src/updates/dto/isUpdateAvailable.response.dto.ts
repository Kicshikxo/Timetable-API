import { ApiProperty } from '@nestjs/swagger'

export default class isUpdateAvailableResponseDto {
    @ApiProperty({
        example: true,
        description: 'Доступно ли обновление'
    })
    isUpdateAvailable: boolean

    @ApiProperty({
        example: '2.0.1',
        description: 'Последняя доступная версия'
    })
    latestVersion: string | null
}
