# Lucibus

*Modern stage lighting control system*

[![Circle CI](https://circleci.com/gh/lucibus/lucibus.svg?style=svg)](https://circleci.com/gh/lucibus/lucibus)
[![Build Status](https://travis-ci.org/lucibus/lucibus.svg)](https://travis-ci.org/lucibus/lucibus)
[![Coverage Status](https://coveralls.io/repos/lucibus/lucibus/badge.svg)](https://coveralls.io/r/lucibus/lucibus)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/sshanabrook.svg)](https://saucelabs.com/u/sshanabrook)
[ ![Download](https://api.bintray.com/packages/lucibus/lucibus/lucibus/images/download.svg) ](https://bintray.com/lucibus/lucibus/lucibus/_latestVersion)

This project is separated into four distinct apps. They exist right now in one repository for ease of deployment and synchronization of commits.

*`subicul`* is the backend. It is written in Go and serves up a websocket connection.

*`caido`* is the frontend.

*`api`*  just has the JSON schmea that defines the structure of the websocket messages sent between the fontend and the backend.

*`binary`* builds a single binary to serve `caido` as well as `subicul`
