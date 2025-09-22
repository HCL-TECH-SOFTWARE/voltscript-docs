# Run from command line

--8<-- "arm.md"

Any VoltScript file can be run from the command line on Windows or Linux. This is done using the **VoltScript** executable downloaded from [My HCLSoftware](https://my.hcltechsw.com/)<!--[Flexnet](https://hclsoftware.flexnetoperations.com/)-->{: target="_blank" rel="noopener noreferrer"} portal.

!!! note
    Ensure the directory containing the VoltScript executable is included in the PATH environment variable.

The VoltScript program requires as its final parameter a path to the file to run, including the `.vss` suffix:

```bash
VoltScript scripts/testScript.vss
```

Multiple scripts can be passed, in which case all will be compiled and run.

## Run process

1. The program first compiles the code. If there are any `Use` statements, the program will look for a file at the relevant absolute or relative path and compile that. If there are any `UVSE` statements, the relevant VoltScript Extensions will be loaded using the following process:
    - Use the `seti.ini` file passed via the `--seti` argument.
    - Use a `seti.ini` in the current working directory, if found. For VS Code, this will be the workspace folder open.
    - Use a `seti.ini` in the same directory as the VoltScript executable, if found.
1. If compilation fails, a "Use or UseVSE Error" is raised and the program exits with an exit code 19.
1. If compilation passes, any code in `Sub Initialize` blocks in any of the files is run, as well as any code _not_ in any Sub or Function block.
1. Print statements and runtime errors are routed to the console. If VoltScript runs to completion, a 0 exit code is returned.

## Options Available

Additional options can be passed:

| Option      | Description      |
| ----------- | ---------------- |
| -c         | Compiles only, doesn't run any code |
| --context <context\> | Sends a string of text, passed after the option, that can be picked up using ContextVSE. Note: there are operating system limitations on what content can be passed as part of the string.|
| --no-utf8       | Treats the source file as platform character set |
| --debug-server <port> | Starts the debug server on the specified port |
| --headless, -H  | Sets headless mode, msgbox calls are routed to print statements |
| --help, -h  | Shows the options available |
| --http-server <port> | Starts the HTTP server on the specified port |
| --path, -I <path\>       | Sets the path to look for the given scripts |
| --seti, -X <path\> | Uses a seti.ini at the relevant path to identify file locations for any VoltScript extensions |
| --verbose, -v         | Enables verbose output |
| --version   | Shows the BaliScript version string |

## StreamVSE STDIO

If StreamVSE is being used to receive input from STDIO, running VoltScript will prompt for content to be passed.