# Download files

--8<-- "setup.md"

!!! note
    For specific details of APIs, see [API Docs](../../apidocs/webvse/index.html)

## Introduction

Although REST doesn't have to be over HTTP or transfer content as JSON, typically this is the case. This how-to covers this typical use case and requires the use of two VoltScript Extensions, which are WebVSE and JsonVSE.

## VoltScript dependencies

Incorporating JsonVSE and WebVSE is straightforward. You just need to add the following JSON objects to the `vsesDependencies` element in your `atlas.json`.

```json
        "WebVSE": {
            "library": "WebVSE VoltScript Extension",
            "version": "1.0.4",
            "module": "webvse",
            "repository":"volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

To use the extension in your script, enter `UseVSE "*JsonVSE"` and `UseVSE "*WebVSE"`.

## Download files

!!! warning
    VoltScript runs synchronously, so downloading files should be done with prudent caution. In Volt MX Go this will be running as middleware, requiring VoltScript to download the file to Volt Foundry over HTTP and send it on via HTTP to the device. Best practice, where possible, would be to send the target URL as a string to the device and allow the device to download the file directly.

Downloading files is done via a `WebRequest`. Setting up the `WebServer` is no different than for any other `WebRequest`, if you are unfamiliar, refer to [WebServer Object How-to](web.md#webserver-object).

### Synchronous file download

If downloading a single file you know is small or reasonably-sized over strong bandwidth, synchronous download may be sufficient. The Domino server has standard files that can be used to test against, provided the nhttp task is running. The following code will download a view icon:

``` voltscript
Sub downloadViewIcon()

    Dim request as WebRequest
    Dim response as WebResponse
    Dim path as String

    Try
        ' Update Domino server details in `getDominoWebServer()`
        Set request = getDominoWebServer().createRequest()
        request.target = "icons/vwicn001.gif"
        request.timeoutSeconds = 10
        path = CurDir & "/unit-test-reports/vwicon1.gif"
        Set response = request.fileDownload(path)
        If response.responseCode = 200 Then
            Print "Successful download, check " & path
        End If
    Catch
        Print "Error " & Error() & " on line " & Erl()
    End Try

End Sub
```

### Asynchronous file download

If downloading multiple files, they can be downloaded async in parallel. However, because the `WebRequest` object is being used to run the download, you need to create a separate instance for each download, otherwise you will receive the error message "Error Background task is running, use another WebRequest instance".

Whereas `fileDownload()` returns a `WebResponse`, the asynchronous version `fileDownloadNoWait` returns a `Completion` object. The `Completion` objects can be polled to identify when all files have been downloaded and subsequent code can be run. The `WebResponse` is accessed from each `Completion` object.

This code will download multiple view icons from a Domino server. Of course all are small, so the code will not take long to run.

``` voltscript
Sub downloadViewIconsAsync()

    Dim request as WebRequest
    Dim arr(2) as Completion
    Dim response as WebResponse
    Dim path as String

    Try
        ' Update Domino server details in `getDominoWebServer()`
        Set request = getDominoWebServer().createRequest()
        request.timeoutSeconds = 10
        request.target = "icons/vwicn001.gif"
        path = CurDir & "/unit-test-reports/vwicon-async1.gif"
        Set arr(0) = request.fileDownloadNoWait(path)

        Set request = getDominoWebServer().createRequest()  ' (1)!
        request.timeoutSeconds = 10
        request.target = "icons/vwicn002.gif"
        path = CurDir & "/unit-test-reports/vwiconasync2.gif"
        Set arr(1) = request.fileDownloadNoWait(path)

        Set request = getDominoWebServer().createRequest()
        request.timeoutSeconds = 10
        request.target = "icons/vwicn003.gif"
        path = CurDir & "/unit-test-reports/vwiconasync3.gif"
        Set arr(2) = request.fileDownloadNoWait(path)

        Call arr(0).wait()
        Call arr(1).wait()
        Call arr(2).wait()

        Dim i as Integer
        For i = 0 To UBound(arr)
            Set response = arr(i).response
            Print response.responseCode
        Next

        If response.responseCode = 200 Then
            Print "Successful download, check " & path
        End If
    Catch
        Print "Error " & Error() & " on line " & Erl()
    End Try

End Sub
```

1. This line is crucial for re-initialising the `WebRequest` and avoiding the error to use another instance.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/webvse){: target="_blank" rel="noopener noreferrer"}.