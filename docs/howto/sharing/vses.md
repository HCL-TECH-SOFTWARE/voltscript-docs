# Package VoltScript Extensions

--8<-- "arm.md"

!!! note
    VoltScript Extensions can be scaffolded in [VoltScript Interface Designer](https://github.com/HCL-TECH-SOFTWARE/voltscript-interface-designer). You can also generate code skeletons and API documentation from VSID.

VoltScript Extensions are written in C/C++, which makes them platform, architecture, and processor-specific. In addition, dependencies may vary depending on what's automatically included in a specific platform. As a result, the VoltScript Build Manager code expects a zip file containing zips per platform/architecture/processor including all dependencies required.

The top-level zip file should be named *VSENAME*.zip. This should contain zips with *VSENAME* + "-" + platform code. The valid options for VoltScript are currently:

- linux-x64
- win64

!!! tip
    Linux filenames are case-sensitive, so recommendation for the Linux zip file is to use lower-case.

!!! warning
    ZipVSE cannot extract tar files, so use .zip files for all operating systems.

## Example

### JsonVSE

- JsonVSE.zip
    - LICENSE
        - license
        - notices
    - JsonVSE-win64.zip
        - JsonVSE.dll
    - jsonvse-linux-x64.zip
        - jsonvse.so

### WebVSE

- WebVSE.zip
    - LICENSE
        - license
        - notices
    - WebVSE-win64.zip
        - WebVSE.dll
        - libcurl-x64.dll
    - webvse-linux-x64.zip
        - libwebvse.so

!!! tip
    When naming VoltScript Extensions and zip files, bear in mind the following logic in VoltScript dependency management:

    - Using **module** in `atlas.json`:
        - Download the zip using library and module.
        - Extract it and look for a zip called *-win64.zip or *-linux-x64.zip.
        - To update `seti.ini`, if there is only one file in the zip, use that. Otherwise, look for a file including the label for the JSON object in atlas.json.

## Documentation for VoltScript Build Manager consumers

See information under [references](../../references/vses.md).

--8<-- "repository.md"

--8<-- "repository-marketplace.md"