# @quartz-community/favicon

Generates a favicon.ico from the site's quartz/static/icon.png file.

## Installation

```bash
npx quartz plugin add github:quartz-community/favicon
```

## Usage

```ts
// quartz.config.ts
import * as ExternalPlugin from "./.quartz/plugins";

const config: QuartzConfig = {
  plugins: {
    emitters: [ExternalPlugin.Favicon()],
  },
};
```

## Configuration

This plugin has no configuration options.

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/) for more information.

## License

MIT
