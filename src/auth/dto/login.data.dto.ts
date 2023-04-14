import { ApiProperty } from '@nestjs/swagger'

export class loginDataDto {
    @ApiProperty({
        example: 'ПКС-4.2',
        description: 'Название группы',
        required: true
    })
    group: string

    @ApiProperty({
        example: '2022-2023',
        description: 'Учебные года группы',
        required: true
    })
    academicYear: string

    @ApiProperty({
        example: null,
        description: 'Пароль для группы (может быть пустым)',
        required: false
    })
    password?: string
}
