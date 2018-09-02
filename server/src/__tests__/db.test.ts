/**
 * Tests for the db module
 */

import getConfig from '../conf';
import * as DB from '../db';


describe('db engine tests', () => {
    it('creates a functional database engine', () => {
        const db = DB.getDb(getConfig({}))
        debugger;
        console.log(db)
    })
})

