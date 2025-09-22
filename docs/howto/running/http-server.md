# Run HTTP server

If the `--http-server <port>` option is passed when starting the VoltScript runtime, the runtime will listen on the specified port for HTTP POST requests.

The request:

- should use the POST verb.
- should use the URL:
    - **http://localhost:PORT/run** using the port passed when starting the HTTP server.
    - **?path=** plus the absolute path to the .vss file to run.
    - **&seti_path=** plus the absolute path to the seti.ini file to use.
- should pass `Content-Type` header with the value "application/json".
- should pass a JSON payload comprising:
    - **context** that's accessible via ContextVSE's `Context.context` property.
    - **jwttoken** that's an optional JSON value comprising a JWT token that DrapiVSE will pick up to automatically log into a DrapiServer.

!!! note
    The HTTP server isn't intended to be accessible directly to the internet, because query parameters expected are the path to the script to run. As a result, it doesn't support HTTPS and is no enabled for HTTP/2. It's intended for internal development or calling from a locally-hosted application.

Terminate the HTTP server process by using `Ctrl + C`.

## Debugging

If you wish to debug code running on the HTTP server, you will need to start the **debug HTTP server** using `--debug-server <port>` option instead.