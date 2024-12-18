import esbuild from "rollup-plugin-esbuild";
import { dts } from "rollup-plugin-dts";

const commonConfigs = {
  input: "src/index.ts",
};

export default [
  {
    ...commonConfigs,
    output: {
      file: "./dist/gasrun.js",
      format: "es",
    },
    plugins: [esbuild()],
  },
  {
    ...commonConfigs,
    output: {
      file: "./dist/gasrun.umd.cjs",
      format: "umd",
      name: "GASRun",
    },
    plugins: [
      esbuild({
        platform: "node",
        target: "node14",
      }),
    ],
  },
  {
    ...commonConfigs,
    output: [
      {
        file: "./dist/gasrun.d.ts",
        format: "es",
      },
      {
        file: "./dist/gasrun.d.cts",
        format: "cjs",
      },
    ],
    plugins: [dts()],
  },
  {
    ...commonConfigs,
    output: {
      file: "./dist/gasrun.min.mjs",
      format: "es",
    },
    plugins: [
      esbuild({
        target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
        minify: true,
      }),
    ],
  },
];
