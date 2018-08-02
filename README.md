# html-boilerplate
HTML boilerplate with ejs,stylus,gulp, and so on.

## Requirements

* npm (https://www.npmjs.com/get-npm)


## Download

https://github.com/yuchesc/html-boilerplate/archive/master.zip

## Setup

```bash
> npm install
```

## Run

```bash
> npm run build
```

### Tasks

* clean: Clean dist
* build: Build and minify all to dist
* build-debug: Build all to dist
* watch: Build and minify all to dist, and watch src
* watch-debug: Build all to dist, and watch src

## Directory Tree

```
├── dist            -- output for production.
└── src             -- HTML, robots.txt, favicon.ico, and so on.
    └── assets      -- contains resoure directories.
        ├── ejs     -- EJS templates.
        ├── img     -- images.
        ├── script  -- javascript, or AltCSS.
        ├── style   -- stylus, or css.
        └── vendor  -- external libraries. Not mention either js or css.
```
