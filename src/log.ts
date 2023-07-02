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
    ...logConfig,
    format: formatLog,
    dirname: dirPath,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '10d',
  });
};

export const initLogModule = (
  logPath = path.resolve(__dirname, '../../../logs'),
) =>
  WinstonModule.forRootAsync({
    imports: [],
    useFactory: () => {
      // options
      return {
        level: 'info',
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
        ],
      };
    },
    inject: [],
  });
