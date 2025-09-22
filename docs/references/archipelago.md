# Dependency Management Process

## Install dependencies

Dependency management will:

- **Call `runSetup()`** to check for and, if required, create the `.vss` directory.
- **Call `loadArgs()`** to prompt for project directory, `atlas.json` location, `atlas-settings.json` location and whether or not to force download of dependencies.
- **Call `loadSettings()`** to validate and convert `atlas-settings.json` into a VoltScript object (a `Map` of `AtlasWebServerSettings` or `AtlasGitHubSettings`).
- **Call `loadAtlas()`** to validate and convert `atlas.json` into an `Atlas` VoltScript object.
- **Call `buildProjectDirectories()`** to create directories for **sourceDir**, **testDir**, **libsDir** and **vsesDir** properties.
- Convert the `Atlas` object into an `EffectiveAtlas`.
- **Call `EffectiveAtlas.identifyDependenciesToDownload`** to dentify any dependencies in `atlas.json` that can't be found locally. If the user chose to force download of dependencies, this is all dependencies.
- **Call `downloadDirectDependencies()`** to call `downloadDependency()` for any dependencies explicitly referenced in the `atlas.json` that weren't found locally. If an `atlas.json` was downloaded, the dependency is added to a queue to process for downstream dependencies.
- **Call `downloadDownstreamDependencies()`** to iterate the queue of dependencies that were downloaded with an `atlas.json`. That `atlas.json` is loaded into an `Atlas` VoltScript object and converted to an `EffectiveAtlas` VoltScript object. Any dependencies not already processed are downloaded. If an `atlas.json` was also downloaded, the dependency is added to the bottom of the queue.
- **Call `copyDependencies()`** to copy VoltScript Libraries from user's `.vss` directory to **libsDir**. VoltScript Extensions are extracted into **vsesDir**, depending on **runtimePlatforms** property, and the platform-specific names of the actual VoltScript Extension identified.
- **Call `CreateSetiIni()`** to create a **seti.ini** for any VoltScript extensions, if seti.ini doesn't exist or force is set to `true`. Otherwise, the existing seti.ini won't be updated.
- **Call `copyMiscFiles()`** to sync between **sourceDir** and **testDir** any `.vss` files not included in **mainScripts**, **unitTestScript** and **integrationTestScripts**. 

    !!!note
        This only runs if `libsDir` isn't set.

- Create an **effective-atlas.json** with verbose details of actual versions, actual locations, and actual repositories used. This can be used to troubleshoot unexpected behavior.

    !!! note
        `effective-atlas.json` should be excluded in your `.gitignore`.

## List dependencies

The "list dependencies" process is similar, except VSEs are not downloaded. The atlas.json of VoltScript Libraries needs to be downloaded to check downbstream dependencies. The list process will:

- **Call `runSetup()`** to check for and, if required, create the `.vss` directory.
- **Call `loadCheckArgs()`** to prompt for project directory, `atlas.json` location, `atlas-settings.json` location.
- **Call `loadSettings()`** to validate and convert `atlas-settings.json` into a VoltScript object (a `Map` of `AtlasWebServerSettings` or `AtlasGitHubSettings`).
- **Call `loadAtlas()`** to validate and convert `atlas.json` into an `Atlas` VoltScript object.
- **Call `buildProjectDirectories()`** to create directories for **sourceDir**, **testDir**, **libsDir** and **vsesDir** properties.
- Convert the `Atlas` object into an `EffectiveAtlas`.
- **Call `EffectiveAtlas.identifyDependenciesToDownload`** to dentify any dependencies in `atlas.json` that can't be found locally. If the user chose to force download of dependencies, this is all dependencies.
- **Call `downloadDirectDependencies()`** to call `downloadDependency()` for any VoltScript Library dependencies explicitly referenced in the `atlas.json` that weren't found locally. If an `atlas.json` was downloaded, the dependency is added to a queue to process for downstream dependencies.
- **Call `downloadDownstreamDependencies()`** to iterate the queue of dependencies that were downloaded with an `atlas.json`. That `atlas.json` is loaded into an `Atlas` VoltScript object and converted to an `EffectiveAtlas` VoltScript object. Any dependencies not already processed are downloaded. If an `atlas.json` was also downloaded, the dependency is added to the bottom of the queue.
- **Call `printDependencies()`** to print out a list of dependencies and any version conflicts.