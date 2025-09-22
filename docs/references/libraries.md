# VoltScript Library Modules

VoltScript Libraries are `.vss` files with provided classes, subs, and functions for use in the main and test scripts. They shouldn't have a `Sub Initialize`.

For documentation on HCL-developed VoltScript Libraries, see:

- **VoltScript Testing** provides classes for unit-/integration-testing and validation. 
    - [Source Code](https://github.com/HCL-TECH-SOFTWARE/voltscript-testing){: target="_new" rel="noopener noreferrer"}  
    - [Documentation](https://opensource.hcltechsw.com/voltscript-testing){: target="_new" rel="noopener noreferrer"} 
- **VoltScript JSON Converter** provides classes for configured deserialization / serialization of JSON. 
    - [Source Code](https://github.com/HCL-TECH-SOFTWARE/voltscript-json-converter){: target="_new" rel="noopener noreferrer"} 
    - [Documentation](https://opensource.hcltechsw.com/voltscript-json-converter){: target="_new" rel="noopener noreferrer"}
- **VoltScript Collections** provides Collection, Map and Pair classes. 
    - [Source Code](https://github.com/HCL-TECH-SOFTWARE/voltscript-collections){: target="_new" rel="noopener noreferrer"}
    - [Documentation](https://opensource.hcltechsw.com/voltscript-collections){: target="_new" rel="noopener noreferrer"}
- **VoltScript Console Colors** provides constants for changing the console colors when printing to a terminal that supports this functionality. 
    - [Source Code](https://github.com/HCL-TECH-SOFTWARE/voltscript-console-colors){: target="_new" rel="noopener noreferrer"}
- **VoltScript Volt MX Middleware** provides classes for interacting with context and updating results for Volt Foundry. 
    - [Source Code](https://github.com/HCL-TECH-SOFTWARE/voltscript-voltmx-middleware){: target="_new" rel="noopener noreferrer"}
    - [Documentation](https://opensource.hcltechsw.com/voltscript-voltmx-middleware){: target="_new" rel="noopener noreferrer"}
- **VoltScript Logging** provides classes for error tracking and logging. 
    - [Source Code](https://github.com/HCL-TECH-SOFTWARE/voltscript-logging){: target="_new" rel="noopener noreferrer"}
    - [Documentation](https://opensource.hcltechsw.com/voltscript-logging){: target="_new" rel="noopener noreferrer"}

Within this documentation you can access [aggregated API Docs](../apidocs/vsls/index.html){: target="_new" rel="noopener noreferrer”}.

## Dependency management

Dependency management is available in the documentation for each project, but also aggregated here:

### Authentication

You'll need a [Personal Access Token](../howto/archipelago/settings.md#github-personal-access-token) to use GitHub REST APIs. You'll then need to add this to the JSON object in your [atlas-settings.json](../howto/archipelago/settings.md), in the .vss directory of your user home directory:

```json
    "hcl-github": {
        "type": "github",
        "token": "${env.TOKEN}"
    }
```

### Repository

You'll need to add to your **repositories** object in the atlas.json of your project:

```json
        {
            "id": "hcl-github",
            "type": "github",
            "url": "https://api.github.com/repos/HCL-TECH-SOFTWARE"
        }
```

### Dependency

You'll need the relevant dependency to add to your **dependencies** or **testDependencies** object in the atlas.json of your project:

```json
        {
            "library": "voltscript-testing",
            "version": "1.0.1",
            "module": "VoltScriptTesting.vss",
            "repository": "hcl-github"
        }
```

```json
        {
            "library": "voltscript-json-converter",
            "version": "1.0.5",
            "module": "VoltScriptJsonConverter.vss",
            "repository": "hcl-github"
        }
```

```json
        {
            "library": "voltscript-collections",
            "version": "1.0.5",
            "module": "VoltScriptCollections.vss",
            "repository": "hcl-github"
        }
```

```json
        {
            "library": "voltscript-console-colors",
            "version": "1.0.1",
            "module": "VoltScriptConsoleColors.vss",
            "repository": "hcl-github"
        }
```

```json
        {
            "library": "voltscript-voltmx-middleware",
            "version": "1.0.5",
            "module": "VoltMXObjects.vss",
            "repository": "hcl-github"
        }
```

```json
        {
            "library": "voltscript-logging",
            "version": "1.0.1",
            "module": "VoltScriptLogging.vss",
            "repository": "hcl-github"
        }
```

--8<-- "depmgmt.md"

!!! note
    VoltScript code is compiled for the platform at runtime. As a result, unlike VoltScript Extensions (VSEs), you don't need to worry about the runtime platform of your custom VoltScript code when sharing code.