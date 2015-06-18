# caido

Initial structure based off of [`react-starter`](https://github.com/webpack/react-starter/tree/48cecfcd3a528ceefdd3d68b4e0f05fffbedac8e)

## Features

* Compilation with webpack
* React and jsx
* react-router
* Stylesheets can be CSS, LESS, SASS, Stylus or mixed
* Embedded resources like images or fonts use DataUrls if appropriate
* A simple flag loads a react component (and dependencies) on demand.
* Development
  * Development server
  * Optionally Hot Module Replacement development server (LiveReload for Stylesheets and React components enabled)
  * Uses SourceUrl for performance, but you may switch to SourceMaps easily
* Production
  * Server example for prerendering for React components
  * Initial data inlined in page
  * Long Term Caching through file hashes enabled
  * Generate separate css file to avoid FOUC
  * Minimized CSS and javascript
* Also supports coffee-script files if you are more a coffee-script person.
* You can also require markdown or text files for your content.

## Local Installation

1. Install [Docker](https://get.docker.com/)
2. Install [Docker Compose](https://docs.docker.com/compose/)

### For a mac install
Use the [docker-osx-dev](https://github.com/brikis98/docker-osx-dev)
project to get proper watch events. Install everything by it's commands

Then run `docker-osx-dev` from the root directory of this project

## Development server

```
docker-compose -f docker-compose/dev-server.yml up
open http://dockerhost:8080/webpack-dev-server/
```

The configuration is `webpack-dev-server.config.js`.

It automatically recompiles when files are changed. When a hot-replacement-enabled file is changed (i. e. stylesheets or React components) the module is hot-replaced. If Hot Replacement is not possible the page is refreshed.

Hot Module Replacement has a performance impact on compilation.

Also check the [webpack-dev-server documentation](http://webpack.github.io/docs/webpack-dev-server.html).

## Production compilation and server

``` text
# build the client bundle and the prerendering bundle
# and then start an nginx server to serve it
docker-compose -f docker-compose/production.yml up

open http://dockerhost:8000
```

The configuration is `webpack-production.config.js`.

The server is at `lib/server.js`

The production setting builds two configurations: one for the client (`build/public`) and one for the serverside prerendering (`build/prerender`).

## License

Copyright (c) 2012-2015 Tobias Koppers [![Gittip donate button](http://img.shields.io/gittip/sokra.png)](https://www.gittip.com/sokra/)

MIT (http://www.opensource.org/licenses/mit-license.php)
