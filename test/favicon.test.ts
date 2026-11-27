import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import type { BuildCtx } from "@quartz-community/types";
import { Favicon } from "../src/index";

describe("Favicon", () => {
  let root: string;
  let cwd: string;
  beforeEach(async () => {
    // a Quartz checkout: quartz/static/icon.png, relative to which the build runs
    root = await fs.mkdtemp(path.join(os.tmpdir(), "favicon-"));
    await fs.mkdir(path.join(root, "quartz", "static"), { recursive: true });
    await sharp({
      create: {
        width: 200,
        height: 120,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toFile(path.join(root, "quartz", "static", "icon.png"));
    cwd = process.cwd();
    process.chdir(root);
  });
  afterEach(async () => {
    process.chdir(cwd);
    await fs.rm(root, { recursive: true, force: true });
  });

  it("writes favicon.ico, a 48×48 PNG of quartz/static/icon.png, into the output", async () => {
    const out = path.join(root, "public");
    const files: string[] = [];
    for await (const file of Favicon().emit({ argv: { output: out } } as unknown as BuildCtx, [], {
      css: [],
      js: [],
      additionalHead: [],
    }) as AsyncGenerator<string>)
      files.push(file);

    expect(files).toEqual([path.join(out, "favicon.ico")]);
    const meta = await sharp(path.join(out, "favicon.ico")).metadata();
    expect(meta).toMatchObject({ format: "png", width: 48, height: 48 });
    const { data } = await sharp(path.join(out, "favicon.ico"))
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect([...data.subarray(0, 3)]).toEqual([255, 0, 0]);
  });

  it("emits nothing on partial (incremental) rebuilds", async () => {
    const results = [];
    for await (const file of Favicon().partialEmit!(
      {} as BuildCtx,
      [],
      { css: [], js: [], additionalHead: [] },
      [],
    ) as AsyncGenerator<string>)
      results.push(file);
    expect(results).toEqual([]);
  });
});
