# caido


## Install

1. Install Node 0.12.x
2. Install dependencies (`npm install`)

## Building

### Development server

This has hot reloading enabled.

```
npm run dev-server
open http://localhost:8080/webpack-dev-server/
```

### Production Server

This builds the full client bundle and starts an nginx server to serve it.

```
npm run build -- --watch
open ./dist/index.html
```

## Testing

### Linting
All `.js[x]` files should pass `eslint`. To run the linter run:

```
npm run test
```

Then to make sure production stuff build correctly run:

```
npm run build
```

Both of these are checked on Travis CI after every push: [![Build Status](https://travis-ci.org/lucibus/caido.svg?branch=master)](https://travis-ci.org/lucibus/caido)


## Design

#### Structure

Initial structure based off of [`react-starter`](https://github.com/webpack/react-starter/tree/48cecfcd3a528ceefdd3d68b4e0f05fffbedac8e)

#### Compilation

We are using [webpack](https://github.com/webpack/webpack) to bundle up everything
and compile. So if you wanna add a stylesheet don't slap some `<link href="">...`
crap in a HTML file somewhere. Instead just import it in your componenent
which uses it, after installing with `npm`.

```
import "bootstrap/dist/css/bootstrap.css";
```

#### Styles

Also all custom styles should be completely local. Check out
[this demo/instruction site](https://css-modules.github.io/webpack-demo/)
for examples.

#### State
We use [react](http://facebook.github.io/react/) for the view layer and
[baobab](https://github.com/Yomguithereal/baobab) (using [baobab-react](https://github.com/Yomguithereal/baobab-react))
for the state. We chose baobab over a classic Flux solution because it minimizes
the amount of code we have to write for state changes and supports having one
global state, which is helpful initially, so that we can sync it easily to the
backend.

We are using the decorator style for baobab-react. [Check out their documentation](https://github.com/Yomguithereal/baobab-react#decorators)
for some nice examples.


## Editors

I currently use sublime text.

If you also use it, I highly reccomend a few packages. The first is
[babel-sublime](https://github.com/babel/babel-sublime) to get jsx syntax
highlighting. The other is [sublimelinter-eslint](https://github.com/roadhump/SublimeLinter-eslint)
for linting.
