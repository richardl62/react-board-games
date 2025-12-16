# Intro

This project provides an online implement of various board games. It was written
as a hobby/learning project.

The project was created using create-react-app, but was later ported to Vite.

The project originally used boardgame.io, but that was replaced with home-grown 
code as boardgame.io is no longer being maintained. The currect code is still
influenced by the design of boardgame.io.

An earlier version of this project is deployed at
https://richards-board-games.herokuapp.com/

# Known problems

- The server restarted test does not work.

# Possible enhancements

- Reduce use of 'any'.

# Testing

More testing is needed, particularly of the effects of network problems. 

## WebSocket Keepalive

Some hosting platforms and intermediaries (e.g., Heroku routers, load balancers, CDNs) will close idle WebSocket connections after ~55–60 seconds of inactivity. To prevent unintended disconnects during periods of no game activity, the server now sends periodic WebSocket `ping` frames and expects `pong` responses (handled automatically by browsers).

- Behavior: the server pings each connected client on an interval; connections that fail to respond are terminated to avoid leaking dead sockets.
- Default interval: 25 seconds. Configure via the `KEEPALIVE_MS` environment variable if needed.

Example (Heroku):

```
heroku config:set KEEPALIVE_MS=25000
```

Client impact: no code changes required; browsers auto‑reply to `ping` with `pong`. If you want auto‑reconnect for transient network changes, you can enable `shouldReconnect` in the `react-use-websocket` hook on the client side.