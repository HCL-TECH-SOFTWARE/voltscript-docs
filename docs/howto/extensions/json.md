# JSON Parsing

--8<-- "setup.md"

## Introduction

JsonVSE provides functionality to convert strings or files of JSON into JSON objects, which can then be parsed. [VoltScript JSON Converter](https://opensource.hcltechsw.com/voltscript-json-converter){: target="_blank" rel="noopener noreferrer"} uses JsonVSE to convert to and from VoltScript objects. In some cases, parsing the JSON objects may be preferable.

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

## JsonParser class

The JsonParser class is used to generate a JSON object from a string or file content.

### Parse JSON strings

Parsing JSON strings is done using `loadFromJson()`:

``` voltscript
Function parseJsonString(json as String) as JsonObject

    Dim parser as New JsonParser()
    Call parser.loadFromJson(json)
    Return parser.getRootObject

End Function
```

If a string is passed that is not valid JSON, an error will be returned, error 400. The error message will be "Must supply a valid JSON string" followed by the invalid JSON. You canb validate the string before parsing it by using `parser.isValidJSON(json)`.

### Parse JSON files

Parsing JSON files is done with `loadFromFile()`, passing the path.

``` voltscript
Function parseJsonFile(fileName as String) as JsonObject

    Dim parser as New JsonParser()
    Call parser.loadFromFile(CurDir & "/" & fileName)
    Return parser.getRootObject

End Function
```

If the file isn't found at the location specified, an error will be returned, error 404. The error message will be "File could not be opened" plus the path that was tried.

If the file does not contain valid JSON, an error will be returned, error 400. The error message will be "JSON text is not valid".

## Parse JSON objects

The `JsonObject` class is used to hold scalar values, arrays, or other JSON objects, which may contain scalar values, arrays or other JSON objects.

### Capture types

Verifying the type of a JSON object is used with boolean "is..." functions or `JsonType` property, which returns a lower-case string. So the following code can output type and a number corresponding to type.

``` voltscript
Function checkJsonType(jsonObj as JsonObject, label as String) as String
    Dim child as jsonObject
    Dim resp as String
    Dim count as Integer

    Set child = jsonObj.getChild(label)
    resp = child.JsonType & " "
    If child.isNumber() Then count += 1
    If child.isObject() Then count += 2
    If child.isScalar() Then count += 4
    If child.isString() Then count += 8
    If child.isArray() Then count += 16
    If child.isBoolean() Then count += 32
    Return resp & count

End Function
```

!!! warning
    `.getChild()` will throw an error code 404, "Child JSON not found" if there is no child matching the passed label.

### Verify existence

Unless dealing with static JSON, it's always advisable to verify elements can be found before trying to parse them. At a single level, this can be done with `isChild()`. At lower levels, this can be done in two ways. Firstly by using an array of strings. `isDescendant()` returns a boolean for existence, `findObjectByPath()` can return the actual object and returns `Nothing` if no object can be found at the path.

``` voltscript
    Call testSuite2.describe("Check address is child").assertTrue(jsonObj.isChild("address"))
    Dim path(1) as String
    path(0) = "address"
    path(1) = "add1"
    Call testSuite2.describe("Check address/add1 can be found").assertTrue(jsonObj.isDescendant(path))
    path(1) = "add3"
    Call testSuite2.describe("Check address/add3 can't be found").assertFalse(jsonObj.isDescendant(path))
    Call testSuite2.describe("Check address/add3 can't be found").assertFalse(jsonObj.isDescendantPath("address/add3"))
    Dim actualObj as JsonObject
    Call testSuite2.describe("Find address/add2").assertTrue(actualObj Is Nothing)
    Set actualObj = jsonObj.findObjectByPath(path)
    Call testSuite2.describe("Find address/add2").assertTrue(Not actualObj Is Nothing)
```

Alternatively it can be done with a string and delimiter. `isDescendantPath()` returns a boolean for existence, `getDescendantPath()` can return the actual object and returns `Nothing` if no object can be found at the path.

``` voltscript
    Call testSuite2.describe("Check address/add1 can be found as a string").assertTrue(jsonObj.isDescendantPath("address/add1"))
    Call testSuite2.describe("Check address/add3 can't be found as a string").assertFalse(jsonObj.isDescendantPath("address/add3", "/"))
    Set actualObj = jsonObj.getDescendantPath("address,add2", ",")
    Call testSuite2.describe("Find address/add2 as a string").assertTrue(Not actualObj Is Nothing)
```

!!! note
    The methods take an optional parameter for the delimiter, defaulting to "/" if nothing is passed. This is because "/" is a valid character in a JSON string literal. This allows your string to use a different character as the delimiter to avoid incorrect splitting.

!!! warning
    Finding by descendant path as a string will only navigate to a maximum of **three** levels. This is by design to minimise performance impact. But remember this method is available on *any* JSON object, not just the root JSON object.

### Return values

For JSON objects that are scalars, the value can be returned using `scalarValue` property.

`getChildren()` is preferred to process arrays, as a consistent approach that will work for scalar and object arrays. Each element will be a JsonObject, so `scalarValue` will be required to get the value. Alternatively, if you are certain they are scalars, `valueArray` property will return a Variant array.

### Troubleshoot values

For any JsonObject `toString()` can be used to return the full JSON object as a string, pretty-printed if the argument passed is `True`, as compact JSON if `False`. Alternatively, for swift debugging purposes, the `shortValue` property will return a maximum 16 characters.

!!! note
    VoltScript Testing can be used to validate the JSON object before processing. If you set `suppressReport = True` on the TestSuite, you can check `ranSuccessfully()` to verify if the JSON object was successfully validated or not.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/jsonvse){: target="_blank" rel="noopener noreferrer"}.