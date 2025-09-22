# Lab 05 - VoltScript Json Converter

## Duration 20 min

## What you will learn

You will expand your basic JSON parsing skills from [Lab 03b](lab-03b.md) using the `JsonVSE` VoltScript Extension.  You will learn how the VS-Code VoltScript environment behaves when a run-time exception occurs, and how to correct simple typo mistakes in your source code.

## Prerequisites

- [Lab 04](lab-04.md) completed  

## Steps

### The IDE

1. Create a new VS Code VoltScript Workspace folder called **lab-05**.
    --8<-- "voltscript-ide.md"

### atlas.json

1. Download the [atlas.json](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/intro-lab5/assets/atlas.json){: target="_new" rel="noopener noreferrer”} and save it to your `lab-05` folder.  
1. Modify `atlas.json` value for `authors` appropriately and save it.
1. Run VoltScript Dependency Setup and create your `atlas-settings.json` file as you did in [Lab 03a](lab-03a.md)
1. From the **Command Palette**, run `VoltScript: Install Dependencies`.  

### Sample JSON Data  

1. Download the sample JSON data is available on [customerscontacts.json](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/intro-lab5/assets/customerscontacts.json){: target="_new" rel="noopener noreferrer”} and save it to the **src** folder.

## VOLTSCRIPT CODE

1. Download [main.vss](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/intro-lab5/assets/main.vss){: target="_new" rel="noopener noreferrer”} and save it to the **src** folder.
1. Download [functions.vss](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/intro-lab5/assets/functions.vss){: target="_new" rel="noopener noreferrer”} and save it to the **src** folder.
1. Open src/main.vss and src/functions.vss and examine the scripts.

1. As you review these scripts, you may find the api documentation for [JsonVSE](../../apidocs/jsonvse/JsonVSE_VSID/JsonVSE_VSE.html){: target="_new" rel="noopener noreferrer”} and the [VoltScriptJsonConverter](../../apidocs/vsls/VoltScriptJSONConverter_VSID/VoltScriptJSONConverter_Library.html){: target="_new" rel="noopener noreferrer”} to be useful.  
    - The script starts out by calling the `convertJson()` method.  
    - This method instantiates a `JsonParser` object and loads it from the `customerscontacts.json` file.  
    - It then instantiates a new `JsonBasicObjectArrayConverter` and a new JsonObject array for docs.  

    ``` voltscript

        ' Instantiate the converter 
        Set contactConverter = New JsonBasicObjectArrayConverter(|Contact|, CLASS_CONTAINER_LIBRARY)

        ' instantiate the result
        Set docs = new JsonObject(True)

    ```  

    - Of special note here is the constructor arguments for the `JsonBasicObjectArrayConverter`.  The source code for this class can be found in libs/VoltScriptJsonConverter.vss.  Note that the name of the class for the conversion and the path to the library containing the class definition are passed to the constructor.  
    - The script then deserializes the Customers' information from the contacts and for each spawns a new Customer object:  

    ``` voltscript

        'Deserialize Customers
        Call helper.withCustomConverter(|contacts|, contactConverter)
        ForAll child in jsonObj.getChildren()
            Set temp = child
            Set company = helper.toObject(temp, |Company|, CLASS_CONTAINER_LIBRARY).fromJson(temp)
            Call company.addToJsonArray(docs)
        End ForAll

    ```  

    - After adding the new Customer objects, the docs array is returned to the calling code in src/main.vss.  
    - The code in src/main.vss then instantiates a new carrier JSON object (payload) and inserts the docs array as a new value (`documents`).  
    - Finally the code prints out the results of the operation.  Any errors, should they occur, are also printed out.  

1. Return focus to the main.vss file in your VS Code editor.
--8<-- "voltscript-saveandrun.md"

!!! success
    You have successfully used [JsonVSE](../../apidocs/jsonvse/index.html){: target="_new" rel="noopener noreferrer”} to read in and process JSON content from a file.  You have additionally used [VoltScriptJsonConverter](../../apidocs/vsls/VoltScriptJSONConverter_VSID/VoltScriptJSONConverter_Library.html){: target="_new" rel="noopener noreferrer”} to convert these JSON Objects into VoltScript objects, and then add content from these VoltScript objects back into a JSON Object Array.  

## Review

This gives you an idea of a day in the life of a VoltScript developer. You can use VoltScript Dependency Manager to avoid having to copy and paste dependencies around. You can process JSON data using `JsonVSE`, convert JSON to / from VoltScript objects using `VoltScriptJsonConverter`, and use error information to discover and correct typos in your code.  

In the [things to explore](#things-to-explore), you can extend your familiarity with the JsonObject instance.

The code for the lab is available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/intro-lab5).

## Looking Forward

In [Lab 06](lab-06.md), you will use the JSON document records to add Customer and Contact records to your database. This will provide you with populated content for use with a Volt Foundry Integration Service you will create in a later lab.  

## Things to explore

### Examine the payload JsonObject

Modify your src/main.vss file to compare / contrast the docs and payload Json Objects

??? example "Revised src/main.vss file"

    ``` voltscript  
        Option Declare
        Option Public

        Use "../src/functions"

        Sub Initialize() 
            Dim docs as JsonObject
            Dim payload as JsonObject
            Dim temp as JsonObject

            Try 
                Set docs = convertJson()
                Set payload = New JsonObject()
                Call payload.insertValue("documents", docs)

                Print |Success!|
                Print |Created | & docs.childCount & | JSON documents.| 

                ' Print the Counts
                Print || 
                Print |Docs.ChildCount: | & docs.ChildCount 
                Print |Payload.ChildCount: | & payload.ChildCount

                ' Print the First Child of docs 
                Print || 
                ForAll child in docs.getChildren()
                    Set temp = child
                    Print |Docs First Child: | & temp.toString(True)
                    Exit Forall 
                End ForAll

                ' Print the First Child of payload 
                Print || 
                ForAll child in payload.getChildren()
                    Set temp = child
                    Print |Payload First Child: | & temp.toString(False)
                    Exit Forall 
                End ForAll

                ' Get the documents from the payload 
                Print || 
                    Set temp = payload.getChild("documents")
                Print |Temp.ChildCount: | & temp.ChildCount 

                ' Print the First Child of payload's documents 
                Print || 
                ForAll child in temp.getChildren()
                    Set temp = child
                    Print |Payload's documents' First Child: | & temp.toString(True)
                    Exit Forall 
                End ForAll 
            Catch
                Print getErrorInfo(||) 
            End Try
        End Sub

    ``` 
