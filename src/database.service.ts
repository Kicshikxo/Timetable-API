import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Pool, QueryResult } from 'pg'

@Injectable()
export class DatabaseService {
    private readonly pool: Pool

    constructor(private readonly configService: ConfigService) {
        this.pool = new Pool({
            host: this.configService.get('TIMETABLE_POSTGRES_HOST'),
            port: this.configService.get('TIMETABLE_POSTGRES_PORT'),
            user: this.configService.get('TIMETABLE_POSTGRES_USER'),
            password: this.configService.get('TIMETABLE_POSTGRES_PASSWORD'),
            database: this.configService.get('TIMETABLE_POSTGRES_DATABASE')
        })
    }

    async query(queryText: string): Promise<QueryResult<any>> {
        return this.pool.query(queryText)
    }
}
