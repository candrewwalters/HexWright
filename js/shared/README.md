# Shared code (editor ⇄ game)

Code in this folder is used by both the HexWright editor and the TFT_Trainer game, so they agree on
the grid (and, later, look the same when drawing maps).

**The master copy lives in the HexWright repo** (`editor/js/shared/`). The game's `js/shared/` is a mirror
made by `editor/scripts/sync-shared.sh`, so edit here, then run the script and commit in both repos.
Tests for this code live in `tests/shared/` and are mirrored the same way.

Rules for anything placed here:
- No dependencies on either app's globals: take what you need as arguments.
- Plain scripts (no build step); each file defines one global and also works in Node for tests.
