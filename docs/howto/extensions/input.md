# Receive input

--8<-- "setup.md"

## Introduction

There may be common occasions where you need to receive input. This can either be received via the command line `--context` argument or STDIN. Dependency management uses both of these, passing an argument ("setup" or "installDeps") for the process to run and prompting the user for parameters to run against. Command line arguments are best for simple, short text. For example, double quotes need escaping and may affect what VoltScript reads. JSON content should only ever be passed via STDIN.

## VoltScript dependencies

Incorporating StreamVSE and ContextVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
        "StreamVSE": {
            "library": "StreamVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "streamvse",
            "repository": "volt-mx-marketplace"
        },
        "ContextVSE": {
            "library": "ContextVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "contextvse",
            "repository":"volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

!!! note
    For more comprehensive documentation and further details about API parameters, see StreamVSE and ContextVSE documentation.

## Pass Context

The Visual Studio Code "VoltScript: Save & Run Script" command always prompts for command line parameters to be passed to the underlying script using an input box. The following code can capture context passed in via the `--context` command line parameter:

``` voltscript
Sub Initialize

    Dim ctx as New Context()
    Print "Received contextual string: " & ctx.Context

End Sub
```

You can run this script from VS Code by using the "VoltScript: Save & Run Script" command and, when prompted, enter, for example `--context "Hello"`. Alternatively, you can run from the terminal in VS Code using `VoltScript --context "Hello World" src/echoContext.vss`.

!!! warning
    There is limitations passing contextual content via command line. Visual Studio Code cannot accept spaces, on command line double quotes need escaping. For any complex or unpredictable input, StreamVSE is the recommended approach.

## Use StreamVSE and STDIO

To receive input from standard input and output (STDIO) via StreamVSE, a stream must be connected to that input stream. This is done by calling `.open()` with a specific pair of arguments - `("", "STDIO")`. This is understood by the API to read content via standard input (stdin) and write to standard out (stdout).

As with streaming files, `readText()` and `writeText()` are used to interact with STDIO. When reading input, the second parameter for timeout is important to bear in mind, otherwise the program will hang waiting for input. When input is complete, it is crucial to close the stream to tell StreamVSE not to wait for further input.

### Close stream on specific input

Identifying when input is completed will depend on the method of interaction. For example, when interacting with a user via command line, you can prompt for a specific input.

``` voltscript
Sub echoMessagesUntilQuit()
    Dim pipestream as New Stream()
    Dim continue as Boolean
    Dim data as String
    
    Call pipestream.open("", "STDIO")
    continue = true
    Call pipeStream.writeText("Enter quit or q to end interaction", EOL_LF)
    Do While Continue
        data = pipeStream.readText(true, 4, 5)
        Select Case data
        Case "quit", "q":
            continue = False
        Case "":
            Call pipeStream.writeText("I didn't head anything", EOL_LF)
        Case Else:
            Call pipeStream.writeText("You entered: " & data, EOL_LF)
        End Select
    Loop
    Call pipeStream.close()
    Print "Thank you"
End Sub
```

### Close stream when isEOS

The stream does not end with each input, instead it's kept open until explicitly closed. `Ctrl + D` is the way from the command line to signal to the waiting program that the stream is ended.

``` voltscript
Sub echoMessagesUntilEOS()
    Dim pipestream as New Stream()
    Dim continue as Boolean
    Dim data as String

    Call pipestream.open("", "STDIO")
    Print "Press CTRL + Z on Windows, Ctrl + D on everything else to end interaction"
    Do While Not pipeStream.isEOS
        data = pipeStream.readText(true, 4, 5)
        Select Case data
        Case "":
            Print "I didn't head anything"
        Case Else:
            Print "You entered: " & data
        End Select
    Loop
    Call pipeStream.close()
    Print "Thank you"
End Sub
```

!!! note
    `Print` can also be used to write to standard out. `Print` automatically appends a line feed after it prints.

### STDIO from external programs

Programs that start an external process can typically programmatically send an "end of stream" notification. This is the case with Java with the `ProcessBuilder` class.

#### Java ProcessBuilder

Java has the [`ProcessBuilder` API](https://www.baeldung.com/java-lang-processbuilder-api) which allows triggering an external process. This also allows writing to the process's standard output and reading content from the process's standard input. It can also programmatically send an "end of stream" message.

```java linenums="1"
// Set up variables with path to the VoltScript executable and to the .vss script file to run
// Your code will also need to handle IOException and InterruptedException
public static void runVoltScript(String pathToVoltScript, String scriptFile) throws IOException, InterruptedException {
    ProcessBuilder procBuilder = new ProcessBuilder(pathToVoltScript, scriptFile);
    // Optionally set procBuilder.directory() to the working directory to use, i.e. directory for VoltScript
    procBuilder.redirectErrorStream(true);   // (1)!
    Process proc = procBuilder.start();

    OutputStream stdin = proc.getOutputStream();
    BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(stdin));
    writer.write("Some text to pass");   // Repeat for all content to pass
    writer.flush();
    writer.close();     // (2)!
    List<String> errors = readOutput(proc.getErrorStream());
    int exitCode = proc.waitFor();  // (3)!

    List<String> response = readOutput(proc.getInputStream());
    // Do something with the response
}

// Read print statements etc from VoltScript
private static List<String> readOutput(InputStream inputStream) throws IOException {
    try (BufferedReader output = new BufferedReader(new InputStreamReader(inputStream)))) {
        return output.lines().collect(Collectors.toList());
    }
}
```

1. To capture errors as STDOUT of the process
2. Will trigger Stream.isEOS
3. Wait for VoltScript to finish

The code uses a `ProcessBuilder` to run the VoltScript process, effectively running `VoltScript _scriptFile_`, when the process is started on line 8. The error stream for the VoltScript process is routed to the process (via the `ProcessBuilder`) on line 7, via which errors can be read on line 14.

The Java program's STDOUT (the STDIN into VoltScript) is accessed in lines 9 and 10. Content is written in line 11, the writer flushed in line 12 and closed in line 13 to end the stream.

After waiting for the VoltScript process to finish on line 15, the response is read by getting the STDOUT of VoltScript, the Java program's STDIN from the process, on line 17.

#### Process input in VoltScript

In the Java example, the stream is explicitly closed. Thus, the content can be captured using:

``` voltscript
Dim data as String
Do While Not pipeStream.isEOS
    data = data & pipestream.readText(true, 4, 5)
Loop
```

This will exit the loop when `writer.close()` is called in Java.

Best practice for subsequent processing is to pass the `data` string variable to a subsequent function. This enables the developer to unit test or troubleshoot based on a specific input.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/input){: target="_blank" rel="noopener noreferrer"}.