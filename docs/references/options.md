# Runtime options

The following options are available when starting the VoltScript runtime:

| Option      | Description      |
| ----------- | ---------------- |
| -c         | Compiles only, doesn't run any code |
| --context <context\> | Sends a string of text, passed after the option, that can be picked up using ContextVSE. </br> **Note**: There are operating system limitations on what content can be passed as part of the string.|
| --no-utf8       | Treats the source file as platform character set |
|--debug-server <port> | Starts the debug server on the specified port |
| --headless, -H  | Sets headless mode, msgbox calls are routed to print statements |
| --help, -h  | Shows the options available |
| --http-server <port> | Starts the HTTP server on the specified port |
| --path, -I <path\>       | Sets the path to look for the given scripts |
| --seti, -X <path\> | Uses a seti.ini at the relevant path to identify file locations for any VoltScript extensions |
| --verbose, -v         | Enables verbose output |
| --version   | Shows the BaliScript version string |