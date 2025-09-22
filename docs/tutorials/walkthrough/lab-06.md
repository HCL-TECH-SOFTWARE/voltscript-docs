# Lab 06 - Putting it all Together

## Duration 40 min

## What you will learn

You will combine the skills you have learned in previous labs in order to generate Customers and Contacts documents in a Domino Database.

## Prerequisites

- [Lab 05](lab-05.md) completed.

## Steps

### The IDE

1. Copy your VS Code VoltScript Workspace folder **lab-05** to a new folder called **lab-06**.

### atlas.json

1. Delete the `effective-atlas.json` and `seti.ini` files from your lab-06 folder.
1. Edit your `atlas.json` file as follows:  
    - Change the name, description, and displayName properties to reflect this lab.

    ``` json  
        "name": "voltscript-intro-lab-6",
        "description": "Lab 06 - Putting it all Together",
        "displayName": "JsonVSE + VoltScriptJsonConverter + DrapiVSE",
    ```  

    - Add a `vseDependencies` JSON object for `DrapiVSE` after the `dependencies` array.

    ``` json  
        "dependencies": [
            {
                "library": "voltscript-json-converter",
                "version": "latest",
                "module": "VoltScriptJsonConverter.vss",
                "repository": "hcl-github"
            }
        ],    
        "vseDependencies": {
            "DrapiVSE": {
                "library": "DrapiVSE VoltScript Extension",
                "version": "1.0.1",
                "module": "drapivse",
                "repository": "volt-mx-marketplace"
            }
        }
    ```  

1. Run VoltScript Dependency Setup and create your `atlas-settings.json` file as you did in [Lab 03a](lab-03a.md)
1. From the **Command Palette**, run `VoltScript: Install Dependencies`.  

## VOLTSCRIPT CODE

As you work on this code, you may find the api documentation for [JsonVSE](../../apidocs/jsonvse/JsonVSE_VSID/JsonVSE_VSE.html){: target="_new" rel="noopener noreferrer”}, the [VoltScriptJsonConverter](../../apidocs/vsls/VoltScriptJSONConverter_VSID/VoltScriptJSONConverter_Library.html){: target="_new" rel="noopener noreferrer”}, and DrapiVSE](../../apidocs/drapivse/DrapiVSE_VSID/DrapiVSE_VSE.html){: target="_new" rel="noopener noreferrer”} to be useful.

1. Edit your `src/main.vss` file:  
    - If you completed [Lab 05 - Things to Explore](lab-05.md#things-to-explore) then remove those changes.
    - Add a `UseVSE "DrapiVSE"` instruction after the options.  
    - Open your main.vss file from [Lab 04 - VoltScript Code](lab-04.md#voltscript-code) and copy the constants and values for `DRAPI_SCOPE`, `VIEWNAME`, `DRAPI_URL`, `USER_NAME`, and `USER_PASSWORD`.  Paste these into your main.vss file for this lab.  
    - Add variables to your `Initialize()` method for a new DrapiServer and a DrapiRequest object.
    - Using your main.vss file from [Lab 04 - VoltScript Code](lab-04.md#voltscript-code) as a guide, add code to your main.vss file for this lab that will set the new DrapiServer's `serverUrl`, log into the DrapiServer using your credentials, get the `companiescontacts` scope in a DrapiRequest and list all the views.
    - Create a `generateDrapiDocs()` method that has DrapiRequest and a JsonObject arguments, and returns a JsonObject containing response information.  This method should utilize method(s) from DrapiRequest to generate documents within the HCL Domino REST API database.  Consider adding `Try / Catch` logic and `Print` statments to write output to the console when running.  
    - Add code to your `Initialize()` method that will call your new method, and (if successful) print out the number of documents that are created.
1. Test and run your main.vss file in your VS Code editor. Debug and run again as necessary until you can successfully generate the Customer and Contacts documents.  Try to get your code to work **without** having to use the `Initialize()` and `generateDrapiDocs()` examples.  

??? example "Initialize() method"  

    ``` voltscript  
        Sub Initialize() 
            Dim server as New DrapiServer()
            Dim request as DrapiRequest, response as DrapiResponse

            Dim docs as JsonObject
            Dim payload as JsonObject
            Dim scopeResponse as JsonObject 
                
            Try 
                Set docs = convertJson()
                Set payload = New JsonObject()
                Call payload.insertValue("documents", docs)

                Print |Created | & docs.childCount & | JSON documents.| 

                ' Connect to the DrapiServer
                server.serverUrl = DRAPI_URL
                Call server.login(USER_NAME, USER_PASSWORD)
                Print "JWT Token: " & server.JWTToken

                ' Get the named scope in a DrapiRequest 
                Set request = server.createRequest(DRAPI_SCOPE)

                ' List the Views in the DrapiRequest 
                Print DRAPI_SCOPE & | Views: | & request.getLists() 

                ' Generate the DrapiDocs 
                Set response = generateDrapiDocs(request, payload)

                If response.ResponseCode = 200 then 
                    Print "Documents created successfully."
                End If  

            Catch
                Print getErrorInfo(||) 
            End Try
        End Sub
    ```

??? example "generateDrapiDocs() function"  

    ``` voltscript  
        Function generateDrapiDocs(request as DrapiRequest, payload as JsonObject) as JsonObject 
            Dim parser as new JsonParser()
            Dim response as String
            Dim result as JsonObject

            Try 
                Set response = request.bulkCreateDocuments(payload.toString(false)) 
                Call parser.loadFromJson(response.ContentBody)
                Set result = parser.getRootObject()        
            Catch 
                Print getErrorInfo(||)
            End Try 

            Return result 

        End Function 
    ```

!!! success
    You have successfully used [JsonVSE](../../apidocs/jsonvse/index.html){: target="_new" rel="noopener noreferrer”} to read in and process JSON content from a file.  You have additionally used [VoltScriptJsonConverter](../../apidocs/vsls/VoltScriptJSONConverter_VSID/VoltScriptJSONConverter_Library.html){: target="_new" rel="noopener noreferrer”} to convert these JSON Objects into VoltScript objects, and then add content from these VoltScript objects back into a JSON Object Array. Finally, you have used this JSON object array, in conjunction with [DrapiVSE](../../apidocs/drapivse/index.html){: target="_new" rel="noopener noreferrer”} to generate multiple documents in a Domino database.  

## Review

This gives you an idea of a day in the life of a VoltScript developer. You can make use of many different VoltScript abilities such as the [Dependency Management Process](../../references/archipelago.md), [VoltScript Extensions](../../references/vses.md), and [VoltScript Library Modules](../../references/libraries.md) to quickly and easily accomplish fairly complicated tasks with just a little thought and a few lines of VoltScript Code.  

In the [things to explore](#things-to-explore), you can use the `DrapiResponse` object to get additional information about Customers and Contacts documents.

The code for the lab is available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/intro-lab6).

## Looking Forward

In the next set of tutorials, [Introduction to VoltScript for Volt Foundry](../foundry/index.md), you can extend your VoltScript skills to begin working with [HCL Volt MX Go](https://opensource.hcltechsw.com/voltmxgo-documentation/topicguides/introvoltmxgo.html).

## Things to explore

Try creating a new method in your `main.vss` that will return the number of Companies or Contacts, and print out that information to the console. The afformentioned API documentation should be helpful.

??? example "getDocumentCount() method"
    ``` voltscript
        Function getDocumentCount(request as DrapiRequest, viewname As String) As Integer  
            Dim viewentries as JsonObject
            Dim response as DrapiResponse, entryargs as New GetListEntriesArgs
            Dim parser as New JsonParser

            Try 
                entryArgs.mode = "default"
                entryArgs.RichTextAs = "html"
                Set response = request.getListEntries(viewName, entryargs)
                Call parser.loadFromJson(response.ContentBody) 
                Set viewentries = parser.getRootObject() 

                return viewentries.childCount 

            Catch 
                Print getErrorInfo(||)
            End Try 
        End Function 
    ```

??? example "Revised Initialize() method"
    ``` voltscript
        Sub Initialize()
            Dim server as New DrapiServer()
            Dim scope as DrapiRequest, response as DrapiResponse

            Dim docs as JsonObject
            Dim payload as JsonObject
            Dim scopeResponse as JsonObject 
                
            Try 
                Set docs = convertJson()
                Set payload = New JsonObject()
                Call payload.insertValue("documents", docs)

                Print |Created | & docs.childCount & | JSON documents.| 

                ' Connect to the DrapiServer
                server.serverUrl = DRAPI_URL
                Call server.login(USER_NAME, USER_PASSWORD)
                Print "JWTToken: " & server.JWTToken

                ' Get the named scope in a DrapiRequest 
                Set request = server.createRequest(DRAPI_SCOPE)

                ' List the Views in the DrapiRequest
                Print DRAPI_SCOPE & | Views: | & request.getLists() 

                ' Generate the DrapiDocs 
                Set scopeResponse = generateDrapiDocs(request, payload)

                If Not (scopeResponse is Nothing) then 
                    Print || 
                    Print |Created | & scopeResponse.childCount & | Drapi Documents.|
                End If  

                ' Count the View Documents 
                Print |There are | & getDocumentCount(request, |Companies|) & | Companies.|
                Print |There are | & getDocumentCount(request, |Contacts|) & | Contacts.|

            Catch
                Print getErrorInfo(||) 
            End Try
        End Sub
    ```