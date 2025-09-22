# Return

One of the new features of VoltScript is the `Return` statement.  This statement immediately ceases operation of any method (*Sub*, *Function*, or *Property*) and returns to the calling code.  If the method is supposed to return a value (such as with a *Function* or a *Property Get*), the value which is returned to the calling code will be the value following the `return` statement.   If no value follows the `return` statement, then the value that is returned will be the **default** value for the method's return data type.  ("" for Strings, 0 for Integers, etc).  If the metod's return type is an object, then a no-value `return` statement will return `Nothing`.

!!! info
    In LotusScript the way to break out of a sub or function is `Exit Sub` or `Exit Function`. In a function, the way to return a value is `FUNCTION_NAME =`, prepended with `Set` if the function returns an object.

    For VoltScript, the LotusScript syntax will still work. But you can also use the `Return` statement. This is designed to simplify the code and make it more consistent with other languages, including Visual Basic.

## Subs and Setter Properties

`Return` in a Sub or Setter Property will stop processing and exit the Method.

``` voltscript
Sub printMessage(msg as String)
    If msg = "" Then Return
    Print msg  ' << this line will never execute!!
End Sub  

Property Set Message(msg As String)
    Return 
    Me.message = msg  ' << this line will never execute!!
End Poperty 
```

A sub does not return a value, so you cannot pass a value or variable to the Return statement.

## Functions and Getter Properties

In these methods, `Return` will work the same as `Exit Function` or `Exit Property`, by aborting processing and returning the default value for the method's datatype.

``` voltscript
Function incrementCounter(counter as Integer) as Integer
    Try
        Return ++counter
    Catch
        Return  ' If incrementing counter causes an Overflow error
    End Try
End Function  

Property Get myTypeName As String 
    Return TypeName(Me) ' returns the TypeName of the carrying class

    myTypeName = TypeName(Me)  ' << this line will never execute!!
End Property 

Property Get noTypeName As String 
    Return ' returns an empty string

    noTypeName = |no type name|  ' << this line will never execute!!
End Property 
```

For functions, the Return statement can also take a value or variable to return. `Set` does not need to be prepended, so syntax is identical whether you are returning a scalar/scalar array or an object.

``` voltscript
UseVSE "*ZuluVSE"
Function convertDate(incoming as Variant) as Variant
    Dim dp as New DateTimeParser
    If ("STRING" = TypeName(incoming)) Then
        Return dp.parseISOString(incoming)  'String -> DateTimeObject
    Else
        Return incoming.toISODateTime()     'DateTimeObject -> String
    End If
End Function
```

!!! note
    The syntax of the `Return` statement is identical for returning a String and a DateTimeObject.

## Return and Try/Catch/Finally

Using `Return` will still respect a Try/Catch/Finally statement. The `Finally` block(s) will be processed before exiting the sub or function.