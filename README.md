# Lucibus

*Modern stage lighting control system*

[![all github issues](https://img.shields.io/badge/Huboard-all%20github%20issues-brightgreen.svg)](https://huboard.com/lucibus/design)


## Goals

* Brings the UI and structure of the app closer to the mental picture the lighting designer has of the show.
	* When you look back at a cue you wrote weeks ago, it should be apparent how it was formed and how it relates to the rest of the show.
* Interface is intuitive and simpler. Easy to pick up for a beginner.
	* The question "Why is this light up right now?" should be easy to answer.
* Open source and free. BYOH (bring your own hardware). Windows, Mac, and Linux all supported.
	* Have your own idea how you wanna control your lights? Great make a tool to do it, nothing is stopping you now.
	* Or contribute a patch, if you think others could benefit from it.


## Architecture

We start with some objectives that we want:

* Runnable on cheap hardware
* Multiple simultaneous users, with synchronized state
* Multiple DMX output devices, connected wirelessly
* Mobile users

We decided to build it in a client server model. The client would be a static html site that communicates to the server over HTTP (or websockets). Multiple clients can connect to the server at once, and it will maintain the master state.

We used Go to build the backend server (called subicul) and react + baobab for
the frontend (called caido).


### Alternatives Considered
For a while we considered having a dumb stateless server that only handled sending DMX, and keeping all the state on the client. Then the client would communicate with the server and tell it things like "bring address 10 to 50", or maybe "bring address 10 to 50 over 10 seconds", but nothing more advanced than that. The advantage of this was that we could keep all the logic in one place (the client) and not duplicate any of this code. However, it would get complicated to try to synchronize multiple client state with this model. Also we would need another server to store the state once the client logs off, so it would end up being a bit more complexity.


