# In-memory streaming

Reading and writing to files is useful. But in-memory processing is typically quicker because it removes the disk I/O interaction. In-memory streams are designed as a more performant approach than string concatenation.

To create an in-memory stream, open the stream with either "MEMORY" or "BUFFER" as the character set.

``` voltscript
Dim stream as new Stream()
Call stream.open("", "MEMORY")
```

!!! note
    "MEMORY" and "BUFFER" are provided as keyword synonyms and either can be used. This replaces the character set because in-memory streams are always stored with **UTF-16** character set.

Writing to the stream is then performed as usual, with either `writeBytes()` or `writeText()`.

## Converting person objects to CSV

For example, consider you have an array of Person objects and want to write the details out as a CSV file.

If you wish to store the CSV on a filesystem, this could be written directly to disk, but this would require constant file access during the process and multiple disk I/O interactions. Writing to an in-memory stream and outputting the complete stream in a single call may be preferable. And if you wish to send the CSV content as a file from a REST API, in-memory processing removes the need to write to and clean up temp files.

The code for writing to the stream will be familiar from other StreamVSE interactions:

``` voltscript
Sub convertPeopleToCsv(stream as Stream, people As Variant)

    Dim personObj as Person
    Call stream.writeText("Name,Age", EOL_CRLF)

    ForAll person In people
        Set personObj = person
        Call stream.writeText(personObj.getName() & "," & personObj.getAge(), EOL_CRLF)
    End ForAll

End Sub
```

The header is written. A `Forall` loop is used to iterate over the variant array. Because we are calling methods on the object, we need to cast the variant `person` to an instance of the `Person` class. Then we write out its properties.

## Retrieving content from the stream

To print out the contents of the stream, we use the following code:

``` voltscript
stream.position = 0
Print stream.readText()
Call stream.close()
```

We need to reset the position to the beginning of the stream, character position 0. We can then read out either the full content or sized chunks, either as text or as bytes.

!!! danger
    If you do not call `stream.position = 0` before reading the text, you will get no output. This is because you're only reading content *after* the position at which you finished writing.

!!! note
    Another use case might be writing activity logs during process. [VoltScript logging](https://opensource.hcltechsw.com/voltscript-logging) is intended for building up logs at various log levels and controlling at runtime which logs get written and to where. But if you always want to write out information for auditing purposes, in-memory streams can be a good option. The content can then be written out in the `Finally` block of your main routine.