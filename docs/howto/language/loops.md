# Loops

## Introduction

There are no additions to the available [iterative statements (loops)](https://help.hcltechsw.com/dom_designer/12.0.2/basic/LSAZ_ITERATIVE_STATEMENTS.html){: target="_blank" rel="noopener noreferrer"} in VoltScript. But the pre- and post-fix increment and decrement operators may change the way code is written.

## Iterative statements

Like LotusScript, VoltScript provides the following iterative statements:

- **For...Next** loop uses a numeric variable, iterating from a lower bound to an upper bound, both defined in the `For` statement. The numeric variable is automatically incremented by the loop.
- **ForAll...in** loop iterates all elements in an array, list or VoltScript Extension class that implements a collection. `Exit ForAll` statement allows you to exit early.
- **While** loop iterates according to a condition, checked at the start of each loop. There is no `Exit` statement provided to break out of this condition, so if you wish to do this, best practice is to use a `Do...` loop instead. It's the developer's responsibility to remember to change the condition variable within the loop.
- **Do...Loop** loop iterates without condition until an `Exit Do` statement is triggered.
- **Do While...Loop** loop checks a condition before starting each loop and, as long as the condition is true, executes the conditions. It's the developer's responsibility to remember to change the condition variable within the loop or call `Exit Do`.
- **Do...Loop While** loop checks a condition after each loop, always iterating the loop at least once. The loop is iterated again as long as the condition is true. It's the developer's responsibility to remember to change the condition variable within the loop or call `Exit Do`.
- **Do Until...Loop** loop checks a condition before starting each loop and executes the loop until the condition is true. It's the developer's responsibility to remember to change the condition variable within the loop or call `Exit Do`.
- **Do...Loop Until** loop checks a condition after each loop, always iterating the loop at least once. The loop is iterated again until a condition is true. It's the developer's responsibility to remember to change the condition variable within the loop or call `Exit Do`.

!!! note
    When using a `ForAll` loop, the data type of the element variable in  the container is `Variant`. Best practice will be to cast it to the relevant datatype before using. If it is being passed to another Sub or Function, you will need to cast it before passing it to the method or you will receive a Type Mismatch error.

    This is consistent with LotusScript, although it is encountered less frequently. `NotesDocument.items` is one such container in LotusScript that can be iterated using a `ForAll` loop. More usually in LotusScript you need to use `getFirst...` and `getNext...` function to iterate the collection.

This flow diagram should help you choose the right iterative loop:

``` mermaid
flowchart TD
    A{Iterate\nnumeric\nvariables?}-- Yes -->B(For...Next)
    A-- No -->C{Iterate all\nelements in a\ncollection?}
    C-- Yes -->D(ForAll...in...)
    C-- No -->E{Loop without\ncondition?}
    E-- Yes -->F(Do...Loop)
    E-- No -->G{When to\ncheck\ncondition?}
    G-- Start of each loop -->H{Continue to\ncompletion\nalways?}
    H-- Yes -->I(While...Wend)
    H-- No -->J{When to\nbreak loop?}
    J-- When condition\nis false -->K(Do While...Loop)
    J-- When condition\nis true -->L(Do Until...Loop)
    G-- End of each loop -->M{When to\nbreak loop?}
    M-- When condition\nis false -->N(Do...Loop While)
    M-- When condition\nis true -->O(Do...Loop Until)
```

!!! success
    Use of the right iterative statement should prevent error conditions or the need to use `GoTo`, improving readability and support of the code.

### Prefix/Postfix increment/decrement

When using numeric variables in `While` and `Do` loops, historically a separate instruction to increment or decrement the variable was required. However, prefix and postfix increment and decrement operators can avoid the need for this.

!!! warning
    You may need to think carefully about whether to use prefix or postfix operators. Remember with a prefix operator, the variable will be modified *before* any other instructions on the line are processed; with the post-fix operator, all other instructions on the line will be processed *and then* the variable will be modified.

### While loop

The `While` loop is probably the most familiar to LotusScript developers. The following example will print all elements of an array, incrementing the variable after the print:

``` voltscript
Sub loopArray(passedArr as Variant)
    Dim i as Integer
    While i <= UBound(passedArr)
        Print passedArr(i++)
    Wend
End Sub
```

### Do with prefix or postfix increment

The danger of incrementing a variable within the loop is that the unobservant developer may wish to make an additional use of the array element, so copy and paste `passedArr(i++)`, inadvertently double-incrementing the variable `i` within each loop. `Do` loops can avoid the temptation by ensuring the variable is incrementing in the loop command.

However, incrementing at the start of the loop will skip the first variable, so the condition must be at the end. This can be achieved with either prefix or postfix operator. The following code uses the prefix operator.

``` voltscript
Sub loopArrayDo(passedArr as Variant)
    Dim i as Integer
    Do
        Print passedArr(i)
    Loop Until ++i > UBound(passedArr)
End Sub
```

The following code does the same with a postfix operator:

``` voltscript
Sub loopArrayDoPostfix(passedArr as Variant)
    Dim i as Integer
    Do
        Print passedArr(i)
    Loop Until i++ = UBound(passedArr)
End Sub
```

### More complex postfix operations

Imagine we want to iterate the words in "The quick brown fox jumps over the lazy dog" but exit at the second "the". Postfix operators can make the code very terse:

``` voltscript linenums="1"
Sub loopArrayExitThe(passedArr as Variant)
    Dim i as Integer
    Dim the as Integer
    Do Until i > UBound(passedArr)
        If (LCase(passedArr(i)) = "the") Then
            If the++ > 0 Then Exit Do
        End If
        Print passedArr(i++)
    Loop
End Sub
```

Line 5 checks if the lower-cased word is "the". Line 6 checks a variable is greater than 0 and then increments it, allowing the conditional statement to be reduced to a single line. After printing the current word, the variable for the `Do` loop is incremented.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/language){: target="_blank" rel="noopener noreferrer"}.