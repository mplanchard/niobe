import dotenv from 'dotenv';
import R from 'ramda';

export interface Config {
    [x: string]: number|string|boolean,
    port: number,
    host: string,
    db_engine: string,
    db_host: string,
    db_name: string,
    db_pass: string,
    db_port: number,
    db_user: string,
};

interface MapOfStrings { [x: string]: string|undefined }

const getEnv = (): MapOfStrings => ({ ...process.env });

/**
 * Get an env var from a sourced config or the environment.
 * @param confObj environment config sourced from a dotenv file
 * @param varName variable name
 * @param defaultValue the default if the variable is not found
 */
const getFromEnvOrObj = (
    env: MapOfStrings,
    confObj: MapOfStrings,
    varName: string,
    defaultValue: string = '',
): string => (
    (env.hasOwnProperty(varName)) ?
        env[varName] || '' :
        (confObj.hasOwnProperty(varName)) ?
            confObj[varName] || '' :
            defaultValue
);


const getConfig = (
    itemGetter: (a: MapOfStrings, b: MapOfStrings, c: string, d: string) => string,
    envGetter: () => MapOfStrings,
    envConf = {},
): Config => {
    const getVar = R.partial(itemGetter, [envGetter(), envConf])
    return {
        port: Number(getVar('NIOBE_PORT', '8080')),
        host: getVar('NIOBE_HOST', '127.0.0.1'),
        db_engine: getVar('NIOBE_DB_ENGINE', 'postgresql'),
        db_host: getVar('NIOBE_DB_HOST', 'localhost'),
        db_name: getVar('NIOBE_DB_NAME', 'niobe'),
        db_port: Number(getVar('NIOBE_DB_PORT', '5432')),
        db_pass: getVar('NIOBE_DB_PASS', ''),
        db_user: getVar('NIOBE_DB_USER', 'niobe'),
    }
};


const config = R.partial(getConfig, [getFromEnvOrObj, getEnv]);

export default config
