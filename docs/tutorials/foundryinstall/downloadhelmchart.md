# Install Domino REST API

The procedure guides you in downloading the Domino REST API Helm chart and deploying Domino REST API.

## 1. Download the Domino REST API Helm chart

1. Run the following command to make sure that the chart information for the repositories is up-to-date.

    ``` bash
    helm repo update
    ```

1. Run the following command to download the chart:

    ``` bash
    helm pull hclcr/drapi
    ```

    The file `drapi-1.n.n.tgz` is downloaded.

1. Run the following commands to unpack the chart and make the DRAPI directory your current directory:

    ``` bash
    tar -xzvf drapi-1.n.n.tgz
    cd drapi
    ```

    !!!note
        Ensure the version number specified here with tar matches the version you downloaded, such as `drapi-1.0.7.tgz`.

1. Edit the `values.yaml` file using your preferred editor to update the file with your HCL Container Repository credentials, and the DNS name settings.

    1. Locate the following lines in the file and replace `your-email` and `your-authentication-token` with your [email and authentication token](obtainauthenticationtoken.md) used with the HCL Container Repository:

        ``` { .yaml .no-copy }
        imageCredentials:
            username: your-email
            password: your-authentication-token
        ```

        !!! note
            Use the **CLI secret** value you saved from [obtaining authentication token from HCL Container Repository](obtainauthenticationtoken.md) as your authentication token or password.

    1. Locate the following lines in the file and add your DNS hostname settings:

        ``` { .yaml .no-copy }
        ingress:
            drapiDnsName:
            drapiManagementDnsName:
        ```

        !!! example
            The example names used are `drapi.mymxgo.com` and `drapi-management.mymxgo.com` respectively.
            ``` .yaml
            # The DNS host names that users will access the Domino REST API with.
            drapiDnsName: "drapi.mymxgo.com"

            # The DNS host name administrators will access the REST API management
            # interface with.
            drapiManagementDnsName: "drapi-management.mymxgo.com"
            ``` 

        --8<-- "resolvablehostnames.md"

    1. Locate the following lines in the file for the Administrator's first name, last name, and password. Set values for each of these settings. In our example we're using "mxgo", "admin" and "password". However, if you use your own values, remember the values and use them when required. Remember that the values of `dominoAdminFirstName` and `dominoAdminLastName` are combined, but separated by a space, to form the **username**.

        ``` { .yaml .no-copy }
        dominoAdminFirstName: "mxgo"
        dominoAdminLastName: "admin"
        dominoAdminPassword: "password"
        ```

        The following fields may be of interest to you as well and may be customized to suite your deployment:

        ``` { .yaml .no-copy }
        dominoServerDomainName: "ocp"
        dominoOrgName: "ocp"
        dominoServerName: "drapi"
        dominoNetworkHostname: ""
        ```

        !!! info "Optional Use Existing Domino Environment"
            Consult the [Table of variables](https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/docker.html#table-of-variables) in *Run Domino REST API with a Docker image* in the  [Domino REST API documentation](https://opensource.hcltechsw.com/Domino-rest-api/index.html) to determine if you need to revise these settings. The mapping of `values.yaml` settings to variables is as follows:

            - `dominoServerDomainName = SERVERSETUP_SERVER_DOMAINNAME`
            - `dominoOrgName = SERVERSETUP_ORG_ORGNAME`
            - `dominoServerName = SERVERSETUP_SERVER_NAME`
            - `dominoNetworkHostname = SERVERSETUP_NETWORK_HOSTNAME`

    1. Determine how you want to expose the Domino server to Notes clients by setting the value of the `exposeNRPC` parameter to any of the following options:

        - `do-not-expose`: Set this value to prevent exposure of TCP port 1352 to the network.
        - `HostPort`: Set this value to use TCP port 1352 on your machine for the Notes client to communicate with Domino using the Notes Remote Procedure Call (NRPC) protocol. **This is only recommended when using Rancher Desktop for Kubernetes**.

        - `NodePort`: Set this value if you want Kubernetes to allocate a random port in a specified range, by default 30000 to 32767, that's available on every worker node in the cluster. Kubernetes automatically routes traffic on this port from the Kubernetes node to the back-end Domino pod. **This is the recommended option if you want to expose NRPC to your Notes Clients when deploying into a non Rancher Desktop cluster**. See [Create a new server connection under Procedure](https://opensource.hcltechsw.com/voltmxgo-documentation/howto/connectdominofromnotes.html#procedure) for instructions on how to obtain the random port number.

        - `LoadBalancer`: Set this value if you want an external load balancer to be provisioned by a cloud provider which supports external load balancers. Traffic from the external load balancer is directed at the Domino pod, and the cloud provider decides how it is load balanced. Kubernetes typically starts off by making the changes that are equivalent to you requesting NodePort. The cloud-controller-manager component then configures the external load balancer to forward traffic to that assigned node port.

        You can read more about these options in the [Service](https://kubernetes.io/docs/concepts/services-networking/service/) topic in the Kubernetes documentation.

1. **(Optional)** If you would like to configure Ingress for Domino REST API, proceed to [Configure Kubernetes Ingress for Domino REST API](https://opensource.hcltechsw.com/voltmxgo-documentation/howto/drapiingress.html).

1. Save the file and exit.

## 2. Deploy Domino REST API

1. Deploy Domino REST API by running the following Helm install command:

    ``` bash
    helm install domino . -f values.yaml -n mxgo
    ```

    !!!note
        The images must be pulled. It might take awhile, 90 seconds or longer, for the pod to start.

1. Run the following command to wait for the Domino pod to be running and in the ready state:

    ``` bash
    kubectl get pods -o wide -w --namespace mxgo
    ```

    !!!note
        The `-w` flag tells the kubectl command to wait, and updates the output over time with any changes.

    Eventually you should see 3/3 in the READY column as shown below:

    ``` { .yaml .no-copy }
    NAME                           READY   STATUS              RESTARTS   AGE
    domino-drapi-68596f98fd-bkpdz  0/3     ContainerCreating   0          34s
    domino-drapi-68596f98fd-bkpdz  3/3     Running             0          72s
    ```

1. Once you see the READY column showing 3/3, press `Ctrl-c` to cancel the command.

- To connect to Domino server from your Notes client, see [Connect to Domino server from your Notes client](https://opensource.hcltechsw.com/voltmxgo-documentation/howto/connectdominofromnotes.html).

## Next step

Proceed to [Install MySql for Volt Foundry](installmysqlfoundry.md).
