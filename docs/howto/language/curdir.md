# Understanding CurDir()

`CurDir()` has always been a LotusScript function. The unwary developer may assume `CurDir()` function returns the directory containing the script currently being edited, but this is a misconception. The VoltScript `CurDir()` function works the same way it does in LotusScript, returning the current *working* directory *at runtime*, so the directory from which the script is being run. Typically, this will be the project directory.

This can be tested by comparing `CurDir` from a test or main script with the following function in a VoltScript Library Module.

``` voltscript
Function getCurrentWorkingDirectory() as String
    Return CurDir
End Function
```

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/platform){: target="_blank" rel="noopener noreferrer"}.