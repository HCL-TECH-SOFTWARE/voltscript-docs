# Package VoltScript Libraries

!!! note
    VoltScript Extensions can be scaffolded in [VoltScript Interface Designer](https://github.com/HCL-TECH-SOFTWARE/voltscript-interface-designer). You can also generate code skeletons and API documentation from VSID.

VoltScript Libraries are published as individual files. You will need to share:

- the main `.vss` file.
- the `atlas.json` file.
- any custom `.vss` files not specified as dependencies in the `atlas.json`.

!!! note
	If you are creating a release on GitHub, you should add these files manually into the release. If in doubt, look at one of the HCL-developed repositories for an example.

## Downstream dependencies

You don't need to publish downstream dependencies. VoltScript Libraries or VoltScript Extensions included in your `atlas.json` as dependencies from other external repositories will automatically be downloaded, providing they're accessible.

## Documentation for VoltScript Build Manager consumers

### Dependencies

Include in your documentation a JSON object for each `.vss` file, comprising the library, version, and `.vss` filename. For example:

```json
"dependencies": [
  {
    "library": "voltscript-testing",
    "version": "1.0.1",
    "module": "VoltScriptTesting.vss"
  }
]
```

If [publishing to GitHub](publish.md#publishing-to-github), the library will be the GitHub repository name. If publishing to a [generic web server](publish.md#publishing-to-a-generic-web-server), the library will be a directory with a subdirectory for each version.

!!! note
    You don't need to include any documentation referring to the `atlas.json`, that will be picked up automatically.

--8<-- "repository.md"