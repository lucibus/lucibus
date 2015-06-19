# caido

## Development

### Install

1. Install [Docker](https://get.docker.com/)
2. Install [Docker Compose](https://docs.docker.com/compose/)

#### For a mac install
Use the [docker-osx-dev](https://github.com/brikis98/docker-osx-dev)
project to get proper watch events. Install everything by it's commands

Then run `docker-osx-dev` from the root directory of this project


## Testing

### Linting
All `.js[x]` files should pass `eslint`. To run the linter run:

```
docker-compose -f docker-compose/common.yml run web npm run test
```

Then to make sure production stuff build correctly run:

```
docker-compose -f docker-compose/production.yml run web npm run build
```

Both of these are checked on CircleCI after every push: [![Circle CI](https://circleci.com/gh/lucibus/caido.svg?style=svg)](https://circleci.com/gh/lucibus/caido)


## Building


### Development server

This has hot reloading enabled.

```
docker-compose -f docker-compose/dev-server.yml up
open http://dockerhost:8080/webpack-dev-server/
```

### Production Server

This builds the full client bundle and starts an nginx server to serve it.

```
docker-compose -f docker-compose/production.yml up
open http://dockerhost:8000
```


### Packages

When you change a dependency in `package.json` you need to rebuild

```
docker-compose -f docker-compose/common.yml build web

# sometimes you need to remove all the old docker containers after, if it doesn't
# pick up the new changes
docker rm -f $(docker ps -a -q)
```

### Design

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
