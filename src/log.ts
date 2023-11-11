import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const timestamp = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});
const formatLog = winston.format.combine(
  timestamp,
  winston.format.printf((args) => {
    const { level, message, timestamp, stack } = args;
    let log = `${timestamp} [${level}] ${message}`;
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  }),
);

const getLog = (logConfig: Record<string, any>, dirPath: string) => {
  return new winston.transports.DailyRotateFile({
    format: formatLog,
    dirname: dirPath,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '10d',
    json: true,
    ...logConfig,
  });
};

export interface IInitLogOpts {
  customLevel?: { name: string; level: number }[];
}

export const initLogModule = (
  logPath = path.resolve(__dirname, '../../../logs'),
  opts: IInitLogOpts = {},
) => {
  const customLevel = opts.customLevel || [];
  console.log(
    customLevel.reduce((acc, v) => {
      acc[v.name] = v.level;
      return acc;
    }, {}),
  );
  return WinstonModule.forRootAsync({
    imports: [],
    useFactory: () => {
      // options
      return {
        level: 'info',
        levels: Object.assign(
          {
            error: 0,
            warn: 1,
            info: 2,
            http: 3,
            verbose: 4,
            debug: 5,
            silly: 6,
          },
          customLevel.reduce((acc, v) => {
            acc[v.name] = v.level;
            return acc;
          }, {}),
        ),
        format: winston.format.combine(timestamp, formatLog),
        transports: [
          new winston.transports.Console({
            format: formatLog,
          }),
          getLog(
            {
              filename: path.join(logPath, 'info-%DATE%.log'),
              level: 'info',
            },
            logPath,
          ),
          getLog(
            {
              filename: path.join(logPath, 'warn-%DATE%.log'),
              level: 'warn',
            },
            logPath,
          ),
          getLog(
            {
              filename: path.join(logPath, 'error-%DATE%.log'),
              level: 'error',
            },
            logPath,
          ),
          ...customLevel.map((v) =>
            getLog(
              {
                filename: path.join(logPath, `${v.name}-%DATE%.log`),
                level: v.name,
              },
              logPath,
            ),
          ),
        ].filter((v) => v),
      };
    },
    inject: [],
  });
};
