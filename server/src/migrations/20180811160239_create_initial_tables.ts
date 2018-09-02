import Knex from 'knex';
import R from 'ramda';

import { TableMap, createTableChain, dropTableChain } from '../migration_util';


const tableMaps: TableMap[] = [{
    address: (t) => {
        console.log('making address table')
        t.increments('id')
        t.string('address_one')
        t.string('address_two')
        t.string('address_three')
        t.string('address_four')
        t.string('city')
        t.string('district')
        t.string('postal_code')
        t.string('country')
    },
    phone: (t) => {
        console.log('making phone table')
        t.increments('id')
        t.string('number')
    },
    person: (t) => {
        console.log('making persons table')
        t.increments('id')
        t.timestamps()
        t.string('name').index()
    },
}, {
    person_address: (t) => {
        t.integer('person_id').unsigned()
        t.integer('address_id').unsigned()

        t.foreign('person_id').references('person.id')
        t.foreign('address_id').references('phone.id')
    },
    person_phone: (t) => {
        t.integer('person_id').unsigned()
        t.integer('phone_id').unsigned()

        t.foreign('person_id').references('person.id')
        t.foreign('phone_id').references('phone.id')
    },
    user: (t) => {
        t.increments('id')
        t.timestamps()
        t.string('email').unique()
        t.string('password', 1024).index()
        t.boolean('activated')
        t.integer('person_id').unsigned()

        t.foreign('person_id').references('person.id').onDelete('CASCADE')
    },
} ]


export const up = (knex: Knex): Promise<any> => {
    return createTableChain(
        knex.schema.createTable.bind(knex.schema),
        tableMaps,
    )
};


export const down = (knex: Knex): Promise<any> => {
    return dropTableChain(
        knex.schema.dropTable.bind(knex.schema),
        R.reverse(tableMaps),
    )
};
