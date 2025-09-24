# Build XML

--8<-- "setup.md"

## Introduction

Although the most efficient way of modifying and improving your XML is through parsing, **XMLVSE** is also designed to allow developers to construct an XML tree from scratch. In this guide, the focus is on _writing_ XML.

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

## XMLObject class

The **XMLObject** class is used to hold the whole XML tree.

### Construct XML Objects

To construct an XML from scratch, you need to know the key components that XML is composed of:

- **Root**: the primary and topmost element of an XML
- **Attribute**: defines the properties of a specific XML element
- **Child** - elements contained inside a specific XML element.

XML elements that have a child or children are called Parent XML elements.

To populate your XML from scratch, add a root element using the `AddRootTag()`. The first parameter is the tag and the second parameter is the value.

!!! note
    Element values are optional depending on how you want your expected XML to look. You can set it as empty if you want to add another element on your root instead of a string value. In you used `AddRootTag()` to an XML object that already has a root element, a 404 error occurs. The error message is _Current Object needs to be Empty to be able to add a new tag_.

Once your XMLObject has a root, you can now add Attributes into your XML Object if you want using `addAttribute()`. The first parameter is the tag and the second parameter is the value.

``` voltscript
Function buildXML() as XMLObject

    Dim xmlObj as New XMLObject

    Call xmlObj.addRootTag("Test", "Hello World")
    Call xmlObj.addAttribute("version", "1")

    Return xmlObj
End Function
```

### Add Child Elements

There are two ways to add Child Elements to your XML. The first way is to use string inputs `AddChild()` with the first parameter being the tag and the second parameter being the value. The second way is to use another XML Object `AddChildObject()` with the parameter needing to be an XMLObject.

!!! note
    For **addChild()**, element values are optional depending on how you want your expected XML to look. You can set it as empty if you want to add another element on your child element instead of a string value.
    For **AddChildObject()**, if the passed parameter isn't an XML object, error 53291 occurs. The error message is _Type mismatch on:_ followed by the supplied input. In case the passed XML Object isn't a valid XML, error 404 occurs. The error message is _Child Object is Empty_.

``` voltscript
Function buildXMLWithChildren() as XMLObject

    Dim xmlObj as New XMLObject
    
    Call xmlObj.addRootTag("Test", "")
    Call xmlObj.addChild("Hello", "World")

    Dim ChildObj as New XMLObject
    Call ChildObj.addRootTag("Foo", "Bar")

    Call xmlObj.addChildObject(ChildObj)

    Return xmlObj
End Function
```

### Remove Elements

Removing XML Elements is also part of modifying your XML tree. XMLVSE also has methods that you can use to remove certain elements from your XML tree.

- To remove attributes, use `RemoveAttribute()`. The parameter is the attribute tag.
- To remove a child element, use `RemoveChild()`. The parameter is the child tag. You can also use `RemoveChildObject()`to remove a child using an object parameter.

``` voltscript
Function removeXMLElements(xmlObj as XMLObject) as XMLObject
    
    Call xmlObj.removeAttribute("version")
    Call xmlObj.removeChild("Hello")

    Dim ChildObj as New XMLObject
    Set ChildObj = xmlObj.getChild("Foo")
    Call xmlObj.removeChildObject(ChildObj)

    Return xmlObj
End Function
```

## Return XML

For both XMLParser and XMLObject, you can use `ToString()` to return the full XML object as a string. If the passed argument is `True`, a prettified or indented XML is printed. If the passed argument is `False`, a compact XML is printed.

<!--For both XMLParser and XMLObject, you can use `ToString()` to return the full XML object as a string, pretty-print or indented XML would be printed if the argument passed is `True`, and a compact XML if `False`.-->

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/jsonvse){: target="_blank" rel="noopener noreferrer"}.