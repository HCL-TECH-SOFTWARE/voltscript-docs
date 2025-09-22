# Use VoltScript Extensions

VoltScript Extensions are application extensions written in C/C++. 
  
  - On a Windows operating system, they will have a `.dll` suffix. 
  - On a Mac operating system, they will have a `.dylib` suffix.  
  - On a Linux operating system, they will have a `.so` suffix. 

They must be compiled as 64-bit extensions, because the VoltScript runtime is only available for 64-bit.

!!! note
    Domino developers may not be aware, but they're familiar with extensions which (for LotusScript) are referred to as LSXs. Virtually all LotusScript code depends on at least one LSX, **lsxbe**. This is added to scripts and compilation paths automatically by Domino Designer, and the install process of Notes or Domino automatically registers the relevant extensions with the operating system.

    Third party LSXs in LotusScript would need to be registered on the operating system and explicitly referenced using `UseLSX...` syntax.

## seti.ini

Unlike LotusScript LSXs on Windows, VoltScript Extensions don't need to be registered with the operating system explicitly. They can be lazy-loaded at compile-time, either with a literal path or referenced in a **seti.ini** file. The latter is the recommended best practice.

If you are using VoltScript Dependency Management, the `seti.ini` will be created automatically for you. If not, you will need to create it manually.

## Dependency management

It's recommended to include VoltScript Extensions via dependency management. This will automatically download and extract the files, and create the `seti.ini`. For details of what to add to your [atlas.json](../archipelago/atlas.md), see references on [VoltScript Extensions](../../references/vses.md).

--8<-- "depmgmt.md"

### Relative / Absolute Paths

The `seti.ini` contains mappings of extension names to file paths for Windows and Linux operating systems. As with `Use` statements, the paths can be absolute or relative. Relative paths ensure consistency across environments.

!!! note
    - Relative paths should be relative to the **location of** `seti.ini`.
    - Prefixing with "./" will map relative to the `seti.ini` location.
    - Using forward slashes ensures consistent format.
    - Dependency management will auto-generate the `seti.ini` if it doesn't exist or _force_ argument is set to `true`.

### File Format Rules

The key aspects to remember are:

- The file must be named **seti.ini**.
- Line endings **must** be LF, not CRLF. This is required for both Linux _and_ Windows, even though the default line ending setting for Windows is CRLF. In Visual Studio Code, the line ending can be changed in the bottom-right of the IDE. 

    ![seti.ini](../../assets/images/seti.png)

- The file **must** include a blank line at the end.
- Mappings to Windows .dll files are in a section starting `[VoltScriptExtensions\2.0\Windows]`.
- Mappings to Mac .dylib files are in the section starting `[VoltScriptExtensions\2.0\Mac]`.
- Mappings to Linux .so files (Docker container) are in a section starting `[VoltScriptExtensions\2.0\Linux]`.
- Mappings are in format ALIAS=PATH. The alias is the name used in the `UseVSE` statement.

### Sample seti.ini

A sample seti.ini is:

```ini
[LotusScriptExtensions\2.0\Windows]
JsonVSE=./vses/JsonVSE.dll

[VoltScriptExtensions\2.0\Mac]
JsonVSE=./vses/libjsonvse.dylib

[LotusScriptExtensions\2.0\Linux]
JsonVSE=./vses/libjsonvse.so

```

This will map the name "JsonVSE" on either operating system to an extension in a "vses" directory at the same level as the `seti.ini` file.

The `seti.ini` can be loaded when a script is run by passing the [--seti option](../running/voltscript.md#options-available) to the VoltScript program.

## UseVSE Statement

The extension can be included in a script file by using the `UseVSE` statement. This takes two string formats:

- "*EXTENSION_NAME", mapping to the name defined in the `seti.ini`, such as `UseVSE "*JsonVSE"`.
- "EXTENSION_PATH", with an absolute path to the extension, including the `.so`, `.dll`, or `.dylib` extension.

Obviously, the latter requires the same directory setup in all environments and is only recommended for quick one-off scripts.

!!! note
    `UseLSX` is still aliased, so could be used. But `UseVSE` is recommended.