import { ApiProperty } from '@nestjs/swagger'
import { weekDto } from './week.dto'

export class weeksResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Общее количество недель для текущей группы'
    })
    totalItemsCount: number

    @ApiProperty({
        example: [
            {
                id: '202237',
                days: [
                    {
                        date: '2022-09-13',
                        lessons: [
                            {
                                index: 1,
                                name: 'Математика',
                                cabinet: '1'
                            },
                            {
                                index: 2,
                                name: 'Русский язык',
                                cabinet: '4'
                            }
                        ]
                    },
                    {
                        date: '2022-09-14',
                        lessons: [
                            {
                                index: 2,
                                name: 'Русский язык',
                                cabinet: '4'
                            },
                            {
                                index: 3,
                                name: 'Физика',
                                cabinet: '12'
                            }
                        ]
                    }
                ]
            }
        ],
        description: 'Список недель для текущей группы'
    })
    weeks: weekDto[]
}
