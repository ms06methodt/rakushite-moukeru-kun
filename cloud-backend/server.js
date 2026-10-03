const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Coincheck 全取扱主要銘柄マスター
const COIN_MASTER = [
  { id: 'BTC', name: 'ビットコイン', symbol: 'BTC/JPY', price: 13580000, change: 1.38, alloc: 40, color: '#F7931A' },
  { id: 'ETH', name: 'イーサリアム', symbol: 'ETH/JPY', price: 412000, change: 2.15, alloc: 25, color: '#627EEA' },
  { id: 'XRP', name: 'リップル', symbol: 'XRP/JPY', price: 92.4, change: 4.82, alloc: 15, color: '#23292F' },
  { id: 'SOL', name: 'ソラナ', symbol: 'SOL/JPY', price: 23800, change: 3.40, alloc: 10, color: '#14F195' },
  { id: 'DOGE', name: 'ドージコイン', symbol: 'DOGE/JPY', price: 24.8, change: 6.20, alloc: 5, color: '#C2A633' },
  { id: 'SHIB', name: 'シバイヌ', symbol: 'SHIB/JPY', price: 0.0031, change: -1.20, alloc: 2, color: '#FFA409' },
  { id: 'AVAX', name: 'アバランチ', symbol: 'AVAX/JPY', price: 4680, change: 1.85, alloc: 1, color: '#E84142' },
  { id: 'LINK', name: 'チェーンリンク', symbol: 'LINK/JPY', price: 2150, change: 2.90, alloc: 1, color: '#375BD2' },
  { id: 'MATIC', name: 'ポリゴン', symbol: 'POL/JPY', price: 78.5, change: 0.85, alloc: 1, color: '#8247E5' },
  { id: 'BCH', name: 'ビットコインキャッシュ', symbol: 'BCH/JPY', price: 54200, change: 1.10, alloc: 0, color: '#0AC18E' },
  { id: 'LTC', name: 'ライトコイン', symbol: 'LTC/JPY', price: 10400, change: 0.65, alloc: 0, color: '#345D9D' },
  { id: 'SAND', name: 'サンドボックス', symbol: 'SAND/JPY', price: 48.2, change: -0.45, alloc: 0, color: '#0084FF' },
  { id: 'CHZ', name: 'チリーズ', symbol: 'CHZ/JPY', price: 11.2, change: 3.10, alloc: 0, color: '#CD0124' },
  { id: 'XLM', name: 'ステラルーメン', symbol: 'XLM/JPY', price: 16.4, change: 0.95, alloc: 0, color: '#14B6EB' },
  { id: 'ETC', name: 'イーサリアムクラシック', symbol: 'ETC/JPY', price: 3280, change: 1.40, alloc: 0, color: '#328332' },
  { id: 'IOST', name: 'アイオーエスティ', symbol: 'IOST/JPY', price: 0.98, change: 5.40, alloc: 0, color: '#1C1C1C' }
];

let selectedCoinId = 'ALL';

let db = {
  coins: COIN_MASTER,
  selectedCoinId: 'ALL',
  totalFundValueJpy: 102697, // 元本10万円 + 利益2697円
  totalProfitJpy: 2697,
  todayProfitJpy: 2158,
  winRate: 82.4,
  totalTrades: 89,
  pockets: [
    {
      id: 'pocketA',
      name: 'A: 堅実ロボ',
      strategyName: '全銘柄ボリンジャー逆張り＆RSI防御',
      tag: '低リスク・全銘柄監視',
      realizedPnL: 820,
      unrealizedPnL: 65,
      winCount: 22,
      tradeCount: 24,
      statusText: '🟢 BTC/ETH/SOLの押し目安全買い増し待機中',
    },
    {
      id: 'pocketB',
      name: 'B: AIデイトレ',
      strategyName: 'Geminiマルチ暗号資産スキャルピング',
      tag: '高回転・ボラティリティ狩り',
      realizedPnL: 1480,
      unrealizedPnL: 92,
      winCount: 48,
      tradeCount: 58,
      statusText: '⚡ XRP(+4.8%) & DOGE(+6.2%)の急騰波を秒速利確',
    },
    {
      id: 'pocketC',
      name: 'C: コピートレード',
      strategyName: 'クジラ大口オンチェーンマルチ追従',
      tag: 'アルトコイン爆発トレンド追従',
      realizedPnL: 940,
      unrealizedPnL: 140,
      winCount: 16,
      tradeCount: 19,
      statusText: '🐋 SOL大口ウォレット(3.5万SOL)のステーキング買い増し追従中',
    },
  ],
  trades: [
    {
      id: 't1',
      coin: 'DOGE',
      type: 'SELL',
      profitJpy: 240,
      reason: 'DOGE急騰モメンタム検知 (+6.2%) AI秒速利確',
      timestamp: 'たった今'
    },
    {
      id: 't2',
      coin: 'XRP',
      type: 'SELL',
      profitJpy: 180,
      reason: 'XRP 国際送金ニュース連動・押し目からの反発利確',
      timestamp: '2分前'
    },
    {
      id: 't3',
      coin: 'SOL',
      type: 'BUY',
      profitJpy: 0,
      reason: 'SOL DeFi TVL急増オンチェーンシグナル感知買い',
      timestamp: '6分前'
    },
    {
      id: 't4',
      coin: 'BTC',
      type: 'SELL',
      profitJpy: 140,
      reason: 'BTC レジスタンスブレイク追従利確',
      timestamp: '15分前'
    }
  ]
};

app.get('/api/status', (req, res) => {
  res.json(db);
});

app.post('/api/tune', (req, res) => {
  const { option } = req.body;
  res.json({ success: true, message: `マルチ暗号資産AI方針【${option}】を適用しました` });
});

app.post('/api/rebalance', (req, res) => {
  const { allocations } = req.body;
  if (allocations) {
    db.coins.forEach(c => {
      if (allocations[c.id] !== undefined) {
        c.alloc = allocations[c.id];
      }
    });
  }
  res.json({ success: true, message: 'ポートフォリオ配分比率を更新いたしました！' });
});

// 完全一体型マルチ暗号資産サイバーUI
const MULTI_COIN_CYBER_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>楽して儲ける君 - Coincheck全銘柄対応 AIマルチクリプトファンド</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: #010409; color: #E2F0FF; display: flex; justify-content: center; min-height: 100vh; }
    .app-container { width: 100%; max-width: 520px; background-color: #030711; border-left: 1px solid rgba(0,240,255,0.15); border-right: 1px solid rgba(0,240,255,0.15); display: flex; flex-direction: column; min-height: 100vh; position: relative; }
    
    /* Header */
    .header { background: #050B14; border-bottom: 1px solid rgba(0,240,255,0.2); padding: 10px 14px; }
    .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .title-cyber { color: #00FF66; font-size: 19px; font-weight: 900; letter-spacing: 1px; text-shadow: 0 0 10px rgba(0,255,102,0.6); }
    .title-sub { color: #00F0FF; font-size: 8px; font-weight: 700; letter-spacing: 1.5px; opacity: 0.85; }
    .header-actions { display: flex; gap: 6px; }
    .header-btn { background: #0F1E36; border: 1px solid rgba(0,240,255,0.3); color: #E2F1FF; font-size: 11px; font-weight: 700; padding: 5px 8px; border-radius: 6px; cursor: pointer; }
    
    /* Coin Selector Ribbon (Plan 1: ワンタップ銘柄切り替え) */
    .coin-ribbon { display: flex; gap: 6px; overflow-x: auto; padding: 6px 14px; background: #040913; border-bottom: 1px solid rgba(0,240,255,0.15); scrollbar-width: none; }
    .coin-ribbon::-webkit-scrollbar { display: none; }
    .coin-tab { flex-shrink: 0; background: #091526; border: 1px solid #162C4A; border-radius: 8px; padding: 5px 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; transition: all 0.2s; }
    .coin-tab.active { background: rgba(0,255,102,0.15); border-color: #00FF66; box-shadow: 0 0 10px rgba(0,255,102,0.3); }
    .coin-tab-name { font-size: 11px; font-weight: 800; color: #FFF; display: flex; align-items: center; gap: 4px; }
    .coin-tab-price { font-size: 9px; font-family: monospace; color: #A0B4CC; }
    .coin-tab-chg { font-size: 8px; font-weight: 700; }
    .chg-up { color: #00FF66; }
    .chg-down { color: #FF3366; }

    /* Main Scroll */
    .main-scroll { flex: 1; overflow-y: auto; padding: 12px 14px 85px 14px; }
    
    /* Giant Neon Card */
    .neon-card { background: #070E1B; border-radius: 16px; padding: 16px; border: 1.5px solid rgba(0,240,255,0.3); box-shadow: 0 4px 20px rgba(0,240,255,0.15); text-align: center; margin-bottom: 12px; }
    .badge-autofund { display: inline-block; background: rgba(0,240,255,0.1); color: #00F0FF; font-size: 9px; font-weight: 800; letter-spacing: 2px; padding: 3px 8px; border-radius: 4px; margin-bottom: 4px; }
    .pnl-label { color: #A0B4CC; font-size: 12px; font-weight: 700; margin-bottom: 4px; }
    .giant-neon-profit { font-size: 38px; font-weight: 900; font-family: monospace; color: #00FF66; text-shadow: 0 0 16px rgba(0,255,102,0.8); margin: 4px 0 10px 0; }
    .metrics-row { display: flex; justify-content: space-around; background: #040811; padding: 8px; border-radius: 10px; border: 1px solid rgba(0,240,255,0.1); }
    .metric-item { display: flex; flex-direction: column; align-items: center; }
    .metric-lbl { color: #657B96; font-size: 9px; margin-bottom: 2px; }
    .metric-v { font-size: 12px; font-weight: 800; font-family: monospace; color: #00FF66; }

    /* Plan 2: Portfolio Visualizer Bar */
    .portfolio-box { background: #081222; border-radius: 12px; padding: 12px; border: 1px solid #182C4A; margin-bottom: 12px; }
    .portfolio-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .portfolio-title { font-size: 12px; font-weight: 800; color: #00F0FF; }
    .portfolio-btn { background: #00FF6622; border: 1px solid #00FF66; color: #00FF66; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; cursor: pointer; }
    .alloc-bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 8px; }
    .alloc-seg { height: 100%; transition: width 0.3s; }
    .alloc-legend { display: flex; flex-wrap: wrap; gap: 8px; font-size: 10px; color: #C6DCF5; }
    .legend-item { display: flex; align-items: center; gap: 4px; }
    .legend-dot { width: 6px; height: 6px; border-radius: 3px; }

    /* Pockets */
    .section-title { font-size: 12px; font-weight: 800; color: #E0F0FF; margin: 10px 0 6px 0; display: flex; justify-content: space-between; }
    .pockets-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
    .pocket-card { background: #081120; border-radius: 12px; padding: 10px 12px; border: 1px solid #182C4A; border-left: 4px solid #00F0FF; }
    .pocket-card.b { border-left-color: #00FF66; }
    .pocket-card.c { border-left-color: #BF5AF2; }
    .pocket-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .pocket-name { font-size: 13px; font-weight: 800; color: #FFF; }
    .pocket-profit { font-size: 12px; font-weight: 900; font-family: monospace; color: #00FF66; }
    .pocket-desc { font-size: 10px; color: #7F96B2; margin-bottom: 6px; }
    .pocket-status { background: #040913; border-radius: 6px; padding: 6px 8px; display: flex; align-items: center; gap: 6px; font-size: 11px; font-family: monospace; color: #C6DCF5; border: 1px solid rgba(0,240,255,0.15); }

    /* Trades */
    .trades-list { display: flex; flex-direction: column; gap: 6px; }
    .trade-row { background: #070F1E; border-radius: 8px; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #13243B; font-size: 11px; }
    .trade-buy { background: rgba(0,240,255,0.15); color: #00F0FF; padding: 2px 6px; border-radius: 4px; font-weight: 800; }
    .trade-sell { background: rgba(0,255,102,0.15); color: #00FF66; padding: 2px 6px; border-radius: 4px; font-weight: 800; }

    /* Bottom Quick Bar */
    .quick-bar { position: absolute; bottom: 0; left: 0; right: 0; background: #050C18; border-top: 1px solid rgba(0,240,255,0.2); padding: 8px 12px; z-index: 10; }
    .quick-hdr { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #7B93B2; margin-bottom: 5px; }
    .quick-hdr a { color: #00F0FF; text-decoration: none; cursor: pointer; }
    .quick-btns { display: flex; gap: 6px; }
    .q-btn { flex: 1; padding: 8px 4px; border-radius: 8px; font-size: 10px; font-weight: 800; text-align: center; border: 1.2px solid; cursor: pointer; color: #FFF; }
    .q-btn.g { background: rgba(0,255,102,0.1); border-color: rgba(0,255,102,0.4); }
    .q-btn.c { background: rgba(0,240,255,0.1); border-color: rgba(0,240,255,0.4); }
    .q-btn.p { background: rgba(191,90,242,0.1); border-color: rgba(191,90,242,0.4); }

    /* Modals */
    .modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 100; justify-content: center; align-items: center; padding: 14px; }
    .modal.active { display: flex; }
    .modal-box { background: #07101E; border-radius: 16px; width: 100%; max-width: 480px; max-height: 85vh; border: 1.5px solid #00FF66; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 0 25px rgba(0,255,102,0.3); }
    .modal-hdr { background: #091526; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #122540; }
    .modal-title { color: #00FF66; font-size: 14px; font-weight: 800; }
    .modal-close { background: #162842; color: #A0B8D4; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; }
    .modal-body { padding: 14px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 10px; }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Header -->
    <div class="header">
      <div class="header-top">
        <div>
          <div class="title-cyber">楽して儲ける君</div>
          <div class="title-sub">COINCHECK 全16銘柄 AIマルチファンド</div>
        </div>
        <div class="header-actions">
          <button class="header-btn" onclick="openPortfolioModal()">📊 配分設定</button>
          <button class="header-btn" onclick="openBrain()">🧠 脳内ログ</button>
          <button class="header-btn" onclick="openChat()">💬 執事対話</button>
        </div>
      </div>
    </div>

    <!-- Plan 1: ワンタップ銘柄切り替えリボン (Coin Ribbon) -->
    <div class="coin-ribbon" id="coinRibbon">
      <!-- Generated via JS -->
    </div>

    <!-- Main Scroll -->
    <div class="main-scroll">
      <!-- Giant Neon Profit Card -->
      <div class="neon-card">
        <div class="badge-autofund" id="cardScopeBadge">PORTFOLIO TOTAL PROFIT</div>
        <div class="pnl-label" id="cardScopeLabel">全16銘柄トータル利益</div>
        <div class="giant-neon-profit" id="totalProfit">+¥3,240</div>
        <div class="metrics-row">
          <div class="metric-item">
            <span class="metric-lbl">本日の利益</span>
            <span class="metric-v" id="todayProfit">+¥2,580</span>
          </div>
          <div class="metric-item">
            <span class="metric-lbl">ファンド勝率</span>
            <span class="metric-v" id="winRate">82.4%</span>
          </div>
          <div class="metric-item">
            <span class="metric-lbl">マルチ取引数</span>
            <span class="metric-v" id="totalTrades">89回</span>
          </div>
        </div>
      </div>

      <!-- Plan 2: マルチ暗号資産ポートフォリオ配分バー -->
      <div class="portfolio-box">
        <div class="portfolio-hdr">
          <span class="portfolio-title">🪙 AIマルチ暗号資産ポートフォリオ配分</span>
          <button class="portfolio-btn" onclick="openPortfolioModal()">AI自動リバランス ⚡</button>
        </div>
        <div class="alloc-bar" id="allocBar"></div>
        <div class="alloc-legend" id="allocLegend"></div>
      </div>

      <!-- 3 Pockets -->
      <div class="section-title">
        <span>3大自律AIポケット稼働状況</span>
        <span style="color:#00F0FF;font-size:9px;">MULTI-COIN 24H</span>
      </div>
      <div class="pockets-list" id="pocketsList"></div>

      <!-- Live Execution Ticker -->
      <div class="section-title">
        <span>⚡ 全銘柄リアルタイム執行速報</span>
        <span style="color:#657B96;font-size:9px;">ALL COIN TICKER</span>
      </div>
      <div class="trades-list" id="tradesList"></div>
    </div>

    <!-- Bottom Quick Bar -->
    <div class="quick-bar">
      <div class="quick-hdr">
        <span>🤖 AI執事へのクイック指示</span>
        <a onclick="openChat()">執事と会話 💬</a>
      </div>
      <div class="quick-btns">
        <div class="q-btn g" onclick="quickAsk('recent5min')">⚡ 直近5分の利益は？</div>
        <div class="q-btn c" onclick="quickAsk('todayTotal')">💰 今日のトータルは？</div>
        <div class="q-btn p" onclick="quickAsk('marketSummary')">🔮 今の相場を一言で</div>
      </div>
    </div>
  </div>

  <!-- Portfolio Modal (Plan 2) -->
  <div class="modal" id="portfolioModal">
    <div class="modal-box">
      <div class="modal-hdr">
        <span class="modal-title">📊 マルチ暗号資産ポートフォリオ配分調整</span>
        <button class="modal-close" onclick="closeModal('portfolioModal')">✕ 閉じる</button>
      </div>
      <div class="modal-body">
        <div style="background:#00FF6615;border:1px solid #00FF6644;border-radius:8px;padding:8px;font-size:11px;color:#A2FFCE;">
          💡 Coincheck取扱いの全16銘柄を網羅！AIが相場のボラティリティに応じて自動で最適な比率に調整（リバランス）します。
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="applyPreset('ai')" style="flex:1;background:#00FF66;color:#021406;padding:8px;border-radius:6px;font-weight:bold;cursor:pointer;border:none;">🤖 AI推奨バランス</button>
          <button onclick="applyPreset('btc_heavy')" style="flex:1;background:#0F2442;border:1px solid #00F0FF;color:#00F0FF;padding:8px;border-radius:6px;font-weight:bold;cursor:pointer;">👑 BTCガチホ重視</button>
          <button onclick="applyPreset('alt_explosive')" style="flex:1;background:#2A1438;border:1px solid #BF5AF2;color:#DF9BFF;padding:8px;border-radius:6px;font-weight:bold;cursor:pointer;">🚀 アルト爆発重視</button>
        </div>
        <div id="coinAllocSliders" style="display:flex;flex-direction:column;gap:8px;margin-top:6px;"></div>
      </div>
    </div>
  </div>

  <!-- Brain Modal -->
  <div class="modal" id="brainModal">
    <div class="modal-box">
      <div class="modal-hdr">
        <span class="modal-title">🧠 AI脳内ログ ＆ 全銘柄2択育成</span>
        <button class="modal-close" onclick="closeModal('brainModal')">✕ 閉じる</button>
      </div>
      <div class="modal-body">
        <div class="proposal-card">
          <div style="color:#00F0FF;font-weight:bold;font-size:11px;">B: AIデイトレからの全銘柄改善提案</div>
          <div style="color:#FFF;font-size:12px;font-weight:bold;margin:2px 0;">アルトコイン急騰時の利確感度チューニング</div>
          <div style="color:#A0B8D4;font-size:11px;margin:4px 0 8px 0;">XRPやDOGEの急騰時、+5%で利確するか、+15%まで引っ張るかのご指示を仰ぎたく存じます。</div>
          <div class="prop-option a" onclick="applyTuning('A')">【A】電光石火（+5%で確実に利確・勝率最優先）</div>
          <div class="prop-option b" onclick="applyTuning('B')">【B】爆益追従（+15%超の爆発トレンドまでホールド）</div>
          <div id="tuningStatus"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Chat Modal -->
  <div class="modal" id="chatModal">
    <div class="modal-box">
      <div class="modal-hdr">
        <span class="modal-title">🤵‍♂️ 専属AI執事『楽して儲ける君』</span>
        <button class="modal-close" onclick="closeModal('chatModal')">✕ 閉じる</button>
      </div>
      <div class="modal-body" id="chatMessages" style="height:320px;"></div>
      <div style="padding:10px;background:#060D1A;border-top:1px solid #122540;display:flex;gap:6px;">
        <input type="text" id="chatInput" placeholder="執事へ指示（例: リップルの状況は？）" style="flex:1;background:#0E1B2E;border:1px solid #1F3758;border-radius:6px;padding:8px 10px;color:#FFF;font-size:12px;" />
        <button onclick="sendChatMessage()" style="background:#00FF66;color:#031208;border:none;padding:8px 14px;border-radius:6px;font-weight:bold;cursor:pointer;">送信</button>
      </div>
    </div>
  </div>

  <script>
    let fundData = null;
    let selectedCoin = 'ALL';
    let chatHistory = [
      { sender: 'butler', text: 'ご主人様、Coincheck取扱い全16銘柄のマルチ暗号資産ファンドへようこそ！ビットコインだけでなく、イーサリアムやリップル、ソラナ、ドージコインなども24時間全自動でリスク分散しながら利益を最大化しております。' }
    ];

    async function fetchStatus() {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          fundData = await res.json();
          renderDashboard();
        }
      } catch (e) {}
    }

    function selectCoin(coinId) {
      selectedCoin = coinId;
      renderDashboard();
    }

    function renderDashboard() {
      if (!fundData) return;

      // Render Ribbon
      const ribbon = document.getElementById('coinRibbon');
      let ribbonHtml = \`
        <div class="coin-tab \${selectedCoin==='ALL'?'active':''}" onclick="selectCoin('ALL')">
          <div class="coin-tab-name">🌐 全銘柄</div>
          <div class="coin-tab-price">ファンド全体</div>
          <div class="coin-tab-chg chg-up">+3.24%</div>
        </div>
      \`;

      fundData.coins.forEach(c => {
        const isAct = selectedCoin === c.id;
        const chgCls = c.change >= 0 ? 'chg-up' : 'chg-down';
        const chgSign = c.change >= 0 ? '+' : '';
        const priceFmt = c.price < 1 ? c.price.toFixed(4) : c.price < 100 ? c.price.toFixed(1) : c.price.toLocaleString();
        ribbonHtml += \`
          <div class="coin-tab \${isAct?'active':''}" onclick="selectCoin('\${c.id}')">
            <div class="coin-tab-name" style="color:\${c.color}">● \${c.id}</div>
            <div class="coin-tab-price">¥\${priceFmt}</div>
            <div class="coin-tab-chg \${chgCls}">\${chgSign}\${c.change}%</div>
          </div>
        \`;
      });
      ribbon.innerHTML = ribbonHtml;

      // Scope labels
      const targetCoin = fundData.coins.find(c => c.id === selectedCoin);
      if (selectedCoin === 'ALL') {
        document.getElementById('cardScopeBadge').innerText = 'PORTFOLIO TOTAL PROFIT';
        document.getElementById('cardScopeLabel').innerText = '全16銘柄トータル利益';
        document.getElementById('totalProfit').innerText = '+¥3,240';
      } else {
        document.getElementById('cardScopeBadge').innerText = targetCoin.id + ' AUTONOMOUS FUND';
        document.getElementById('cardScopeLabel').innerText = targetCoin.name + ' (' + targetCoin.id + ') 運用利益';
        document.getElementById('totalProfit').innerText = '+¥' + Math.round(3240 * (targetCoin.alloc / 100 + 0.2)).toLocaleString();
      }

      // Portfolio Bar
      const allocBar = document.getElementById('allocBar');
      const allocLegend = document.getElementById('allocLegend');
      allocBar.innerHTML = fundData.coins.filter(c => c.alloc > 0).map(c => \`
        <div class="alloc-seg" style="width:\${c.alloc}%;background:\${c.color};" title="\${c.id}: \${c.alloc}%"></div>
      \`).join('');

      allocLegend.innerHTML = fundData.coins.filter(c => c.alloc > 0).map(c => \`
        <div class="legend-item">
          <div class="legend-dot" style="background:\${c.color};"></div>
          <span>\${c.id} \${c.alloc}%</span>
        </div>
      \`).join('');

      // Pockets
      document.getElementById('pocketsList').innerHTML = fundData.pockets.map(p => {
        const pnl = p.realizedPnL + p.unrealizedPnL;
        const cls = p.id === 'pocketB' ? 'b' : p.id === 'pocketC' ? 'c' : '';
        return \`
          <div class="pocket-card \${cls}">
            <div class="pocket-hdr">
              <span class="pocket-name">\${p.name}</span>
              <span class="pocket-profit">+¥\${pnl.toLocaleString()}</span>
            </div>
            <div class="pocket-desc">戦略: \${p.strategyName}</div>
            <div class="pocket-status">
              <span style="color:#00FF66;">●</span>
              <span>\${p.statusText}</span>
            </div>
          </div>
        \`;
      }).join('');

      // Trades (Filter by selected coin if not ALL)
      const filteredTrades = selectedCoin === 'ALL'
        ? fundData.trades
        : fundData.trades.filter(t => t.coin === selectedCoin);

      document.getElementById('tradesList').innerHTML = (filteredTrades.length > 0 ? filteredTrades : fundData.trades).slice(0, 5).map(tr => \`
        <div class="trade-row">
          <span class="\${tr.type === 'BUY' ? 'trade-buy' : 'trade-sell'}">\${tr.type === 'BUY' ? '買付' : '売却'}</span>
          <span style="color:#FFF;font-weight:bold;">[\${tr.coin || 'BTC'}] \${tr.pocketName || ''}</span>
          <span style="color:#7F96B2;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">\${tr.reason}</span>
          <span style="color:#00FF66;font-family:monospace;font-weight:bold;">+¥\${tr.profitJpy || 80}</span>
        </div>
      \`).join('');
    }

    function openPortfolioModal() {
      document.getElementById('portfolioModal').classList.add('active');
      renderAllocSliders();
    }

    function renderAllocSliders() {
      const container = document.getElementById('coinAllocSliders');
      container.innerHTML = fundData.coins.map(c => \`
        <div style="background:#091424;border-radius:8px;padding:8px;border:1px solid #162C4A;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <span style="color:\${c.color};font-weight:bold;">● \${c.id}</span>
            <span style="color:#7F96B2;font-size:11px;margin-left:4px;">\${c.name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="range" min="0" max="60" value="\${c.alloc}" onchange="updateAlloc('\${c.id}', this.value)" style="width:100px;" />
            <span style="font-family:monospace;font-weight:bold;color:#00FF66;width:35px;text-align:right;">\${c.alloc}%</span>
          </div>
        </div>
      \`).join('');
    }

    function updateAlloc(coinId, val) {
      const target = fundData.coins.find(c => c.id === coinId);
      if (target) {
        target.alloc = parseInt(val);
        renderDashboard();
        renderAllocSliders();
      }
    }

    function applyPreset(preset) {
      if (preset === 'ai') {
        fundData.coins.forEach(c => {
          c.alloc = c.id === 'BTC' ? 40 : c.id === 'ETH' ? 25 : c.id === 'XRP' ? 15 : c.id === 'SOL' ? 10 : c.id === 'DOGE' ? 5 : c.id === 'SHIB' ? 2 : 1;
        });
      } else if (preset === 'btc_heavy') {
        fundData.coins.forEach(c => {
          c.alloc = c.id === 'BTC' ? 70 : c.id === 'ETH' ? 20 : c.id === 'SOL' ? 10 : 0;
        });
      } else if (preset === 'alt_explosive') {
        fundData.coins.forEach(c => {
          c.alloc = c.id === 'XRP' ? 30 : c.id === 'DOGE' ? 25 : c.id === 'SOL' ? 20 : c.id === 'SHIB' ? 15 : c.id === 'BTC' ? 10 : 0;
        });
      }
      renderDashboard();
      renderAllocSliders();
    }

    function quickAsk(type) {
      let reply = '';
      if (type === 'recent5min') {
        reply = 'ご主人様、直近5分間は【DOGE (+6.2%)】と【XRP (+4.8%)】のボラティリティをAIデイトレが掴み、合わせて+¥420の利ざやを掠め取りました！';
      } else if (type === 'todayTotal') {
        reply = 'ご主人様、全16銘柄マルチファンドの本日利益は【+¥2,580】（累計: +¥3,240）となっております！アルトコインの急騰が大きく寄与しております。';
      } else {
        reply = 'ご主人様、現在の暗号資産市場は『アルトコイン循環物色の活況相場』でございます。BTCの安定に伴い、XRP・SOL・DOGEへの資金流入が加速しております！';
      }
      chatHistory.push({ sender: 'butler', text: reply });
      openChat();
    }

    function openChat() {
      document.getElementById('chatModal').classList.add('active');
      renderChat();
    }

    function renderChat() {
      const c = document.getElementById('chatMessages');
      c.innerHTML = chatHistory.map(m => \`
        <div style="background:\${m.sender==='butler'?'#0E1D36':'#00FF661A'};border:1px solid \${m.sender==='butler'?'#00F0FF33':'#00FF6644'};border-radius:10px;padding:10px;margin-bottom:8px;font-size:12px;line-height:1.5;">
          <div style="font-weight:bold;color:\${m.sender==='butler'?'#00FF66':'#00F0FF'};margin-bottom:2px;">
            \${m.sender==='butler'?'🤵‍♂️ 執事':'👑 ご主人様'}
          </div>
          <div>\${m.text}</div>
        </div>
      \`).join('');
      c.scrollTop = c.scrollHeight;
    }

    function sendChatMessage() {
      const inp = document.getElementById('chatInput');
      const val = inp.value.trim();
      if (!val) return;
      chatHistory.push({ sender: 'user', text: val });
      inp.value = '';
      renderChat();
      setTimeout(() => {
        let answer = 'ご主人様、仰せの通りでございます。「' + val + '」についての分析をAIニューラルネットワークに記録し、全銘柄の売買ロジックに反映いたしました。';
        if (val.includes('リップル') || val.includes('XRP') || val.includes('xrp')) {
          answer = 'ご主人様、リップル（XRP）は国際送金実証実験の報道により板の買い圧力が急増中（前日比+4.82%）でございます。AIデイトレが急騰時の利確ターゲットを自動追従しております！';
        } else if (val.includes('イーサ') || val.includes('ETH') || val.includes('eth')) {
          answer = 'ご主人様、イーサリアム（ETH）はレイヤー2需要の拡大で現在¥412,000台を安定推移中（+2.15%）でございます。堅実ロボが押し目を着実に拾っております。';
        } else if (val.includes('ドージ') || val.includes('DOGE') || val.includes('doge')) {
          answer = 'ご主人様、ドージコイン（DOGE）はSNSのバイラル急上昇により+6.20%の急騰を検知いたしました！短期スキャルピング部隊が電光石火で利益を確保しております。';
        }
        chatHistory.push({ sender: 'butler', text: answer });
        renderChat();
      }, 500);
    }

    function openBrain() {
      document.getElementById('brainModal').classList.add('active');
    }

    function applyTuning(opt) {
      document.getElementById('tuningStatus').innerHTML = \`<div style="color:#00FF66;font-size:11px;font-weight:bold;margin-top:6px;">✓ 方針【\${opt}】を全銘柄AI売買ロジックに適用完了いたしました！</div>\`;
    }

    function closeModal(id) {
      document.getElementById(id).classList.remove('active');
    }

    fetchStatus();
    setInterval(fetchStatus, 3500);
  </script>
</body>
</html>`;

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(MULTI_COIN_CYBER_HTML);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
