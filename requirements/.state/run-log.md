# Business Requirements Agent — run log

One checkpoint line per step. Format:

`- [<ISO-8601 UTC minute>] run=<run_id> mode=<mode> step=<NN> status=DONE|FAILED note=<one line>`

A run whose last checkpoint is not its final step is resumed from the next step on the next invocation of the same mode.

## Checkpoints

