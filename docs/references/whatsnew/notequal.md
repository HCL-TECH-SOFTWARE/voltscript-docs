---
hide:
    toc
---
# Inequality Operator Alias

In LotusScript, a boolean inequality check in an `If` statement is done using `<>`. For better consistency with other languages VoltScript has introduced the alias `!=`. Both can be used and there is no difference in how they work, so the following two code blocks will both work the same.

``` voltscript
Function checkEmptyString(passedVal as String) as Boolean
    If (passedVal <> "") Then
        Return True
    Else
        Return False
    End If
End Function
```

``` voltscript
Function checkEmptyString(passedVal as String) as Boolean
    If (passedVal != "") Then
        Return True
    Else
        Return False
    End If
End Function
```

!!! note
    The code is more verbose than necessary, to clearly illustrate the new syntax. `Return passedVal != ""` would be valid code and more terse.

The syntax can be used for numerics as well as strings:

``` voltscript
Function checkNotZero(passedVal as Integer) as Boolean
    If (passedVal != 0) Then
        Return True
    Else
        Return False
    End If
End Function
```