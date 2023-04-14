import { ApiProperty } from '@nestjs/swagger'

export class checkLoginResponseDto {
    @ApiProperty({
        example: true,
        description: 'Валидность токена',
        required: true
    })
    valid: boolean

    @ApiProperty({
        example: false,
        description: 'Является ли пользователь админом',
        required: true
    })
    isAdmin: boolean

    @ApiProperty({
        example: 'ПКС-4.2',
        description: 'Название группы',
        required: true
    })
    groupName: string

    @ApiProperty({
        example: '2022-2023',
        description: 'Учебный год группы',
        required: true
    })
    groupAcademicYear: string
}
