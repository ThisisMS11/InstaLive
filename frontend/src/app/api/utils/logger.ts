import { Logger, createLogger, format, transports, addColors } from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = format;

const myCustomLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        debug: 'green',
    },
};

addColors(myCustomLevels.colors);

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger: Logger = createLogger({
    levels: myCustomLevels.levels,
    format: combine(timestamp(), errors({ stack: true }), myFormat),
    defaultMeta: { service: 'user-service' },
    transports: [],
});

// Add file transports only in non-production environments (e.g., development)
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.File({
            filename: path.join(process.cwd(), 'logs', 'error.log'),
            level: 'error',
        })
    );
    logger.add(
        new transports.File({
            filename: path.join(process.cwd(), 'logs', 'combined.log'),
        })
    );

    // Add console transport for better readability in dev
    logger.add(
        new transports.Console({
            format: combine(colorize({ all: true }), myFormat),
        })
    );
} else {
    // In production, only log to console
    logger.add(
        new transports.Console({
            format: combine(colorize({ all: true }), myFormat),
        })
    );
}

// Wrapper function to add label dynamically
const createLoggerWithLabel = (label: string) => {
    return {
        debug: (message: string) => logger.debug({ label, message }),
        info: (message: string) => logger.info({ label, message }),
        warn: (message: string) => logger.warn({ label, message }),
        error: (message: string) => logger.error({ label, message }),
    };
};

export { createLoggerWithLabel };
