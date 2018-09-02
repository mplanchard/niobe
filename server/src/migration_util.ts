import R from 'ramda';
import Knex from 'knex';

import { promiseChain } from './async_util';


/**
 * A mapping of tables to their create functions
 */
export interface TableMap {
    [x: string]: (t: Knex.TableBuilder) => void
}


/**
 * Return a promise that, upon resolution, creates the specified tables
 * @param createTableFunc the bound createTable function
 * @param tableMap a map of tables that may be created in parallel
 */
export const createTablesPromise = (
    createTableFunc: (
        name: string,
        func: (t: Knex.TableBuilder) => void
    ) => Knex.SchemaBuilder,
    tableMap: TableMap,
) => {
    return Promise.all(
        R.map(
            ([name, func]) => async () => createTableFunc(name, func),
            Object.entries(tableMap),
        )
    )
}


/**
 * Return a promise that, upon resolution, drops the specified tables
 * @param dropTableFunc the bound dropTable function
 * @param tableMap a map of tables that may be dropped in parallel
 */
export const dropTablesPromise = (
    dropTableFunc: (name: string) => Knex.SchemaBuilder,
    tableMap: TableMap,
) => (
    Promise.all(
        R.map(
            (name) => async () => dropTableFunc(name),
            Object.keys(tableMap),
        )
    )
)


/**
 * Return a promise that, upon resolution, creates the specified tables
 * @param boundCreateTable a create table method bound to `knex.schema`
 * @param tableMapArray an array of TableMap objects, where each value is a map
 * of tables to be created in parallel prior to the creation of the tables in
 * subsequent values
 */
export const createTableChain = (
    boundCreateTable: (t: Knex.TableBuilder) => void,
    tableMapArray: TableMap[],
) => {
    const createKnexTables = R.partial(createTablesPromise, [boundCreateTable])
    return promiseChain(
        R.map(
            (tableMap) => createKnexTables(tableMap),
            Object.values(tableMapArray)
        )
    )
}


/**
 * Return a promise that, upon resolution, drops the specified tables
 * @param boundDropTable a drop table method bound to `knex.schema`
 * @param tableMapArray an array of `TableMap` objects, where each value is a
 * group of tables that may be dropped in parallel before moving on to
 * dropping the tables in subsequent values
 */
export const dropTableChain = (
    boundDropTable: (name: string) => Knex.SchemaBuilder,
    tableMapArray: TableMap[],
) => {
    const dropKnexTables = R.partial(dropTablesPromise, [boundDropTable])
    return promiseChain(
        R.map(
            (tableName) => dropKnexTables(tableName),
            Object.values(tableMapArray)
        )
    )
}
