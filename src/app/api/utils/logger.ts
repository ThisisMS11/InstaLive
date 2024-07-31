import { Logger, createLogger, format, transports, addColors } from 'winston';
import { get } from 'stack-trace';

const { combine, timestamp, printf, colorize } = format;

const myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
  },
};

addColors(myCustomLevels.colors);

const jsonFormatWithSource = format((info) => {
  const trace = get();
  const caller = trace[10]; // Adjust index as necessary to get the correct caller
  info.source = {
    function: caller.getFunctionName() || 'anonymous',
    file: caller.getFileName(),
    line: caller.getLineNumber(),
  };  
  return info;
});

const logger: Logger = createLogger({
  levels: myCustomLevels.levels,
  format: combine(
    timestamp(),
    jsonFormatWithSource(),
    format.json() // Ensure JSON format is applied
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({
      filename:
        '/home/mohit/Desktop/Visual-Studio-Code/Web-development/top-projects/Dekh Mera Video/liveme/src/app/api/logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename:
        '/home/mohit/Desktop/Visual-Studio-Code/Web-development/top-projects/Dekh Mera Video/liveme/src/app/api/logs/combined.log',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize({ all: true }), timestamp(), printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      })),
    })
  );
}

// Wrapper function to add label dynamically
const createLoggerWithLabel = (label: string) => {
  return {
    info: (message: string) => logger.info({ label, message }),
    warn: (message: string) => logger.warn({ label, message }),
    error: (message: string) => logger.error({ label, message }),
  };
};

export { createLoggerWithLabel };
