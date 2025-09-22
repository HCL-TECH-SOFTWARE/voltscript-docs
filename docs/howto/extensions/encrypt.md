# Encryption

--8<-- "setup.md"

## Introduction

[Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard){: target="_blank" rel="noopener noreferrer"} (AES) is a standard encryption algorithm using symmetric keys. This means it uses the same keys for both encryption and decryption. VoltScript provides both 128-bit and 256-bit cryptographic keys. It also provides the ability to generate the [initialization vector](http://en.wikipedia.org/wiki/Initialization_vector){: target="_blank" rel="noopener noreferrer"}, a randomized starting point for the encryption.

## VoltScript dependencies

Incorporating HashVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
        "HashVSE": {
            "library": "HashVSE VoltScript Extension",
            "version": "1.0.3",
            "module": "hashvse",
            "repository":"volt-mx-marketplace"
        }
```

--8<-- "vse-repository.md"

To use the extension in your script, enter `UseVSE "*HashVSE"`.

## AES Encryption

### Initialization vector and keys

For AES encryption, you will need an initialization vector and either a 128-bit or 256-bit key, stored as a byte array. The following code shows how to initialize all:

``` voltscript
Sub initializeForAES(iv as Variant, key128 as Variant, key256 as Variant)
    Dim cu as New CryptoUtilities()
    iv = cu.createAESIV()
    key128 = cu.createAES128Key()
    key256 = cu.createAES256Key()
End Sub
```

### Encrypting a file

The following code will encrypt the file:

``` voltscript
Function encryptFile(iv as Variant, key as Variant, sourceFile as String, targetFile as String)
    Dim cu as New CryptoUtilities()
    Call cu.fileEncryptAES(sourceFile, targetFile, iv, key, True)
End Function
```

The same function is used for encrypting with a 128-bit key or a 256-bit key. You just pass the relevant key.

### Decrypting a file

Decrypting a file will require the same initialization vector and key used to encrypt it, both as byte arrays. This will probably not be shared as a byte array, but a string. HashUtilities provides an option to convert the string to a byte array, as shown in the [Hash how-to](./hash.md#converting-a-string-to-a-byte-array).

Decrypting the file with the keys, as byte arrays, can be done with the following code:

``` voltscript
Function decryptFile(sourceFile as String, targetFile as String, iv as Variant, key as Variant)
    Dim cu as New CryptoUtilities()
    Call cu.fileDecryptAES(sourceFile, targetFile, iv, key, True)
End Function
```

## RSA PKCS Encryption

HashVSE supports key generation, encryption, and decryption of files and data using RSAES-OAEP, following the PKCS #1 version 2.2 standards.

Currently, signing messages with private keys and verifying signatures with public keys are not supported.

### Creating the private / public keys

RSA encryption uses a private / public key pair. This can be used to encrypt / decrypt both files and byte arrays. You may already have those files generated and saved. But VoltScript also provides functions to generate the files.

```voltscript
Sub createRSAKeys()
    Dim cu as New CryptoUtilities()
    result = cu.createRSAKeyPair(CurDir & "user-id", CurDir & "user-id.pub")
End Sub
```

There are additional parameters for using a password to generate the private key file with and the number of bits. You should use a password and always keep it safe.

### Encrypting a file

The following code will encrypt the file:

``` voltscript
Sub encryptFilePKCS(privateKeyFile as String, plainFile as String, encryptedFile as String)
    Dim cu as New CryptoUtilities()
    Call cu.PKCSEncryptFile(privateKeyFile, True, sourceFile, targetFile, True)  ' Assumes no password on file
End Sub
```

### Decrypting a file

Decrypting a file will require the same initialization vector and key used to encrypt it, both as byte arrays. This will probably not be shared as a byte array, but a string. HashUtilities provides an option to convert the string to a byte array, as shown in the [Hash how-to](./hash.md#converting-a-string-to-a-byte-array).

Decrypting the file with the keys, as byte arrays, can be done with the following code:

``` voltscript
Sub decryptFilePKCS(privateKeyFile as String, encryptedFile as String, plainFile as String)
    Dim cu as New CryptoUtilities()
    Call cu.PKCSDecryptFile(privateKeyFile, encryptedFile, plainFile, True)  ' Assumes no password on file
End Sub
```

### Encrypting a string

To encrypt a string, it first needs to be converted to a byte array. Encrypting the byte array is similar to encrypting a file.

``` voltscript
Function encryptBufferPKCS(rivateKeyFile as String, stringToEncrypt) as String
    Dim cu as New CryptoUtilities()
    Dim publicKeyBytes as Variant
    Dim clearBytes as Variant
    Dim encryptedBytes as Variant
    publicKeyBytes = cu.PKCSReadPrivateKeyFile(privateKeyFile)  ' Assumes no password on file
    clearBytes = cu.textToBytes(stringToEncrypt)
    encryptedBytes = cu.PKCSEncryptBuffer(publicKeyBytes, false, clearBytes)
    Return cu.bytesToText(encryptedBytes)
End Function
```

### Decrypting a string

Decrypting a string will be very similar:

``` voltscript
Function decryptBufferPKCS(rivateKeyFile as String, encryptedString) as String
    Dim cu as New CryptoUtilities()
    Dim publicKeyBytes as Variant
    Dim clearBytes as Variant
    Dim encryptedBytes as Variant
    publicKeyBytes = cu.PKCSReadPrivateKeyFile(privateKeyFile)  ' Assumes no password on file
    encryptedBytes = cu.textToBytes(encryptedString)
    clearBytes = cu.PKCSDecryptBuffer(publicKeyBytes, encryptedBytes)
    Return cu.bytesToText(encryptedBytes)
End Function
```

!!! warning
    `bytesToText()` and `textToBytes()` will be renamed after EA4 to `bytesToString()` and `stringToBytes()`, for consistency with HashUtilities class.

The complete implementations of the code snippets are available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/hashvse){: target="_blank" rel="noopener noreferrer"}.