import dotenv from 'dotenv';
import R from 'ramda';
import restify from 'restify';

import getConfig, { Config } from "./conf";


const createServer = (
        serverFactory: (...args: any[]) => restify.Server,
        conf: Config,
        server_args: any[] = [],
) => {
    const server = serverFactory(...server_args);
    server.get('/',
        (req: restify.Request, res: restify.Response, next: restify.Next) => {
            res.send('hello');
            next()
        }
    );
    return server;
}

const createRestifyServer = R.partial(createServer, [restify.createServer])

const runRestifyServer = (conf: Config, server: restify.Server) => {
    server.listen(conf.port, conf.host);
}


const conf = getConfig(dotenv.config({'path': '../.env'}))

runRestifyServer(conf, createRestifyServer(conf))
