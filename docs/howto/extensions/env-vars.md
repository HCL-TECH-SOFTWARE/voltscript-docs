# Access platform and environment variables

--8<-- "setup.md"

## `Environ()` Function

The `Environ()` function has always been available in [LotusScript](https://help.hcltechsw.com/dom_designer/12.0.2/basic/LSAZ_ENVIRON_FUNCTION.html){: target="_blank" rel="noopener noreferrer”}, and is also available in VoltScript. However, it only allows reading previously set environment variables. Nonetheless, it's useful if read-only access is sufficient, if you aren't already including the OSUtils VoltScript Extension in your project and would prefer not to.

### Retrieve home directory with GetThreadInfo() and Environ()

On Windows, the environment variable for the user's directory is "USERPROFILE". On Linux, it is "HOME". `GetThreadInfo` provides access to the current platform at index 13.

``` voltscript
Function getHomeDirTraditional() as String
    Dim platform as String
    Dim envVar as String
    Dim homeDir as String

    platform = GetThreadInfo(13)
    Select Case platform
    Case "WIN64":
        envVar = "USERPROFILE"
    Case "LINUX64":
        envVar = "HOME"
    Case Else
        Error 1001, "Unexpected platform - " & platform
    End Select

    Return Environ$(envVar)
End Function
```

## VoltScript dependencies

Incorporating OSUtilsVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
        "OSUtilsVSE": {
            "library": "OSUtilsVSE VoltScript Extension",
            "version": "1.0.4",
            "module": "osutilsvse",
            "repository":"volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

To use the extension in your script, enter `UseVSE "*OSUtilsVSE"`.

## Retrieve home directory with OSUtils and Environ()

OSUtils allows the developer to reproduce the same functionality.

``` voltscript

Function getHomeDirOS() as String
    Dim OSUtils as New OSUtils()
    Dim platform as String
    Dim envVar as String
    Dim homeDir as String

    platform = OSUtils.platform
    Select Case platform
    Case "Windows64":
        envVar = "USERPROFILE"
    Case "LINUX":
        envVar = "HOME"
    Case Else
        Error 1001, "Unexpected platform - " & platform
    End Select

    Return OSUtils.getEnvironment(envVar)
End Function
```

!!! info
    OSUtils VoltScript Extension and the VoltScript runtime each take a separate snapshot of environment variables at the start of execution. This means an environment variable set with `OSUtils.setEnvironment()` will be available to `OSUtils.getEnvironment()` but *not* to `Environ$()`.

## Retrieve home directory with OSUtils.HomeDir

Alternatively, the user's directory can be retrieved from OSUtils, without needing to check the platform or environment variables.

``` voltscript
Function getHomeDirOSProperty() as String
    Dim OSUtils as New OSUtils()

    Return OSUtils.homeDir
End Function
```

## Retrieve temp dir

Retrieving the temp directory via environment variables across platforms using `Environ$()` is less straightforward. But OSUtils offers an easy property to get the temp directory.

``` voltscript
Function getTempDir() as String
    Dim OSUtils as New OSUtils()

    Return OSUtils.tempDir
End Function
```

## Set environment variables

!!! note
    Environment variables set via VoltScript won't persist outside the current process call.

!!! warning
    You should be careful to only set environment variables that won't have deleterious impacts.

``` voltscript
Sub setEnvironmentVariable()
    Dim OSUtils as New OSUtils()

    Call OSUtils.setEnvironment("VOLTSCRIPT_HELLO","Hello World")
End Sub
```

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/platform){: target="_blank" rel="noopener noreferrer"}.