import { ApiProperty } from '@nestjs/swagger'

export class loginResponseDto {
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

    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        description: 'Токен аутентификации',
        required: true
    })
    token: string
}
