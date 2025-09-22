# Read and write files

--8<-- "setup.md"

## Introduction

There may be common occasions where you need to interact with the filesystem to read or write files and manipulate directories. OSUtilsVSE allows you to interact with the filesystem and StreamVSE allows you to stream data to and from files.

## VoltScript dependencies

Incorporating OSUtilsVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
        "StreamVSE": {
            "library": "StreamVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "streamvse",
            "repository": "volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

## File handling

### Open or create a file

There is no separate API for creating a file using StreamVSE, the same API is used for creating or opening the file. If the file exists at the filepath, it's opened for appending. If the file doesn't exist, it's created. However, no file is saved unless data is written to it.

An error will be generated if the file can't be opened. Typical causes may be creating a file in a directory that doesn't exist, creating a file in a read-only directory, or opening a file you don't have access to.

``` voltscript
Function createFile(stream as Stream, filePath as String) as Boolean
    Try
        Call stream.open(filePath, "UTF-8")
        Return True
    Catch
        Print "Error " & Error() & " on line " & Erl()
        Return False
    Finally
        If (stream.isOpen) Then
            Call stream.close()
        End If
    End Try
End Function
```

Whenever you open a file, the stream's `Position` will always be 0 regardless of whether or not the file already had content.

### Write to a file

Writing appends to a file and can take bytes or text, up to 2 GB. You can also pass a type of line-ending, for which there are constants available in StreamVSE. The default is to write the text without appending any kind of line break. The following code will write the passed text with a line-feed.

``` voltscript
Function writeToFile(stream as Stream, text as String) as Boolean
    Call stream.writeText(text, EOL_LF)
    call stream.writeNewLine(EOL_LF)
End Function
```

### Read from existing file

There are `read...` functions corresponding to the `write...` functions. `readText()` can be used to read the whole file (up to 2 GB) or an individual line. This code would read a while file and pass it into a string:

``` voltscript
Function readWholeFile(stream as Stream) as String
    Return stream.readText()
End Function
```

When reading line-by-line you can specify the line ending to look for, using `EOL_ANY` to match any type of line ending. However, bear in mind that the text returned *does not include any line ending*. So if you are wishing to construct the full text, you will need to append a line ending manually:

``` voltscript
Function readFromFile(stream as Stream) as String
    Dim retVal as String
    While Not stream.isEOS
        retVal = retVal & stream.readText(True, EOL_ANY) & Chr(10)
    Wend
    Return retVal
End Function
```

!!! warning
    Remember to close the stream when reading or writing has been completed. This is a perfect use case for the `Try...Finally`. Use `Stream.isOpen()` to ensure the stream was successfully opened, otherwise an error will be thrown.

!!! note
    StreamVSE can only be used to append to a file. If you wish to replace the contents, delete the file using `Kill` and then use StreamVSE to create the file.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/platform){: target="_blank" rel="noopener noreferrer"}.