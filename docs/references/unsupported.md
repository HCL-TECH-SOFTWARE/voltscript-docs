# Unsupported functions

## InputBox

The `InputBox` function can't be used in VoltScript, because there are no UI elements to display the content.

## MessageBox

The `MessageBox` or `MsgBox` function and statement should be avoided. VoltScript is designed to run as middleware, so a prompt that blocks processing and requires user interaction will have unexpected outcomes. The `--headless` option when running VoltScript can convert any `MessageBox` calls into `Print` statements. **The best practice is to avoid using `MessageBox`.**

## SendKeys

`SendKeys` is used to enter keystrokes in the active window as if they were entered from the keyboard. This is not supported in Notes / Domino on UNIX or MacOS platforms. It also makes no sense a VoltScript environment, so is unsupported but with no intention to remove from the runtime engine.

## Asc(), Chr(), Uni() and multi-byte character sets

We are aware of an issue with `Asc()` and `Chr()` when using multi-byte characters. The problem has been identified with 3 byte Thai characters. The problem is likely to also affect `Uni()` There are no plans to fix at this point.

## Other functions

Some other functions do not make sense in a VoltScript context, like `CreateObject`, `IMESetMode`, `IMEStatus`, `IsUnknown`, `Shell`, `ShellID`, `Stop`, `Yield`.