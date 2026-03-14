import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { joinSegments } from '@quartz-community/types';

// src/emitter.ts
var QUARTZ = "quartz";
var write = async (ctx, slug, ext, content) => {
  const pathToPage = joinSegments(ctx.argv.output, slug + ext);
  const dir = path.dirname(pathToPage);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pathToPage, content);
  return pathToPage;
};
var Favicon = () => ({
  name: "Favicon",
  async *emit({ argv }) {
    const iconPath = joinSegments(QUARTZ, "static", "icon.png");
    const faviconContent = sharp(iconPath).resize(48, 48).toFormat("png");
    yield write(
      { argv },
      "favicon",
      ".ico",
      faviconContent
    );
  },
  async *partialEmit() {
  }
});

export { Favicon };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map