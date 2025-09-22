# Make Requests to Couch

--8<-- "setup.md"

## Introduction

CouchVSE provides the ability to make REST service calls to CouchDb.

!!! warning "Preview Only"
    The schema for CouchVSE has been set up to include design operations. But the version for Early Access is available as preview only. Not all functions may have been implemented, basic CRUD is the main focus. Some functions, for example creating views, will have to be performed via [Fauxton](https://docs.couchdb.org/en/stable/intro/tour.html#welcome-to-fauxton), the web interface. Advanced concepts - for example agents, and ACLs - will not be available.

## VoltScript dependencies

Incorporating CouchVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
        "CouchVSE": {
            "library": "CouchVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "couchvse",
            "repository": "volt-mx-marketplace"
        }
```

To use the extension in your script, enter `UseVSE "*CouchVSE"`.

## CouchServer class

The `Couchserver` clas sis the entrypoint for any CouchDb calls. You need to specify the serverUrl, which is the protocol + server name.

After adding the `serverURL` you'll need to call `login()` passing a username and password. The following code will login to the server, assuming the variables `serverName`, `userName` and `password` have been set.

``` voltscript
Function loginCouchDbServer(server As CouchServer, user As String, password As String, url As String, certificatepath As String) As Boolean 
    
    Set server = new CouchServer() 

    server.User = user
    server.Password = password
    server.URL = url

    If (Len(FullTrim(certificatepath)) > 0) Then
        'Only set certificate path if not blank
        server.CertificatePath = certificatepath
    End If

    Call server.Login()

    return True 
End Function
```

!!! info
    To use HTTPS, the web-based extensions expect a properly verifiable SSL certificate. For well-known sites, these may be loaded by your operating system.

    In the above code, `CouchServer.certificatePath` property is passed a path to a specific self-signed certificate. Alternatively, you can set `CouchServer.SSLHostValidationOn = False`. For more information, see [Web SSL Certificate Handling](web.md#ssl-certificate-handling).

If the server is successfully connected to the CouchDB, you can check the CouchDB version with `CouchServer.CouchVersion`.

The CouchDB server will have certain features available, and an array of these can be retrieved with `CouchServer.features`. The following code will print the features out, converting the :

``` voltscript
Function getCouchDbFeatures(server As CouchServer) As Variant 
    Dim result As Variant 
    Dim i As Integer 

    result = server.Features
    If IsArray(result) Then i = Ubound(result) + 1
    Print "There are " & i & " Features: ", join(result, |, |)

    Return result 
End Function 
```

## CouchDatabase class

To interact with data on the CouchDB server, you'll need to get a database. `CouchServer.databaseNames` will give an array of the database names available for connection. Once you know the name, the following code will get or create the database:

``` voltscript
Function getOrCreateCouchDbDatabase(server As CouchServer, dbName As String) As CouchDatabase 
    If server.IsDatabase(dbName) Then
        return server.GetDb(dbName)
    Else
        Return server.CreateDb(dbName)
    End If
End Function
```

## Basic CRUD operations

### Create document

The `CouchDatabase.createDocument()` function does not update the CouchDB database, it merely creates an in-memory CouchDocument ready to be saved into the database. The following code can create a document and save it to the database:

``` voltscript
Function createDocument(server as CouchServer, dbName as String) as CouchDocument
    
    Dim db as CouchDatabase
    Dim doc as CouchDocument

    Set db = getOrCreateCouchDbDatabase(server, "demo")
    Set doc = db.createDocument("", |{"firstName":"John","lastName":"Doe","email":"jdoe@acme.com"}|)
    Call doc.save()
    Return doc

End Function
```

!!!info
    It is possible to create a document with a specific ID, but it's best to allow CouchDB to set the ID itself.

Once the document is saved, metadata, including the ID, will be populated.

### Retrieval

Retrieving a document is done using `CouchDatabase.getDocumentByID()`. This takes two parameters, the ID and whether to include documents deleted in CouchDB. If the document was deleted with `preserve` set to False or through some other means than CouchVSE, the returned document will only have minimal information, id and last revision code.

Retrieving a document that doesn't exist will throw an error, so you'll need to wrap the retrieval code in either a `Try...catch` block or check `CouchDatabase.isDocument()` first. The following code shows the latter option:

``` voltscript
Function getDocument(db as CouchDatabase, id as String) as CouchDocument
    
    If db.isDocument(ID) Then Return db.GetDocumentByID(ID)

End Function
```

### Update

CouchDB is a schemaless NoSQL database, so it allows any updates to any items in the document. It is the responsibility of the person posting data to ensure it will not cause issues with applications consuming that data downstream.

Items can be added a scalar values or as nested JSON. The following code will retrieve and update a document, adding a "Pet" and a "Color" object that comprises a Name and a HexCode.

``` voltscript
Function updateDocument(db as CouchDatabase, id as String) as CouchDocument

    Dim doc as CouchDocument
    If db.isDocument(ID) Then
        Set doc = db.GetDocumentByID(ID)
        Call doc.addItem("Pet", "Squirrel")
        Call doc.addItemToJsonObject("Name", "Color", "Blue")
        Call doc.addItemToJsonObject("HexCode", "Color", "0000FF")
        Call doc.save()
        Return doc
    End If

End Function
```

### Deletion

Deletion can be done by passing an ID or a CouchDocument. When a document is deleted, it is removed from all queries, with a `{"_deleted":true}` item set.

CouchVSE extends CouchDB deletion, by adding an easy "soft deletion" functionality. This is done with a second parameter on `CouchDatabase.deleteDocumentByID()` and `CouchDatabase.deleteDocument()`. If the parameter is set to false, the document will be deleted in the normal CouchDB way, all data on the tombstone stub will be removed. If the parameter is set to true, it will perform a "soft deletion", setting `_deleted` to remove it from all queries but retaining the data.

The following code will delete a document in the normal CouchDB way:

``` voltscript
Function deleteDocument(db as CouchDatabase, id as String) as Boolean

    If db.isDocument(ID) Then
        Return db.deleteDocumentByID(ID, False)
    End If

End Function
```

## Views

!!! info
    In EA1, views are expected to be created via the [Fauxton](https://docs.couchdb.org/en/stable/intro/tour.html#welcome-to-fauxton) web interface. For more information on creating views, see [CouchDB Views documentation](https://docs.couchdb.org/en/stable/ddocs/views/index.html).

The following code will get the first two entries in a view called "names":

``` voltscript
Function getEntriesFromView(db as CouchDatabase) as String

    Dim view as CouchView

    Set view = db.getViewByID("names")
    Print view.getSomeRows(0, 2)

End Function
```

## Attachments

### Add an attachment

Attachments can be added to a CouchDocument once it has been saved. When uploading, the parent CouchDocument object is not automatically reacquired from the CouchDatabase to update the "_attachments" metadata. If you wish to retrieve the latest changes to the underlying CouchDocument, you will need to use `getDocumentByID()` again. The following code saves an attachment and reacquires the document:

``` voltscript
Sub addAttachment(db as CouchDatabase, doc as CouchDocument, filePath as String)
    Dim attach as CouchAttachment
    Set attach = doc.createAttachment("attach", filePath, "text/plain")
    Call attach.upload

    ' Need to re-acquire document to update CouchDocument fields
    Set doc = db.GetDocumentByID(doc.ID, False)
End Sub
```

### Download an attachment

The attachment can also be downloaded to a specified file location. The following code will perform this download:

``` voltscript
Sub downloadAttachment(doc as CouchDocument, attachName as String, filePath as String)

    Dim attach as CouchAttachment
    Set attach = doc.getAttachmentInfo(attachName)
    Call attach.download(filePath, True)
    Call attach.upload

End Sub
```

CouchDB stores an MD5 hash of the file in the document metadata. `CouchDocument.MD5Hash` provides access to this hash value, which can be used to verify the downloaded file if required. See [Hash files](hash.md#md5-hashes-of-files) for more information.