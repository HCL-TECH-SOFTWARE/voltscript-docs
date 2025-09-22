---
hide:
  - toc
---
# Structure your project code

There is no specific directory structure required for individual one-off scripts, and there is no format prescribed by the IDE or runtime. The best practice, encouraged by content assist in `atlas.json`, is the following format:

project/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;src/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;test/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;libs/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;vses/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;seti.ini<br/>
&nbsp;&nbsp;&nbsp;&nbsp;atlas.json<br/>

For more clarification:

| Directory/File | Description       |
| -------------- | ----------------- |
| src            | Main script(s) to run |
| test           | Unit and integration script(s) to run |
| libs           | .vss libraries containing classes, subs and functions |
| vses           | .dll or .so C/C++ extensions |
| seti.ini       | [File containing mappings for VoltScript Extensions](vses.md#setiini) |
| atlas.json     | [Configuration file of project structure and dependencies](../archipelago/atlas.md) |
