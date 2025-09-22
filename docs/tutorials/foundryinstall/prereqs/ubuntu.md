# Ubuntu or VM

These instructions are for deploying Volt Foundry using K3s on an Ubuntu, RHEL, SLES machine, or VM

## Operating System

- RHEL9
- Ubuntu
- SLES

## Hardware

| Spec | Minimum |
| ---- | ------- |
| CPU | 4 cores |
| RAM | 16 GB |

--8<-- "k3s.md"

--8<-- "authtoken.md"

## Update hosts file

!!! tip
    Obtain your machine's IP ADDRESS as you will need it in the following step.

1. Add the hostnames that you have chosen to use in your `/etc/hosts` file together with your **IP ADDRESS** and **dns domain name**. As an example:

    ```
    10.190.252.181 drapi.mymxgo.com drapi-management.mymxgo.com foundry.mymxgo.com
    ```

    !!! note
        If you are using a Domino REST API installation on an existing server, you only need to set `foundry.mymxgo.com` hostname.
        
    !!! note
        If you will be accessing this deployment from other remote machines, you need to apply this same `/etc/hosts` file change on those machines as well.

1. Run the following command to make these name/IP address matches available within the Kubernetes:

    ``` bash
    kubectl edit configmap -n kube-system coredns
    ```

1. Locate the segment that looks like the following:

    ``` { .yaml .no-copy }
        import /etc/coredns/custom/*.server
    NodeHosts: |
        10.190.252.181 vm1.example.com
    kind: ConfigMap
    ```

1. Before the line that starts with `kind: ConfigMap`, add a new line that uses the same IP address, but adds the hostnames you have chosen to use. When done, the segment of the file looks like the following code, but with your IP address and your own hostname. The previously hard-coded values are shown in this example:

    ```{ .yaml .no-copy }
        import /etc/coredns/custom/*.server
    NodeHosts: |
        10.190.252.181 vm1.example.com
        10.190.252.181 drapi.mymxgo.com drapi-management.mymxgo.com foundry.mymxgo.com
    kind: ConfigMap
    ```

1. Save the file and exit the editor.
1. Run the following command to force the restart of the coredns pod:

    ``` bash
    kubectl delete pod -n kube-system -l k8s-app=kube-dns
    ```

## Create a temp directory for the charts

Run the following commands to create a temp directory for the charts and make it the current directory:

``` bash
mkdir ~/mxgo
cd ~/mxgo
```

## Install wget and curl into your Linux environment

If **wget** and **curl** are not alreay installed to your Linux environment, there are numerous websites containing detailed instructions on how to do so.

## Next step

If you are using a pre-existing implementation of Domino REST API, proceed to [Install MySQL for Volt Foundry](../installmysqlfoundry.md). Otherwise proceed to [Install Domino REST API](../downloadhelmchart.md).