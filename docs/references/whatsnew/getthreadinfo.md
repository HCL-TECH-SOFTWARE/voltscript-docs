---
hide:
  - toc
---
# GetThreadInfo

GetThreadInfo function is pre-existing in [LotusScript](https://help.hcltechsw.com/dom_designer/12.0.0/basic/LSAZ_GETTHREADINFO.html), but has been extended in VoltScript.

The LSI constants available with LotusScript aren't included by default, so the integer indices will be needed instead. The full table with indices, including the new options, is below:

| Index | Code (Not in VoltScript) | Meaning                 |
| ----- | ------------------------ | ----------------------- |
| 0     | LSI_THREAD_LINE          | Current line number from file |
| 1     | LSI_THREAD_PROC          | Name of current procedure |
| 2     | LSI_THREAD_MODULE        | Name of current module  |
| 3     | LSI_THREAD_VERSION       | LotusScript&reg; version number |
| 4     | LSI_THREAD_LANGUAGE      | OS (Human) language setting |
| 5     | LSI_THREAD_COUNTRY       | OS Country or region setting |
| 6     | LSI_THREAD_TICKS         | Get current clock ticks* |
| 7     | LSI_THREAD_TICKS_PER_SEC | Get clock ticks per second (supported only on platforms that support parallel processing primitives) |
| 8     | LSI_THREAD_PROCESS_ID    | Get current process ID (supported only on platforms that support parallel processing primitives) |
| 9     | LSI_THREAD_TASK_ID       | Get current task ID (supported only on platforms that support parallel processing primitives) |
| 10    | LSI_THREAD_CALLPROC      | Get the name of the calling procedure |
| 11    | LSI_THREAD_CALLMODULE    | Get the name of the calling module |
| 12    |                          | Get stack trace, comprising calling module (script file), class (or an empty string, if not in a class), calling procedure (sub/function name), and line number<br/>**Note:** Do not include `.` in your filename, because manipulation of the module name strips everything after the first `.`. |
| 13    |                          | Get platform (WIN64, LINUX64, MACARM, MACX86) |
| 14    |                          | Get current memory |
| 15    |                          | Get memory used |
| 16    |                          | Get memory available |

* On Windows this always returns 2147483647