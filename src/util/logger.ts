import winston from "winston";

/**
 * Create a logger instance for use throughout the application.
 *
 * NB: While this would also typically be logged to Azure or a file in production, for the purpose of this
 * demo application, we are solely logging to the console.
 */
const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.json(),
    defaultMeta: { service: 'price-tracker' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    ],
});

export default logger;
