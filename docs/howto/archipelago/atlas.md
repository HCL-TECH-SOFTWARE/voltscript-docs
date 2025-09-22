# atlas.json

The `atlas.json` file is used to define a project's metadata as well as dependencies and the repositories in which they reside. It's intended to be included in source control for the project so it does not include any credentials for accessing repositories. For more details, see [How to Structure an atlas.json](../../references/atlas.md). For dependency management, it's only important to reference certain elements in `atlas.json`:

- **repositories**: an array of **repository** objects. The repository contains three properties:
    - **id**: used to cross-reference with the atlas-settings.json.
    - **type**: currently only "github" and "webserver" are supported.
    - **url**: base URL for API calls to the repository. See below for more details how this is used.
- **dependencies**: an array of **dependency** objects mapping to VoltScript files to use. The dependency contains three properties:
    - **library**: the group under which the .vss files and their own atlas.json are grouped.
    - **version**: an explicit version number mapping to a release, or "latest" to also retrieve the most recent.
    - **module**: the specific file to be incorporated.
    - **repository**: an optional property mapping to a repository ID. If used, Archipelago will look in that repository first.
- **vseDependencies**: an object of **extension dependency** objects mapping to extensions to use. The extension dependency is a JSON object whose label is the name you intend to use in the `UseVSE` statement, and which has three properties:
    - **library**: the group under which the VoltScript Extension(s) are grouped. For Volt MX Marketplace, this is the title of the asset as found in the breadcrumbs when manually navigating to the extension on Volt MX Marketplace. For HCL extensions, this will be the VSE name followed by " VoltScript Extension", e.g. "JsonVSE VoltScript Extension".
    - **version**: a human-readable version number mapping to the asset version, e.g. "1.0.1". "latest" is not relevant for Volt MX Marketplace.
    - **module**: the specific file to be downloaded. For Volt MX Marketplace, this is the VSE name in lowercase, e.g. "jsonvse". **NOTE:** This will **no longer** change with every release.
    - **repository**: an optional property mapping to a repository ID. If used, Archipelago will look in that repository first.
- **sourceDir**: the directory name, relative to the root of the project, in which to store VoltScript files for main execution.
- **testDir**: the directory name, relative to the root of the project, in which to store VoltScript files for running unit and integration tests.
- **vsesDir**: the directory name, relative to the root of the project, in which to store VoltScript Extensions. If omitted, extensions are put in the root of the project.
- **libsDir**: the directory name, relative to the root of the project, in which to store the VoltScript Library dependencies. If omitted, the VoltScript files are put in the root of the project.
- **mainScripts**: an array of files that are main runnable scripts.
- **unitTestScript**: an array of files that are unit test runnable scripts.
- **integrationTestScripts**: an array of files that are integration test runnable scripts.
- **runtimePlatforms**: an array of platforms for which to add VSEs to your project.

!!! note
    A starter atlas.json with all options annotated can be accessed by typing `atlas` in an atlas.json. A starter atlas.json specific to Volt Foundry development can be accessed by typing `foundry-atlas` in an atlas.json. For more details, see [Volt Foundry atlas.json](../foundry/integrations/archipelago.md#atlasjson). If you are comfortablke structuring your atlas.json, you can create uncommented minimal starters with `minimal-atlas` or `minimal-foundry-atlas`.

## VSE Extensions

In EA1 and EA2, it was only possible to download VSEs by using the numeric portions of the file download URL, e.g. **library** as "25265" and **module** as "25877/20841". The module changed for each version, because it corresponded to a specific file download. This required the Volt MX Marketplace repository URL to be **"https://community.demo-hclvoltmx.com/marketplace/asset"**.

From EA3, a different download URL from Volt MX Marketplace is supported. For this, the **library** is the asset title, e.g. "JsonVSE VoltScript Extension". The **module** is the asset filename when downloaded, minus the file suffix, e.g. "jsonvse". This requires the Volt MX Marketplace repository URL to be **"https://community.demo-hclvoltmx.com/marketplace"**. Note that unlike EA1 and EA2, this does not have "/asset" on the end.

If the VSE library and extension are numeric, you **must** have the repository URL as "https://community.demo-hclvoltmx.com/marketplace/asset". If it is the more human-readable format mapping to the VSE name, you **must** have the repository URL as "https://community.demo-hclvoltmx.com/marketplace". This format is the preferable option and there has been limited usage of EA1 and EA2, so the repository ID has not been changed. Documentation and the latest versions of all VoltScript Library Modules have been updated to use it.

!!! warning
    All affected VoltScript Library Modules have had new releases. These are:<br/>
        - VoltScript JSON Converter, version 1.0.4.<br/>
        - VoltScript Collections, version 1.0.4.<br/>
        - VoltScript VoltMX Middleware, version 1.0.4.<br/>
    Ensure you are using at least these versions, or there may be errors downloading downstream dependencies from "https://community.demo-hclvoltmx.com/marketplace".

!!! info
    By default, VSE files for all platforms (Windows, Linux, MacOS) will be copied into the project. You can use `runtimePlatforms` property to restrict which platforms' VSEs are copied in. For more details, see [How to Structure an atlas.json](../../references/atlas.md).

## .vss Directory

Dependencies will be stored centrally in a `.vss` directory in the user's directory. This automatically gets created by the VS Code extension. They are divided into a subdirectory for the library, a subdirectory for the version, and the relevant module files. If the version is "latest", they are also copied to a sub-directory with the actual version number. So for VoltScript Testing Framework, this might be:

.vss<br/>
&nbsp;&nbsp;&nbsp;&nbsp;voltscript-testing<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;latest<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VoltScriptTesting.vss<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;version.txt<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.0.0<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VoltScvriptTesting.vss

For Volt MX Marketplace, the module downloads a specific version. There is no option for "latest". It downloads a main zip and extracts as platform-specific zips. For the jsonvse example earlier, the directory structure would be:

.vss<br/>
&nbsp;&nbsp;&nbsp;&nbsp;JsonVSE VoltScript Extension<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.0.0<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JsonVSE.zip<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;JsonVSE-windows-amd64.zip<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jsonvse-linux-x86_64.zip<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jsonvse-darwin-arm64.zip

These directories are used to avoid downloading dependencies from the internet every time.