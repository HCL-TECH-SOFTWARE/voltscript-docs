# Number Manipulation

## Mathematical Assignment Operators

The following assignment operators have been added:

- **+=**, the addition assignment operator, adds the value of the right operand to a variable and assigns the result to the variable.
- **-=**, the subtraction assignment operator, subtracts the value of the right operand from a variable and assigns the result to the variable.
- **\*=**, the multiplication assignment operator, multiplies the variable by the right operand and assigns the result to the variable.
- **/=** and **\=**, the division assignment operators, divide the variable by the right operand and assign the result to the variable.

``` voltscript
    Dim i as Integer
    i += 5
    Print i     ' Prints 5
    i -= 3
    Print i     ' Prints 2
    i *= 4
    Print i     ' Prints 8
    i /= 2
    Print i     ' Prints 4
    i \= 2
    Print i     ' Prints 2
```

!!! note
    The assignment operators cannot be combined with another function, e.g. `Print i += 2` will not compile.

## Increment and Decrement Operators

In LotusScript, incrementing a numeric value is done using code such as `i = i + 1`. VoltScript adds the increment operator (**++**) and decrement operator (**--**). These can both be used prefix and postfix.

If used postfix (`i++`) the variable is incremented _after_ it is used. If used prefix (`++i`) the variable is incremented _before_ it is used.

``` voltscript
Dim i as Integer
Print ++i       ' Prints 1
Print i++       ' Prints 1 again, and after printing increments i to 2
Print i         ' Prints 2
Print --i       ' Prints 1
Print i--       ' Prints 1 again, and after printing decrements i to 0
Print i         ' Prints 0
```

!!! warning
    `+=` can only be used for manipulation of numeric values. It cannot be used for string concatenation.