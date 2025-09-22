# Generate a new VoltScript Extension using VoltScript Interface Designer

## Introduction

VoltScript Extensions (VSEs) are native libraries for the VoltScript runtime using the same well-known interface as earlier LotusScript Extensions (LSXs). As native code, they provide a way to write new classes and objects with more complex functionality or that use an existing third-party library. VoltScript Interface Designer (VSID) provides a way to describe the classes, properties, and methods of a VSE, and then generates C++ skeleton code based on the interface. This code uses modern [CMake](https://cmake.org){: target="_new" rel="noopener noreferrer”} as its build system, allowing a developer to use a text editor or IDE of their choice to implement the design.

## VoltScript Interface Designer

VSID is distributed as a .ntf template and a .dll LSX for the Windows version of HCL Notes&reg; 14.0. The template provides a form for designing a VSE or VoltScript library, while the .dll handles the C++ code generation. You must register the LSX first so that it can be loaded by Notes.

**To start designing your own VSE**:

1. Extract the VSID template and .dll to a directory of your choice. As an example, you can use the path `C:\VSE\`.

2. Close Notes 14.0 if it's open.

3. Register `vsidwizard.dll` in the Windows Registry.

    A value needs to be added to the key `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Lotus\Components\LotusScriptExtensions\2.0`. Notes 14.0 creates this key when it's installed, along with a string value named `Notes`.

    VSID requires a string value of `lsxwizard` with its data as the full path to `vsidwizard.dll`.

    You can add the value yourself using the Registry Editor, or by running this command in an elevated command prompt, replacing `C:\VSE\vsidwizard.dll` with the full path to the DLL on your system:

    ```cmd
    REG ADD HKLM\Software\Lotus\Components\LotusScriptExtensions\2.0 /v lsxwizard /t REG_SZ /d "C:\VSE\vsidwizard.dll" /f
    ```

4. Import the VSID template (`vsid.ntf`) into your Notes 14.0 client. An easy way is copying it into your Notes data directory.

5. Open Notes 14.0 and create a new database using "VoltScript Interface Designer 1.0.0" as the template.

    As an example, you can use the name "My First VSE". The new database is automatically opened to the "Script Extension Projects" view.

6. Set the paths VSID will use when generating the VSE.

    1. Click **Setup** located at the top right corner of the view to open the **VoltScript Interface Designer Setup** dialog.

        ![VSID Setup Button](../../assets/images/VoltScriptInterfaceDesigner-SetupButton.png)

    2. In the **VoltScript Interface Designer Setup** dialog, set the **VSE Target Directory** to your preferred directory by either using the folder icon to select the directory or directly entering the directory path in the text field. As an example, you can use `C:\VSE\MyFirstVSE\`.

        !!!note
            The selected VSE Target Directory is the directory where the generated VSE files will be written to.  

        ![VSID Setup](../../assets/images/VoltScriptInterfaceDesigner-Setup.png)

## Design and generate a new VSE

VSID provides an interface for creating and modifying the programming interface for a VSE, such as the names and data types of properties and functions. You'll use it to create a simple VSE.

1. Make sure "Script Extension Projects" is selected from the left hand pane in VSID.

2. Create a project.

    1. Along the top black bar of VSID, click **Project** to create and open a new project document.
    2. Fill in the fields, such as for the name and description, as needed.

        The **Name** is the name of the VSE and will be referenced by any scripts that use it. As an example, you can set the name to "MyFirstVSE".

    3. Click **Save & Close** at the top left of the document to save your changes and return to VSID.

3. Create a class.

    1. With the project selected, click **Class** from the top of the VSID to create and open a new class document in that project.
    2. Fill in the name field.

        The enetered name will be used as the name of the class in the scripts. As an example, you can set the name to "MyFirstClass".

    3. Click **Save & Close** at the top left of the document to save your changes and return to VSID.

4. Give the class a property.

    1. With the class selected, click **Property** to create a new property.

        !!!tip
            Properties are available to both VoltScript and C++, and can be used to expose data or provide a control.

    2. Set the **Name** of the property, as well as its **Data Type** and optionally its **Initial Value** when an instance of this class is created. As an example, you can create a property having the name "MyFirstProperty", the data type "Integer-Signed", and the initial value "123".

        ![Sample Property](../../assets/images/VoltScriptInterfaceDesigner-Property.png)

    3. Click **Save & Close** at the top left of the document to save your changes and return to VSID.

5. Give the class a method.

    1. With the class selected, click **Method** to create a new method.
    2. Enter a **Name** and select the **Type** and **Return Type** of the method.

        !!!tip
            Methods can be called by VoltScript and are generated as C++ methods. A method can be a function, which has a return value, or a sub, which has no return value, and can optionally have a number of arguments with default values.

        As an example, you can create a method with the name "TestMethod", the type "Function", and the return type "Integer-Signed". The default return value for this data type is 0.

        ![Sample Method](../../assets/images/VoltScriptInterfaceDesigner-Method.png)

    3. Click **Save & Close** at the top left of the document to save your changes and return to VSID.

6. Click **Generate Extension Files**.

    !!!note
        You will need to have a document in the "Script Extension Projects" selected to be able to run this.

7. In the **VSE Output Directory** dialog, check the **VSE Target Directory** path, change it if needed, and the click **OK** to generate the files, along with the needed common header and source files.

    !!!note
        The defined **VSE Target Directory** path in the **VSE Output Directory** dialog is by default the same as the **VSE Target Directory** path defined in the **VoltScript Interface Designer Setup** dialog.

    ![VSE Output Directory](../../assets/images/VoltScriptInterfaceDesigner-Output.png)

You can edit any document in VSID by double-clicking it to open. Comment and Code Sample fields can be left empty, but will be referenced when the documentation is generated.

## Build and test a new VSE

After generating the C++ code, you can begin development. You'll start by building and testing the freshly generated VSE. All methods and functions will be given placeholder values to allow the code to be compiled and loaded by VoltScript without editing any source first.

1. Build the VSE by either using the generated build script or another tool like Visual Studio Code.

    You will need a build environment with the 64-bit MSVC compiler and CMake available. If you have Visual Studio installed, a command prompt with the needed tools is in your start menu. Search for "x64 Native Tools Command Prompt for VS". Navigate this command prompt to your generated VSE and run the generated build script: `build.bat --debug`. You can get help on using this script by running `build.bat --help`.

2. Write a test VoltScript file that loads the VSE and interacts with it.

    As an example, here is a test script that interacts with our project, class, property, and method:

    ``` voltscript
    Option Public
    Option Declare

    UseVSE "*MyFirstVSE"

    Sub Initialize

        Dim hello as New MyFirstClass

        Print "Testing reading a VSE property:"
        Print hello.MyFirstProperty

        Print "Testing calling a VSE method:"
        Print hello.TestMethod()

    End Sub
    ```

    For this example, this file will be located at `C:\VSE\MyFirstVSE\hello.vss`.

3. Run the script using VoltScript.

    You need to provide VoltScript with the path to the newly built VSE through [`seti.ini`](../writing/vses.md#setiini). The CMake build system automatically generates a sample `seti.ini` with the path the built .dll in `bin/w64/`, as `seti-D.ini` for "debug" builds and `seti.ini` for "release" builds. You can pass the path to this `seti.ini` to VoltScript through the [--seti option](../running/voltscript.md#options-available) on the command line.

    As an example, you can run the test script against your earlier debug build by running VoltScript like this: `VoltScript.exe --seti bin\w64\seti-D.ini hello.vss`.

    The output of a successful test would look like this:

    ```cmd
    Testing reading a VSE property:
     123
    Testing calling a VSE method:
     0
    ```

## Next steps

Now that you have a functional VSE, you can use it as the starting point for further development. A development flow might look like this:

* Implement the functionality of the VSE to provide a powerful library to your VoltScript projects. The most important files will be in the `src/VSEName` folder, where VSEName is the name of the project, like "MyFirstVSE". Files named after classes, like "MyFirstClass.cpp" and "MyFirstClass.hpp", will be populated with stub code for the methods and properties set in VSID.

* Add more properties or methods and regenerate the VSE. Throughout the generated code are commented tag strings like `//{{LSX_AUTHOR_CODE_` and `//}}`. The code generation step will preserve any code between these tags, allowing existing implementations to be kept when the generation is run again.

* Use a source control tool like [git](https://git-scm.com){: target="_new" rel="noopener noreferrer”} to track changes and share your VSE with other developers.

* Review the generated `CMakeLists.txt` file and note how external libraries can be included.

* Test your VSE on your target platforms, such as the VoltScript Dev Container. The generated build system works on both Windows and Linux.
