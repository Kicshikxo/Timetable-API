import { ApiProperty } from '@nestjs/swagger'
import { dayDto } from './day.dto'

export class weekDto {
    @ApiProperty({
        example: '202237',
        description: 'Идентификатор недели в формате iyyyiw'
    })
    id: string

    @ApiProperty({
        example: [
            {
                date: '2022-09-13',
                lessons: [
                    { index: 1, name: 'Математика', cabinet: '1' },
                    { index: 2, name: 'Русский язык', cabinet: '4' }
                ]
            },
            {
                date: '2022-09-14',
                lessons: [
                    { index: 2, name: 'Русский язык', cabinet: '4' },
                    { index: 3, name: 'Физика', cabinet: '12' }
                ]
            }
        ],
        description: 'Список дней в неделе',
        isArray: true
    })
    days: dayDto[]
}
