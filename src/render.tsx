/**
 * Renders the Year in Code card: validates the template, prints any
 * diagnostics, then writes a PNG (2x, for crisp sharing) and an SVG with
 * `renderImage()`. Fonts are passed as bytes — the image renderer loads
 * nothing itself — from the TTFs in `assets/fonts/` (Inter and Fraunces,
 * both SIL Open Font License).
 */
import { readFile, writeFile } from "node:fs/promises";
import { formatDiagnostics, outline, validate } from "@hyper-elements/react";
import { renderImage } from "@hyper-elements/react/image";
import YearInCode from "./year-in-code";

const font = async (family: string, file: string, weight: number, style: "normal" | "italic" = "normal") => ({
  family,
  src: await readFile(new URL(`../assets/fonts/${file}`, import.meta.url)),
  weight,
  style,
});

const fonts = [
  await font("Inter", "Inter-400.ttf", 400),
  await font("Inter", "Inter-600.ttf", 600),
  await font("Inter", "Inter-700.ttf", 700),
  await font("Inter", "Inter-800.ttf", 800),
  await font("Fraunces", "Fraunces-500Italic.ttf", 500, "italic"),
  await font("Fraunces", "Fraunces-700.ttf", 700),
];

const template = <YearInCode />;

const diagnostics = validate(template);
if (diagnostics.length > 0) {
  console.log(formatDiagnostics(diagnostics));
} else {
  console.log("(no diagnostics)");
}
console.log(outline(template));

const png = await renderImage(template, { fonts, format: "png", scale: 2 });
await writeFile(new URL("../out/year-in-code@2x.png", import.meta.url), png.image);
console.log(`wrote out/year-in-code@2x.png (${png.width}x${png.height})`);

const png1x = await renderImage(template, { fonts, format: "png", scale: 1 });
await writeFile(new URL("../preview.png", import.meta.url), png1x.image);
console.log(`wrote preview.png (${png1x.width}x${png1x.height})`);

const svg = await renderImage(template, { fonts, format: "svg" });
await writeFile(new URL("../out/year-in-code.svg", import.meta.url), svg.image);
console.log("wrote out/year-in-code.svg");
