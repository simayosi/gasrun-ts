// GAS server-side code

export function hello(str: string) {
  return `Hello ${str}!`;
}

export function concat(prop: { a: string; b: unknown }) {
  return { result: prop.a + prop.b?.toString() };
}

export function throwError() {
  throw new Error("Error in GAS!");
}
