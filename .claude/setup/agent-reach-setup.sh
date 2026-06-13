#!/bin/bash
# Agent-Reach 环境恢复脚本
# 用法: source .claude/setup/agent-reach-setup.sh
# 在新机器上克隆仓后运行此脚本即可恢复配置

set -e

echo "=== Agent-Reach 环境恢复 ==="

# 1. 安装 Agent-Reach
if ! pip show agent-reach &>/dev/null; then
    echo "[1/4] 安装 Agent-Reach..."
    pip install https://github.com/Panniantong/agent-reach/archive/main.zip
else
    echo "[1/4] Agent-Reach 已安装，跳过"
fi

# 2. 确保目录存在
AGENT_DIR="$HOME/.agent-reach"
TOOLS_DIR="$AGENT_DIR/tools/xiaoyuzhou"
mkdir -p "$TOOLS_DIR"

# 3. 从 .env.cookies 恢复凭据（如存在）
ENV_FILE="$(dirname "$0")/.env.cookies"
if [ -f "$ENV_FILE" ]; then
    echo "[2/4] 从 $ENV_FILE 恢复凭据..."
    source "$ENV_FILE"

    # 写入 agent-reach config
    cat > "$AGENT_DIR/config.yaml" << YAMLEOF
groq_api_key: ${GROQ_API_KEY}
twitter_auth_token: ${TWITTER_AUTH_TOKEN}
twitter_ct0: ${TWITTER_CT0}
YAMLEOF
    chmod 600 "$AGENT_DIR/config.yaml"
    echo "       -> 已写入 $AGENT_DIR/config.yaml"
else
    echo "[2/4] ⚠️ .env.cookies 不存在，请手动创建（参考 .env.cookies.example）"
fi

# 4. 安装 mcporter（Exa 搜索）
if ! which mcporter &>/dev/null; then
    echo "[3/4] 安装 mcporter..."
    pip install mcporter
else
    echo "[3/4] mcporter 已安装，跳过"
fi

# 5. 验证
echo "[4/4] 验证安装..."
python3 -c "import agent_reach; print(f'Agent-Reach v{agent_reach.__version__}')" 2>/dev/null || echo "       ⚠️ agent_reach 导入失败，请检查安装"

echo ""
echo "=== 恢复完成 ==="
echo "运行 agent-reach doctor 检查各平台状态："
echo "  source .claude/setup/agent-reach-setup.sh"
echo "  agent-reach doctor --json"
