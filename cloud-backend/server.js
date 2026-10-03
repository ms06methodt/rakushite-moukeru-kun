const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Coincheck 全取扱銘柄マスターデータ（保有数量 amount と評価額 holdingVal）
const COIN_MASTER = [
  { id: 'BTC', name: 'ビットコイン', symbol: 'BTC/JPY', price: 13580000, change: 1.38, amount: 0.005, isOwned: true, color: '#F7931A' },
  { id: 'ETH', name: 'イーサリアム', symbol: 'ETH/JPY', price: 412000, change: 2.15, amount: 0.08, isOwned: true, color: '#627EEA' },
  { id: 'XRP', name: 'リップル', symbol: 'XRP/JPY', price: 92.4, change: 4.82, amount: 250, isOwned: true, color: '#23292F' },
  { id: 'SOL', name: 'ソラナ', symbol: 'SOL/JPY', price: 23800, change: 3.40, amount: 1.2, isOwned: true, color: '#14F195' },
  { id: 'DOGE', name: 'ドージコイン', symbol: 'DOGE/JPY', price: 24.8, change: 6.20, amount: 500, isOwned: true, color: '#C2A633' },
  { id: 'SHIB', name: 'シバイヌ', symbol: 'SHIB/JPY', price: 0.0031, change: -1.20, amount: 1000000, isOwned: true, color: '#FFA409' },
  { id: 'AVAX', name: 'アバランチ', symbol: 'AVAX/JPY', price: 4680, change: 1.85, amount: 0, isOwned: false, color: '#E84142' },
  { id: 'LINK', name: 'チェーンリンク', symbol: 'LINK/JPY', price: 2150, change: 2.90, amount: 0, isOwned: false, color: '#375BD2' },
  { id: 'MATIC', name: 'ポリゴン', symbol: 'POL/JPY', price: 78.5, change: 0.85, amount: 0, isOwned: false, color: '#8247E5' },
  { id: 'BCH', name: 'ビットコインキャッシュ', symbol: 'BCH/JPY', price: 54200, change: 1.10, amount: 0, isOwned: false, color: '#0AC18E' },
  { id: 'LTC', name: 'ライトコイン', symbol: 'LTC/JPY', price: 10400, change: 0.65, amount: 0, isOwned: false, color: '#345D9D' },
  { id: 'SAND', name: 'サンドボックス', symbol: 'SAND/JPY', price: 48.2, change: -0.45, amount: 0, isOwned: false, color: '#0084FF' },
  { id: 'CHZ', name: 'チリーズ', symbol: 'CHZ/JPY', price: 11.2, change: 3.10, amount: 0, isOwned: false, color: '#CD0124' },
  { id: 'XLM', name: 'ステラルーメン', symbol: 'XLM/JPY', price: 16.4, change: 0.95, amount: 0, isOwned: false, color: '#14B6EB' },
  { id: 'ETC', name: 'イーサリアムクラシック', symbol: 'ETC/JPY', price: 3280, change: 1.40, amount: 0, isOwned: false, color: '#328332' },
  { id: 'IOST', name: 'アイオーエスティ', symbol: 'IOST/JPY', price: 0.98, change: 5.40, amount: 0, isOwned: false, color: '#1C1C1C' }
];

let db = {
  coins: COIN_MASTER,
  totalProfitJpy: 3480,
  todayProfitJpy: 2650,
  winRate: 83.5,
  totalTrades: 94,
  pockets: [
    {
      id: 'pocketA',
      name: 'A: 堅実ロボ',
      strategyName: '実保有資産ボリンジャー逆張り＆RSI防御',
      realizedPnL: 1120,
      unrealizedPnL: 85,
      statusText: '🟢 ご主人様の実保有BTC/ETHの押し目防壁稼働中',
    },
    {
      id: 'pocketB',
      name: 'B: AIデイトレ',
      strategyName: '保有中アルトコイン超短期スキャルピング',
      realizedPnL: 1840,
      unrealizedPnL: 115,
      statusText: '⚡ 実保有XRP & DOGEの急騰波を秒速利確 (+0.4%目標)',
    },
    {
      id: 'pocketC',
      name: 'C: コピートレード',
      strategyName: '実保有SOL/SHIBクジラオンチェーン追従',
      realizedPnL: 1180,
      unrealizedPnL: 160,
      statusText: '🐋 ご登録資産(SOL/SHIB)の大口ステーキング集積を追従中',
    },
  ],
  trades: [
    {
      id: 't1',
      coin: 'DOGE',
      type: 'SELL',
      profitJpy: 240,
      reason: '実保有DOGE急騰モメンタム検知 (+6.2%) AI秒速利確',
      timestamp: 'たった今'
    },
    {
      id: 't2',
      coin: 'XRP',
      type: 'SELL',
      profitJpy: 180,
      reason: '実保有XRP 送金需要反発・高値利確完了',
      timestamp: '1分前'
    },
    {
      id: 't3',
      coin: 'SOL',
      type: 'BUY',
      profitJpy: 0,
      reason: '実保有SOL TVL急増オンチェーンシグナル追加買い',
      timestamp: '5分前'
    },
    {
      id: 't4',
      coin: 'BTC',
      type: 'SELL',
      profitJpy: 140,
      reason: '実保有BTC レジスタンスブレイク追従利確',
      timestamp: '12分前'
    }
  ]
};

app.get('/api/status', (req, res) => {
  res.json(db);
});

const MULTI_COIN_CYBER_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>楽して儲ける君 - 実保有資産連動 AIクリプトファンド</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: #010409; color: #E2F0FF; display: flex; justify-content: center; min-height: 100vh; }
    .app-container { width: 100%; max-width: 520px; background-color: #030711; border-left: 1px solid rgba(0,240,255,0.15); border-right: 1px solid rgba(0,240,255,0.15); display: flex; flex-direction: column; min-height: 100vh; position: relative; }
    
    /* Header */
    .header { background: #050B14; border-bottom: 1px solid rgba(0,240,255,0.2); padding: 10px 14px; }
    .header-top { display: flex; justify-content: space-between; align-items: center; }
    .title-cyber { color: #00FF66; font-size: 19px; font-weight: 900; letter-spacing: 1px; text-shadow: 0 0 10px rgba(0,255,102,0.6); }
    .title-sub { color: #00F0FF; font-size: 8px; font-weight: 700; letter-spacing: 1.5px; opacity: 0.85; }
    .header-actions { display: flex; gap: 5px; }
    .header-btn { background: #0F1E36; border: 1px solid rgba(0,240,255,0.3); color: #E2F1FF; font-size: 11px; font-weight: 700; padding: 5px 8px; border-radius: 6px; cursor: pointer; }
    .btn-asset { background: rgba(0,255,102,0.15); border-color: #00FF66; color: #00FF66; font-weight: 900; }
    
    /* Filter & Sort Bar */
    .ribbon-control-bar { display: flex; justify-content: space-between; align-items: center; padding: 6px 14px; background: #060D1A; border-bottom: 1px solid rgba(0,240,255,0.1); }
    .filter-toggles { display: flex; background: #0A162B; border-radius: 6px; padding: 2px; border: 1px solid #162C4A; gap: 2px; }
    .filter-btn { background: transparent; border: none; color: #7B93B2; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
    .filter-btn.active { background: #00FF66; color: #021206; box-shadow: 0 0 8px rgba(0,255,102,0.4); }
    .sort-actions { display: flex; align-items: center; gap: 6px; }
    .sort-select { background: #0F1E36; border: 1px solid rgba(0,240,255,0.3); color: #00F0FF; font-size: 10px; font-weight: bold; padding: 3px 6px; border-radius: 6px; outline: none; cursor: pointer; }

    /* Coin Selector Ribbon */
    .coin-ribbon { display: flex; gap: 6px; overflow-x: auto; padding: 8px 14px; background: #040913; border-bottom: 1px solid rgba(0,240,255,0.15); scrollbar-width: none; }
    .coin-ribbon::-webkit-scrollbar { display: none; }
    .coin-tab { flex-shrink: 0; background: #091526; border: 1px solid #162C4A; border-radius: 8px; padding: 6px 10px; cursor: pointer; display: flex; flex-direction: column; align-items: center; transition: all 0.2s; position: relative; }
    .coin-tab.active { background: rgba(0,255,102,0.15); border-color: #00FF66; box-shadow: 0 0 10px rgba(0,255,102,0.3); }
    .coin-tab.is-owned { border-top: 2px solid #00FF66; }
    .owned-badge { position: absolute; top: -5px; right: -3px; background: #00FF66; color: #031208; font-size: 7px; font-weight: 900; padding: 1px 3px; border-radius: 3px; }
    .coin-tab-name { font-size: 11px; font-weight: 800; color: #FFF; display: flex; align-items: center; gap: 4px; }
    .coin-tab-price { font-size: 9px; font-family: monospace; color: #A0B4CC; margin-top: 2px; }
    .coin-tab-holding { font-size: 8px; font-family: monospace; color: #00FF66; font-weight: bold; margin-top: 1px; }
    .coin-tab-chg { font-size: 8px; font-weight: 700; margin-top: 1px; }
    .chg-up { color: #00FF66; }
    .chg-down { color: #FF3366; }

    /* Main Scroll */
    .main-scroll { flex: 1; overflow-y: auto; padding: 12px 14px 85px 14px; }
    
    /* Real Net Worth Banner */
    .networth-card { background: #0A172B; border-radius: 12px; padding: 10px 14px; border: 1px solid rgba(0,240,255,0.25); display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .networth-lbl { font-size: 11px; color: #8BA8CA; font-weight: 700; }
    .networth-val { font-size: 15px; font-weight: 900; font-family: monospace; color: #FFF; }
    .edit-assets-btn { background: #00FF66; color: #021206; font-size: 10px; font-weight: 900; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; }

    /* Giant Neon Card */
    .neon-card { background: #070E1B; border-radius: 16px; padding: 16px; border: 1.5px solid rgba(0,240,255,0.3); box-shadow: 0 4px 20px rgba(0,240,255,0.15); text-align: center; margin-bottom: 12px; }
    .badge-autofund { display: inline-block; background: rgba(0,240,255,0.1); color: #00F0FF; font-size: 9px; font-weight: 800; letter-spacing: 2px; padding: 3px 8px; border-radius: 4px; margin-bottom: 4px; }
    .pnl-label { color: #A0B4CC; font-size: 12px; font-weight: 700; margin-bottom: 4px; }
    .giant-neon-profit { font-size: 38px; font-weight: 900; font-family: monospace; color: #00FF66; text-shadow: 0 0 16px rgba(0,255,102,0.8); margin: 4px 0 10px 0; }
    .metrics-row { display: flex; justify-content: space-around; background: #040811; padding: 8px; border-radius: 10px; border: 1px solid rgba(0,240,255,0.1); }
    .metric-item { display: flex; flex-direction: column; align-items: center; }
    .metric-lbl { color: #657B96; font-size: 9px; margin-bottom: 2px; }
    .metric-v { font-size: 12px; font-weight: 800; font-family: monospace; color: #00FF66; }

    /* Portfolio Visualizer Bar */
    .portfolio-box { background: #081222; border-radius: 12px; padding: 12px; border: 1px solid #182C4A; margin-bottom: 12px; }
    .portfolio-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .portfolio-title { font-size: 12px; font-weight: 800; color: #00F0FF; }
    .portfolio-btn { background: #00FF6622; border: 1px solid #00FF66; color: #00FF66; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; cursor: pointer; }
    .alloc-bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 8px; background: #0A1424; }
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
    
    /* Asset Edit Inputs */
    .asset-row { background: #0A162B; border: 1px solid #193457; border-radius: 8px; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; }
    .asset-input { width: 90px; background: #050C18; border: 1px solid #00F0FF44; border-radius: 6px; padding: 5px 8px; color: #00FF66; font-family: monospace; font-weight: bold; font-size: 12px; text-align: right; }
    .asset-subval { font-size: 10px; color: #7B93B2; font-family: monospace; text-align: right; margin-top: 2px; }

    /* Reorder items */
    .reorder-item { background: #0A162B; border: 1px solid #193457; border-radius: 8px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; }
    .reorder-btn { background: #122540; color: #00F0FF; border: 1px solid #1F3D68; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Header -->
    <div class="header">
      <div class="header-top">
        <div>
          <div class="title-cyber">楽して儲ける君</div>
          <div class="title-sub">実保有資産連動 24/7 AIマルチファンド</div>
        </div>
        <div class="header-actions">
          <button class="header-btn btn-asset" onclick="openAssetModal()">💼 資産登録</button>
          <button class="header-btn" onclick="openReorderModal()">↕️ 並替</button>
          <button class="header-btn" onclick="openBrain()">🧠 脳内</button>
          <button class="header-btn" onclick="openChat()">💬 執事</button>
        </div>
      </div>
    </div>

    <!-- Filter & Sort Bar -->
    <div class="ribbon-control-bar">
      <div class="filter-toggles">
        <button class="filter-btn active" id="btnFilterAll" onclick="setFilter('ALL')">🌐 全銘柄</button>
        <button class="filter-btn" id="btnFilterOwned" onclick="setFilter('OWNED')">💼 保有中のみ</button>
      </div>
      <div class="sort-actions">
        <span style="font-size:9px;color:#7B93B2;">並び順:</span>
        <select class="sort-select" id="sortSelect" onchange="changeSort(this.value)">
          <option value="custom">⭐ おすすめ順</option>
          <option value="holding">💰 保有評価額順</option>
          <option value="gain">🚀 急騰順 (+%)</option>
          <option value="name">🔤 銘柄名順</option>
        </select>
      </div>
    </div>

    <!-- Coin Selector Ribbon -->
    <div class="coin-ribbon" id="coinRibbon"></div>

    <!-- Main Scroll -->
    <div class="main-scroll">
      <!-- Real Net Worth Banner -->
      <div class="networth-card">
        <div>
          <div class="networth-lbl">💼 ご主人様の実保有資産 総評価額</div>
          <div class="networth-val" id="totalNetWorth">¥162,490</div>
        </div>
        <button class="edit-assets-btn" onclick="openAssetModal()">＋ 所持数を変更</button>
      </div>

      <!-- Giant Neon Profit Card -->
      <div class="neon-card">
        <div class="badge-autofund" id="cardScopeBadge">PORTFOLIO TOTAL PROFIT</div>
        <div class="pnl-label" id="cardScopeLabel">実保有資産ベース 運用利益</div>
        <div class="giant-neon-profit" id="totalProfit">+¥3,480</div>
        <div class="metrics-row">
          <div class="metric-item">
            <span class="metric-lbl">本日の運用益</span>
            <span class="metric-v" id="todayProfit">+¥2,650</span>
          </div>
          <div class="metric-item">
            <span class="metric-lbl">AI勝率</span>
            <span class="metric-v" id="winRate">83.5%</span>
          </div>
          <div class="metric-item">
            <span class="metric-lbl">自律取引数</span>
            <span class="metric-v" id="totalTrades">94回</span>
          </div>
        </div>
      </div>

      <!-- Portfolio Distribution Bar -->
      <div class="portfolio-box">
        <div class="portfolio-hdr">
          <span class="portfolio-title">🪙 実保有ポートフォリオ資産比率</span>
          <button class="portfolio-btn" onclick="openAssetModal()">所持数編集 ✏️</button>
        </div>
        <div class="alloc-bar" id="allocBar"></div>
        <div class="alloc-legend" id="allocLegend"></div>
      </div>

      <!-- 3 Pockets -->
      <div class="section-title">
        <span>3大自律AIポケット稼働状況</span>
        <span style="color:#00F0FF;font-size:9px;">REAL ASSET ENGINE</span>
      </div>
      <div class="pockets-list" id="pocketsList"></div>

      <!-- Live Execution Ticker -->
      <div class="section-title">
        <span>⚡ 実保有銘柄 執行速報</span>
        <span style="color:#657B96;font-size:9px;">LIVE EXECUTION</span>
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

  <!-- Asset Registration Modal (ご主人様の所持数登録モーダル) -->
  <div class="modal" id="assetModal">
    <div class="modal-box">
      <div class="modal-hdr">
        <span class="modal-title">💼 ご主人様の仮想通貨所持数 登録・変更</span>
        <button class="modal-close" onclick="closeModal('assetModal')">✕ 閉じる</button>
      </div>
      <div class="modal-body">
        <div style="background:#00FF6615;border:1px solid #00FF6644;border-radius:8px;padding:8px;font-size:11px;color:#A2FFCE;">
          ✨ Coincheck等で実際に保有している数量を入力してください！<br>
          入力した所持数を元に、現在の実資産規模でAIが24時間デモ運用・最適化を行います。
        </div>
        <div id="assetInputList" style="display:flex;flex-direction:column;gap:6px;"></div>
        <button onclick="saveAssetHoldings()" style="background:#00FF66;color:#031208;border:none;padding:12px;border-radius:8px;font-weight:900;font-size:13px;cursor:pointer;margin-top:6px;box-shadow:0 0 12px rgba(0,255,102,0.5);">💾 所持数を保存して運用に反映する</button>
      </div>
    </div>
  </div>

  <!-- Reorder Modal -->
  <div class="modal" id="reorderModal">
    <div class="modal-box">
      <div class="modal-hdr">
        <span class="modal-title">↕️ 銘柄の並び順カスタマイズ</span>
        <button class="modal-close" onclick="closeModal('reorderModal')">✕ 閉じる</button>
      </div>
      <div class="modal-body">
        <div style="background:#00F0FF12;border:1px solid #00F0FF44;border-radius:8px;padding:8px;font-size:11px;color:#D4EEFF;">
          💡 よく見る銘柄や所有している仮想通貨を上（前）に移動できます！
        </div>
        <div id="reorderList" style="display:flex;flex-direction:column;gap:6px;"></div>
      </div>
    </div>
  </div>

  <!-- Brain Modal -->
  <div class="modal" id="brainModal">
    <div class="modal-box">
      <div class="modal-hdr">
        <span class="modal-title">🧠 AI脳内ログ ＆ 実資産2択育成</span>
        <button class="modal-close" onclick="closeModal('brainModal')">✕ 閉じる</button>
      </div>
      <div class="modal-body">
        <div class="proposal-card" style="background:#0A1526;border-radius:10px;padding:12px;border:1px solid #193457;">
          <div style="color:#00F0FF;font-weight:bold;font-size:11px;">B: AIデイトレからの実資産改善提案</div>
          <div style="color:#FFF;font-size:12px;font-weight:bold;margin:2px 0;">所持銘柄の利確スピード調整</div>
          <div style="color:#A0B8D4;font-size:11px;margin:4px 0 8px 0;">ご主人様が保有中のXRPやDOGEの急騰時、+4%で利確するか、+10%まで引っ張るかのご指示を仰ぎたく存じます。</div>
          <div onclick="applyTuning('A')" style="background:rgba(0,240,255,0.08);border:1.5px solid rgba(0,240,255,0.4);color:#00F0FF;padding:10px;border-radius:8px;margin-top:6px;cursor:pointer;">【A】電光石火（+4%で確実に利確・勝率最優先）</div>
          <div onclick="applyTuning('B')" style="background:rgba(191,90,242,0.08);border:1.5px solid rgba(191,90,242,0.4);color:#DF9BFF;padding:10px;border-radius:8px;margin-top:6px;cursor:pointer;">【B】爆益追従（+10%超の爆発トレンドまでホールド）</div>
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
        <input type="text" id="chatInput" placeholder="執事へ指示（例: 私の保有資産の状況は？）" style="flex:1;background:#0E1B2E;border:1px solid #1F3758;border-radius:6px;padding:8px 10px;color:#FFF;font-size:12px;" />
        <button onclick="sendChatMessage()" style="background:#00FF66;color:#031208;border:none;padding:8px 14px;border-radius:6px;font-weight:bold;cursor:pointer;">送信</button>
      </div>
    </div>
  </div>

  <script>
    let fundData = null;
    let selectedCoin = 'ALL';
    let filterMode = 'ALL';
    let currentSort = 'custom';
    let customOrder = [];

    // ローカルストレージからご主人様の所持数を読み込み
    function loadSavedAmounts() {
      try {
        const saved = localStorage.getItem('rakushite_my_holdings');
        if (saved && fundData) {
          const parsed = JSON.parse(saved);
          fundData.coins.forEach(c => {
            if (parsed[c.id] !== undefined) {
              c.amount = parseFloat(parsed[c.id]) || 0;
              c.isOwned = c.amount > 0;
            }
          });
        }
      } catch (e) {}
    }

    let chatHistory = [
      { sender: 'butler', text: 'ご主人様、実保有資産連動ファンドへようこそ！ご主人様が実際に所有されている各仮想通貨の所持数を右上の【💼 資産登録】から自由に入力・保存していただけます。ご主人様のリアルな資産規模に合わせて、AI執事が24時間最適トレードをシミュレーションいたします！' }
    ];

    async function fetchStatus() {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          fundData = await res.json();
          loadSavedAmounts();
          if (customOrder.length === 0) {
            customOrder = fundData.coins.map(c => c.id);
          }
          renderDashboard();
        }
      } catch (e) {}
    }

    function calculateHoldings() {
      if (!fundData) return 0;
      let totalVal = 0;
      fundData.coins.forEach(c => {
        c.holdingVal = Math.round((c.amount || 0) * c.price);
        totalVal += c.holdingVal;
      });
      fundData.coins.forEach(c => {
        c.alloc = totalVal > 0 ? Math.round((c.holdingVal / totalVal) * 100) : 0;
      });
      return totalVal;
    }

    function setFilter(mode) {
      filterMode = mode;
      document.getElementById('btnFilterAll').classList.toggle('active', mode === 'ALL');
      document.getElementById('btnFilterOwned').classList.toggle('active', mode === 'OWNED');
      renderDashboard();
    }

    function changeSort(sortVal) {
      currentSort = sortVal;
      renderDashboard();
    }

    function getSortedCoins() {
      if (!fundData) return [];
      let list = [...fundData.coins];

      if (filterMode === 'OWNED') {
        list = list.filter(c => c.amount > 0 || c.isOwned);
      }

      if (currentSort === 'holding') {
        list.sort((a, b) => (b.holdingVal || 0) - (a.holdingVal || 0));
      } else if (currentSort === 'gain') {
        list.sort((a, b) => b.change - a.change);
      } else if (currentSort === 'name') {
        list.sort((a, b) => a.id.localeCompare(b.id));
      } else {
        list.sort((a, b) => customOrder.indexOf(a.id) - customOrder.indexOf(b.id));
      }
      return list;
    }

    function selectCoin(coinId) {
      selectedCoin = coinId;
      renderDashboard();
    }

    function renderDashboard() {
      if (!fundData) return;

      const totalNetWorth = calculateHoldings();
      document.getElementById('totalNetWorth').innerText = '¥' + totalNetWorth.toLocaleString();

      const displayCoins = getSortedCoins();

      // Render Ribbon
      const ribbon = document.getElementById('coinRibbon');
      let ribbonHtml = \`
        <div class="coin-tab \${selectedCoin==='ALL'?'active':''}" onclick="selectCoin('ALL')">
          <div class="coin-tab-name">🌐 全保有銘柄</div>
          <div class="coin-tab-price">総額 ¥\${totalNetWorth.toLocaleString()}</div>
          <div class="coin-tab-chg chg-up">+3.48%</div>
        </div>
      \`;

      displayCoins.forEach(c => {
        const isAct = selectedCoin === c.id;
        const chgCls = c.change >= 0 ? 'chg-up' : 'chg-down';
        const chgSign = c.change >= 0 ? '+' : '';
        const priceFmt = c.price < 1 ? c.price.toFixed(4) : c.price < 100 ? c.price.toFixed(1) : c.price.toLocaleString();
        const amtFmt = (c.amount || 0) > 0 ? \`\${c.amount}枚\` : '未所持';
        ribbonHtml += \`
          <div class="coin-tab \${isAct?'active':''} \${c.amount>0?'is-owned':''}" onclick="selectCoin('\${c.id}')">
            \${c.amount > 0 ? '<span class="owned-badge">保有中</span>' : ''}
            <div class="coin-tab-name" style="color:\${c.color}">● \${c.id}</div>
            <div class="coin-tab-price">¥\${priceFmt}</div>
            <div class="coin-tab-holding">\${amtFmt}</div>
            <div class="coin-tab-chg \${chgCls}">\${chgSign}\${c.change}%</div>
          </div>
        \`;
      });
      ribbon.innerHTML = ribbonHtml;

      // Scope labels
      const targetCoin = fundData.coins.find(c => c.id === selectedCoin);
      if (selectedCoin === 'ALL') {
        document.getElementById('cardScopeBadge').innerText = 'PORTFOLIO TOTAL PROFIT';
        document.getElementById('cardScopeLabel').innerText = '実保有資産ベース トータル運用利益';
        document.getElementById('totalProfit').innerText = '+¥3,480';
      } else {
        document.getElementById('cardScopeBadge').innerText = targetCoin.id + ' HOLDING ENGINE';
        document.getElementById('cardScopeLabel').innerText = targetCoin.name + ' (' + targetCoin.id + ') 所持評価: ¥' + targetCoin.holdingVal.toLocaleString();
        const profit = Math.round(targetCoin.holdingVal * 0.035 + 120);
        document.getElementById('totalProfit').innerText = '+¥' + profit.toLocaleString();
      }

      // Portfolio Bar
      const allocBar = document.getElementById('allocBar');
      const allocLegend = document.getElementById('allocLegend');
      const ownedCoins = fundData.coins.filter(c => c.holdingVal > 0);
      
      if (ownedCoins.length > 0) {
        allocBar.innerHTML = ownedCoins.map(c => \`
          <div class="alloc-seg" style="width:\${c.alloc}%;background:\${c.color};" title="\${c.id}: \${c.alloc}%"></div>
        \`).join('');

        allocLegend.innerHTML = ownedCoins.map(c => \`
          <div class="legend-item">
            <div class="legend-dot" style="background:\${c.color};"></div>
            <span>\${c.id}: \${c.amount}枚 (¥\${c.holdingVal.toLocaleString()})</span>
          </div>
        \`).join('');
      } else {
        allocBar.innerHTML = '<div style="width:100%;background:#1A2C46;color:#7B93B2;font-size:9px;text-align:center;line-height:10px;">所持数が未登録です</div>';
        allocLegend.innerHTML = '<span style="color:#7B93B2;font-size:10px;">「💼 資産登録」ボタンからお持ちの仮想通貨の枚数を入力してください。</span>';
      }

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

      // Trades
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

    // Asset Modal Functions
    function openAssetModal() {
      document.getElementById('assetModal').classList.add('active');
      renderAssetInputs();
    }

    function renderAssetInputs() {
      const container = document.getElementById('assetInputList');
      container.innerHTML = fundData.coins.map(c => {
        const estVal = Math.round((c.amount || 0) * c.price);
        return \`
          <div class="asset-row">
            <div>
              <span style="color:\${c.color};font-weight:bold;">● \${c.id}</span>
              <span style="color:#A0B8D4;font-size:11px;margin-left:4px;">\${c.name} (¥\${c.price.toLocaleString()})</span>
            </div>
            <div style="text-align:right;">
              <input type="number" step="any" min="0" class="asset-input" id="input_amt_\${c.id}" value="\${c.amount || 0}" oninput="previewAssetVal('\${c.id}')" />
              <span style="color:#A0B8D4;font-size:11px;margin-left:2px;">枚</span>
              <div class="asset-subval" id="val_prev_\${c.id}">≈ ¥\${estVal.toLocaleString()}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function previewAssetVal(coinId) {
      const inp = document.getElementById('input_amt_' + coinId);
      const prev = document.getElementById('val_prev_' + coinId);
      const c = fundData.coins.find(item => item.id === coinId);
      if (inp && prev && c) {
        const amt = parseFloat(inp.value) || 0;
        const val = Math.round(amt * c.price);
        prev.innerText = '≈ ¥' + val.toLocaleString();
      }
    }

    function saveAssetHoldings() {
      const holdingsMap = {};
      fundData.coins.forEach(c => {
        const inp = document.getElementById('input_amt_' + c.id);
        if (inp) {
          const val = parseFloat(inp.value) || 0;
          c.amount = val;
          c.isOwned = val > 0;
          holdingsMap[c.id] = val;
        }
      });
      try {
        localStorage.setItem('rakushite_my_holdings', JSON.stringify(holdingsMap));
      } catch (e) {}

      closeModal('assetModal');
      renderDashboard();
      alert('✅ ご主人様の保有仮想通貨と所持数を保存し、デモ運用エンジンに反映いたしました！');
    }

    // Reorder Modal Functions
    function openReorderModal() {
      document.getElementById('reorderModal').classList.add('active');
      renderReorderList();
    }

    function renderReorderList() {
      const container = document.getElementById('reorderList');
      container.innerHTML = customOrder.map((coinId, idx) => {
        const c = fundData.coins.find(item => item.id === coinId);
        if (!c) return '';
        const amt = c.amount || 0;
        return \`
          <div class="reorder-item">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="color:#657B96;font-size:10px;width:16px;">#\${idx + 1}</span>
              <span style="color:\${c.color};font-weight:bold;">● \${c.id}</span>
              <span style="color:#A0B8D4;font-size:11px;">\${c.name}</span>
              \${amt > 0 ? '<span style="background:#00FF6622;color:#00FF66;font-size:8px;padding:1px 4px;border-radius:3px;font-weight:bold;">' + amt + '枚</span>' : ''}
            </div>
            <div style="display:flex;gap:4px;">
              <button class="reorder-btn" onclick="moveOrder('\${c.id}', -1)" \${idx===0?'disabled style=\"opacity:0.3\"':''}>▲ 上へ</button>
              <button class="reorder-btn" onclick="moveOrder('\${c.id}', 1)" \${idx===customOrder.length-1?'disabled style=\"opacity:0.3\"':''}>▼ 下へ</button>
            </div>
          </div>
        \`;
      }).join('');
    }

    function moveOrder(coinId, dir) {
      const idx = customOrder.indexOf(coinId);
      if (idx < 0) return;
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= customOrder.length) return;
      const temp = customOrder[idx];
      customOrder[idx] = customOrder[targetIdx];
      customOrder[targetIdx] = temp;
      renderReorderList();
      renderDashboard();
    }

    function quickAsk(type) {
      let reply = '';
      if (type === 'recent5min') {
        reply = 'ご主人様、直近5分間はご登録いただいた実保有【DOGE】と【XRP】のボラティリティをAIデイトレが掴み、+¥420の利ざやを掠め取りました！';
      } else if (type === 'todayTotal') {
        reply = 'ご主人様、ご登録の実保有資産ベースでの本日運用益は【+¥2,650】（累計: +¥3,480）となっております！総資産評価額も順調に増加中です。';
      } else {
        reply = 'ご主人様、現在の相場はご主人様のポートフォリオ（BTC/ETH/XRP/SOL）にとって非常に有利な上昇モメンタムを維持しております！';
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
        let answer = 'ご主人様、仰せの通りでございます。「' + val + '」についての分析をAIニューラルネットワークに記録し、ご登録資産の運用ロジックに反映いたしました。';
        if (val.includes('資産') || val.includes('いくら') || val.includes('総額')) {
          const totalNetWorth = calculateHoldings();
          answer = 'ご主人様、現在ご登録いただいている仮想通貨の総資産評価額は【¥' + totalNetWorth.toLocaleString() + '】でございます！AIが各コインの枚数に応じた最適運用を継続しております。';
        } else if (val.includes('リップル') || val.includes('XRP') || val.includes('xrp')) {
          answer = 'ご主人様、ご所有のリップル（XRP）は+4.82%の上昇中！AIデイトレが保有枚数に応じた利確ポジションを監視しております。';
        }
        chatHistory.push({ sender: 'butler', text: answer });
        renderChat();
      }, 500);
    }

    function openBrain() {
      document.getElementById('brainModal').classList.add('active');
    }

    function applyTuning(opt) {
      document.getElementById('tuningStatus').innerHTML = \`<div style="color:#00FF66;font-size:11px;font-weight:bold;margin-top:6px;">✓ 方針【\${opt}】をご登録実資産のAI売買ロジックに適用完了いたしました！</div>\`;
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
