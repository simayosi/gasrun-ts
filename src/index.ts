// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunc = (...args: any[]) => any;

type FuncRecord = Record<string, AnyFunc>;
type GASFunctions<FO extends FuncRecord> = {
  [K in keyof FO]: (...args: Parameters<FO[K]>) => Promise<ReturnType<FO[K]>>;
};

function promisifyGASRun(name: string) {
  return (...args: unknown[]) =>
    new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        [name](...args);
    });
}

export function wrapGASFunctions<FR extends FuncRecord>(funcRecord?: FR) {
  return Object.keys(funcRecord || google.script.run).reduce((acc, key) => {
    return {
      ...acc,
      [key]: promisifyGASRun(key),
    };
  }, {} as GASFunctions<FR>);
}

export function mockGASFunctions<FR extends FuncRecord>(funcRecord: FR) {
  return Object.keys(funcRecord).reduce((acc, key) => {
    return {
      ...acc,
      [key]: async (...args: unknown[]) => funcRecord[key](...args),
    };
  }, {} as GASFunctions<FR>);
}
