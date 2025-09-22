# Encode and hash content

--8<-- "setup.md"

## Introduction

Because VoltScript is running as middleware, the need to convert to and from various hashing algorithms is probable. HashVSE is designed to enable this using the `HashUtilities` class.

## VoltScript dependencies

Incorporating HashVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
        "HashVSE": {
            "library": "hashVSE Voltscript Extension",
            "version": "1.0.3",
            "module": "hashvse",
            "repository":"volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

To use the extension in your script, enter `UseVSE "*HashVSE"`.

## Input and output formats

All the APIs can receive input and output content as VoltScript strings or Byte Arrays. Because there is no data type specifically for Byte Arrays, the VoltScript data type is `Variant`, containing an array of [Byte data types](https://help.hcltechsw.com/dom_designer/12.0.2/basic/LSAZ_BYTE_DATA_TYPE.html){: target="_blank" rel="noopener noreferrer"}.

### Converting a String to a Byte array

The following code can be used to convert a string to a byte array:

``` voltscript
Function convertStringToBytes(passedStr as String) as Variant
    Dim hu as New HashUtilities()
    Return hu.stringToBytes(passedStr)
End Function
```

### Converting a Byte array to a String

Converting a byte array to a string is a little more complex. We need to know whether to expect hexadecimals when converting the byte array. This is the second argument passed to the function:

``` voltscript
Function convertStringToBytes(passedStr as String) as Variant
    Dim hu as New HashUtilities()
    Return hu.stringToBytes(passedStr)
End Function
```

## Base64

Some content may be received or need to be posted as Base64. Base64 encoding can be used to convert form data or JSON to a shorter string with restricted URL-safe character set. There are APIs in WebVSE to [encode](./web.md#encode-body-content) and [decode](./web.md#decode-and-request-body-content) Base64 HTTP data. But HashVSE also provides APIs for Base64 operations.

### Encoding to Base64

The following code can be used to convert a string to a Base64 encoded string:

``` voltscript
Function base64Encode(passedStr as String) as String
    Dim hu as New HashUtilities()
    Return hu.base64Encode(passedStr)
End Function
```

### Decoding from Base64

The following code can be used to convert a Base64 encoded string to a string:

``` voltscript
Function base64Decode(base64Str as String) as String
    Dim hu as New HashUtilities()
    Return hu.base64Decode(base64Str)
End Function
```

### Encoding a Byte array to Base64

To encode a byte array, we first need to convert the string to bytes, which [we have already covered](#converting-a-string-to-a-byte-array). Once we have that, converting to a Base64-encoded string is straightforward:

``` voltscript
Function base64ByteEncode(tempVal as Variant) as String
    Dim hu as New HashUtilities()
    Return hu.base64EncodeB(tempVal)
End Function
```

### Decoding from Base64 to a Byte array

The following code can be used to convert a Base64 encoded string to a byte array:

``` voltscript
Function base64ByteDecode(base64Str as String) as Variant
    Dim hu as New HashUtilities()
    Return hu.base64DecodeB(base64Str)
End Function
```

In our round-tripping example, the starting string was not hexified when converted to Base64, so to convert it back to a string, we can use the function [we have already covered](#converting-a-byte-array-to-a-string).

## SHA hashes

### Converting strings to SHA hashes

Converting a string to a SHA-hashed string just requires calling the function for the relevant SHA variant:

``` voltscript
Sub convertSHA(inputStr as String, output1 as String, output256 as String,_
    output512 as String)
    Dim hu as New HashUtilities()
    output1 = hu.SHA1(inputStr)
    output256 = hu.SHA256(inputStr)
    output512 = hu.SHA512(inputStr)
End Sub
```

### Converting byte arrays to SHA hashes

If you have byte arrays instead of strings, there are functions for converting those too:

``` voltscript
Sub convertSHABytes(inputStr as Variant, output1 as Variant, output256 as Variant,_
    output512 as Variant)
    Dim hu as New HashUtilities()
    output1 = hu.SHA1B(inputStr)
    output256 = hu.SHA256B(inputStr)
    output512 = hu.SHA512B(inputStr)
End Sub
```

Bear in mind that SHA functions generate hexadecimal bytes, so to convert them to a string, you will need to pass `True` as the second argument, for example `hu.bytesToString(output1B, True)`.

## MD5 Hashes

When manually downloading files, it's common to compare the MD5 hash of the file to an expected value. `HashUtilities` provides the ability to generate MD5 hashes of strings, byte arrays or files.

### MD5 hash of string

The following code can be used to generate an MD5 hash of a string:

``` voltscript
Function convertMD5(inputStr as String) as String
    Dim hu as New HashUtilities()
    Return hu.MD5(inputStr)
End Function
```

### MD5 hash of byte array

The following code can be used to generate an MD5 hash of a byte array:

``` voltscript
Function convertMD5Bytes(inputBytes as Variant) as Variant
    Dim hu as New HashUtilities()
    Return hu.MD5B(inputBytes)
End Function
```

Bear in mind that MD5 hashing generates hexadecimal bytes, so to convert the byte array to a string, you will need to pass `True` as the second argument, for example `hu.bytesToString(returnVal, True)`.

### MD5 hashes of files

The following code can be used to generate an MD5 hash from a file, by passing the filepath:

``` voltscript
Function convertFileMD5() as String
    Dim hu as New HashUtilities()
    Return hu.FileMD5(CurDir & "/samples/lorem.txt")
End Function
```

A similar function can be used to return a byte array:

``` voltscript
Function convertFileMD5Bytes() as Variant
    Dim hu as New HashUtilities()
    Return hu.FileMD5B(CurDir & "/samples/lorem.txt")
End Function
```

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/hashvse){: target="_blank" rel="noopener noreferrer"}.