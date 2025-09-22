# Lab 04 - Reading from a DRAPI Request

## Duration 30 min

## What you will learn

You will learn how to connect to an HCL Domino REST API Scope and pull information from a view using VoltScript Code and DrapiVSE.  

## Prerequisites

- [Lab 03b](lab-03b.md) completed
- Familiarity with creating a Domino Database from a Template
- Familiarity with creating a Scope and Schema in the [HCL Domino REST API](https://opensource.hcltechsw.com/Domino-rest-api/){: target="_new" rel="noopener noreferrer”}

## Steps

### DRAPI SETUP

1. Download the [Demo Companies and Contacts Template](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/blob/main/samples/intro-lab4/assets/compcont.ntf){: target="_new" rel="noopener noreferrer”} and save it locally.  
1. Create a New Database instance from the template on the HCL Domino server upon which your HCL Domino REST API is installed, and set the ACL appropriately for your DRAPI instance.  
1. Create a Scope called `companiesandcontacts`, and associate it with the `demo_companies_and_contacts` Schema in your newly created database.

### The IDE

1. Create a new VS Code VoltScript Workspace folder called **lab-04**.
    --8<-- "voltscript-ide.md"

### atlas.json

1. Download the [atlas.json](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/intro-lab4/assets/atlas.json){: target="_new" rel="noopener noreferrer”} and save it to your `lab-04` folder.  
1. Modify `atlas.json` value for `authors` appropriately and save it.
1. Run VoltScript Dependency Setup and create your `atlas-settings.json` file as you did in [Lab 03a](lab-03a.md)
1. From the **Command Palette**, run `VoltScript: Install Dependencies`.  

## VOLTSCRIPT CODE

1. Download [main.vss](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/intro-lab4/assets/main.vss){: target="_new" rel="noopener noreferrer”} and save it to the **src** folder.
1. Open src/main.vss and modify the script.
    - Set the values for the constants `DRAPI_URL`, `USER_NAME`, and `USER_PASSWORD` to the appropriate values for your environment. Ensure that the */api/v1* suffix remains for `DRAPI_URL`.  
1. As you review the script, you will find the [DrapiVSE Documentation](../../apidocs/drapivse/index.html){: target="_new" rel="noopener noreferrer”} to be a useful reference.
    - The script instantiates a new `DrapiServer` object, and then sets the `serverUrl` property.  
    - It then logs into the server using the appropriate credentials, and then prints the user's information to the console.  
    - The script then gets the appropriate `DrapiRequest` from the `DrapiServer` object, and prints out information about all of the views.  It is important to note here that information returned by the `getLists` method is restricted to **only** the `Active Views` you configured during the DRAPI SETUP portion of this lab.  
    - The script then prints out all of the entries in the `contactsByCompany` view; which at this point should be an empty array (no entries).

1. Return focus to the main.vss file in your VS Code editor.
--8<-- "voltscript-saveandrun.md"

!!! success
    You have successfully connected to an HCL Domino REST API Instance, passed authentication, and queried information from a specific Scope and printed it out to the console -all with just a few lines of VoltScript Code.  

## Review

This gives you an idea of a day in the life of a VoltScript developer. You will use VoltScript Dependency Manager to avoid having to copy and paste dependencies around. You can retrieve data from a **_remote_** data store using various [VoltScript Extensions](../../references/vses.md), and retrieve information from them.

The code for the lab is available on [GitHub](https://github.com/HCL-TECH-SOFTWARE/voltscript-samples/tree/main/samples/intro-lab4).

## Looking Forward

In [Lab 05](lab-05.md), you will learn to use the VoltScriptJsonConverter to process raw JSON data into JSON document records.  

In [Lab 06](lab-06.md), you will use the JSON document records to add Customer and Contact records to your database.  This will provide you with populated content for use with a Volt Foundry Integration Service you will create in a later lab.  
