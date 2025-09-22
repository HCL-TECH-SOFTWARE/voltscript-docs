# Build JSON

--8<-- "setup.md"

## Introduction

JSON can be constructed manually as a string. But this is an onerous and accident-prone way of generating output. **JsonVSE** was designed to improve the developer experience for both reading and writing JSON. In this tutorial, we will focus on _writing_ JSON.

## VoltScript dependencies

Incorporating JsonVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
"JsonVSE": {
    "library": "JsonVSE VoltScript Extension",
    "version": "1.0.3",
    "module": "jsonvse",
    "repository":"volt-mx-marketplace"
}
```

--8<-- "vse-repository.md"

To use the extension in your script, enter `UseVSE "*JsonVSE"`.

## JsonObject class

### Construct JSON objects and arrays

The **JsonObject** class is used for both JSON objects and JSON arrays. The JsonObject class can be instantiated without an argument, using just `Dim jsonObj as New JsonObject()`. If done this way, the object created can be used for JSON objects or arrays.

``` voltscript
Function buildJsonObj() as JsonObject
    Dim jsonObj as New JsonObject(False)

    Call jsonObj.insertValue("String", "One")
    Call jsonObj.insertValue("Number", 2)

    Return jsonObj
End Function
```

If intended just as a JSON object, use `new JsonObject(False)`. The method `insertValue()` is used to build a JSON object. The first parameter is the label, the second parameter is the value.

``` voltscript
Function buildJsonArr() as JsonObject
    Dim jsonArr as New JsonObject(True)

    Call jsonArr.appendToJsonArray("One")
    Call jsonArr.appendToJsonArray("Two")
    Call jsonArr.appendToJsonArray(2)

    Return jsonArr
End Function
```

If the instance should _only_ be a JSON array, best practice is to instantiate it with the argument `True`. When instantiated this way, the resulting object can _only_ be used to add array elements - using `insertValue()` will throw an error.

The method `appendToJsonArray()` is used to build a JSON array. Because the JSON array only contains values, there is only one parameter to pass. Because a JSON array can contain mixed value types, subsequent calls to `appendToJsonArray()` don't need to pass the same parameter type.

### Fluent Methods

Methods for inserting values and appending arrays are fluent. So method calls can be chained for shorter code:

``` voltscript
    Set jsonObj = new JsonObject(False)
    Call testSuite.describe("Test fluent method on object building")
    Call jsonObj.insertValue("key1", "one").insertValue("key2", "two")
    Call testSuite.assertEqualsInteger(2, jsonObj.childCount)
    Set jsonObj = new JsonObject(True)
    Call testSuite.describe("Test fluent method on array building")
    Call jsonObj.appendToJsonArray("one").appendToJsonArray("two")
    Call testSuite.assertEqualsInteger(2, jsonObj.childCount)
```

### Add arrays to existing JsonObject

An array can be passed into a JsonObject in two ways. The first is by constructing a VoltScript array and calling the `insertValue()` method.

``` voltscript
Sub addVSArrToObj(jsonObj as JsonObject)
    Dim vals(1) as String
    vals(0) = "Hello"
    vals(1) = "World"

    Call jsonObj.insertValue("StringArray", vals)
End Function
```

Alternatively, a JsonObject that's an array can be loaded, calling either `insertValue()` or `insertObject()` methods. If using `insertValue()`, you need to pass the label as a parameter. The `label` property of the JsonObject will be ignored. If using `insertObject()`, the `label` property of the JsonObject can be leveraged or the label explicitly passed as a parameter.

``` voltscript
Sub addJsonArrToObject(jsonObj as JsonObject, jsonArr as JsonObject)
    Call jsonObj.insertValue("JSONArray", jsonArr)

    Call jsonObj.insertObject(jsonArr, "ObjectArray") ' (1)
    jsonArr.label = "ArrayLabel"
    Call jsonObj.insertObject(jsonArr) ' (2)
End Function
```

1. "ObjectArray" label is used, regardless of the label of the `jsonArr` object.
2. `jsonArr.label` is used as the label.

### Add JsonObjects to a JsonObject

A JsonObject can  be loaded calling either `insertValue()` or `insertObject()` methods. If using `insertValue()`, you need to pass the label as a parameter. The `label` property of the JsonObject will be ignored. If using `insertObject()`, the `label` property of the JsonObject can be leveraged or the label explicitly passed as a parameter.

``` voltscript
Sub addJsonObj(jsonObj as JsonObject)
    Dim childObj as New JsonObject
    Call childObj.insertValue("hello","world")

    Call jsonObj.insertValue("child1", childObj)
    Call jsonObj.insertObject(childObj, "child2")

    childObj.label = "child3"
    Call jsonObj.insertObject(childObj)
End Function
```

### "By Value" addition

JsonObjects and JsonArrays loaded by `insertValue()` or `insertObject()` are passed by value, not by reference. This means the contents are deep-copied into the new parent. As a result, subsequent changes to the child won't be reflected in the parent.

``` voltscript
Function modifyChild() as JsonObject
    Dim parent as JsonObject
    Dim childObj as JsonObject
    Call childObj.insertValue("elem1", "hello world")
    childObj.label = "child"

    Call parent.insertObject(childObj)
    Call childObj.insertValue("elem2", 2)
    Print parent.toString(false) ' (1)
    Return parent
End Function
```

1. This code will print `{"child":{"elem1":"hello world"}}` because "elem2" was added to the child JsonObject _after_ it was copied into the parent.

## Removing elements

Elements can be removed from JsonObjects using the relevant method - `removeArrayEntry()` for JsonObjects that are arrays and `removeChild()` for JsonObjects that are not. **NOTE:** `removeChild()` will throw an error if used on JsonObjects that are arrays.

``` voltscript
    Call testSuite.describe("Test removeArrayEntry")
    Call jsonObj.removeArrayEntry(0)
    Call testSuite.assertEqualsInteger(1, jsonObj.childCount)
    Call testSuite.assertEqualsString("two", jsonObj.getChildren()(0).scalarValue, True)

    Set jsonObj = new JsonObject(False)
    Call jsonObj.insertValue("key1", "one").insertValue("key2", "two")
    Call jsonObj.removeChild("key1")
    Call testSuite.assertEqualsInteger(1, jsonObj.childCount)
    Call testSuite.assertEqualsString("two", jsonObj.getChildren()(0).scalarValue, True)
```

## Return JSON

We use `toString(false)` to return a string of compact JSON.

``` voltscript
Print parent.toString(false)
```

This will print `{"child":{"elem1":"hello world"}}`.

Use `toString(true)` to return a string of JSON pretty-printed.

``` voltscript
Print parent.toString(true)
```

This will print:

```json
{
    "child": {
        "elem1": "hello world"
    }
}
```

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/jsonvse){: target="_blank" rel="noopener noreferrer"}.