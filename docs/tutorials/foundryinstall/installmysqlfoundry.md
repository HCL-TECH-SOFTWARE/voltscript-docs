# Install MySQL for Volt Foundry

The procedure guides you in installing MySQL for Volt Foundry.

## Procedure

1. Run the following commands to create a Volt Foundry directory in the proper location, and make the Volt Foundry directory the current directory:

    ``` bash
    cd ..
    mkdir foundry
    cd foundry
    ```

1. Run the following command to make sure that the chart information for the repositories is up-to-date.

    ``` bash
    helm repo update
    ```

1. Run the following commands to install the Bitnami MySQL Helm chart to use for the Volt Foundry database storage:

    ``` bash
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install mysql bitnami/mysql --version "9.6.0" --set image.tag="8.0.32-debian-11-r17",auth.rootPassword="Password123\!",auth.createDatabase=false,auth.username=dbclient,auth.password="Password123\!" -n mxgo
    ```

    !!!note
        The command is specifying a simple password (Password123!) for the root account. You may want to change this password. If you do, make note of it, as the correct password must be specified again when you install Volt Foundry.

1. Run the following command to verify when the database is in the ready state:

    ``` bash
    kubectl get pods -o wide -w --namespace mxgo
    ```

    mysql-0 should show 1/1 in the READY column as shown in the following output example to indicate that the database is in the ready state.

    ``` { .yaml .no-copy }
    NAME                              READY   STATUS    RESTARTS   AGE
    domino-drapi-5c65d76c6c-rkfml     3/3     Running   0          11m
    mysql-0                           1/1     Running   0          45s
    ```

1. Once the database is in the ready state, press `Ctrl-c` to stop the command.

## Next step

Proceed to [Install Volt Foundry](installfoundry.md).