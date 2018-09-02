/**
 * Common database functionality
 */

 import Knex from 'knex';

 import { Config } from './conf';

export const getDb = (conf: Config): Knex => (
    Knex({
        client: 'postgresql',
        connection: {
            database: conf.db_name,
            host: conf.db_host,
            password: conf.db_pass,
            user: conf.db_user
        },
        pool: {
            min: 2,
            max: 10,
        }
    })
)
