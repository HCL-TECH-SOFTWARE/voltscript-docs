# Web-based Access

As middleware, the standard data transfer format will be [JSON](https://www.json.org/json-en.html){: target="_blank" rel="noopener noreferrer"}. Accessing and handling that data easily is a core priority of VoltScript.

## libcurl and SSL

All web-based extensions use libcurl to make curl requests. To use HTTPS, libcurl uses [SSL Certificate Verification](https://curl.se/docs/sslcerts.html){: target="_blank" rel="noopener noreferrer"}. Typically, the web-based extensions expect a properly verifiable SSL certificate to use HTTPS, but WebVSE has an option to disable this with `WebServer.SSLHostValidationOn = False`. This is equivalent to the libcurl command `curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, FALSE);` or the curl command line option `-k/--insecure`.

It is the responsibility of the systems administrator to ensure the relevant self-signed certificates to the relevant cert store.

Alternatively, all extensions have a `certificatePath` property to pass a path to a certificate to use to validate SSL.

## Web

The Web VoltScript Extension provides low-level functions for making HTTP requests using libcurl.

The `WebServer` class is the entrypoint, intended to provide a standard and reusable object for managing requests to a base URL. It can also be used to URL encode or decode strings. The `WebRequest` class handles data and file requests to a specific endpoint. It can also base64  The `WebResponse` class handles verifying and processing the response.

With WebVSE, files can be downloaded either synchronously or asynchronously. Only synchronous download is supported for other VSEs. `.zip` files can be manipulated using ZipVSE.

!!! note
    Developers should bear in mind that a file is always created for a download, regardless of HTTP response. If a non-200 HTTP response is received, the file will contain the HTML response.

You can find out more information in the [API docs](../../apidocs/webvse/index.html) and the following how-to documents:

- [Make HTTP REST JSON request](../../howto/extensions/web.md)
- [Download files](../../howto/extensions/file-download.md)

## Domino Access

### VoltScript vs LotusScript

While VoltScript has its origins in LotusScript, and while they share similar syntax, the way you approach writing applications in VoltScript is fundamentally different than the way you would write an application in LotusScript.

LotusScript is a *hosted language*, meaning it lives as a part of a parent platform, that uses and event-driven programming model. Everything is driven by *events* that occur - the click of a button, the saving of a document, etc. Code is scattered throughout the application, usually within the event being triggered.

VoltScript is a standalone language that may be available in applications such as Foundry, but it can also be written and executed without a hosted application. VoltScript is "stateless", meaning that each execution of code is independent of any other code, state, or event.

LotusScript is often coded within UI objects such as forms, views, etc. It also has front-end (UI) and back-end (data) classes available for working with Notes/Domino objects (since it's a hosted language).

VoltScript is strictly back-end - there is no UI component. It is able to work with various servers and databases through the use of REST APIs or VoltScript Extensions specifically written to work with a back-end, such as Domino or CouchDB.

### DrapiVSE

DrapiVSE leverages the same libcurl libraries as the Web VoltScript Extension and wraps much of that functionality. This integrates with Domino REST API and provides VoltScript classes and methods for making Domino REST API data calls.

DrapiVSE just creates curl requests to Domino REST APIs. It's important to remember that VoltScript Extensions have different rules to receiving arguments compared to REST APIs. A REST API can receive query parameters in any order, omitting any not required. VoltScript methods must include required parameters first, and optional parameters can only be omitted if no subsequent optional parameter is needed. This may make calls more verbose than corresponding REST API calls.

The `DrapiServer` contains the entrypoint to the Domino REST API running on a server, providing login and generic Domino REST API server info. Access to a specific scope is via a `DrapiRequest`. APIs that return multiple documents will return a String of JSON in `DrapiResponse.ContentBody`. APIs that always return a specific single document will return a DrapiDocument. The JSON content corresponding to the document can be accessed via `DrapiDocument.JSONValue`.

Many methods take or return strings where the developer might expect some form of JSON object or VoltScript object along the lines of NotesViewEntryCollection, NotesDocument etc. This provides greater reliability against multiple versions of Domino REST API and flexibility on version migration.

It's strongly recommended that you are familiar with Domino REST API calls, documentation, and usage via other methods, such as Postman. This will provide understanding of expected schema of JSON data received, direct access to the data being received, providing sample data that can be used to help coding, for unit testing parts of VoltScript code, and for troubleshooting unexpected data-related failures in deployed code.

!!! warning
    DrapiVSE isn't intended for scope or schema configuration, the Domino REST web configuration UI should be used for that purpose. DrapiVSE also doesn't support proxy server access, it expects either direct or VPN access to the data. Of course any DrapiVSE call can be created manually using WebVSE.

## CouchDb

The Couch VoltScript Extension also leverages libcurl to provide access to CouchDB. This was developed as a research project and is provided as a proof of technology. CouchVSE provides low-level CRUD access to a Couch server without enforcing the kind of control Domino Developers and Administrators have and expect. As a result, the extension is more permissive.

## JSON

The JSON VoltScript Extension provides utilities for parsing and build JSON. As well as receiving a JSON string from an HTTP call, the parser can also be passed a file (useful for unit testing or debugging without accessing the production environment) or a JsonObject. For ease of use and briefer code, a single class (`JsonObject`) is used for JSON objects and arrays. It can contain a scalar value, a JSON object, or an array of scalars or other JSON objects. The `shortValue` property can be used for debugging or logging purposes, returning the first 16 characters. Any JSON object can be converted to a string, using the `toString()` method.

You can find more information in the [API docs](../../apidocs/jsonvse/index.html) and the following how-to documents:

- [Building JSON](../../howto/extensions/buildingjson.md)
- [Parsing JSON](../../howto/extensions/json.md)
- [Make HTTP REST JSON request](../../howto/extensions/web.md)

The VoltScript JSON Converter library provides classes for configured deserialization from JSON to VoltScript object, and serialization vice versa.

## ISO 8601 Dates

To support JSON parsing, Zulu provides parsing of dates in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601), accepting either "Z" or offset in "hh:mm" format. Portions of the date can be retrieved, and the DateTimeObject can be converted to UTC format. The class does not provide functions for manipulating the timezone. This is expected to be done in the client application, using client functions to display in the user's preferred timezone.

You can find more information in the [API docs](../../apidocs/zuluvse/index.html) and [Processing ISO 8601 dates](../../howto/extensions/zulu.md).

!!! note
    A Zulu DateTimeObject cannot be passed to the core VoltScript `Format()` function. Core language functions cannot receive VoltScript Extension objects.

!!! warning
    The DateTime variant does not contain a timezone, so cannot receive a JSON date in UTC format.