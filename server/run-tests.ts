#!/usr/bin/env node

import dotenv from 'dotenv';
import { ChildProcess, spawn } from 'child_process';
import R from 'ramda';


const logProc = (proc: ChildProcess) => {
    proc.on('close', (code) => { console.log(`exited with code: ${code}`) })
}

dotenv.load();

process.env.NIOBE_DB_NAME = `niobe_test_${Date.now()}`;

const dockerUp = spawn(
    'docker-compose',
    ['up', '-d'],
    { env: process.env, stdio: 'inherit'},
);
logProc(dockerUp)

console.log(process.argv)

const teardown = () => {
    return spawn(
        'knex',
        ['migrate:rollback'],
        { env: process.env, stdio: 'inherit', cwd: './src'}
    ).on('close', () => {
        const dockerDown = spawn(
            'docker-compose',
            ['down', '-v'],
            { env: process.env, stdio: 'inherit' }
        );
        logProc(dockerDown)
    })
}

const _exit = (teardownFunc: () => ChildProcess, code: number): void => {
    teardownFunc().on('close', () => { process.exit(code) });
}


const exit = R.partial(_exit, [teardown])


setTimeout(() => {

    const migrateUp = spawn(
        'knex',
        ['migrate:latest'],
        { env: process.env, stdio: 'inherit' , cwd: './src'},
    ).on('close', (code) => {
        if (code) {
            exit(code)
        } else {
            const tests = spawn(
                'node',
                // './node_modules/jest/bin/jest',
                // 'jest',
                [
                    '--inspect-brk',
                    '--nolazy',
                    '-r',
                    'ts-node/register',
                    './node_modules/jest/bin/jest',
                    // '--runInBand',
                    ...process.argv.slice(2)
                ],
                { stdio: 'inherit', env: process.env}
            )
            logProc(tests)

            tests.on('close', (code) => { teardown() })
        }
    })

}, 5000)
