import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { DatabaseService } from '../database.service'
import isUpdateAvailableResponseDto from './dto/isUpdateAvailable.response.dto'
import { updateDto } from './dto/update.dto'
import { Platform } from './enums/platform.enum'

@Injectable()
export class UpdatesService {
    constructor(private readonly databaseService: DatabaseService) {}

    async isAvailable(platform: Platform, version: string): Promise<isUpdateAvailableResponseDto> {
        const newVersion = await this.databaseService.query(
            `SELECT MAX("version") as "latestVersion" FROM updates WHERE platform = '${platform}' AND "version" > '${version}'`
        )

        const latestVersion: string | null = newVersion.rows[0].latestVersion

        return { isUpdateAvailable: !!latestVersion, latestVersion }
    }

    async latestUpdate(platform: Platform): Promise<updateDto> {
        const latestUpdate = await this.databaseService.query(
            `SELECT platform, version, url, file_name AS "fileName", release_notes AS "releaseNotes", release_date AS "releaseDate", sha256checksum FROM updates WHERE platform = '${platform}' ORDER BY "version" DESC LIMIT 1`
        )

        if (!latestUpdate.rowCount) {
            throw new HttpException(
                {
                    status: HttpStatus.NO_CONTENT,
                    error: 'No content'
                },
                HttpStatus.NO_CONTENT
            )
        }

        return latestUpdate.rows[0] as updateDto
    }

    async allUpdates(platform: Platform, limit?: number, offset?: number): Promise<updateDto[]> {
        const latestUpdate = await this.databaseService.query(
            `SELECT platform, version, url, file_name AS "fileName", release_notes AS "releaseNotes", release_date AS "releaseDate", sha256checksum FROM updates WHERE platform = '${platform}' ORDER BY "version" DESC LIMIT ${
                limit ?? 'NULL'
            } OFFSET ${offset ?? 'NULL'}`
        )

        if (!latestUpdate.rowCount) {
            throw new HttpException(
                {
                    status: HttpStatus.NO_CONTENT,
                    error: 'No content'
                },
                HttpStatus.NO_CONTENT
            )
        }

        return latestUpdate.rows as updateDto[]
    }

    async updateInfo(platform: Platform, version: string): Promise<updateDto> {
        const update = await this.databaseService.query(
            `SELECT platform, version, url, file_name AS "fileName", release_notes AS "releaseNotes", release_date AS "releaseDate", sha256checksum FROM updates WHERE platform = '${platform}' AND "version" = '${version}'`
        )

        if (!update.rowCount) {
            throw new HttpException(
                {
                    status: HttpStatus.NO_CONTENT,
                    error: 'No content'
                },
                HttpStatus.NO_CONTENT
            )
        }

        return update.rows[0] as updateDto
    }
}
