# Short-Circuit Conditionals

**Short-Circuit Evaluation** is a programming mechanism by which evaluation of a condition ceases as soon as the result of the condition can be determined.  Attitional comparisons are considered redundant and ignored.

??? info "short-circuit comparisons"
    In LotusScript (from which VoltScript evolved), `And` and `Or` comparisions **always** evaluate every condition (both sides of the comparison operator), which can result in ineffecient code (or sometimes code failures).   *Short Circuit* comparisons (`||` for `Or`, and `&&` for `And`) will cease comparison at the first condition which logically ends the need for additional comparisons, and will not evaulate additional conditions. The following code example should help:  
    ``` voltscript
    Dim a as Integer
    Dim b as Integer
    Dim c as Integer

    a = 1 
    b = 2 
    c = 3 

    If (a < b) || (b < c) Then Print "True: evaluated first condition, skipped second condition"
    If (a < b) && (b < c) Then Print "True: evaluated both conditions"
    If (a > b) || (b > c) Then Print "False: evaluated both conditions"
    If (a > b) && (b > c) Then Print "False: evaluted first condition, skipped second condition"
    ```

## || (OrElse)

An `If...Then...Else` statement can contain multiple conditional statements. If a logical OR statement is used in LotusScript, all the conditional statements will be executed, regardless of the outcome.

``` voltscript linenums="1"
Class Student
    Public ID As Long
    Public Name As String
    Public Score As Single
End Class

Sub orFail
    Dim obj as Student
    If (obj is Nothing Or obj.Name != "") Then
        Print "Student not initialized"
    End If
End Sub
```

When running the `orFail` method, the above code will throw an "Object Variable Not Set" error on line 8 because both conditional statements will be executed, which means `obj.Name` will be checked even though `obj is Nothing` returns true.

VoltScript provides a short-circuit OR operator, `||`. This performs like Visual Basic's `OrElse` operator, running the minimum conditional statements required. The following code will not throw an error and continue to the `Return` statement.`

``` voltscript
Function orSuccess as String
    Dim obj as Student
    If (obj is Nothing || obj.Name != "") Then
        Print "Student not initialized"
    End If
    Return "Success"
End Function
```

!!! danger
    Because `||` represents either an empty string or an `OrElse` indicator, using both of them in the same line of code (without forced grouping) will not compile.  The use of either parentheses or breaking the code into multiple lines is recommended.  

    ``` voltscript
        If passedStr = "" || args(0) = "" Then  ' << This line will not compile 

        If (passedStr = "") || args(0) = "" Then  ' << Use this pattern instead
    ```

!!! warning
    `Print` can also take a string of values, e.g. `Print "One" "Two" "Three"`. The recommended best practice is to concatenate strings with ampersand.  
    `Or` is valid in a Print statement, e.g. `Print True or False`, but undocumented for LotusScript and with limited use cases.
    `||` in a Print statement runs as "OrElse" and **is strongly discouraged**.

## && (AndAlso)

If a logical AND statement is used in LotusScript, all the conditional statements will also be executed, regardless of the outcome. So in the following code, both conditions will be checked, even if the `obj.Name` condition is not met.

``` voltscript
Sub andFail
    Dim obj as New Student
    If (obj.Name != "" And obj.Score > 90) Then
        Print "High-score valid student"
    End If
End Sub
```

VoltScript provides a short-circuit AND operator, `&&`. This performs like Visual Basic's `AndAlso` operator, running the minimum conditional statements required. The following code will not run the `obj.Score` condition if `obj.Name` is blank.

``` voltscript
Function andSuccess as String
    Dim obj as New Student
    If (obj.Name != "" && obj.Score > 90) Then
        Print "High-score valid student"
    End If
    Return "Success"
End Function
```

??? question "Why didn't you just change the behavior of And and Or?"
    This is an extremely valid question, and was something the development team discussed at length.  
    Because existing LotusScript business logic code is likely to be *imported into VoltScript* environments, changing the behavior of these logical operators could *break the imported code*, which the development team deemed to be unacceptable.  

For more details, see [Short-circuiting logical expressions](../../howto/language/conditionals.md).