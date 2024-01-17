const logLevels = ['trace', 'debug', 'info', 'warn', 'error'] as const;

type LogLevel = (typeof logLevels)[number];

const isLogLevel = (level: unknown): level is LogLevel => {
  return logLevels.includes(level as LogLevel);
};

const logLevel = (() => {
  const level = process.env.LOG_LEVEL;
  if (!level) return 'info';
  if (!isLogLevel(level)) throw new Error(`Invalid log level: ${level}`);
  return level;
})();

const logLevelIndex = logLevels.indexOf(logLevel);
const log = (level: LogLevel, content: Record<string, unknown>) => {
  // eslint-disable-next-line no-console -- そういうもの
  console.log(JSON.stringify({ level, ...content }));
};

export const logger = logLevels.reduce(
  (acc, level) => {
    const levelIndex = logLevels.indexOf(level);
    if (levelIndex < logLevelIndex) {
      acc[level] = () => void 0;
    } else {
      acc[level] = (content) => {
        log(level, content);
      };
    }
    return acc;
  },
  {} as Record<LogLevel, (content: Record<string, unknown>) => void>,
);
