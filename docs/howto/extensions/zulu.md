# Process dates

--8<-- "setup.md"

## Introduction

LotusScript has always had a date/time Variant (DataType 7). But it doesn't contain a timezone and is unaware of any daylight savings.

When dealing with data in middleware, [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html){: target="_blank" rel="noopener noreferrer"} is a standard for date/times. But the values are passed in JSON as strings with datetime format. For use within VoltScript, it may be easier to convert to a date object. This is what ZuluVSE provides.

## VoltScript dependencies

Incorporating ZuluVSE is straightforward. You just need to add the following JSON object to the `vsesDependencies` element in your `atlas.json`.

```json
    "ZuluVSE": {
        "library": "ZuluVSE VoltScript Extension",
        "version": "1.0.4",
        "module": "zuluvse",
    }
```

To use the extension in your script, enter `UseVSE "*ZuluVSE"`.

## Parse dates

The `DateTimeParser` class is used to parse a date string or number and return a `DateTimeObject`. There are a variety of in-built methods, depending on the value you start with.

### Parse ISO dates

ISO dates can be parsed in UTC or with an offset. When dates are in UTC, they don't have an offset but end in "Z". The following code will convert a UTC date-time string to a DateTimeObject:

``` voltscript
Function parseISOZuluDateString() as DateTimeObject
    Dim dateStr as String
    Dim parser as new DateTimeParser()
    Dim dateObj as DateTimeObject

    dateStr = "2023-08-15T09:50:20Z"
    Set dateObj = parser.parseISOString(dateStr)
    Return dateObj
End Function
```

Sometimes a date will be received with an offset. These can also be parsed using `parseISOString()`:

``` voltscript
Function parseISOOffsetDateString() as DateTimeObject
    Dim dateStr as String
    Dim parser as new DateTimeParser()
    Dim dateObj as DateTimeObject

    dateStr = "2023-08-15T02:50:20-07:00"
    Set dateObj = parser.parseISOString(dateStr)
    Print dateObj.defaultFormat
    Return dateObj
End Function
```

### Build from epoch

`DateTimeParser.buildDateFromEpoch()` is used to build a `DateTimeObject` based on milliseconds since Jan 1 1970 midnight UTC, the Unix epoch. The following code can be used to build a date corresponding to August 15th 2023, 12:08:20 UTC.

``` voltscript
Function parseDateEpoch()
    Dim parser as new DateTimeParser()
    Dim dateObj as DateTimeObject

    Set dateObj = parser.BuildDateTimeFromEpoch(1692101300)
    Print dateObj.defaultFormat
    Return dateObj
End Function
```

### Build from constituent parts

`DateTimeParser.buildDateTimeObject()` is used to build a DateTimeObject passing year, month, day, hours, minutes, seconds and offset minutes from UTC. The following code can be used to build a `DateTimeObject` for August 4th 2023, 12:20:25 (UTC +01:00).

``` voltscript
Function parseDateParts()
    Dim parser as new DateTimeParser()
    Dim dateObj as DateTimeObject

    Set dateObj = parser.BuildDateTimeObject(2023,8,4,11,20,25,-60)
    Print dateObj.defaultFormat
    Return dateObj
End Function
```

### Build from string with formatting codes

`DateTimeParser.ParseDateString()` allows a string date to be parsed with a specific set of format codes for a specific timezone. This function uses formatting codes consistent with the underlying [C/C++ format codes](https://en.cppreference.com/w/c/chrono/strftime){: target="_blank" rel="noopener noreferrer"}.

## Formatting DateTimeObjects

### Formatting to ISO date format

<!-- TODO: Complete this with samples for toISODateTime -->

#### The basics - using the C/C++ format codes

We use the `DateTimeObject.toString()` method to return a date or date/time string formatted to fit our needs. This function uses formatting codes consistent with the underlying [C/C++ format codes](https://en.cppreference.com/w/c/chrono/strftime){: target="_blank" rel="noopener noreferrer"}. Some more common examples are included in the comments of the example code below:

``` voltscript
Sub toStringFormatExample()
    Dim dtObj as DateTimeObject, dtParser as New DateTimeParser
    Dim testISOStr as String, testFmtPattern1 as String, testFmtPattern2 as string, testFmtPattern3 as String
    testISOStr = "2023-02-20T20:49:13Z"
    testFmtPattern1 = "%Y-%m-%d %H:%M:%S %Z"
    testFmtPattern2 = "%F %T %Z"
    testFmtPattern3 = "%A, %B %d %Y %T %Z"
 
    Set dtObj = dtParser.ParseISOString(testISOStr)

    Print |Using test ISO String "| & testISOStr & |" with no locale code; |
    Print |Format pattern "| & testFmtPattern1 & |" returns "| & dtObj.toString(testFmtPattern1, "") & |",|
    Print |Format pattern "| & testFmtPattern2 & |" returns "| & dtObj.toString(testFmtPattern2, "") & |",|
    Print |Format pattern "| & testFmtPattern3 & |" returns "| & dtObj.toString(testFmtPattern3, "") & |"|
End Sub
```

In this example code, we have three different formatting patterns to test.

Each of the patterns (`testFmtPattern1`, `testFmtPattern2`, and `testFmtPattern3`) specifies various date time components and the order in which they should appear.  

- **testFmtPattern1** `%Y-%m-%d %H:%M:%S %Z`: This pattern specifies *year-month-day hour:minute:second timezone*.  
- **testFmtPattern2** `%F %T %Z`: This pattern utilizes special shorthand codes. `%Y-%m-%d` can be abbreviated to `%F`, while `%H:%M:%S` can be abbreviated to simply `%T`.  This pattern therefore also specifies *year-month-day hour:minute:second timezone*.  
- **testFmtPattern3** `%A, %B %d %Y %T %Z`: This pattern demonstrates some additional codes. The day of the week uses the code `%A`, and the name of the month uses the code `%B`, both of which will be returned in the appropriate language for the locale. This pattern specifies *day-of-week, name-of-month day-of-month four-digit-year hour:minute:second timezone*.

??? info "Common shorthand codes for date/time components"

    | Format code | Description |
    | :---------: | ----------- |
    | %B          | Full month name |
    | %b          | Abbreviated month name |
    | %A          | Full day name |
    | %a          | Abbreviated day name |
    | %m          | Month |
    | %d          | Day of month |
    | %0d         | Day of month (2 digit) |
    | %Y          | Year as four digits
    | %F          | Equivalent of %Y-%m-%d |
    | %H          | Hour |
    | %M          | Minute |
    | %S          | Second |
    | %T          | Equivalent of %H:%M:%S |
    | %Z          | Locale-dependent time zone name or abbreviation |

#### The locale parameter

The *locale* parameter in `DateTimeObject.toString(*format*, *locale*)` allows you to display the names of things like months and days of the week using a country or regionally specific language.

!!! warning
    Before using Locales, you must ensure that the appropriate locale has been installed.  

    Locale codes consist of appropriate [ISO 639 Language Codes](https://www.iso.org/iso-639-language-codes.html){: target="_blank" rel="noopener noreferrer"} and [ISO 3166 Country Codes](https://www.iso.org/iso-3166-country-codes.html){: target="_blank" rel="noopener noreferrer"} concatenated with an underscore, followed by a period and the encoding format.  

    Examples:   

    - `en_US.utf8` specifies English (United States)
    - `es_MX.utf8` specifies Spanish (Mexico)
    - `fr_BE.utf8` specifies French  (Belgium) 
    
    A table of locale codes (less the encoding format) can be found [here](https://saimana.com/list-of-country-locale-code/){: target="_blank" rel="noopener noreferrer"}.

Assuming you were to install locales for both English and French, then using the code `"en_US.utf8"` would produce `Monday, February 20 2023 20:49:13 UTC`, and `"fr_FR.utf8"` would produce `lundi, février 20 2023 20:49:13 UTC`.

!!! info
    Using different locales will require the relevant language pack installed on the operating system.

    The VoltScript Dev Container is based on Red Hat Enterprise Linux 8 (RHEL 8). This distribution only has a dedicated English langpack for locales, with all others packaged in ``glibc-all-langpacks``. Installing all locales can be quite large (200+ MB), so ``glibc-all-langpacks`` only installs the locales defined in the build macro ``_install_langs`` to save space.

**To select the locales to install:**

1. Open a root terminal into the container. See [Creating the Dev Container](../../tutorials/ide/devcontainer.md#creating-the-dev-container) for more details.

2. Edit ``/etc/rpm/macros.image-language-conf`` to define ``_install_langs`` as the locales you want installed. This is a colon separated list of locale prefixes ([ISO 639 Language Codes](https://www.iso.org/iso-639-language-codes.html){: target="_blank" rel="noopener noreferrer"}), for example ``de:fr:es``. If a prefix does not contain a ``_``, it is added. The special argument ``all`` means to install all locales and must be present by itself. You can change the languages to install with this command, replacing ``<lang>`` with the locales to install:

    ```sh
    sed -i 's!%_install_langs.*!%_install_langs <lang>!' /etc/rpm/macros.image-language-conf
    ```

3. Install ``glibc-all-langpacks``. This can be done with this command:

    ```sh
    microdnf install glibc-all-langpacks && microdnf clean all
    ```

    Locales will be installed to ``/usr/lib/locale/locale-archive``.

4. Inspect the available locales by running ``locale -a``.

    For more information on selecting what locales to install, run ``build-locale-archive -h`` after installing ``glibc-all-langpacks``. This is the tool which compiles the locale archive. The build macro ``_install_langs`` is passed as the argument to ``--install-langs``.

    You can change the installed locales by editing ``/etc/rpm/macros.image-language-conf``, then reinstalling ``glibc-all-langpacks``:

    ```sh
    sed -i 's!%_install_langs.*!%_install_langs de:fr:es!' /etc/rpm/macros.image-language-conf
    microdnf reinstall glibc-all-langpacks && microdnf clean all
    ```

### Converting LotusScript custom date-time formats

`DateTimeParser.ConvertLSFormat()` converts a string of custom LotusScript datetime formats into corresponding C/C++ format codes. The translated formats can now be recognized and used by other ZuluVSE functions, such as `ParseDateString()` and `toString()`.

``` voltscript
Sub Initialize

    Dim dtObj as DateTimeObject, dtParser as New DateTimeParser
    Dim OldFrmt as String, NewFrmt as String, testFmtLocale as String

    Set dtObj = dtParser.GetNow()
    testFmtLocale = "C"

    OldFrmt = "m/d/yy" 
    NewFrmt = dtParser.ConvertLSFormat(OldFrmt)
    Print "m/d/yy: " & dtObj.toString(NewFrmt, testFmtLocale)

    OldFrmt = "d-mmm-yy" 
    NewFrmt = dtParser.ConvertLSFormat(OldFrmt)
    Print "d-mmm-yy: " & dtObj.toString(NewFrmt, testFmtLocale)

    OldFrmt = "c" 
    NewFrmt = dtParser.ConvertLSFormat(OldFrmt)
    Print "c: " & NewFrmt & "->" & dtObj.toString(NewFrmt, testFmtLocale)
End Sub
```

In this example code, 3 custom LotusScript datetime formats are translated.

- `m/d/yy` is converted into `%m/%d/%y`.
- `d-mmm-yy` is converted into `%d-%b-%y`.
- `c` is converted into `%m/%d/%y %H:%M:%S`.

??? info "Custom LotusScript datetime formats and their respective C/C++ format equivalents"

    | LotusScript  | C/C++ |
    | :----------:| ----------- |
    | c           | %m/%d/%y %H:%M:%S |
    | d           | %d |
    | dd          | %d |
    | ddd         | %a |
    | dddd        | %A |
    | ddddd       | %m/%d/%y |
    | dddddd      | %B %d, %Y |
    | w           | %w |
    | ww          | %V |
    | m           | %m |
    | mm          | %m |
    | mmm         | %b |
    | mmmm        | %B |
    | y           | %j |
    | yy          | %y |
    | yyyy        | %Y |
    | h           | %H |
    | hh          | %H |
    | n           | %M |
    | nn          | %M |
    | s           | %S |
    | ss          | %S |
    | ttttt       | %H:%M:%S |
    | AM/PM am/pm | %p |
    | A/P a/p     | %p |
    | z           | %z |
    | zz          | %Z |

!!! info
    Since LotusScripts doesnt have formats for writing locales, We've added `z` and `zz` for that purpose. `z` writes locale-dependent time zone name or abbreviation while `zz` writes offset from UTC in the ISO 8601 format (e.g. -0430).
