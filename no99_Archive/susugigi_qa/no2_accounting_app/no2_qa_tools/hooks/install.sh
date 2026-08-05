#!/bin/sh
# 把 pre-commit 裝進本 repo 的 .git/hooks/。
#
# hook 不進版控，所以每台機、每個 worktree 都要各自裝一次。
# 跨機一致性靠這支腳本進版控來保證，不靠記憶。
#
# 用法：sh no2_qa_tools/hooks/install.sh

set -e

REPO_ROOT=$(git rev-parse --show-toplevel)
# worktree 的 .git 是檔不是目錄，hooks 落在共用的 common dir。
HOOKS_DIR=$(git rev-parse --git-common-dir)/hooks
SRC=$(cd "$(dirname "$0")" && pwd)/pre-commit
DEST="$HOOKS_DIR/pre-commit"

[ -f "$SRC" ] || { echo "✗ 找不到來源 $SRC"; exit 1; }
mkdir -p "$HOOKS_DIR"

if [ -f "$DEST" ] && ! grep -q '檢驗點清單的提交閘門' "$DEST"; then
  echo "⚠ $DEST 已存在且不是本專案的版本，先備份成 pre-commit.bak"
  cp "$DEST" "$DEST.bak"
fi

cp "$SRC" "$DEST"
chmod +x "$DEST" 2>/dev/null || true

echo "✓ 已安裝 $DEST"
echo "  擋格式、斷言去重、生成物同步三項；已知漂移走債務基準放行。"
echo "  單次略過用 git commit --no-verify，並在 message 說明理由。"
