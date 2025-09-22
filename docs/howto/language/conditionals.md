# Short-circuiting logical expressions

## Introduction

In LotusScript, logical operations (`And` and `Or`) evaluate all expressions before deciding which branch of the conditional statement to process. VoltScript adds new operators - `||` and `&&` - for short-circuiting the logical operations.

### ||

`||` short-circuits logical expressions where developers might otherwise use `Or`. This performs like Visual Basic's `OrElse` operator, running the minimum conditional statements required. The following code won't throw an error and continue to the `Return` statement.`

``` voltscript
Function orSuccess as String
    Dim obj as Student
    If (obj is Nothing || obj.Name != "") Then
        Print "Student not initialized"
    End If
    Return "Success"
End Function
```

!!! note
    Because `||` can now be an empty string and `OrElse`, `If passedStr = "" || args(0) = "" Then` won't compile. The first condition will need to be wrapped in parentheses, so `If (passedStr = "") || args(0) = "" Then`.

### &&

`&&` short-circuits logical conjunctions on two or more expressions. This performs like Visual Basic's `AndAlso` operator, running the minimum conditional statements required. The following code won't run the `obj.Score` condition if `obj.Name` is blank.

``` voltscript
Function andSuccess as String
    Dim obj as New Student
    If (obj.Name != "" && obj.Score > 90) Then
        Print "High-score valid student"
    End If
    Return "Success"
End Function
```

### Understanding when to short-circuit

There may still be cases when you *do not* want to short-circuit logical expressions. When running unit tests, you want to know if all are successful or any have failed. `TestSuite.ranSuccessfully()` returns whether that test was successful. But consider the following script:

``` voltscript linenums="1"
Sub Initialize

    Dim testRunner as New testRunner("Language tests")
    Dim result as Boolean

    result = errorTests(testRunner)
    result = result And logicalTests(testRunner)

    If result Then Print "TESTS SUCCESSFUL" Else Print "TESTS UNSUCCESSFUL"

End Sub
```

If you used `&&` on line 7, the second set of tests would *only* run of the first tests failed. But you want to run them every time. As a result, `And` is the better choice for this use case.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/language){: target="_blank" rel="noopener noreferrer"}.