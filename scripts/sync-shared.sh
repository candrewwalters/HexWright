#!/bin/sh
# Copy the shared code from the editor (the master copy) into the game, which sits beside it:
#
#   <parent>/editor/   this repo (HexWright)
#   <parent>/game/     TFT_Trainer
#
# Shared folders: js/shared/ (code) and tests/shared/ (its tests). In the game they are exact
# mirrors: files removed here are removed there too. Edit shared code here, never in the game.
#
# Usage:
#   scripts/sync-shared.sh           copy editor -> game
#   scripts/sync-shared.sh --check   only report whether the game's copy matches (exit 1 if not)
#   GAME_DIR=/some/path scripts/sync-shared.sh    use a different game folder

set -e
EDITOR="$(cd "$(dirname "$0")/.." && pwd)"
GAME="${GAME_DIR:-$EDITOR/../game}"
SHARED="js/shared tests/shared"

if [ ! -d "$GAME/.git" ]; then
  echo "Game repo not found at $GAME" >&2
  exit 1
fi

status=0
for dir in $SHARED; do
  if [ "$1" = "--check" ]; then
    if diff -r "$EDITOR/$dir" "$GAME/$dir" > /dev/null 2>&1; then
      echo "in sync:      $dir"
    else
      echo "OUT OF SYNC:  $dir"
      status=1
    fi
  else
    mkdir -p "$GAME/$dir"
    rsync -a --delete --exclude '.DS_Store' "$EDITOR/$dir/" "$GAME/$dir/"
    echo "copied:       $dir"
  fi
done

[ "$1" = "--check" ] || echo "Done. Review and commit the changes in $GAME."
exit $status
