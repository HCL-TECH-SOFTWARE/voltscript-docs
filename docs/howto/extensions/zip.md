# Process zip files

--8<-- "setup.md"

## Introduction

VoltScript within Volt Foundry is middleware, where content is downloaded over HTTP and sent to end users over HTTP. The best way to enhance performance for processing this content is using .zip files. ZipVSE has been created for this purpose.

!!! warning
    The C library that ZipVSE uses can only process `.zip` files. `.tar.gz` files can't be written or read.

## VoltScript dependencies

Incorporating ZipVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
        "ZipVSE": {
            "library": "ZipVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "zipvse",
            "repository":"volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

To use the extension in your script, enter `UseVSE "*ZipVSE"`.

## Create zip archives

Creating a zip archive is done in two steps. Firstly, `createArchive()` creates the empty zip archive at a specific file location. Then you add files, in a variety of optional ways. The option you choose may vary depending on what you are adding to the zip archive and how the list of files is generated.

!!! info
    When adding files to an archive, the files will be added mirroring the filepath passed. Therefore to add with just the filename, use `ChDir` to switch to the relevant directory before adding the files.

### Add files explicitly

The following code will add files one by one:

``` voltscript
Function createZipAdd(dirPath as String) as ZipArchive
    Dim zip as New ZipArchive()
    ChDir dirPath
    Call zip.createArchive("zip1.zip", "", True)
    Call zip.addFile("test1.txt", "")
    Call zip.addFile("test2.txt", "")
    Return zip
End Function
```

1. The final parameter is for whether or not to overwrite an existing archive

### Add all files that match a filespec

The following code will add all `.txt` files in a directory:

``` voltscript
Function createZipSpec(dirPath as String) as ZipArchive
    Dim zip as New ZipArchive()
    ChDir dirPath
    Call zip.createArchive("zip2.zip", "", True)
    Call zip.addFiles(CurDir, "*.txt")
    Return zip
End Function
```

### Add files from an array

The following code will add all files included in a String array. Note, the array just includes filenames, the directory is passed as a separate argument.

``` voltscript
Function createZipArray(dirPath as String) as ZipArchive
    Dim zip as New ZipArchive()
    ChDir dirPath
    Dim files(1) as String
    files(0) = "test1.txt"
    files(1) = "test2.txt"
    Call zip.createArchive("zip3.zip", "", True)
    Call zip.addFileList(CurDir, files)
    Return zip
End Function
```

## Extract zip archives

### Extract all files from a zip

The following code can be used to extract all files from a zip. The `openArchive()` command only loads the archive into the `ZipArchive` object so it can be processed. It doesn't physically unzip it.

``` voltscript
Function extractZip(dirPath as String)
    Dim zip as New ZipArchive()
    Call zip.openArchive(dirPath & "/zip1.zip")
    Call zip.extractAllFiles(dirPath & "/zip1", False, True)
End Function
```

### Extract individual files

The following code can be used to extract individual files from a zip:

``` voltscript
Function extractZipEachFile(dirPath as String)
    Dim zip as New ZipArchive()
    Dim file as ZipFile

    ChDir DirPath
    Call zip.openArchive("zip1.zip")
    Set file = zip("test1.txt")
    Call file.extractFile("zip2", False, True)
    Set file = zip("test2.txt")
    Call file.extractFile("zip2", False, True)
End Function
```

!!! note
    Best practice is to call `.close()` on the ZipArchive when processing completes.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/zipvse){: target="_blank" rel="noopener noreferrer"}.