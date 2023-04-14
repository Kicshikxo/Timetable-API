import { ApiProperty } from '@nestjs/swagger'

export class groupDto {
    @ApiProperty({
        example: 'ПКС-4.2 2022-2023',
        description: 'Идентификатор группы'
    })
    id: string

    @ApiProperty({ example: 'ПКС-4.2', description: 'Название группы' })
    name: string

    @ApiProperty({ example: '2022-2023', description: 'Учебный год группы' })
    academicYear: string
}
