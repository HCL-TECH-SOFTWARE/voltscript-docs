# Write pre/postprocessor

Volt Foundry integration service can also be coded in VoltScript. However, only small snippets of code are expected, for example to validate input parameters or manipulate the output. As a result, VoltScript code is entered directly into the Monaco editor, and merged into boilerplate VoltScript. This handles passing the response back to Volt Foundry for subsequent processing.

![PreProcessor](../../assets/images/VSPrePostProcessor.svg){style="height:500px"}

!!! note

    VoltScript pre/postprocessors are not available for VoltScript integration services. This is a limitation for performance reasons, see [Understanding VoltScript in Volt MX Go](../../topicguides/foundry/voltscript-architecture.md#how-volt-foundry-runs-voltscript).

To understand the flow for running preprocessors and postprocessors, see [Understanding VoltScript in Volt MX Go](../../topicguides/foundry/voltscript-architecture.md#how-volt-foundry-runs-preprocessors-and-postprocessors).

# Preprocessors

The function that preprocessor code is inserted into returns a boolean, `false` to abort processing or `true` to continue processing. Volt Foundry will automatically append code to make the default action `Return True` after your code completes.

If you wish to abort processing, you should also consider setting the `opstatus` or `httpStatusCode` and adding an error message. These can be picked up by your downstream applications, that is the Iris app or other application calling the Volt Foundry REST service.

# Postprocessors

Postprocessor code is also inserted into a function, but the return value isn't used. You can set the `opstatus` or `httpStatusCode`, add an error message or populate the result JSON object.