# Early Access 

The section provides information on the features, improvements, and resolved issues related to the early access version of VoltScript. For open source VoltScript Library Modules, see the relevant repository.

!!! note "Important"
    Items marked in <span style="color:red">red</span> are API changes that may impact your applications and should be reviewed before upgrading.

??? info "Early Access v4"

    ## Early Access v4

    ### New

    #### VoltScript Runtime

    - Debugger support has been extended to include variable inspection. For more details, see [debugging](../howto/running/vscode.md#debugging).
    - seti.ini support for Silicon Mac has been added.

    #### VoltScript Archipelago Dependency Management

    - The current directory is provided as a default for the base project directory.
    - Directory paths that begin "~" or "." are supported.
    - VoltScript Logging support has been added, but is not yet enabled. This is because of directory permissions issues for the current user when writing to archipelago directories.
    - Silicon Mac support has been added.
    - Support for `runtimePlatforms` in atlas.json has been added. Only VSEs for the requested runtime platform(s) will be copied into the VSEs directory.

    #### VoltScript Build Management VS Code Extension

    - Runtime platform support and validation added for atlas.json. This means dependency management will only pull in VSEs for the platforms requested.
    - Minimal snippets for atlas.json and atlas-settings.json added.
    - List dependencies command palette option has been added.

    #### VoltScript Extensions

    - All VSEs have been compiled for Silicon Mac.

    #### HashVSE

    - Functions have been added for PKCS encryption, decryption, key file generation, and reading key files.
    - CryptUtilities has bytesToText() function.

    #### KeepVSE

    - Added DominoVersion and DRAPIVersion properties to KeepServer.
    - Added OpenSSL version info to KeepServer.LibCurlVersion.
    - Added KeepDocument.Raw (get and set).
    - Added KeepDocument.MetaData (get only).
    - Added KeepScope.RunAgentWithContext. Note: Keep API does not currently allow context to be sent to server.
    - Added KeepDocument.DeleteAttachment.
    - Added KeepScope.GetListPivot().
    - Added KeepScope.GetQueryResultsProcessor().
    - Added KeepDocument.GetRichText().
    - Added KeepServer.RTProcessors to fetch rich text processors from Keep server.

    ### Improvements

    #### VoltScript Runtime

    - <span style="color:red">GetThreadInfo(12) returns four elements instead of three. The second element is now the current class, or an empty string if the call is not made from a class</span>

    #### VoltScript Archipelago Dependency Management

    - Duplicate VSE message when writing seti.ini has been clarified.
    - 0-byte downloads are gracefully handled.x

    #### VoltScript Build Management VS Code Extension

    - <span style="color:red">Change default URLs for marketplace login to point to demo marketplace. The change at EA3 was incorrect</span>.

    #### VoltScript Extensions

    - The VSEVersion property has been updated to "1.0.3" for all VSE's except XMLVSE, which is 1.0.2.
    - Calling any VSE's methods with no arguments will now raise an error instead of causing a crash.
    - libcurl has been updated to 8.13.0 in CouchVSE, KeepVSE, and WebVSE.
    - OpenSSL has been updated to version 3.3.4 in CouchVSE, HashVSE, KeepVSE, and WebVSE.
    - Enhancements have been made to better support for UTF-16 literal strings on Linux.

    #### HashVSE

    - String handling has been improved.

    #### JsonVSE

    - Fixed a crash when calling JsonObject.ValueArray on a JSON array of non-scalars.
    - <span style="color:red">`JSONObject.getArrayValues()` has been removed. This was previously marked deprecated. Use `getChildren()` instead.</span>

    #### KeepVSE

    - <span style="color:red">...View... APIs have been renamed to ...List.... This is to be more consistent with Domino REST API rather than Notes classes. Affected methods are GetListCategories, GetListEntries, GetListEntriesByKey, GetListInfo, GetAllForms, and GetAllLists.</span>
    - Fixed a crash if server info was requested before logging in.
    - Allowed strings and string arrays for KeepScope.GetListPivot and KeepScope.GetListEntriesByKey.
    - Added RichTextAs argument to KeepScope.BulkGet and remove KeepScope.GetDocuments.
    - Fixed KeepDocument.GetRichText accessing the wrong endpoint.
    - Added RTItemName optional parameter to KeepDocument.GetRichText.
    - Fixed KeepProfileDocument.Save crashing with empty documents.
    - Fixed KeepDocument.ReplaceValue crashing on new docs.
    - Fixed recursive call error with bool overload of AddURLParam.
    - Updated error message handling for all methods that raise an error when an error code is returned from the Keep server. JSON responses are parsed into a readable format, HTTP error code is raised error code.
    - Extended KeepScope.GetFormInfo() to support passing a mode, to get the Form info for that specific mode.
    - <span style="color:red">Changed the parameter order of KeepVSE.KeepDocument.Save(). FormMode is now before ParentUNID.</span>
    - <span style="color:red">KeepDocument.Save() is now a Subroutine since it always returned True or raised an error.</span>
    - <span style="color:red">KeepDocument Get API has been changed to handle rich text differently.</span>
    - Added VerboseLogging property to WebRequest to enable debugging.

    #### WebVSE

    - Fixed changing headers via WebRequest properties. Previous additional headers were added.
    - Fixed URL encoding to avoid double-encoding '+' or '%'.
    - Fixed crash when WebRequest's AddHeaders, AddCookie, FileUpload are called with empty strings.
    - Fixed extra colons in createRequestWithUrl. Output URL's passed to curl in verbose logging. Encode spaces with "%20" instead of "+".
    - Downloads don't create a file unless data is returned from libcurl.
    - Provided curl error messages in ContentBody if no HTTP response code, update shared headers.
    - Added VerboseLogging property to WebRequest to enable debugging.

    #### OSUtilsVSE

    - Support use of "~" for user's home directory.

    #### CouchVSE

    - Added VerboseLogging property to WebRequest to enable debugging.

??? info "Early Access v3"

    ## Early Access v3

    ### New

    #### Volt Foundry

    - A Volt Foundry image has been added to Harbor to allow you to write and/or test VoltScript integration services and VoltScript preprocessors / postprocessors. See [Tutorials](../tutorials/index.md) for more.

    #### Others

    - Documentation added regarding VoltScript in Volt Foundry.

    ### Improvements

    #### VoltScript Runtime

    - <span style="color:red">GetThreadInfo(13) platform names have been improved, adding options for Linux ARM and Mac.</span>

    !!! note
        OSUtilsVSE has not been changed at this time and still outputs the same as EA2.

    #### VoltScript Archipelago Dependency Management

    - VSEs can now be referenced by name for `library` and `module`. See [VSEs reference](../references/vses.md#dependency) for more details.
    - Improved messaging if `Kill` function fails to delete files.

    #### VoltScript Build Management VS Code Extension

    - Change default URLs for marketplace login to point to main marketplace, not demo.
    - Snippets and JSON validation updated for new way to reference VSE library and module.

    #### VoltScript Extensions

    - The VSEVersion property has been updated to "1.0.2" for all VSE's.
    - Calling any VSE's methods with no arguments will now raise an error instead of causing a crash.
    - OpenSSL has been updated to version 3.3.1 in CouchVSE, HashVSE, KeepVSE, and WebVSE.

    #### HashVSE

    - Now statically linked on Windows, to simplify the VSE loading process.

    #### JsonVSE

    - Added `JSONObject.IsDescendant()` and `JSONObject.IsDescendantPath()` to check if there is an object within the provided path. `IsDescendant()` takes a String Array. `JSONObject.IsDescendantPath()` takes a String and delimiter (default `/`) - use `"first/second/third"` to search for an object in the path `first`, `second`, `third`.
    - Added `JSONObject.GetDescendantPath()` to retrieve a descendant `JSONObject` from an object using the provided path.
    - <span style="color:red">`JSONObject.hasField()` has been removed, use `isChild()` instead.</span>

    #### KeepVSE

    - Added `KeepDocument.GetValue()` to retrieve a value from a document's item.
    - Added `KeepDocument.ReplaceValue()` to replace a value with the given one, inserting it if it does not exist.
    - Added `KeepScope.Evaluate()` to compile and execute a Notes @function formula.
    - Added `KeepScope.GetProfileList()` to retrieve a profile document for a given user.
    - Added `KeepScope.BulkGet()` to retrieve a bulk list of documents by UNID.

    #### WebVSE

    - Added `WebRequest.SendAsync()` to make a web request in a background thread. This method returns a `Completion` object that can be checked when convenient, similar to `WebRequest.DownloadFileNoWait()`.

    #### XMLVSE

    - Added `XMLObject.IsDescendant()` to check if a provided path (String Array) is a descendant of the calling object.
    - Added `XMLObject.FindObjectByPath()` to find an `XMLObject` in the current object based on a provided path.
    - Added `XMLObject.ReplaceChildObject()` to replace a child `XMLObject` with a new one.

    #### ZuluVSE

    - Added `DateTimeParser.ConvertLSFormat()` to convert a LotusScript format date time string to the C++ style format used by ZuluVSE.
    - Added `DateTimeObject.EpochTimeMS` to represent the object's epoch time in miliseconds.

??? info "Early Access v2"

    ## Early Access v2

    ### New

    #### VoltScript Runtime

    - Added `--http-server <port>` start option for access over HTTP. For more information, see [Run HTTP server](../howto/running/http-server.md).
    - Added `--debug-server <port>` start option to run debugging listening on a specific port. Kindly note that debugging is provided as a preview. For more information, see [Run from VS Code](../howto/running/vscode.md)

    #### VoltScript Language Server VS Code Extension

    - Added support for CreateUUID function.
    - Added debug server support.

    #### VoltScript Build Management VS Code Extension

    - Added Volt Foundry-related functionality to the VoltScript Build Management extension for Visual Studio code. For more information, see [Use VS Code Extension Build Development Features](../howto/foundry/integrations/archipelago.md).

    #### XMLVSE

    - XMLVSE is a new VSE for deserializing, manipulating, and serializing XML objects. Its interface is inspired by JsonVSE, and also supports a fluent programming model. See the [XMLVSE API documentation](../apidocs/xmlvse/index.html) for full details.

    ### Improvements

    #### VoltScript Extensions

    - Compiled all VoltScript extensions for *RedHat Universal Base Image 8.8 Minimal* (RHEL 8), thus reducing the compiler-level for glibc version.
    - Updated the atlas.json for VoltScript Collections and VoltScript JSON Converter Script Library Modules to use the relevant JsonVSE version.
    - VSE's that use libcurl, such as WebVSE, KeepVSE, CouchVSE, now support the RHEL location of CA certificates in addition to the Ubuntu location. This allows a user to open a HTTPS connection to most servers without manually setting the location of the CA certificates.
    - Updated libcurl to version 8.4.

    #### ContextVSE

    - Now supports a JSON object as the context. `Context.Context` will extract the `context` property from the root level of the object if the incoming context is a JSON string and this property is present. No changes to non-JSON context.

    #### CouchVSE

    - The version of libcurl can now be checked using the property `CouchServer.LibCurlVersion`, which is a string.

    #### HashVSE

    - The version of OpenSSL can now be checked using the property `HashUtilities.OpenSSLVersion`, which is a string.

    #### JsonVSE

    - Constructor now takes an optional boolean parameter `true` to return a JSON array. If no parameter or `false` is passed, the constructor returns a JSON object.
    - Methods for populating the JSON object are fluent, returning the current JSON object to allow calls to be chained.
    - Added `JSONObject.HasField()` to provide an easy way to check if an object has a certain field. <span style="color:red">We subsequently realised this duplicated functionality available in `JSONObject.isChild()`, so the method was deprecated and was removed in EA3.</span>
    - Added `JsonParser.IsValidJSON()` to check if a provided string is a valid JSON. This can be used to sanitize incoming data before attempting to parse it.
    - Added `JSONObject.RemoveArrayEntry()` to enable the removal of a specific index from an array.

        !!! note
            
            You cannot use `JSONObject.RemoveChild()` to remove an entry from an array.

    - Added `JSONObject.ScalarValue` that always returns doubles for numeric values. **NOTE:** This means integers will have a fractional portion (e.g. 1.0).

    #### KeepVSE

    - The version of libcurl can now be checked using the property `KeepServer.LibCurlVersion`, which is a string.
    - Added `KeepProfileDocument` to allow the creation, update, or deletion of a profile document.
    - Added `KeepDocument.DownloadAttachment()` to download and save an attachment to a local file path.
    - Added optional `Mode` and `AllMeta` (short for "all metadata") arguments to `KeepScope.GetViewEntries()` and `KeepScope.GetViewEntriesByKey()`.
    - Added `KeepServer.GetUserInfo()` to fetch information about the current user.
    - Added `KeepScope.BulkDelete()` to delete multiple documents by UNID.
    - Added `KeepScope.BulkCreate()` to create multiple documents based on a provided JSON string.
    - Added `KeepScope.FolderAddDocuments()` and `KeepScope.FolderRemoveDocuments()` to organize documents in folders.
    - Added `KeepScope.GetViewInfo()` to fetch information about a specific design view.
    - `KeepServer` now checks the script context for a JWT token, parsing and adding it to its requests if it is present.

    #### StreamVSE

    - A `Stream` can now be opened as an in-memory buffer only, without being attached to a file. Set the charset to `MEMORY` or `BUFFER` to activate this mode. This can be useful for building a long string or logging. The final string can be returned by setting `Stream.Position` to 0 and calling `Stream.ReadText`.
    - Fixed reading from a pipe on standard input.

    #### WebVSE

    - The version of libcurl can now be checked using the property `WebServer.LibCurlVersion`, which is a string.

    #### ZuluVSE

    - Date/time parsing now handles fractional seconds.

    ### Others

    - Added documentation around writing code for Volt Foundry. For more information, see [Understanding VoltScript in Volt Foundry](../topicguides/foundry/index.md) and [Use with Volt Foundry](../howto/foundry/index.md).

??? info "Early Access v1"

    ## Early Access v1

    - First release of the early access version of VoltScript.