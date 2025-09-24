# XML Parsing

--8<-- "setup.md"

## Introduction

The main feature of **XMLVSE** is to load XML strings or files and convert them to an XML object for parsing. Once parsed, the XML object can now be modified using various XMLVSE functions.
<!--**XMLVSE** main functionality is to load strings or files of XML and converts it into an XML object for parsing. Once parsed, these XML object can now be modified using the various functions that XMLVSE has.-->

## VoltScript dependencies

Incorporating XMLVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
        "XmlVSE": {
            "library": "XMLVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "xmlvse",
            "repository": "volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

To use the extension in your script, enter `UseVSE "*XMLVSE"`.

## XMLParser class

The **XMLParser** class is used to generate an XML object from reading strings or a file content.

### Parse XML strings

To parse an XML string, you need to pass it using the `LoadFromXML()` method:

``` voltscript
Function parseXMLString(xml as String) as XMLObject

    Dim parser as New XMLParser()
    Call parser.loadFromXML(xml)
    Return parser.getRootXML

End Function
```

If the passed string is not valid XML, a 404 error is returned. The error message is *Must supply a valid XML string*.

### Parse XML files

To parse an XML file, you need to pass it using the `LoadFromFile()` method:

``` voltscript
Function parseXMLFile(fileName as String) as XMLObject

    Dim parser as New XMLParser()
    Call parser.loadFromFile(CurDir & "/" & fileName)
    Return parser.getRootXML

End Function
```

If the XML file isn't found at the specified path, a 404 error is returned. The error message is *File could not be opened:* followed by the provided path.

If the file does not contain valid XML, a 404 error is returned. The error message is *XML file is not a valid XML*.

## Parse XML objects

The **XMLObject** class is used to hold the whole XML tree. You can traverse throughout the XML Tree by diving into a Child Element using `GetChild()` by providing the specific Tag or step back using `GetParent()`.

You can also get all the child element in an array of XMLObject using `GetChildren()`

``` voltscript
Sub Initialize
    
    Dim parser as New XMLParser
    DIm object as New XMLObject
    Dim xmlString as String

    xmlString = "<Profile version='1' publish='2024'><Employee>John Doe</Employee></Profile>"
    Call parser.loadFromXML(xmlString)
    Set object = parser.getRootXML()

    DIm newObject as New XMLObject

    Set newObject =  object.getChild("Employee")
    Print newObject.toString("true")

    Set newObject =  object.getParent()
    Print newObject.toString("true")

    Dim arrayVals as Variant
    arrayVals =  object.getChildren()

    ForAll child in arrayVals         
    Set newObject = child
    Print newObject.Tag() & " - " & newObject.Value()
    End ForAll

End Sub
```

!!! warning
    `.GetChild()` throws an error code 404, *Child XML not found:* if there is no child matching the passed label.

### Modifying Parsed XML

You can manipulate the parsed XML by modifying the **tag** and **value** properties of an XMLObject.

``` voltscript
Sub Initialize

    DIm object as New XMLObject
    Dim parser as New XMLParser
    Dim xmlString as String

    xmlString = "<Profile version='1' publish='2024'><Employee>John Doe</Employee></Profile>"
    Call parser.loadFromXML(xmlString)
    Set object = parser.getRootXML()

    object.tag = "Account"

    Dim ChildObject as XMLObject
    Set ChildObject = object.getChild("Employee")

    Call object.removeChildObject(ChildObject)

    ChildObject.tag = "Manager"
    ChildObject.value = "Jane Doe"

    Call object.addChildObject(ChildObject)

    print object.toString(True)

End Sub
```

In the above sample, the root element tag was updated from `Profile` to `Account` and child element tag and value were updated from `<Employee>John Doe</Employee>` to `<Manager>Jane Doe</Manager>`. `GetChild` returns a new XMLObject instance separated from the parent object, in this case `ChildObject`. To update the parent object, remove the child with `RemoveChild` or `RemoveChildObject`, then add the modified child to the parent with `AddChildObject`.

### Verify and troubleshoot values

For both XMLParser and XMLObject, you can use `ToString()` to return the full XML object as a string. If the passed argument is `True`, a prettified or indented XML is printed. If the passed argument is `False`, a compact XML is printed.

<!--For both XMLParser and XMLObject, you can use `ToString()` to return the full XML object as a string, pretty-print or indented XML would be printed if the argument passed is `True`, and a compact XML if `False`.-->

You can also verify the XML existence within the XML Object using the `IsEmpty` checking.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/xmlvse){: target="_blank" rel="noopener noreferrer"}.