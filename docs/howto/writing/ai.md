# Using GitHub Copilot for AI assistance

!!! note
    Code actions need coding and adding to a Visual Studio Code extension. This takes time. While those are added,using an AI assistant like GitHub Copilot can fill the gap. At HCL, we've been using GitHub Copilot since spring 2024. With its knowledge of Visual Basic and LotusScript, and an awareness of files that are open, it can be an effective peer programmer.

    This "how-to" is by no means exhaustive. For full details, read the GitHub Copilot Extension documentation. This is designed to highlight some easy-to-miss gotchas and give ideas on how GitHUb Copilot might enhance your developer experience.

## Background

[GitHub Copilot extension for VS Code](https://code.visualstudio.com/docs/copilot/overview) can advise on and perform code actions on files, and also has documentation specifically for [best practices](https://code.visualstudio.com/docs/copilot/prompt-crafting). It's important to understand the different contexts. Copilot interaction can be done from:

- a Quick Chat, from the Command Center Copilot menu at the top of VS Code.
- the Chat sidebar.
- Editor Inline Chat, which can be started from the right-click menu.

The Editor Inline Chat can make amendments to the code in the editor, which you can accept or discard. So you may need to carefully consider on which line you begin the chat. Other options will just show you sample code.

By default, GitHub Copilot will "see" the contents of the file visible in the editor window. This may mean it does not see everything you want it to see. You can use `#file` to add a whole file as context.

GitHub Copilot will offer code suggestions as you type. It has not been trained on VoltScript language and its training lags behind what is available on the web. As a result APIs may not be accurate. We have found that WebVSE and JsonVSE are particularly prone to incorrect assumptions of API calls, and its initial guesses will be based on other language APIs.

We recommend being careful with your wording. GitHub Copilot can be particularly verbose with some responses. There is a max size for responses. On occasion we have found responses that exceed its limit. Re-wording the question to avoid lengthy exposition can avoid the problem.

## Some ideas of uses

### API Doc comments

GitHub Copilot can be asked to add an API Doc comment to a function. Asking GitHub Copilot to generate the whole comment may not give the best explanation and correct language syntax, depending on what else is in the document. But if you start to add the comment, it can complete JavaDoc / JSDoc syntax for `@param`, `@returns` etc.

### Format code

GitHub Copilot can be used to format code with correct indentations.

### Unreachable code

GitHub Copilot can advise on any unreachable code in a block.

Checking for unused functions is more difficult, because some libraries may not be fully utilized. However, by passing specific files and asking a targeted question, it may be possible to verify for unused functions in a specific library.

### Complexity

By passing a file, it's possible to check for code for complexity, either under [cyclomatic complexity rules](https://en.wikipedia.org/wiki/Cyclomatic_complexity) or [cognitive complexity rules](https://en.wikipedia.org/wiki/Cognitive_complexity#In_computer_science). Other complexity types may also be tested.

### Change variable names

Changing variables names in a function can also be done with gitHub Copilot. In tests, this has correctly just updated variable names, not replaced class declarations where the class name was the same as the variable name.

Updating across whole files may have differing levels of success.

### Refactor code - move to separate function

GitHub Copilot can also be used to move a chunk of code into its own function. If manually refactoring code, having the original code still available and visible might help Copilot "copy and paste" the code across.