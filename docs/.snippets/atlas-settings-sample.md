A sample atlas-settings file sould look something like this:

```json
{
    "hcl-github": {
        "type": "github",
        "token": "${env.TOKEN}"
    },
    "my-web-server": {
        "type": "webserver",
        "credentials": "${env.CRED}"
    },
    "volt-mx-marketplace": {
        "type": "marketplace",
        "username": "${env.USERNAME}",
        "password": "${env.PASSWORD}",
        "authUrl": "https://accounts.auth.demo-hclvoltmx.net/login"
    }
}
```