# atlas-settings.json

The `atlas-settings.json` should be in the `.vss` directory and contains a JSON object of repositories and the credentials to use. If the credentials begin with `${env` and end with `}`, VoltScript Build Manager  retrieves the value from the relevant environment variable. For example, "${env.TOKEN}" would tell the code to retrieve an environment variable called TOKEN.

Each repository element has a label, which matches what's defined in the `atlas.json`. It has a type, either "github", "webserver" or "marketplace.

!!! tip
    If this is your first time building a VoltScript project with an atlas.json on this device, you may need to run `VoltScript_Archipelago setup` or use the Visual Studio Code command "VoltScript: Run Dependency Setup" from an atlas.json to create your `.vss` directory.

## GitHub Personal Access Token

If the type is "github", it should also include "token".
Follow GitHub's documentation for creating a [GitHub Person Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). The value will begin "ghp_". This is required for API access, regardless of whether the GitHub repository is private or public.

If you are connecting to a GitHub Enterprise instance specific for your organization, check the relevant GitHub documentation. Fine-grained Personal Access Tokens may not be available, depending on version installed.

!!! tip
    The minimum permissions required are:

    | Token Type | Purpose | Access Setting |
    | ---------- | ------- | -------------- |
    | Tokens (classic) | If you need to download releases from public repos only | public_repo |
    | Tokens (classic) | If you need to download from private or public repos | repo |
    | Fine-grained tokens | If you need to download releases from public repos only | Public Repositories (read-only) |
    | Fine-grained tokens | If you need to download releases from public and private repos | Repository permissions > Contents > Access: Read-only |

## Web server credentials

If the type is "webserver" and requires authentication, it should also include "credentials", which maps to [Base64 basic auth credentials](https://en.wikipedia.org/wiki/Basic_access_authentication){: target="_blank"}. This is a Base64-encoded string of the username + ":" + password. "Basic " will be automatically prepended by Archipelago when passing the credentials.

If the web server doesn't require authentication, the credentials aren't needed or should be an empty string.

## Volt MX Marketplace credentials

If the type is "marketplace", it should include "username", "password" and "authUrl". The authUrl for the main Volt MX Marketplace is "https://accounts.auth.demo-hclvoltmx.net/login".

You will need a login for the [Volt MX Marketplace](https://marketplace.demo-hclvoltmx.com/search/voltscript%20extension){: target="_new" rel="noopener noreferrer”}. Make sure you've tested successfully logging into the web interface before using it for dependency management.

!!! note
    You will be prompted to change your password periodically. Make sure you do so, or your account will expire.

## Sample

--8<-- "atlas-settings-sample.md"

!!! tip
    There are two snippets available:

        - A complete commented sample, with two JSON objects each for "github", "webserver", and "marketplace". For each repository type, one sample shows using explicit credentials and the other shows using environment variables.
        - A minimal sample, without comments and with JSON objects for "github" and "marketplace".

    When you are comfortable with the syntax and values for the atlas-settings.json, you can use the second sample to keep your atlas-settings.json clean.