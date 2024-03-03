import { jest } from "@jest/globals";
import { wrapGASFunctions, mockGASFunctions } from "../dist/gasrun.min.mjs";

describe("wrapGASFunctions", () => {
  it("should wrap all functions of google.script.run", () => {
    const gasrun = wrapGASFunctions();
    expect(gasrun).toHaveProperty("funcA");
    expect(gasrun).toHaveProperty("funcB");
    expect(gasrun).toHaveProperty("funcC");
  });
  it("should wrap specified functions", () => {
    const gasrun = wrapGASFunctions({
      funcA: null,
      funcB: null,
    });
    expect(gasrun).toHaveProperty("funcA");
    expect(gasrun).toHaveProperty("funcB");
    expect(gasrun).not.toHaveProperty("funcC");
  });
  it("should call a wrapped function", async () => {
    const gasrun = wrapGASFunctions();
    const mockedFuncA = jest
      .spyOn(global.google.script, "funcA")
      .mockImplementation((str, num) => `${str}${num}`);
    await expect(gasrun.funcA("test", 1)).resolves.toBe("test1");
    expect(mockedFuncA).toHaveBeenCalledTimes(1);
    expect(mockedFuncA).toHaveBeenLastCalledWith("test", 1);
    mockedFuncA.mockReset();
  });
  it("should fetch an exception from a wrapped function", async () => {
    const gasrun = wrapGASFunctions();
    const mockedFuncA = jest
      .spyOn(global.google.script, "funcA")
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
      funcA: () => {},
      funcB: () => {},
    });
    expect(gasrun).toHaveProperty("funcA");
    expect(gasrun).toHaveProperty("funcB");
    expect(gasrun).not.toHaveProperty("funcC");
  });
  it("should call a mock function", async () => {
    const mockedFuncA = jest.fn((str, num) => `${str}${num}`);
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
