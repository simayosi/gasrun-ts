import { jest, describe, it, expect } from "@jest/globals";
import { wrapGASFunctions, mockGASFunctions } from "../";
import * as GAS from "./gas-functions";
import { funcA } from "./gas-functions";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace google {
  const script: {
    funcA(str: string, num: number): string;
  };
}

describe("wrapGASFunctions", () => {
  it("should wrap all functions of google.script.run", () => {
    const gasrun = wrapGASFunctions();
    expect(gasrun).toHaveProperty("funcA");
    expect(gasrun).toHaveProperty("funcB");
    expect(gasrun).toHaveProperty("funcC");
  });
  it("should wrap all functions imported from a module", () => {
    const gasrun = wrapGASFunctions(GAS);
    expect(gasrun).toHaveProperty("funcA");
    expect(gasrun).toHaveProperty("funcB");
    expect(gasrun).not.toHaveProperty("funcC");
    expect(gasrun.funcA).toBeDefined();
    expect(gasrun.funcB).toBeDefined();
  });
  it("should wrap specified functions", () => {
    const gasrun = wrapGASFunctions({ funcA });
    expect(gasrun).toHaveProperty("funcA");
    expect(gasrun).not.toHaveProperty("funcB");
    expect(gasrun).not.toHaveProperty("funcC");
    expect(gasrun.funcA).toBeDefined();
  });
  it("should call a wrapped function", async () => {
    const gasrun = wrapGASFunctions({ funcA });
    const mockedFuncA = jest
      .spyOn(google.script, "funcA")
      .mockImplementation((str, num) => `${str}${num}`);
    await expect(gasrun.funcA("test", 1)).resolves.toBe("test1");
    expect(mockedFuncA).toHaveBeenCalledTimes(1);
    expect(mockedFuncA).toHaveBeenLastCalledWith("test", 1);
    mockedFuncA.mockReset();
  });
  it("should fetch an exception from a wrapped function", async () => {
    const gasrun = wrapGASFunctions({ funcA });
    const mockedFuncA = jest
      .spyOn(google.script, "funcA")
      .mockImplementation(() => {
        throw new Error("test");
      });
    await expect(gasrun.funcA()).rejects.toThrow("test");
    expect(mockedFuncA).toHaveBeenCalledTimes(1);
    mockedFuncA.mockReset();
  });
});

describe("mockGASProperties", () => {
  it("should mock specified functions", () => {
    const gasrun = mockGASFunctions({
      funcA: (_str: string, _num: number) => "",
      funcB: () => {},
    });
    expect(gasrun).toHaveProperty("funcA");
    expect(gasrun).toHaveProperty("funcB");
    expect(gasrun).not.toHaveProperty("funcC");
    expect(gasrun.funcA).toBeDefined();
    expect(gasrun.funcB).toBeDefined();
  });
  it("should call a mock function", async () => {
    const mockedFuncA = jest.fn((str: string, num: number) => `${str}${num}`);
    const gasrun = mockGASFunctions({
      funcA: mockedFuncA,
    });
    await expect(gasrun.funcA("test", 1)).resolves.toBe("test1");
    expect(mockedFuncA).toHaveBeenCalledTimes(1);
    expect(mockedFuncA).toHaveBeenLastCalledWith("test", 1);
  });
  it("should fetch an exception from a mock function", async () => {
    const mockedFuncA = jest.fn(() => {
      throw new Error("test");
    });
    const gasrun = mockGASFunctions({
      funcA: mockedFuncA,
    });
    await expect(gasrun.funcA()).rejects.toThrow("test");
    expect(mockedFuncA).toHaveBeenCalled();
  });
});
