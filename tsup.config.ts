import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"], // ajuste para o ponto de entrada do seu app
  format: ["cjs"], // ou 'esm' se você estiver usando módulos ES
  target: "es2022",
  outDir: "build",
  watch: false,
  dts: false, // gera arquivos .d.ts se for uma lib
  clean: true, // limpa a pasta dist antes do build
  sourcemap: true, // útil para debug
  external: ["@prisma/client", ".prisma/client"], // <- ESSENCIAL
});
