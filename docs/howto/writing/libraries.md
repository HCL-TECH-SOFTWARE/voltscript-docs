# Use VoltScript Library Modules

!!! info
    For pulling external VoltScript Library Modules via dependency management, see the relevant repository or, for HCL-developed library modules, see the [references](../../references/libraries.md).

!!! note
    Domino developers will be familiar with the `Use` statement for incorporating external script library modules. However, in an NSF all script libraries have to be placed in the same location.

VoltScript files can include VoltScript code in external `.vss` files. This is done by referencing the filename, without the `.vss` suffix, in a `Use` statement at the start of the script. The file can be referenced with a relative or absolute path.

!!! note
    Currently, relative paths are relative to the file being run. If a VoltScript File A contains a Use statement to File B, which contains a Use statement to File C, the relative path for File C is resolved relative to File A, not File B.

!!! warning
    Although valid for one-off runs, absolute paths should be avoided, because it makes code more difficult to transfer to other environments.

## Correct Syntax

Assume the following directory structure:

/tmp/projecta<br/>
&nbsp;&nbsp;&nbsp;&nbsp;entry.vss<br/>
&nbsp;&nbsp;&nbsp;&nbsp;libA.vss<br/>
&nbsp;&nbsp;&nbsp;&nbsp;libB.vss<br/>
&nbsp;&nbsp;&nbsp;&nbsp;libC.vss

The following would be valid Use statements and positioning in `entry.vss`:

``` voltscript
Use "libA"  'Looks for libA.vss in the same directory
Use "../projecta/libB"  'Navigates to parent directory (tmp) of the current directory (projecta), then looks for libB.vss in projecta directory
Use "/tmp/projecta/libC"  'Looks for /tmp/projecta/libC.vss

Sub Initialize

End Sub
```

!!! note
    - The directory separator "/" should be used for cross-platform compatibility. It's standard for *nix platforms but also understood by modern Windows platforms.
    - See [Structuring Your Project](./structure.md) for best practices.

## Dependency management

It's recommended to include VoltScript Extensions via dependency management. This will automatically download and extract the files, and create the seti.ini. For details of what to add to your [atlas.json](../archipelago/atlas.md), see references on [VoltScript Library Modules](../../references/libraries.md).

--8<-- "depmgmt.md"