#!/bin/zsh
# ダブルクリックで開発環境（Postgres + Next.js）を起動し、
# 準備ができたら自動でブラウザを開くスクリプト。
# 使い終わったらこのウィンドウを閉じればサーバーも止まる。

PROJECT_DIR="/Users/suyamayuya/Desktop/samurai"
PORT=3000
URL="http://localhost:$PORT"

cd "$PROJECT_DIR" || { echo "プロジェクトフォルダが見つかりません: $PROJECT_DIR"; sleep 5; exit 1; }

echo "Postgresを確認しています..."
/usr/local/bin/brew services start postgresql@16 >/dev/null 2>&1

is_up() {
  [ "$(curl -s -o /dev/null -w '%{http_code}' "$URL" --max-time 2)" = "200" ]
}

if is_up; then
  echo "すでに起動しています。ブラウザを開きます。"
  open "$URL"
  echo "このウィンドウは閉じてかまいません。"
  sleep 3
  exit 0
fi

# ポートは埋まっているが応答がない（フリーズした前回のプロセスなど）場合は片付ける
EXISTING_PID=$(lsof -ti :$PORT)
if [ -n "$EXISTING_PID" ]; then
  echo "応答のない古いプロセスを終了します (PID: $EXISTING_PID)"
  kill -9 $EXISTING_PID 2>/dev/null
  sleep 1
fi

echo "開発サーバーを起動しています..."

# サーバーの起動を待ってから自動でブラウザを開く（バックグラウンドで実行）
(
  for i in $(seq 1 60); do
    if is_up; then
      open "$URL"
      break
    fi
    sleep 1
  done
) &

echo "起動したらこのウィンドウに自動でブラウザが開きます。"
echo "使い終わったらこのウィンドウを閉じるとサーバーが止まります。"
echo ""

exec npm run dev
