import pkg from "./package.json" with { type: "json" };

export default [
  {
    input: "index.js",
    output: [{ file: pkg.main, format: "es" }],
  },
];
