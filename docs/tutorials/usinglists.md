# Lists

## 1 Introduction

A list is a one-dimensional collection of elements. The size of the list is not defined at compile-time but grows and shrinks dynamically as entries are added or removed. The elements are accessed via a unique string **tag**. Lists are highly performant for iterating or accessing elements, but are not designed for anything more sophisticated than random or sequential access.

## 2 Creating Lists

Lists can be declared in modules, classes or procedures, but not in types. They are created using the `List` keyword after the variable name. Lists are declared with a data type, which can be any of the scalar data types or a custom class.

``` voltscript
Dim countries List as String
```

If you wish to add content consisting of multiple data types to a list, declare it as a List of Variants.

``` voltscript
Dim complexList List as Variant
```

### 2.1 List Data Types

The **TypeName** check on a list returns the data type suffixed with " LIST". The **DataType** function returns 2048 + the corresponding integer for the data type of the list.

``` voltscript
Dim countries List as String

Print TypeName(countries)   'Prints "STRING LIST"
Print DataType(countries)   'Prints "2056 = 2048 + 8
```

## 3 Handling Lists

### 3.1 Adding Elements

A List is initially created empty. Elements are added by specifying a string key and a value corresponding to the list declaration:

``` voltscript
countries("United States") = "US"
countries("United Kingdom") = "UK"
```

If a key is re-used, it will overwrite the value assigned in the list. Keys are matched depending on the _Option Compare_ case sensitivity applied. By default, that is `Option Compare Case` - case-sensitive matching. Thus `countries("united states")` and `countries("United States")` would be different elements in the list.

### 3.2 Testing Size of the List

Testing the size of a list must be done by iterating the list. There is no single function for checking if a list is empty.

``` voltscript
Dim countries List as String

Print isEmpty(countries)    'Prints "false" - isEmpty cannot be used to test the list has values

Dim listIsEmpty as Boolean
listIsEmpty = True

ForAll elem in countries
    listIsEmpty = False
    Exit ForAll
End ForAll

Print listIsEmpty   'Print "true"

countries("United States") = "US"
countries("United Kingdom") = "UK"

Dim elemCount as Integer

ForAll elem in countries
    elemCount ++
End ForAll

Print elemCount     'Prints "2"
```

### 3.3 Accessing Content

Content can be accessed by iterating elements using a `ForAll` loop, as shown already. Or specific elements can be accessed by using the key. When doing so, be aware that using a key that does not exist will throw an error.

``` voltscript linenums="1"
Dim countries List as String

countries("United States") = "US"

Print countries("United States")    ' Prints "US"
Print countries("United Kingdom")
```

Line 6 will throw an error, "List item does not exist", error code 120. To avoid this, use **IsElement**.

``` voltscript
Dim countries List as String

countries("United States") = "US"

Print countries("United States")    ' Prints "US"
If IsElement(countries("United Kingdom")) Then Print countries("United Kingdom")
```

When iterating the list using a `ForAll` loop, if you require the current key, use **ListTag**.

``` voltscript
Dim countries List as String

countries("United States") = "US"

ForAll elem in countries
    Print ListTag(elem) & " - " & elem  'Prints "United States - US"
End ForAll
```

## Cleanup

Individual entries can be removed from the list using **Erase**. This will also reclaim the memory allocated for that element.

``` voltscript
Dim countries List as String

countries("United States") = "US"

Erase(countries("United States"))
```

Passing just the list variable itself will remove all entries from the list and reclaim memory.

``` voltscript
Dim countries List as String

countries("United States") = "US"
countries("United Kingdom") = "UK"

Erase(countries)
```

It is best practice to call Erase on the list at the end of your code.
