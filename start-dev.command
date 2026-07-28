#!/bin/zsh

set -u

PROJECT_DIR="${0:A:h}"
START_PORT="${1:-${PORT:-8000}}"

cd "$PROJECT_DIR" || {
  echo "无法进入项目目录：$PROJECT_DIR"
  read -r "?按回车键关闭窗口..."
  exit 1
}

PYTHON_BIN="$(command -v python3 2>/dev/null || true)"
if [[ -z "$PYTHON_BIN" ]]; then
  echo "未找到 Python 3，无法启动本地服务。"
  echo "请先安装 Python 3，然后重新双击此文件。"
  read -r "?按回车键关闭窗口..."
  exit 1
fi

if [[ "$START_PORT" != <-> ]] || (( START_PORT < 1 || START_PORT > 65535 )); then
  echo "端口无效：$START_PORT"
  echo "请使用 1 到 65535 之间的端口。"
  read -r "?按回车键关闭窗口..."
  exit 1
fi

MAX_PORT=$(( START_PORT + 99 ))
if (( MAX_PORT > 65535 )); then
  MAX_PORT=65535
fi

port_is_available() {
  "$PYTHON_BIN" - "$1" <<'PY'
import socket
import sys

port = int(sys.argv[1])
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    try:
        sock.bind(("127.0.0.1", port))
    except OSError:
        raise SystemExit(1)
PY
}

PORT_NUMBER="$START_PORT"
while ! port_is_available "$PORT_NUMBER"; do
  (( PORT_NUMBER += 1 ))
  if (( PORT_NUMBER > MAX_PORT )); then
    echo "端口 ${START_PORT}-${MAX_PORT} 均被占用，无法启动服务。"
    read -r "?按回车键关闭窗口..."
    exit 1
  fi
done

URL="http://127.0.0.1:${PORT_NUMBER}/"

echo
echo "多元拾光本地开发服务"
echo "项目目录：$PROJECT_DIR"
echo "访问地址：$URL"
echo
echo "浏览器即将自动打开。按 Control + C 可停止服务。"
echo

if [[ "${OPEN_BROWSER:-1}" != "0" ]]; then
  (
    sleep 0.8
    open "$URL"
  ) &
fi

exec "$PYTHON_BIN" -m http.server "$PORT_NUMBER" \
  --bind 127.0.0.1 \
  --directory "$PROJECT_DIR"
