# Make HTTP REST JSON Requests

--8<-- "setup.md"

!!! note
    For specific details of APIs, see [API Docs](../../apidocs/webvse/index.html)

## Introduction

Although REST doesn't have to be over HTTP or transfer content as JSON, typically this is the case. This how-to covers this typical use case and requires the use of two VoltScript Extensions, which are WebVSE and JsonVSE.

## VoltScript dependencies

Incorporating WebVSE and JsonVSE is straightforward. You just need to add the following JSON objects to the `vsesDependencies` element in your `atlas.json`.

```json
        "WebVSE": {
            "library": "WebVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "webvse",
            "repository":"volt-mx-marketplace"
        },
        "JsonVSE": {
            "library": "JsonVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "jsonvse",
            "repository":"volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

To use the extension in your script, enter `UseVSE "*JsonVSE"` and `UseVSE "*WebVSE"`.

## WebServer object

The **WebServer** is the entrypoint for HTTP requests via WebVSE and is instantiated using the `New` constructor. Unlike other internally-focussed extensions (DrapiVSE and CouchVSE), `WebServer` permits defining proxy settings as properties. Proxy servers aren't currently supported, VPN access is recommended.

If making multiple requests to the same base URL, you can re-use the same `WebServer` instance.

``` voltscript
Private server as WebServer

Function getWebServer() as WebServer
    If (server is Nothing) Then
        Set server = new WebServer()
        server.protocol = "HTTPS"
        server.HostUrl = "httpstat.us"
    End If
    Return server
End Function
```

The `HostURL` shouldn't include the protocol and may just be the hostname of the server (for example "google.com") or may be to a more specific URL (for example "api.github.com/orgs/hcl-tech-software"). The `HostURL` shouldn't end with a path separator ("/").

### SSL Certificate Handling

To use HTTPS, the web-based extensions expect a properly verifiable SSL certificate. For well-known sites, these may be loaded by your operating system.

For sites with self-signed certificates WebVSE has an option to disable this with `WebServer.SSLHostValidationOn = False`. This is equivalent to the libcurl command `curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, FALSE);` or the curl command line option `-k/--insecure`.

It's the responsibility of the systems administrator to ensure the relevant self-signed certificates are in the relevant cert store or, for Windows, appended to the curl-ca-bundle.crt in VoltScript executable directory.

Alternatively, `WebServer.certificatePath` property can be passed a path to a specific self-signed certificate.

### Cookies

Although REST APIs are intended to be stateless, certain web interactions may require persisting of cookies between requests. This can be done by setting `PreserveCookies=True`.

### Encoding / Decoding URL content

When including content from variables, for example for including in querystring parameters, it can include invalid content, such as " ", "/". The receiving web server will require these values to be URL encoded. The `WebServer` class provides utility functions to URL encode and decode strings - `WebServer.URLEncode()` and `WebServer.URLDecode()`, each taking a string to encode / decode.

!!! note
    When sending a request, the URL is automatically encoded. So there is no need to additionally call WebServer.URLEcode(). To troubleshoot, you can use WebServer.URLEncode to find out what the value would be encoded as. But the better practice approach is to use `WebServer.verboseLogging = True`. See [Troubleshooting](#troubleshoot-requests-and-responses).

!!! warning
    Spaces are encoded to "%20". If the server you are sending to requires "+" instead, use `Replace(url, " ", "+")`. Encoding will not re-encode the "+".

## WebRequest

The `WebRequest` class handles a single specific request to a specific endpoint on a REST API or web server. The key parts of a web request are **target URL**, a **verb** (e.g. "GET", "POST"), one or more **HTTP headers**, **cookies**, potentially a **request body** and **timeout**.

### Basic request

The default verb for a request is "GET". So the most basic request will just need a target URL. Defining `timeoutSeconds` is recommended for best practice. This will be appended, after a "/", to the `WebServer`'s HostURL.

``` voltscript
Function makeBasicRequest() as WebResponse
    Dim request as WebRequest

    Set request = getWebServer().createRequest()
    request.target = "200"
    request.timeoutSeconds = 5
    Return request.send()
End Function
```

The request is sent to:

| Property | Value |
| -------- | ----- |
| WebRequest.Verb | GET (default value) |
| WebServer.Protocol | HTTPS |
| WebServer.HostURL | httpstat.us |
|  | / |
| WebRequest.Target | 418 |

The full request is GET https://httpstat.us/418, equivalent to the curl command:

```curl
curl --location 'https://httpstat.us/418'
```

### HTTP headers

There are helper properties for common headers:

- `ContentType` for data type of data being sent, for example "application/json"
- `AcceptHeader` for expected return data type, for example "application/json"
- `AuthorizationHeader` for credentials beginning with type, for example "Basic ", "Bearer ".

Additional headers can be added through `AddHeader()`.

Content can be sent for PUT, PATCH, or POST requests via `RequestBody` property.

A sample request for a POST, with JSON body content and custom headers would be:

``` voltscript
Function makeJsonRequest() as WebResponse
    Dim request as WebRequest

    Set request = getWebServer().createRequest()
    request.Verb = "PUT"
    request.ContentType = "application/json"
    request.AcceptHeader = "application/json"
    Call request.addHeader("X-HttpStatus-Response-Foo", "Bar")
    request.target = 418
    request.timeoutSeconds = 5
    request.RequestBody = |{"hello":"world"}|
    Return request.send()
End Function
```

### Encode body content

 In some cases, for example when sending images or sending basic authentication credentials, content may need to be Base64 encoded. This can be done via the utility function `WebRequest.Base64Encode()`, which will return the encoded value.

## File uploading and downloading

File uploading and downloading can be done synchronously or asynchronously. When performed synchronously, it returns a `WebResponse` object corresponding to the response. When performed asynchronously, it returns a `Completion` object.

`Completion` objects have an `IsComplete` property which can be polled periodically, for example in a loop with a `Sleep` function. It also has a `CompletionCode` property for determining success or failure. <!-- TODO: More details -->

Once completed it also has a `WebResponse` object to check the response.

!!! note
    If the response code is *not* 200, no file will be created. If file file length is 0 bytes, again, no file will be created. The `WebResponse` can be interrogated for either problem - `WebResponse.responseCode` will give the numeric response code, `WebResponse.ContentLength` will give the size of the response.

## Create a WebRequest with URLBuilder

Building the URL manually from strings may not be a preferable approach. The `URLBuilder` class provides functionality to build a URL and pass it to a `WebServer`.

``` voltscript
Function makeRequestFromUrlBuilder() as WebResponse
    Dim server as New WebServer()
    Dim request as WebRequest
    Dim builder as New UrlBuilder()

    builder.isHttps = True
    builder.targetHost = "httpstat.us"
    builder.targetPath = "200"
    Call builder.addUrlParameter("sleep", "1000")
    Set request = server.createRequestWithUrl(builder.toString(False)) '(1)!
    request.timeoutSeconds = 5
    Return request.send()
End Function
```

1. `toString()` parameter is for whether or not to URL encode the URL.

!!! note
    When using `URLBuilder.toString()` with multiple URL parameters, they're outputted in alphabetical order.

## WebResponse

The `WebResponse` object is the result of a `WebRequest.send()` or file upload / download. It contains all information relating to the web server's response to your request. `ContentType` contains the data type of data received, for example  "application/json". `ContentLength` can be checked for the size of the response as a Long in bytes. `AllHeaders` and `AllCookies` properties give string arrays of headers and cookies.

### Query response code

`WebResponse.ResponseCode` gives the [HTTP response code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). These fall into five groups:

- 0 bad URL, for example invalid port number, and the request cannot be sent.
- 1xx informational response while additional processing continues.
- 2xx successful - the request was successfully received, understood, and accepted.
- 3xx redirection - additional action needs to be taken to complete the request.
- 4xx client error - **you** have sent incorrect or insufficient information, your request needs amending.
- 5xx server error - **the recipient** has encountered some unexpected error. This may include unanticipated bad data in your request.

It's recommended to test the response code and act accordingly:

``` voltscript
Function validateResponseCode(responseCode as Integer) as Boolean
    Dim request as WebRequest
    Dim response as WebResponse

    Set request = getWebServer().createRequest()
    request.target = "418"
    Set response = request.send()
    Return response.responseCode = 200
End Function
```

!!! warning
    Some servers send a 200 response even for invalid URLs, for example returning an HTML page with status 200 if valid authentication is required (401, 403) or the resource is unavailable (404). You will need to be aware of this and handle accordingly.

## Process JSON response

`ContentBody` is always a string. In some cases, this may be a string of JSON. It's always recommended to verify. But such content can be easily parsed using JsonVSE.

``` voltscript
Function parseResponse(json as String) as JsonObject
    Dim parser as New JsonParser()
    Dim obj as JsonObject

    Call parser.loadFromJSON(json)
    Return parser.getRootObject
End Function
```

!!! note
    The sending server may encode characters, for example apostrophe as "\u0027". Loading into a JSON object will convert this. If in doubt about the response, cross-reference with Postman *checking View > Postman Console or Raw tab in the UI*. The "Pretty" tab does the same conversion that JsonVSE will do.

### Decode and request body content

In some cases, for example when receiving images or parsing cookies/headers, values may be Base64 encoded. These can be decoded via the utility function `WebResponse.Base64Decode(string)`, which will return the decoded value.

## Troubleshoot requests and responses

For troubleshooting problems, you can set `WebRequest.verboseLogging=True`. This will generate a file using the request type ("Send", "DownloadFile", "UploadFile") and a unique key for each request. The file is stored in the project directory. **NOTE:** This should *only* be used for troubleshooting, you should not leave verbose logging set in server environments. This cannot be used in Volt Foundry because the project directory is cleaned up after testing requests.

!!! note
    Bear in mind this will contain credentials, so should be sanitized before sharing with third parties.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/webvse){: target="_blank" rel="noopener noreferrer"}.