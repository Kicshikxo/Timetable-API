import { ApiProperty } from '@nestjs/swagger'

export class lessonDto {
    @ApiProperty({
        example: 1,
        description: 'Порядковый номер урока по расписанию'
    })
    index: number

    @ApiProperty({ example: 'Математика', description: 'Название урока' })
    name: string

    @ApiProperty({ example: '42', description: 'Кабинет урока' })
    cabinet: string
}

export class lessonWithDateDto extends lessonDto {
    @ApiProperty({
        example: '2022-09-14',
        description: 'Дата в формате ISO-8601'
    })
    date: string
}

export class lessonWithDateAndWeekIdDto extends lessonWithDateDto {
    @ApiProperty({
        example: '202237',
        description: 'Идентификатор недели в формате iyyyiw'
    })
    weekId: string
}
