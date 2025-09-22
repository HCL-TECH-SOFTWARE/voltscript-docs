# Find files and managing directories

--8<-- "setup.md"

## Introduction

There have always been low-level APIs for interacting with the filesystem - `Dir`, `MkDir`, `RMDir`, `Open` `Kill` etc. Proper use and error management of these APIs requires careful reading of the APIs and knowledge gleaned over many years. The OSUtils VoltScript Extension is designed to lower the entry level for interacting with the filesystem and minimize the amount of code that needs to bootstrap the specific actions to be performed.

## VoltScript dependencies

Incorporating OSUtilsVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
        "OSUtilsVSE": {
            "library": "OSUtilsVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "osutilsvse",
            "repository":"volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

To use the extension in your script, enter `UseVSE "*OSUtilsVSE"`.

## Directory and file operations

### Identify directory

!!! warning
    The unwary developer may assume `CurDir()` function returns the directory containing the script currently being edited, but this is a misconception. The VoltScript `CurDir()` functions works the same way it does in LotusScript, returning the current directory where the program is being run. Typically this will be the project directory.

`OSUtils.isDirectory()` provides an API to just return a boolean for whether there is a directory at the path passed, without the need for any error handling.

``` voltscript
Function checkIsDir(filePath as String)
    Dim OSUtils as New OSUtils()
    Return OSUtils.isDirectory(filePath)
End Function
```

### Build paths

You can build the path manually. If so, a forward-slash is recommended as the separator. This is now accepted by Windows operating systems and is standard for UNIX operating systems.

However, PathUtils provides a helper class for building paths without worrying about the separator, as is common for many other languages. `toString()` can be used to return the string, for directory operations.

``` voltscript
Function buildFooBarPath() as String
    Dim OSUtils as New OSUtils()
    Dim pathUtils as New PathUtils()

    Call pathUtils.addToPath(OSUtils.tempDir)
    Call pathUtils.addToPath("foo")
    Call pathUtils.addToPath("bar")
    Return pathUtils.toString
End Function
```

At this point, you are only building an object that has a potential directory structure. No checks against or modification of the operating system are performed.

We know "foo" doesn't exist, so the full path can't possibly exist. But checking `OSUtils.isDirectory()` against this path will just return `false`, as expected, it won't throw an error. There is no need to perform a check with `isDirectory()` against each level of the directory hierarchy.

### 3.3 Identify file

The corresponding API for checking whether a file exists at a given path is, not surprisingly, `isFile()`.

``` voltscript
Function checkIsFile(fileName as String) as Boolean
    Dim OSUtils as New OSUtils()
    Return OSUtils.isFile(fileName)
End Function
```

`PathUtils` can be used to build a path to a file as well as to a directory.

``` voltscript
Function buildFooTestFilePath() as String
    Dim OSUtils as New OSUtils()
    Dim pathUtils as New PathUtils()

    Call pathUtils.addToPath(OSUtils.tempDir)
    Call pathUtils.addToPath("foo")
    Call pathUtils.addToPath("test.txt")
    Return pathUtils.toString
End Function
```

### Retrieve files in a directory

Rather than making an API call to get the next file in a directory, OSUtils has an API to return a string array of all files in a directory.

``` voltscript
Function getFiles(filePath as String) as Variant
    Dim OSUtils as New OSUtils()
    Return OSUtils.getFilesInDir(filePath)
End Function
```

### Create and removing directories

#### Create directories

Creating directories is done using `makeDirectories()`. This assumes that, if you want to create the directory, you want to create all parent directories on the path.

``` voltscript
Function makeDirectories(filePath as String) as Boolean
    Dim OSUtils as New OSUtils()
    Return osUtils.makeDirectories(filePath)
End Function
```

If the directory already exists, `makeDirectories` won't throw an error but still return true.

#### Remove directories

Removing directories, however, allows the developer to decide whether or not to force deletion of any files and subdirectories in the directory. This is the boolean parameter passed as the second argument.

``` voltscript
Function removeDirectories(filePath as String) as Boolean
    Dim OSUtils as New OSUtils()
    Return OSUtils.removeDir(filePath, true)
End Function
```

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/platform){: target="_blank" rel="noopener noreferrer"}.