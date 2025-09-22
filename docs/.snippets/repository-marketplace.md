### Volt MX Marketplace

VoltScript Extensions, which will typically not be open sourced, are hosted on Volt MX Marketplace. The completed zip can be uploaded to Volt MX Marketplace for approval.

After upload, you will be prompted to complete the submission form:

- the category should be "VoltScript Extensions".
- it should target the latest Volt Foundry.
- recommended practice is to make the name the VoltScript Extension name + " VoltScript Extension".
- upload an image 400 x 300 pixels, typically we have used a screenshot of a snippet of implementation code.
- add links to documentation and API docs. Documentation will include the JSON consumers need to add.
- in the checkboxes lower down, ensure it targets Volt Foundry and not Volt Iris. This ensures it does not appear as a component in Iris.
- submit.

After approval, you will be able to access the download. Hovering on the "Download" button gives a URL. The JSON you provide for the user should be:

```json
*VSENAME* {
    "library": "TITLE ON ASSET VOLT MX MARKETPLACE",
    "version": "1.0.0",
    "module": "LOWERCASE VSE NAME FOR EXAMPLE JSONVSE",
    "repository": "volt-mx-marketplace"
}
```

If in doubt, compare with the page on the Volt MX Marketplace for an existing HCL VoltScript Extension and the JSON in our documentation.