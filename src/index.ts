import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import helmet from 'helmet';
import debug from 'debug';

import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutesConfig } from './users/users.routes.config';
import { AppConfig } from './app.config';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: number = AppConfig.port;
const host: string = AppConfig.host;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

routes.push(new UsersRoutesConfig(app));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

app.get('/', (req: express.Request, res: express.Response) => {
    return res.status(200).json({ message: 'Server is up and running' });
});

server.listen(port, host, () => {
    debugLog(`Server running at http://${host}:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
});