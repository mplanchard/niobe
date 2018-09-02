import dotenv from "dotenv";

import getConfig from "./conf";


const conf = getConfig(dotenv.config({'path': '../.env'}));

module.exports = {
  client: 'postgresql',
  connection: {
    database: conf.db_name,
    host: conf.db_host,
    password: conf.db_pass,
    port: conf.db_port,
    user: conf.db_user,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
