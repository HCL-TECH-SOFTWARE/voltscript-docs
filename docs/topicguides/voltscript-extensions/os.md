# Operating System Management

## OS

The VoltScript language has low-level functions for interacting with the operating system. However, some functions have behaviors which, although well-documented, are nonetheless not intuitive. For example, when creating a directory, the code throws an error if the directory can't be created, such as when it already exists, and it can't create directories recursively.

The OSUtils VoltScript Extension was designed to support developers with such functions. The OSUtils class provides simple, easy-to-use functions to:

- identify the current platform.
- access temp and user home directories.
- get and set environment variables.
- identify is a directory or file exists at a given path.
- identify if a file is readable, writable or executable.
- create or remove directories.
- get an array of files in a directory.

The extension also includes a class for building a path as an array by adding a single directory or delimited path. The path can be returned as either an array of directories or a string.

You can find additional information in [API docs](../../apidocs/osutilsvse/index.html) and the following how-to guides:

- [Understanding CurDir()](../../howto/language/curdir.md)
- [Environment variables](../../howto/extensions/env-vars.md)
- [Finding files and managing directories](../../howto/extensions/find-files.md)
- [Read and write files](../../howto/extensions/read-files.md)
- [Processing zip files](../../howto/extensions/zip.md)

## Stream

The Stream VoltScript Extension provides functions for easy reading and writing of files, similar to the NotesStream class but extended to also read from standard input and output.

You can find additional information in the [API docs](../../apidocs/streamvse/index.html) and [Read and write files](../../howto/extensions/read-files.md).

## Zip

The Zip VoltScript Extension provides functions for creating and processing `.zip` files, and managing the files contained by the `.zip`.

!!! note
    Because of the platform libraries used, this extension can only be used to process `.zip` files. It can't be used to process `.tar` or `.tar.gz` files.

You can find more information in [API docs](../../apidocs/zipvse/index.html) and [Processing zip files](../../howto/extensions/zip.md).