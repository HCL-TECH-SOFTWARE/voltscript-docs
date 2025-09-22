## Export username and authentication token

The binary images and Helm charts for Volt MX Go server components are pulled from the HCL Container Repository. You must [obtain your authentication token from the HCL Container Repository](../obtainauthenticationtoken.md) before running the commands.

Run the following commands to export the username and authentication token.

!!! note
    - Replace `<your hclcr username>` with your email address as shown in the **User Profile** dialog. Take note of exactly how your email address is written in the **User Profile** dialog as authentication is *case sensitive* on the user email.
    - Replace `<your hclcr authentication token>` with the **CLI secret** value you copied from the **User Profile** dialog.

``` bash
export HCLCR_USERNAME=<your hclcr username>
```

``` bash
export HCLCR_TOKEN=<your hclcr authentication token>
```

## Configure Helm to pull from HCL Container Repository

The procedure sets up Helm with the details necessary to authenticate with the HCL Container Repository. You will need your [email and authentication token](../obtainauthenticationtoken.md) used with the HCL Container Repository.

!!! warning
    If you have previously used `hclcr` with https://hclcr.io/chartrepo/voltmxgo, execute the following command to remove the old repository.

    ``` bash
    helm repo remove hclcr 
    ```

Run the following command to set up Helm:

``` bash
helm repo add hclcr https://hclcr.io/chartrepo/voltmxgo-ea --username <your hclcr username> --password <your CLI secret>
```

!!! warning
    Use the **CLI secret** value you saved from [obtaining authentication token from HCL Container Repository](../obtainauthenticationtoken.md) as your authentication token or password. **Do not use the password you use for logging in. `helm` commands use the CLI secret.**

!!! example

    ``` bash
    helm repo add hclcr https://hclcr.io/chartrepo/voltmxgo-ea --username user.name@example.com --password xx3ds2w
    ```

!!! failure
    If you get an error message similar to the following:

    ``` { .yaml .no-copy }
    Error: looks like https://hclcr.io/chartrepo/voltmxgo is not a valid chart repository or cannot be reached: failed to fetch https://hclcr.io/chartrepo/voltmxgo/index.yaml : 401 Unauthorized
    ```

    Most likely, you haven't specified your username or authentication token correctly. Make sure the case and content matches exactly what's listed on the HCL Container Repository site and retry.

## Create a namespace for MXGO

Run the following commands to create a namespace and set the current context to **mxgo**:

``` bash
kubectl create namespace mxgo
```

``` bash
kubectl config set-context --current --namespace=mxgo
```

--8<-- "resetkubecontext.md"

## Ensure Volt Foundry hostnames are resolvable

You must ensure the url used to access Volt Foundry and Domino REST API are resolvable by all systems that will be accessing it including Kubernetes and any browsers that you use. This can be done by adding DNS host names and IP addresses to your corporate DNS configuration, or by modifying the hosts file for all systems.

In the examples that follow we're going to use these hostnames as examples:

``` bash
drapi.mymxgo.com - used to access Domino REST API.
drapi-management.mymxgo.com - used to access the Domino REST API Management interface.
foundry.mymxgo.com - used to access HCL Volt Foundry
```

!!! note
    If you are using a Domino REST API installation on an existing server, you only need to set `foundry.mymxgo.com` hostname.

You can either provide your own hostnames, or use these example names. Either the name to IP address mapping must be made in your DNS configuration, or you must modify your system hosts file. Further documentation here assumes you aren't using a DNS system and configuration and are therefore modifying local hosts file entries.