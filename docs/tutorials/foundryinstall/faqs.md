# Helm and Kubernetes FAQs

## Why does not my pod have a "Running" status?

The `kubectl describe pods NAME` command can give you more information about the status of the pod. This includes any errors, such as insufficient memory.

## Why is the host name not resolved?

Ensure you have updated the hosts file correctly. Also ensure kube-dns has been restarted, either by restarting Rancher Desktop or issuing the terminal command `kubectl delete pod -n kube-system -l k8s-app=kube-dns`.

## Why don't I see any pods running?

Pods are added to a namespace. The Volt Foundry pods were added to the **mxgo** namespace. You may be in the wrong namespace, possibly the default namespace. Run the terminal command `kubectl get pods`. It will give the message "No resources found in **NAME** namespace", where **NAME** is replaced by the current context. Run the `kubectl config set-context --current --namespace=mxgo` command to set the current namespace context correctly.