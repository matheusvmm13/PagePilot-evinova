import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: "HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message }) => {
      const separator = "─".repeat(50);

      if (message.includes("→")) {
        // HTTP response logs
        return `\n${separator}\n${timestamp} | ${message}\n${separator}`;
      } else if (message.includes("Request:")) {
        // HTTP request logs
        return `${timestamp} | ${message}`;
      } else if (message.includes("Server is running")) {
        // Server startup logs
        return `\n${separator}\n${timestamp} | ${message}\n${separator}`;
      } else if (message.includes("Health check")) {
        // Health check logs
        return `${timestamp} | ${message}`;
      } else {
        // Regular logs
        return `${timestamp} | ${level.toUpperCase()}: ${message}`;
      }
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
    }),
    new transports.File({
      filename: "logs/combined.log",
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
    }),
  ],
});

export default logger;
