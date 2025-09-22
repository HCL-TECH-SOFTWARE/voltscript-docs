# VoltScript Extensions

VoltScript Extensions are closed-source C/C++ binaries, `.dll` files on Windows, and `.so` files on Linux. The are hosted on [Volt MX Marketplace](https://marketplace.demo-hclvoltmx.com/search/voltscript%20extension){: target="_new" rel="noopener noreferrer”}. Some leverage other C/C++ libraries, for example libcurl. The following VoltScript Extensions are available:

!!!note "Note: Click the links to view the API Docs."

- [ContextVSE](../apidocs/contextvse/index.html){: target="_new" rel="noopener noreferrer”} provides access to command line `--context` argument.
- [CouchVSE](../apidocs/couchvse/index.html){: target="_new" rel="noopener noreferrer”} provides a layer for integrating with CouchDB.
- [DrapiVSE](../apidocs/drapivse/index.html){: target="_new" rel="noopener noreferrer”}: provides a layer for making calls to Domino REST API.
- [HashVSE](../apidocs/hashvse/index.html){: target="_new" rel="noopener noreferrer”} provides hashing and cryptographic utilities.
- [JsonVSE](../apidocs/jsonvse/index.html){: target="_new" rel="noopener noreferrer”} provides utilities for manipulating JSON.
- [OSUtilVSE](../apidocs/osutilsvse/index.html){: target="_new" rel="noopener noreferrer”} provides utilities for integrating with the operating system.
- [StreamVSE](../apidocs/streamvse/index.html){: target="_new" rel="noopener noreferrer”} provides utilities for reading/writing files and STDIO.
- [WebVSE](../apidocs/webvse/index.html){: target="_new" rel="noopener noreferrer”} provides utilities for making HTTP(s) calls via libcurl.
- [XMLVSE](../apidocs/xmlvse/index.html){: target="_new" rel="noopener noreferrer”} provides utilities for manipulating XML.
- [ZipVSE](../apidocs/zipvse/index.html){: target="_new" rel="noopener noreferrer”} provides utilities for reading/writing zip files. **This can't read / write `.tar.gz` files**.
- [ZuluVSE](../apidocs/zuluvse/index.html){: target="_new" rel="noopener noreferrer”} provides utilities for reading/writing UTC date/times.


You can also access [aggregated API Docs](../apidocs/vses/index.html){: target="_new" rel="noopener noreferrer”}.

## Dependency management

VoltScript Extensions for dependency management are hosted in Volt MX Demo Marketplace. You'll need three parts:

### Logon

You'll need a username and password for [Volt MX Marketplace](https://marketplace.demo-hclvoltmx.com/search/voltscript%20extension){: target="_new" rel="noopener noreferrer”}. Make sure you've tested successfully logging into the web interface before using it for dependency management. You'll then need to add this to the JSON object in your [atlas-settings.json](../howto/archipelago/settings.md), in the .vss directory of your user home directory:

```json
    "volt-mx-marketplace": {
        "type": "marketplace",
        "username": "YOUR_USERNAME",
        "password": "YOUR_PASSWORD",
        "authUrl": "https://accounts.auth.demo-hclvoltmx.net/login"
    }
```

### Repository

You'll need to add to your **repositories** object in the [atlas.json](../howto/archipelago/atlas.md) of your project:

```json
        {
            "id": "volt-mx-marketplace",
            "type": "marketplace",
            "url": "https://community.demo-hclvoltmx.com/marketplace"
        }
```

### Dependency

You'll need the relevant dependency to add to your **vseDependencies** object in the atlas.json of your project:

```json
        "ContextVSE": {
            "library": "ContextVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "contextvse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "CouchVSE": {
            "library": "CouchVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "couchvse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "DrapiVSE": {
            "library": "DrapiVSE VoltScript Extension",
            "version": "1.0.0",
            "module": "drapivse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "HashVSE": {
            "library": "HashVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "hashvse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "JsonVSE": {
            "library": "JsonVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "jsonvse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "OSUtilsVSE": {
            "library": "OSUtilsVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "osutilsvse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "StreamVSE": {
            "library": "StreamVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "streamvse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "WebVSE": {
            "library": "WebVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "webvse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "XmlVSE": {
            "library": "XMLVSE VoltScript Extension",
            "version": "1.0.2",
            "module": "xmlvse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "ZipVSE": {
            "library": "ZipVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "zipvse",
            "repository": "volt-mx-marketplace"
        }
```

```json
        "ZuluVSE": {
            "library": "ZuluVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "zuluvse",
            "repository": "volt-mx-marketplace"
        }
```

--8<-- "depmgmt.md"

## Platform Support

VoltScript Extensions need to be compiled for specific platforms:

- **.dll** are extensions for Windows. Remember, VoltScript only supports 64-bit Windows.
- **.so** are extensions for Linux-x64. Currently VoltScript only support Linux-x64. Linux-aarch64 support will follow later, but will require different files.
- **.dylib** are extensions for MacOS. Platform libraries for MacOS can be cross-compiled, so the same file can be used on MacOS with Intel *or* ARM processor.

You will need to ensure the VoltScript project and dependency management is set up to support all runtime platforms, both for development and deployment.