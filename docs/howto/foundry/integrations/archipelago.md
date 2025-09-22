# Use VS Code Extension Build Development Features

The Visual Studio Code Build Management Extension provides various functionality for speeding up development.

## atlas.json

The first is an atlas.json snippet template. This can be accessed by creating an atlas.json, typing `foundry-atlas` and accepting the snippet.

The snippet automatically adds the dependencies and repository for VoltMXObjects.

!!! warning
    For EA3 you will need to update the VoltScript VoltMX Middleware version number in the snippet. Please change to "latest". The update was not identified prior to packaging of the VoltScript Extension.

## Volt Foundry script boilerplate

The second is a script snippet template for writing a VoltScript integration service operation. This can be accessed by creating a .vss script file, typing `foundry` and accepting the snippet. The snippet:

- Adds required `Use` and `UseVSE` statements.
- Adds a `Sub Initialize` with the boilerplate code for extracting Volt Foundry objects and sending back a response.

## Package for Volt Foundry

This is a command accessed from the Visual Studio Code Command Palette when you are in the atlas.json or a .vss file. The process:

- Prompts for the project directory.
- Prompts for the location of the atlas.json.
- Prompts for any additional directories or files to be included in the package.
    - Separate multiple instructions with commas.
    - Directories and filenames will be picked up relevant to the project's working directory.
    - Passing a filename or directory and filename will include that file.
    - Passing a directory and spec will include all files with that spec in the parent directory. For example, "foo/*.json" will include all .json files in foo directory.
    - ZipVSE's `.addFiles()` API isn't recursive, it only includes *files* matching the spec, it doesn't include subdirectories.
- Creates a zip comprising:
    - atlas.json
    - seti.ini
    - .vss files in src directory
    - .vss files in libs directory
    - VSEs in vses directory
    - any additional requested directories / files

The zip is named using the `name` and `version` in the atlas.json. For example, if the name is "vss-poc" and version is "1.0.0", the zip file will be called "vss-poc-1.0.0.zip" and placed in the root of the project directory, ready to be uploaded for Volt Foundry.