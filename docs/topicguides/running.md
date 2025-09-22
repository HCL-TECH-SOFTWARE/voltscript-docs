# Running VoltScript code

## VS Code Extension

VoltScript files can be run from the Visual Studio Code IDE via the extension using F5 or **VoltScript: Save & Run Script** Command Palette command. This uses the VoltScript runtime program but is intended for development-only purposes. Production code should be run via the VoltScript runtime. This could be triggered from a shell file for scheduled processing or as a process from external systems.

## Runtime

!!! note
    LotusScript runs in HCL Notes Client and HCL Domino server products, as it also used to run in many Lotus products. Those products are written in the same language as LotusScript itself.

In the case of VoltScript, there was no plan to build a C/C++ server to house a VoltScript task. The runtime is a standalone program, VoltScript, used to run a single script. Think of it like bash, which is used to run a single command-line script. There is no context where VoltScript objects can be held in memory between calls. A script starts, runs, finishes, sends a response to the user and deletes all VoltScript and C/C++ objects from its memory. The VoltScript executable is a stateless program, so any non-ephemeral data must be persisted elsewhere, e.g. in a database, a caching service like Redis, or files.

## Context

Another point worth emphasizing is that LotusScript in Notes/Domino is tightly coupled to the environment it's running in. Certain classes, for example `NotesSession`, `NotesUIWorkspace`, are automatically contributed, which load certain environment-specific properties. Specific entrypoints add more context, for example when in a document, `NotesUIWorkspace.CurrentDocument` is bound. Certain events, like QuerySave, provide the `NotesUIDocument` as a parameter, which the runtime will pre-seed, before custom code is triggered. For certain agent triggers, `NotesDatabase.selectedDocuments` is bound to a specific collection. Such context needs to be contributed by the environment triggering the VoltScript runtime, not by the runtime itself. The VoltScript runtime should just manage _receiving_ such input.

For more information on methods to handle VoltScript inputs, see [Managing Input Parameters](../howto/extensions/input.md)

## Compiled vs Interpreted

VoltScript, like LotusScript, is a [compiled language](https://en.wikipedia.org/wiki/Compiled_language). The `.vss` file that you write gets compiled at runtime for VoltScript to run and use. On the whole this compiled layer is hidden from developers, but it's important to bear in mind. This is the reason dependencies need to be available in the expected locations in all environments.

## Deployed Code

The intention is that entrypoint code and dependencies, along with configuration files, will be deployed as a self-contained directory. This will include the full directory structure of the project including:

- Entrypoint file in the source directory defined in `atlas.json`.
- VoltScript library modules in the libs directory defined in `atlas.json`.
- VoltScript extensions in the `vses` directory defined in the `atlas.json`.
- seti.ini, if VoltScript extensions are in use.
- `atlas.json` for support purposes to identify versions in use.

The expected process for running the code is `VoltScript --seti PATH_TO_SETI entryScript.vss`.