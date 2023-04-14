import { Injectable } from '@nestjs/common'
import { Observable, firstValueFrom, from, groupBy, map, mergeMap, reduce, toArray } from 'rxjs'
import { DatabaseService } from './database.service'
import { dayDto } from './dto/day.dto'
import { groupDto } from './dto/group.dto'
import { lessonDto, lessonWithDateAndWeekIdDto, lessonWithDateDto } from './dto/lesson.dto'
import { weekDto } from './dto/week.dto'
import { weeksResponseDto } from './dto/weeks.response.dto'

@Injectable()
export class TimetableService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getAcademicYears(): Promise<string[]> {
        const academicYears = await this.databaseService.query('SELECT year FROM academic_years ORDER BY year')
        return academicYears.rows.map((row) => row.year) as string[]
    }

    async getGroups(academicYear: string): Promise<groupDto[]> {
        const groups = await this.databaseService.query(
            `SELECT id, name, academic_year as "academicYear" FROM groups ${
                academicYear ? `WHERE academic_year = '${academicYear}'` : ''
            } ORDER BY id`
        )
        return groups.rows as groupDto[]
    }

    async getWeeks(limit: number, offset: number, group?: string): Promise<weeksResponseDto> {
        const lessons: lessonWithDateAndWeekIdDto[] = (
            await this.databaseService.query(
                `SELECT
            week_id AS "weekId",
            date::timestamptz,
            index,
            name,
            cabinet
        FROM
        (
            SELECT
                DISTINCT(week_id)
            FROM
                days
            INNER JOIN lessons ON
                days.date = lessons.date
            WHERE
                lessons.group = '${group}'
            ORDER BY
                week_id DESC
            LIMIT
                ${limit || 'NULL'}
            OFFSET
                ${offset || 'NULL'}
        ) AS selected_weeks,
        LATERAL select_lessons_by_week_id(
            week_id,
            '${group}'
        ) AS selected_lessons`
            )
        ).rows.map((row) => Object.assign(row, { date: row.date.toISOString().split('T')[0] }))

        const totalItems: number = (
            await this.databaseService.query(`
        SELECT
            COUNT(DISTINCT(week_id)) AS "totalItems"
        FROM
            days
        INNER JOIN lessons ON
            days.date = lessons.date
        WHERE
            lessons.group = '${group}'
    `)
        ).rows[0].totalItems

        const lessonsStream$: Observable<weekDto[]> = from(lessons).pipe(
            groupBy((lesson: lessonWithDateAndWeekIdDto) => lesson.weekId, {
                element: (lesson: lessonWithDateDto) => ({
                    date: lesson.date,
                    index: lesson.index,
                    name: lesson.name,
                    cabinet: lesson.cabinet
                })
            }),
            mergeMap((daysGroup$) =>
                daysGroup$.pipe(
                    groupBy((lesson: lessonWithDateDto) => lesson.date, {
                        element: (lesson: lessonDto) => ({
                            index: lesson.index,
                            name: lesson.name,
                            cabinet: lesson.cabinet
                        })
                    }),
                    mergeMap((lessonsGroup$) => lessonsGroup$.pipe(reduce((acc, cur) => [...acc, cur], [lessonsGroup$.key]))),
                    map<any[], dayDto>((arr) => ({
                        date: arr[0],
                        lessons: arr.slice(1)
                    })),
                    reduce((acc, cur) => [...acc, cur], [daysGroup$.key])
                )
            ),
            map<any[], weekDto>((arr) => ({ id: arr[0], days: arr.slice(1) })),
            toArray<weekDto>()
        )

        return {
            totalItemsCount: Number(totalItems),
            weeks: await firstValueFrom(lessonsStream$)
        }
    }
}
