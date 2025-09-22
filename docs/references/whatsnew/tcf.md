# Try...Catch...Finally

!!! info
    Error handling in LotusScript is managed using the [`On Error` statement](https://help.hcltechsw.com/dom_designer/12.0.2/basic/LSAZ_MANAGING_THE_ERROR_NUMBER_AND_MESSAGE_THE_ERR_AND_ERROR_STATEMENTS.html#LSAZ_MANAGING_THE_ERROR_NUMBER_AND_MESSAGE_THE_ERR_AND_ERROR_STATEMENTS__LSAZ_DEFINING_ERRORS_AND_ERROR_NUMBERS) with GoTo labels and Resume statements.

    For VoltScript, the LotusScript syntax will still work. But you can also use Try...Catch...Finally syntax.

Try...Catch...Finally provides a way to catch specific or generic errors. At the minimum, the Try block must be followed by either a Catch block or a Finally block. The following is not valid syntax:

``` voltscript
Try
    ' Do something
End Try
```

## Catching Specific and General Error Codes

To catch errors matching a specific error number, use `Catch Error` and the relevant error code. For example, the following code will catch the Path/File Access error:

``` voltscript linenums="1"
Try
    MkDir(passedPath)
Catch Error 75
    ' Nothing to do, directory already exists
Catch
    Print Error() & ": " & Erl()
End Try
```

The final `Catch` on line 5 will catch any other error.

## Finally Block

The Finally block will execute after the Try and/or Catch blocks. This can be used to perform any cleanup or reset variables before continuing processing.

``` voltscript linenums="1"
Type Student
    ID As Long
    Name As String ' Variable-length string variable
    Score As Single
End Type
Dim undergrad As Student
Sub WriteStudents
    Dim fileNum1 As Integer
    Dim fileNum2 as Integer
    Try
        fileNum1% = FreeFile
        Open "scores.csv" For Input As fileNum1%
        fileNum2% = FreeFile
        Open "hiscores.csv" For Append As fileNum2%
        While Not EOF(fileNum1%) ' Read until end of file.
            Input #fileNum1%, undergrad.ID, undergrad.Name, undergrad.Score
            If undergrad.Score > 92 Then
                Write #fileNum2%, undergrad.ID, undergrad.Name, undergrad.Score
            End If
        Wend
    Catch
        Print "Error reading or writing file, " & Error() & ": " & Erl()
    Finally
        Try
            Close fileNum1%
            Close fileNum2%
        Catch
            ' File not opened
        End Try
    End Try
End Sub
```

In the above code, two files are opened, one for reading (line 12) and one for writing (line 14). If the score is greater than 92, the line is written to the second file. If an error occurs, it is caught on line 22. But the files - if opened - need to be closed. This is done on lines 25 and 26. But the files might not have been successfully opened. There are various defensive coding options to handle this, but Try...Catch...Finally can be nested, and this approach showcases that.

!!! note
    Variables declarations are always processed at the start of the sub or function. So variables declared in the `Try` or `Catch` can be referenced in `Catch` or `Finally` blocks (or even after the completion of the Try/Catch/Finally block), but may not have been initialized.

## Nesting Try...Catch...Finally

Try...Catch...Finally blocks can be nested. So the following code is valid:

``` voltscript linenums="1"
Function comparePeople(personA as Person, personB as Person)
    Dim msgs() as Variant
    Dim i as Integer
    Dim errCount as Integer

    Try
        If (personA.firstName != personB.firstName) Then
            Call AddMessage(personA, personB, "firstName", msgs)
        End If
        If (personA.lastName != personB.lastName) Then
            Call AddMessage(personA, personB, "lastName", msgs)
        End If
        If (personA.age != personB.age) Then
            Call AddMessage(personA, personB, "age", msgs)
        End If
        For i = 0 to UBound(personA.jobs)
            Try
                If (personA.jobs(i) != personB.jobs(i)) Then
                    Error 1001, "Mismatch"
                End If
            Catch
                If (errCount > 3) Then
                    ReDim Preserve msgs(UBound(msgs) + 1)
                    msgs(UBound(msgs)) = "...and other jobs"
                    Exit For
                Else
                    AddMessage(personA, personB, "job" & i, msgs)
                    errCount++
                End If
            End Try
        Next
    Catch
        Print Error() & ": " & Erl()
    End Try

End Function
```

The outer try/catch starting at line 6 catches any generic errors. But when iterating the jobs fixed-size array starting at line 16, we want to exit if more than three jobs are different. To handle this we compare the jobs and throw an error at line 19. If we've found more than three jobs different, we add a generic message to the `msgs` array and exit the for loop, otherwise add the message and increment the counter.

## Try...Catch...Finally _OR_ On Error

A Sub or Function cannot use both Try...Catch...Finally and On Error. If you try to use both, you will receive the error "Method cannot contain both an ON ERROR/RESUME statement and a TRY statement".

However, a Sub or Function that uses `On Error` can call a Sub or Function that uses Try...Catch...Finally, and vice versa.

!!! warning
    Try...Catch....Finally have to be used inside a sub or function.

    `On Error` statements and Try...Catch...Finally blocks cannot be mixed in the same sub or function.