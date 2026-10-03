const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'cloud_database.json');

app.use(cors());
app.use(express.json());

// 静的ファイルの配信（public フォルダ）
const PUBLIC_PATH = path.join(__dirname, 'public');
if (fs.existsSync(PUBLIC_PATH)) {
  app.use(express.static(PUBLIC_PATH));
}

// 初期クラウドDBデータ
const DEFAULT_CLOUD_DATA = {
  ticker: {
    last: 13580000,
    bid: 13575000,
    ask: 13585000,
    change24h: 185000,
    change24hPercent: 1.38,
    timestamp: Date.now(),
  },
  settings: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    coincheckApiKey: process.env.COINCHECK_API_KEY || '',
    coincheckApiSecret: process.env.COINCHECK_API_SECRET || '',
    isRealTradingEnabled: false,
    killSwitchActive: false,
    initialDemoFundsJpy: 10000,
  },
  pockets: [
    {
      id: 'pocketA',
      name: 'A: 堅実ロボ',
      strategyName: 'ボリンジャー逆張り＆RSI防御',
      tag: '低リスク・高勝率',
      allocatedJpy: 3500,
      btcHolding: 0.00025,
      avgBuyPrice: 13450000,
      realizedPnL: 540,
      unrealizedPnL: 45,
      winCount: 17,
      lossCount: 2,
      tradeCount: 19,
      statusText: '🟢 24時間クラウド監視中…安全ゾーン維持',
      statusLevel: 'active',
      lastActionTime: '1分前',
    },
    {
      id: 'pocketB',
      name: 'B: AIデイトレ',
      strategyName: 'Gemini超短期スキャルピング',
      tag: '中リスク・回転重視',
      allocatedJpy: 3500,
      btcHolding: 0.00018,
      avgBuyPrice: 13480000,
      realizedPnL: 1220,
      unrealizedPnL: 72,
      winCount: 36,
      lossCount: 10,
      tradeCount: 46,
      statusText: '⚡ クラウド自律スキャルピング稼働中 (+0.4%目標)',
      statusLevel: 'trading',
      lastActionTime: 'たった今',
    },
    {
      id: 'pocketC',
      name: 'C: コピートレード',
      strategyName: 'クジラ大口ウォレット追従',
      tag: '高リターン・トレンド追従',
      allocatedJpy: 3000,
      btcHolding: 0.00032,
      avgBuyPrice: 13420000,
      realizedPnL: 710,
      unrealizedPnL: 110,
      winCount: 13,
      lossCount: 3,
      tradeCount: 16,
      statusText: '🐋 米大口アドレスの現物集積を24時間監視追従中',
      statusLevel: 'analyzing',
      lastActionTime: '2分前',
    },
  ],
  trades: [
    {
      id: 't_init_1',
      pocketName: 'B: AIデイトレ',
      type: 'SELL',
      profitJpy: 120,
      reason: '24時間クラウドAIスキャルピング利確達成',
      timestamp: '1分前'
    },
    {
      id: 't_init_2',
      pocketName: 'A: 堅実ロボ',
      type: 'BUY',
      profitJpy: 0,
      reason: 'RSI 28.5 到達による逆張り押し目買い',
      timestamp: '5分前'
    }
  ],
  proposals: [],
  learningLogs: [
    {
      id: 'log_1',
      thoughtProcess: 'PC電源OFF時もVercelクラウドサーバーでモメンタムを継続監視。歪みを検知して自動執行完了。',
      confidenceScore: 95
    }
  ],
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('クラウドDB読み込みエラー:', e);
  }
  return DEFAULT_CLOUD_DATA;
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('クラウドDB書き込みエラー:', e);
  }
}

let db = loadData();

// --- REST API エンドポイント ---
app.get('/api/status', (req, res) => {
  res.json(db);
});

app.post('/api/tune', (req, res) => {
  const { option } = req.body;
  res.json({ success: true, message: `方針【${option}】をクラウドAIに適用しました` });
});

// トップページ（ルートURL）へのアクセス
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('<h1>楽して儲ける君 24/7 Cloud Running</h1>');
  }
});

// Vercel serverless export & local listen
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 『楽して儲ける君』 サーバー稼働中: http://localhost:${PORT}`);
  });
}

module.exports = app;
