# caido

This is the frontend for the lighting console. It communicates via websockets
to `subicul`. If you aren't running that server, you can append `?debug=true`
to the URL and it will just create a mock server, so that you can try out the
UI.

## Install

1. Install Node 0.12.x
2. Install dependencies (`npm install --dev`)

## Building

### Development server

This has hot reloading enabled.

```
npm run dev-server
open "http://localhost:8080/?mock_websocket=true"
```

### Production Server

This builds the full client bundle

```
npm run build
open ./dist/index.html
```

## Testing

All `.js[x]` files should pass `standard`. To run the linter run:

```
npm run lint
```

Then run the unit tests

```bash
npm run test:unit
```

And the integration tests:

```bash
npm run test:integration:selenium
nom run test:integration:server
npm run test:integration
```

Then to make sure production stuff build correctly run:

```bash
npm run build
```

Both of these are checked on Travis CI after every push: [![Build Status](https://travis-ci.org/lucibus/lucibus.svg?branch=master)](https://travis-ci.org/lucibus/lucibus)

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
[cerebral-react-baobab]https://github.com/christianalfoni/cerebral-react-baobab)
for the state. We chose baobab over a classic Flux solution because it minimizes
the amount of code we have to write for state changes and supports having one
global state, which is helpful initially, so that we can sync it easily to the
backend.

I reccomend you get the [cerebrum chrome extension](https://chrome.google.com/webstore/detail/cerebral-debugger/ddefoknoniaeoikpgneklcbjlipfedbb?hl=no)
to help debug stuff.

## Editors

I currently use sublime text.

If you also use it, I highly reccomend a few packages. The first is
[babel-sublime](https://github.com/babel/babel-sublime) to get jsx syntax
highlighting. The other is [SublimeLinter-contrib-standard](https://github.com/Flet/SublimeLinter-contrib-standard)
for linting.
