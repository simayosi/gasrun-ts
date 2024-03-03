// Frontend code bundled into GAS HTML-service pages
import { wrapGASFunctions } from "ts-gasrun";
import * as GASFuncs from "./gas-functions";

const gasrun = wrapGASFunctions(GASFuncs);

export function useThenCatch() {
  // hello: (str: string) => Promise<string>
  gasrun.hello("world").then((result) => {
    console.log(result);
  });

  gasrun.throwError().catch((error) => {
    console.error(error);
  });
}

export async function useAsyncAwait() {
  // concat: (prop: { a: string, b: unknown }) => Promise<{ result: string }>
  const { result } = await gasrun.concat({ a: "string", b: 123 });
  console.log(result);

  try {
    await gasrun.throwError();
  } catch (error) {
    console.error(error);
  }
}
