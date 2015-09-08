# Lucibus

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lucibus/lucibus?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Circle CI](https://circleci.com/gh/lucibus/lucibus.svg?style=svg)](https://circleci.com/gh/lucibus/lucibus)
[![Build Status](https://travis-ci.org/lucibus/lucibus.svg)](https://travis-ci.org/lucibus/lucibus)
[![Coverage Status](https://coveralls.io/repos/lucibus/lucibus/badge.svg)](https://coveralls.io/r/lucibus/lucibus)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/sshanabrook.svg)](https://saucelabs.com/u/sshanabrook)
[ ![Download](https://api.bintray.com/packages/lucibus/lucibus/lucibus/images/download.svg) ](https://bintray.com/lucibus/lucibus/lucibus/_latestVersion#files)

Lucibus is a lighting control system. It arose from a feeling that the existing building blocks of lighting control are inneficient. It proposes more structure and normalization, in order to reduce repetition and increase readibility. It's main structures are:

* The patch consists of a mapping of DMX addresses to **tags**. For example, "warm", "upstage", "hi-side", etc. You can then make a **system** of lights by querying based on tags. So you could say something like "Warm Top @ 50%". This leads to readable and descriptive state. One consequence of this is that channels are no longer a first class structure. They could be implemented as a subset of tags (think "Channel 1", "Channel 2" as tags), but I am not sure what purpose they would have.
* **Systems** of lights are combined in order, in a stack based structure. The location in the stack determines precedence. For example if you had "USL Top Cool @ 50%" above "Top Cool @ 30%", then all the top cools would be at 30%, besides the USL top cool, which would be at 50%.
* To reuse the same stack of systems in multiple cues, you can create a **look**. For example, you might create a "Indoor" or "Blueout" look that can be used in multiple cues. Looks solve the same issues of re-use that tracking addresses, but it is more obvious how they work and are more descriptive. (not implemented yet #66)

## Status
This project is being actively developed and is **not ready for production** use. If you are wondering what still needs to be done, [check out the issue tracker](https://github.com/lucibus/lucibus/issues).

We welcome all contributions, both of ideas and of code.

Hop on the [the chat](https://gitter.im/lucibus/lucibus?utm_source=share-link&utm_medium=link&utm_campaign=share-link) to ask any questions or [open an issue](https://github.com/lucibus/lucibus/issues/new).

## Structure
Lucibus is built with web technologies. This frontend (called caido) is mostly Javascript and backend (called subicul) is Go. It is broken up into these two pieces to solve a few goals:

1. Access from remote devices, like mobile phones or laptops.
2. Multiple simultaneous users.
3. Use as much existing work as possible to reduce development time.


This project is separated into four distinct apps. They exist right now in one repository for ease of deployment and synchronization of commits.

*`subicul`* is the backend. It is written in Go and serves up a websocket connection.

*`caido`* is the frontend.

*`api`*  just has the JSON schmea that defines the structure of the websocket messages sent between the fontend and the backend.

*`binary`* builds a single binary to serve `caido` as well as `subicul`
