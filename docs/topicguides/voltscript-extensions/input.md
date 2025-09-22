# Managing input parameters

Middleware functions rarely perform the same action each time on an internally-configured dataset. Typically they will be triggered from user interaction, with contextual information to use to determine what to do, and sometimes with a payload to pass to a database.

VoltScript code needs to be able to receive those input parameters. Two VoltScript Extensions have different ways to achieve this requirement.

## Context and --context Option

In this scenario, the input parameters are passed at the same time as starting the VoltScript file.

The VoltScript runtime has a `--context` option which accepts a string of data from the command line call. This is good for small, basic content. This can be accessed with the following code:

!!! note
    Command line calls have restrictions around what can be passed in a string. There may also be limitations on different platforms for length of the command line call. Be aware of what restrictions are in place before using.

## Stream and STDIO

In this scenario, the VoltScript file will be started in an interactive mode and input parameters passed subsequently. The VoltScript code is responsible for pausing and awaiting the input, then continuing after all expected input is received.

This uses StreamVSE, which has the ability to connect to standard input and output (STDIO) and process input parameters via that mechanism. This is initiated with the following code:

``` voltscript
UseVSE "*StreamVSE"
Dim pipestream as New Stream()
Call pipestream.open("", "STDIO")
```

Input can then be read from standard input using `.readText()`. Content can be written to standard output using the normal `Print` statement of VoltScript or the Stream's `.writeText()` method.

It's the responsibility of the calling code to run the VoltScript file in an interactive manner and handle output.

For more details on both, see [Receive input](../../howto/extensions/input.md).