# Error handling

## Introduction

VoltScript adds Try/Catch/Finally to improve on LotusScript error handling and provides a more consistent developer experience compared to other languages. There aren't currently any enhancements to error functions or logging.

!!! note
    Traditional error handling in LotusScript with with [`On Error` statements](https://help.hcltechsw.com/dom_designer/12.0.2/basic/LSAZ_MANAGING_THE_ERROR_NUMBER_AND_MESSAGE_THE_ERR_AND_ERROR_STATEMENTS.html#LSAZ_MANAGING_THE_ERROR_NUMBER_AND_MESSAGE_THE_ERR_AND_ERROR_STATEMENTS__LSAZ_DEFINING_ERRORS_AND_ERROR_NUMBERS){: target="_new" rel="noopener noreferrer”}. This can still be used in VoltScript, but example code will prefer `Try...Catch` syntax.

## Try/Catch/Finally

Try/Catch allows inline coding to handle errors. This improves readability of code and can simplify code when nesting Try/Catch. Finally blocks allow cleanup regardless of errors. Even if the final instruction of a Try or Catch block is to exit the sub or function, the Finally block will still be processed before the exit instruction.

At the very least, a `Try` block must include either a `Catch` or `Finally` block. The following isn't valid syntax:

``` voltscript
Try
    ' Do something
End Try
```

### Catching specific errors

Specific errors are caught using `Catch Error ` + the error number. The following code will catch the type mismatch thrown because `value` isn't a Boolean and can't be parsed as a Boolean:

``` voltscript
Function catch13Error()
    Dim value as String
    
    value = "Hello world"
    Try
        If (value = true) Then
            Print "value is a boolean true"
        End If
    Catch Error 13
        Print "Type Mismatch - value is not a boolean"
    End Try
End Function
```

### Catching generic errors

A simple Catch block will catch any other uncaught error. Consequently, it should appear after all blocks that are catching specific errors. If there are no blocks catching specific errors, it will catch all errors.

``` voltscript
Sub catchError()
    Try
        Error 22
    Catch
        Print "Catch " & Err() & " on line " & Erl()
    End Try
End Sub
```

### Exiting blocks

In both Try and Catch you can exit out of the sub or function. The following function will return "Success" if you want to continue without error, otherwise it will print an error and return "Failure".

``` voltscript
Function tryCatchExit(throwError as boolean) as String
    Try
        If (throwError) Then Error 400, "You wanted an error"
        Return "Success"
    Catch
        Print "Error " & Error() & " on line " & Erl()
        Return "Failure"
    End Try
End Function
```

!!! warning
    You can't exit out of the Finally block using `Exit` or `Return`.

### Stack trace

When you catch an error, it's often important to know at which line the current function was called. `GetThreadInfo(12)` provides this information, giving a stack for the current line number and the from where the current sub or function was called, all the way to the initializing code. The following code gives a stack that prints "GETSTACK" twice if the argument passed is true, or once if the argument passed is false.

``` voltscript
Function getStack(recurse as Boolean) as String
    If (recurse) Then
        Return getStack(false)
    Else
        Print GetThreadInfo(12)
        Return GetThreadInfo(12)
    End If
End Function
```

!!! note
    The output of `GetThreadInfo(12)` is a string with line feeds (`Chr(10)`) separating each element in the stack and an additional blank line at the end. It comprises four elements for wherever the call is made:

    - **module**, i.e. current script file name.
    - **class** or an empty string, if current procedure is not part of a class.
    - **module**, i.e. current sub or function.
    - **line number**
    
    If you wish to parse it, you will need to do some manipulation.

!!! warning
    When using `GetThreadInfo(12)`, the line at the start of the stack is the *current line*, not an error line. Your error handling will still need to use `Erl()` to get the line the error actually occurred on.

### Finally block

There may be processing that needs to be completed regardless of success or failure. This can be done in a Finally block. The Finally block runs before breaking out of a Try or Catch block, so can be used for unlocking files etc. In the following example, the note in the Finally block will be printed regardless of success or failure:

``` voltscript
Function doFinally(throwError as Boolean) As String
    Try
        If (throwError) Then Error 400, "You wanted an error"
        Return "Success"
    Catch
        Print "Error " & Error() & " on line " & Erl()
        Return "Failure"
    Finally
        Print "NOTE: Running in finally"
    End Try
End Function
```

### Nesting Try/Catch

As expected, Try/Catch/Finally can be nested. This helps keep your code more readable and avoid jumping around your script. The following code demonstrates throwing errors in outer and inner Try blocks:

``` voltscript
Function nestTC(error1 as Boolean, error2 as Boolean) as Integer
    Try
        If (error1) Then Error 400, "You wanted an outer error"
        Print "Outer success"
        Return 1
    Catch
        Print "Error " & Error() & " on line " & Erl()
        Try
            If (error2) Then Error 401, "You wanted an inner error"
            Print "Inner success"
            Return 2
        Catch
            Print "Error " & Error() & " on line " & Erl()
            Return 3
        End Try
    End Try
End Function
```

!!! success
    Use of Try/Catch/Finally should remove the need to use `GoTo` in code, improving readability and support.

!!! note
    Error handling is currently the same as LotusScript, using `Err()` for the error number, `Error()` for the error description and `Erl()` for the error line. See LotusScript documentation for more details.

    Enhancements are on the roadmap, but no further details are available at this time.

## Logging

There are no specific enhancements for error logging from VoltScript. This may be addressed in the future. Currently, the recommended approach would be to use StreamVSE to [write to a file](../extensions/read-files.md).

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/language){: target="_blank" rel="noopener noreferrer"}.