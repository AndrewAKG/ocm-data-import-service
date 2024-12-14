export const logError = (error: unknown, debugMessage: string): void => {
  if (error instanceof Error) {
    console.error(`${debugMessage}: ${error.message}`);
  } else {
    console.error(`${debugMessage}: ${JSON.stringify(error)}`);
  }
};

export const throwError = (error: unknown, debugMessage: string): never => {
  logError(error, debugMessage);
  throw new Error(debugMessage);
};
