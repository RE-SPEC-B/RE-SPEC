'use strict';

const _config = require('config');

const _winstonDaily = require('winston-daily-rotate-file');
const { createLogger, transports, format } = require('winston');
const { combine, timestamp, colorize, printf, label } = format;

const log_dir = 'logs';

// 사용자 지정 포맷
const print_format = printf(({ timestamp, label, level, message }) => {
    return `${timestamp} [${label}] ${level} : ${message}`;
});

const print_log_format = {
    default: combine(
        label({
            label: 'RE:SPEC',
        }),

        timestamp({
            format: 'YYYY-MM-DD HH:mm:dd',
        }),
        print_format,
    ),
};

const logger = createLogger({
    format: print_log_format.default,
    transports: [
        // info 레벨 로그를 저장할 파일 설정
        new _winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        // warn 레벨 로그를 저장할 파일 설정
        new _winstonDaily({
            level: 'warn',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir + '/warn',
            filename: `%DATE%.warn.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        // error 레벨 로그를 저장할 파일 설정
        new _winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir + '/error',
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});

//실제 서비스중인 서버가 아니면
if (_config.get('server.state') !== 'production') {
    logger.add(
        new transports.Console({
            format: combine(colorize({ all: true }), print_format),
        }),
    );
}

logger.stream = {
    write: (message) => logger.info(message),
};

module.exports = logger;
