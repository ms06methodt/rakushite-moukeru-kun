const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Coincheck 全取扱銘柄マスターデータ（ご主人様の保有4銘柄を先頭に配置）
const COIN_MASTER = [
  { id: 'DOGE', name: 'ドージコイン', symbol: 'DOGE/JPY', price: 24.8, change: 6.20, color: '#C2A633' },
  { id: 'ETH', name: 'イーサリアム', symbol: 'ETH/JPY', price: 412000, change: 2.15, color: '#627EEA' },
  { id: 'SHIB', name: 'シバイヌ', symbol: 'SHIB/JPY', price: 0.0031, change: -1.20, color: '#FFA409' },
  { id: 'XRP', name: 'リップル', symbol: 'XRP/JPY', price: 92.4, change: 4.82, color: '#00AAE4' },
  { id: 'BTC', name: 'ビットコイン', symbol: 'BTC/JPY', price: 13580000, change: 1.38, color: '#F7931A' },
  { id: 'SOL', name: 'ソラナ', symbol: 'SOL/JPY', price: 23800, change: 3.40, color: '#14F195' },
  { id: 'AVAX', name: 'アバランチ', symbol: 'AVAX/JPY', price: 4680, change: 1.85, color: '#E84142' },
  { id: 'LINK', name: 'チェーンリンク', symbol: 'LINK/JPY', price: 2150, change: 2.90, color: '#375BD2' },
  { id: 'MATIC', name: 'ポリゴン', symbol: 'POL/JPY', price: 78.5, change: 0.85, color: '#8247E5' },
  { id: 'BCH', name: 'ビットコインキャッシュ', symbol: 'BCH/JPY', price: 54200, change: 1.10, color: '#0AC18E' },
  { id: 'LTC', name: 'ライトコイン', symbol: 'LTC/JPY', price: 10400, change: 0.65, color: '#345D9D' },
  { id: 'SAND', name: 'サンドボックス', symbol: 'SAND/JPY', price: 48.2, change: -0.45, color: '#0084FF' },
  { id: 'CHZ', name: 'チリーズ', symbol: 'CHZ/JPY', price: 11.2, change: 3.10, color: '#CD0124' },
  { id: 'XLM', name: 'ステラルーメン', symbol: 'XLM/JPY', price: 16.4, change: 0.95, color: '#14B6EB' },
  { id: 'ETC', name: 'イーサリアムクラシック', symbol: 'ETC/JPY', price: 3280, change: 1.40, color: '#328332' },
  { id: 'IOST', name: 'アイオーエスティ', symbol: 'IOST/JPY', price: 0.98, change: 5.40, color: '#A0AEC0' }
];

let db = {
  coins: COIN_MASTER,
  winRate: 84.2,
  totalTrades: 128
};

app.get('/api/status', (req, res) => {
  res.json(db);
});

const MULTI_COIN_CYBER_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>楽して儲ける君 | 実保有＆デモ運用切替対応 24/7 AIファンド</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background-color: #030712; color: #F3F4F6; min-height: 100vh; display: flex; justify-content: center; }
    .app-container { width: 100%; max-width: 480px; min-height: 100vh; background: #050B14; border-left: 1px solid #101F33; border-right: 1px solid #101F33; display: flex; flex-direction: column; position: relative; }
    
    /* Header */
    .header { background: #08111F; padding: 10px 14px; border-bottom: 1px solid #152942; position: sticky; top: 0; z-index: 40; }
    .header-top { display: flex; justify-content: space-between; align-items: center; }
    .title-cyber { font-size: 15px; font-weight: 900; background: linear-gradient(90deg, #00FF66, #00F0FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .title-sub { font-size: 9px; color: #7B93B2; margin-top: 1px; }
    .header-actions { display: flex; gap: 5px; }
    .header-btn { background: #0E1E33; border: 1px solid #1E3B66; color: #A0B8D4; font-size: 10px; font-weight: bold; padding: 5px 8px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 3px; }
    .header-btn.btn-asset { background: #00FF6622; border-color: #00FF66; color: #00FF66; font-weight: 800; box-shadow: 0 0 8px rgba(0,255,102,0.3); }

    /* Mode Switcher Bar (REAL vs DEMO) */
    .mode-switch-bar { display: flex; background: #060D1A; padding: 6px 12px; border-bottom: 1px solid #122238; gap: 6px; }
    .mode-tab-btn { flex: 1; padding: 8px; border-radius: 8px; border: 1.5px solid #193457; background: #0A162B; color: #7B93B2; font-size: 11px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
    .mode-tab-btn.active.real { background: #00FF6618; border-color: #00FF66; color: #00FF66; box-shadow: 0 0 10px rgba(0,255,102,0.25); }
    .mode-tab-btn.active.demo { background: #00F0FF18; border-color: #00F0FF; color: #00F0FF; box-shadow: 0 0 10px rgba(0,240,255,0.25); }

    /* Filter & Sort Bar */
    .ribbon-control-bar { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: #050B17; border-bottom: 1px solid #101F33; }
    .filter-toggles { display: flex; gap: 4px; }
    .filter-btn { background: #0B1728; border: 1px solid #1B3454; color: #7B93B2; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 5px; cursor: pointer; }
    .filter-btn.active { background: #00F0FF22; border-color: #00F0FF; color: #00F0FF; font-weight: 800; }
    .sort-actions { display: flex; align-items: center; gap: 4px; }
    .sort-select { background: #0B1728; border: 1px solid #1B3454; color: #A0B8D4; font-size: 10px; padding: 2px 6px; border-radius: 4px; outline: none; }

    /* Ribbon */
    .coin-ribbon { display: flex; overflow-x: auto; padding: 8px 10px; gap: 6px; background: #070F1E; border-bottom: 1px solid #13243D; scrollbar-width: none; }
    .coin-ribbon::-webkit-scrollbar { display: none; }
    .coin-tab { flex: 0 0 auto; background: #0B1626; border: 1px solid #1A314D; border-radius: 8px; padding: 6px 10px; cursor: pointer; text-align: left; min-width: 95px; position: relative; transition: all 0.2s; }
    .coin-tab.active { border-color: #00FF66; background: #0B211C; box-shadow: 0 0 10px rgba(0,255,102,0.25); }
    .coin-tab.is-owned { border-left: 3px solid #00FF66; }
    .coin-tab.is-demo { border-left: 3px solid #00F0FF; }
    .coin-tab-name { font-size: 11px; font-weight: bold; }
    .coin-tab-price { font-size: 11px; font-weight: 800; color: #00F0FF; font-family: monospace; margin-top: 2px; }
    .coin-tab-holding { font-size: 9px; color: #A0B8D4; margin-top: 1px; }
    .coin-tab-chg { font-size: 9px; font-weight: bold; margin-top: 1px; }
    .chg-up { color: #00FF66; }
    .chg-down { color: #FF3B30; }
    .owned-badge { position: absolute; top: 3px; right: 4px; background: #00FF6633; border: 1px solid #00FF66; color: #00FF66; font-size: 8px; font-weight: 900; padding: 1px 3px; border-radius: 3px; }
    .demo-badge { position: absolute; top: 3px; right: 4px; background: #00F0FF33; border: 1px solid #00F0FF; color: #00F0FF; font-size: 8px; font-weight: 900; padding: 1px 3px; border-radius: 3px; }

    /* Scroll Body */
    .main-scroll { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 12px; }

    /* Real / Demo Net Worth Banner */
    .networth-card { background: linear-gradient(135deg, #091B33, #051020); border: 1.5px solid #00F0FF88; border-radius: 12px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 0 16px rgba(0,240,255,0.15); }
    .networth-card.real { border-color: #00FF6688; box-shadow: 0 0 16px rgba(0,255,102,0.15); }
    .networth-lbl { font-size: 11px; color: #00F0FF; font-weight: bold; }
    .networth-card.real .networth-lbl { color: #00FF66; }
    .networth-val { font-size: 22px; font-weight: 900; color: #FFF; font-family: monospace; text-shadow: 0 0 10px rgba(255,255,255,0.4); margin-top: 2px; }
    .edit-assets-btn { background: #00FF66; color: #031208; border: none; font-size: 11px; font-weight: 900; padding: 6px 12px; border-radius: 6px; cursor: pointer; box-shadow: 0 0 10px rgba(0,255,102,0.4); }

    /* Giant Neon Profit Card */
    .neon-card { background: radial-gradient(circle at 50% 20%, #06281E 0%, #05101A 75%); border: 1.5px solid #00FF66; border-radius: 14px; padding: 16px; text-align: center; box-shadow: 0 0 20px rgba(0,255,102,0.25); position: relative; }
    .neon-card.demo { background: radial-gradient(circle at 50% 20%, #062028 0%, #05101A 75%); border-color: #00F0FF; box-shadow: 0 0 20px rgba(0,240,255,0.25); }
    .badge-autofund { display: inline-block; background: #00FF6622; border: 1px solid #00FF66; color: #00FF66; font-size: 9px; font-weight: 900; padding: 2px 8px; border-radius: 12px; letter-spacing: 1px; margin-bottom: 6px; }
    .neon-card.demo .badge-autofund { background: #00F0FF22; border-color: #00F0FF; color: #00F0FF; }
    .badge-unowned { background: #1B293E; border: 1px solid #334E68; color: #829AB1; font-size: 9px; font-weight: 900; padding: 2px 8px; border-radius: 12px; display: inline-block; margin-bottom: 6px; }
    .pnl-label { font-size: 11px; color: #A0B8D4; }
    .giant-neon-profit { font-size: 34px; font-weight: 900; color: #00FF66; text-shadow: 0 0 20px rgba(0,255,102,0.8), 0 0 35px rgba(0,255,102,0.4); font-family: monospace; margin: 4px 0 12px 0; }
    .neon-card.demo .giant-neon-profit { color: #00F0FF; text-shadow: 0 0 20px rgba(0,240,255,0.8), 0 0 35px rgba(0,240,255,0.4); }
    .metrics-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; border-top: 1px solid #0F2D25; padding-top: 10px; }
    .metric-item { text-align: center; }
    .metric-lbl { font-size: 9px; color: #7B93B2; display: block; }
    .metric-v { font-size: 13px; font-weight: bold; color: #FFF; font-family: monospace; margin-top: 2px; }

    /* Unowned coin hint box */
    .unowned-hint-box { background: #0A1728; border: 1px solid #163050; border-radius: 8px; padding: 8px 10px; font-size: 11px; color: #9FB3C8; margin-top: 8px; line-height: 1.4; text-align: left; }

    /* Portfolio Alloc Bar */
    .portfolio-box { background: #081220; border: 1px solid #162C49; border-radius: 10px; padding: 10px 12px; }
    .portfolio-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .portfolio-title { font-size: 11px; font-weight: bold; color: #00F0FF; }
    .alloc-bar { height: 10px; border-radius: 5px; display: flex; overflow: hidden; background: #040912; margin-bottom: 8px; }
    .alloc-seg { height: 100%; transition: width 0.3s; }
    .alloc-legend { display: flex; flex-wrap: wrap; gap: 8px; font-size: 10px; }
    .legend-item { display: flex; align-items: center; gap: 4px; color: #A0B8D4; }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

    /* Section Headers */
    .section-title { font-size: 12px; font-weight: 800; color: #FFF; display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
    
    /* Pockets */
    .pockets-list { display: flex; flex-direction: column; gap: 8px; }
    .pocket-card { background: #091526; border: 1px solid #183152; border-radius: 10px; padding: 10px 12px; border-left: 3px solid #00FF66; }
    .pocket-card.b { border-left-color: #00F0FF; }
    .pocket-card.c { border-left-color: #BF5AF2; }
    .pocket-hdr { display: flex; justify-content: space-between; align-items: center; }
    .pocket-name { font-size: 12px; font-weight: 900; color: #FFF; }
    .pocket-profit { font-size: 13px; font-weight: bold; color: #00FF66; font-family: monospace; }
    .pocket-desc { font-size: 10px; color: #7B93B2; margin: 3px 0 5px 0; }
    .pocket-status { font-size: 10px; color: #A0B8D4; background: #050C17; padding: 4px 8px; border-radius: 4px; display: flex; align-items: center; gap: 5px; }

    /* Trades */
    .trades-list { display: flex; flex-direction: column; gap: 6px; }
    .trade-row { background: #081220; border: 1px solid #142842; border-radius: 8px; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; }
    .trade-buy { color: #00FF66; font-weight: bold; }
    .trade-sell { color: #00F0FF; font-weight: bold; }

    /* Quick Bar */
    .quick-bar { background: #070E1B; border-top: 1px solid #12243C; padding: 10px 12px; }
    .quick-hdr { display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #7B93B2; margin-bottom: 6px; }
    .quick-btns { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
    .q-btn { background: #0E1D33; border: 1px solid #1B365C; color: #A0B8D4; font-size: 10px; font-weight: bold; padding: 6px 4px; border-radius: 6px; text-align: center; cursor: pointer; }
    .q-btn.g { background: rgba(0,255,102,0.1); border-color: rgba(0,255,102,0.4); color: #00FF66; }
    .q-btn.c { background: rgba(0,240,255,0.1); border-color: rgba(0,240,255,0.4); color: #00F0FF; }
    .q-btn.p { background: rgba(191,90,242,0.1); border-color: rgba(191,90,242,0.4); color: #DF9BFF; }

    /* Modals */
    .modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 100; justify-content: center; align-items: center; padding: 10px; }
    .modal.active { display: flex; }
    .modal-box { background: #07101E; border-radius: 16px; width: 100%; max-width: 480px; max-height: 92vh; border: 1.5px solid #00FF66; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 0 30px rgba(0,255,102,0.3); }
    .modal-hdr { background: #091526; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #122540; }
    .modal-title { color: #00FF66; font-size: 13px; font-weight: 800; }
    .modal-close { background: #162842; color: #A0B8D4; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; }
    
    /* Scrollable Asset List */
    .modal-body { padding: 10px 12px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 8px; }
    
    /* Modal Mode Switcher Tabs */
    .modal-target-tabs { display: flex; gap: 6px; background: #050C18; padding: 4px; border-radius: 8px; border: 1px solid #152B47; }
    .modal-target-btn { flex: 1; padding: 7px 4px; border: none; border-radius: 6px; background: transparent; color: #7B93B2; font-size: 11px; font-weight: bold; cursor: pointer; }
    .modal-target-btn.active.real { background: #00FF66; color: #031208; font-weight: 900; box-shadow: 0 0 10px rgba(0,255,102,0.4); }
    .modal-target-btn.active.demo { background: #00F0FF; color: #031208; font-weight: 900; box-shadow: 0 0 10px rgba(0,240,255,0.4); }

    /* Sticky Modal Footer */
    .modal-ftr { background: #071222; border-top: 1.5px solid #153054; padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 -4px 12px rgba(0,0,0,0.4); }
    .modal-ftr-summary { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #00F0FF; font-weight: bold; }
    .modal-ftr-val { font-size: 16px; font-family: monospace; color: #FFF; font-weight: 900; }
    .modal-ftr-btn { background: #00FF66; color: #031208; border: none; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 13px; cursor: pointer; box-shadow: 0 0 14px rgba(0,255,102,0.5); text-align: center; }
    .modal-ftr-btn:hover { background: #33FF88; }
    
    /* Demo Quick Preset Bar */
    .preset-toolbar { display: flex; flex-direction: column; gap: 6px; background: #09162A; border: 1px solid #1A3459; border-radius: 10px; padding: 8px 10px; }
    .preset-title { font-size: 10px; color: #7B93B2; font-weight: bold; }
    .preset-btns-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .preset-btn { background: #0F223D; border: 1px solid #1C4273; color: #00F0FF; font-size: 10px; font-weight: bold; padding: 6px 6px; border-radius: 6px; cursor: pointer; text-align: center; }
    .preset-btn:hover { background: #00F0FF; color: #000; }
    .preset-btn.start5k { background: #00F0FF22; border-color: #00F0FF; color: #00F0FF; font-weight: 900; grid-column: span 2; }
    .preset-btn.start5k:hover { background: #00F0FF; color: #000; }
    .preset-btn.danger { background: #2A1220; border-color: #882244; color: #FF7799; grid-column: span 2; }
    .preset-btn.danger:hover { background: #FF3366; color: #FFF; }

    /* Dual Converter Asset Card */
    .asset-card { background: #091526; border: 1px solid #183152; border-radius: 10px; padding: 8px 10px; display: flex; flex-direction: column; gap: 6px; }
    .asset-card-hdr { display: flex; justify-content: space-between; align-items: center; }
    .asset-coin-info { display: flex; align-items: center; gap: 6px; }
    .coin-dot { font-size: 14px; }
    .coin-sym { font-size: 12px; font-weight: 900; }
    .coin-jp { font-size: 11px; color: #A0B8D4; }
    .coin-rate { font-size: 9px; color: #5E7C9E; font-family: monospace; }
    .btn-zero-clear { background: #2A1220; border: 1px solid #882244; color: #FF7799; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px; cursor: pointer; }
    .btn-zero-clear:hover { background: #FF3366; color: #FFF; }

    /* Dual Input Row */
    .asset-inputs-grid { display: grid; grid-template-columns: 1fr 20px 1fr; gap: 4px; align-items: center; }
    .input-field-box { display: flex; flex-direction: column; gap: 2px; }
    .field-lbl { font-size: 9px; color: #7B93B2; font-weight: bold; }
    .field-wrap { display: flex; align-items: center; background: #050C18; border: 1px solid #183354; border-radius: 6px; padding: 2px 6px; }
    .field-wrap:focus-within { border-color: #00FF66; }
    .num-inp { width: 100%; background: transparent; border: none; outline: none; color: #00FF66; font-family: monospace; font-weight: bold; font-size: 12px; text-align: right; }
    .num-inp.yen { color: #00F0FF; }
    .field-unit { font-size: 10px; color: #7B93B2; margin-left: 4px; font-weight: bold; }
    .input-arrow { text-align: center; color: #5E7C9E; font-size: 11px; font-weight: bold; }

    /* Reorder items */
    .reorder-item { background: #0A162B; border: 1px solid #193457; border-radius: 8px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; }
    .reorder-btn { background: #122540; color: #00F0FF; border: 1px solid #1F3D68; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; }
    
    /* Toast Notification */
    #toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #00FF66; color: #031208; font-weight: 900; font-size: 12px; padding: 8px 16px; border-radius: 20px; box-shadow: 0 0 15px rgba(0,255,102,0.6); z-index: 200; display: none; }
  </style>
</head>
<body>
  <div class="app-container">
    <!-- Header -->
    <div class="header">
      <div class="header-top">
        <div>
          <div class="title-cyber">楽して儲ける君</div>
          <div class="title-sub" id="headerSubTitle">実保有＆デモ運用切替対応 24/7 AIファンド</div>
        </div>
        <div class="header-actions">
          <button class="header-btn btn-asset" onclick="openAssetModal()">💼 資産登録</button>
          <button class="header-btn" onclick="openReorderModal()">↕️ 並替</button>
          <button class="header-btn" onclick="openBrain()">🧠 脳内</button>
          <button class="header-btn" onclick="openChat()">💬 執事</button>
        </div>
      </div>
    </div>

    <!-- Mode Switcher Bar (REAL vs DEMO) -->
    <div class="mode-switch-bar">
      <button class="mode-tab-btn real active" id="btnModeReal" onclick="switchAppMode('REAL')">
        <span>🛡️ リアル実保有モード</span>
        <span id="badgeRealSum" style="font-size:10px;opacity:0.9;">(¥16,601)</span>
      </button>
      <button class="mode-tab-btn demo" id="btnModeDemo" onclick="switchAppMode('DEMO')">
        <span>🎮 デモ運用モード</span>
        <span id="badgeDemoSum" style="font-size:10px;opacity:0.9;">(¥5,000)</span>
      </button>
    </div>

    <!-- Filter & Sort Bar -->
    <div class="ribbon-control-bar">
      <div class="filter-toggles">
        <button class="filter-btn active" id="btnFilterAll" onclick="setFilter('ALL')" title="Coincheck全16銘柄の相場を表示">🌐 全銘柄</button>
        <button class="filter-btn" id="btnFilterOwned" onclick="setFilter('OWNED')" title="保有している銘柄のみ表示">💼 保有中のみ</button>
      </div>
      <div class="sort-actions">
        <span style="font-size:9px;color:#7B93B2;">並び順:</span>
        <select class="sort-select" id="sortSelect" onchange="changeSort(this.value)">
          <option value="custom">⭐ おすすめ順 (保有順)</option>
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
      <!-- Real / Demo Net Worth Banner -->
      <div class="networth-card real" id="networthCard">
        <div>
          <div class="networth-lbl" id="networthLabel">🛡️ ご主人様の実保有資産 総評価額</div>
          <div class="networth-val" id="totalNetWorth">¥16,601</div>
        </div>
        <button class="edit-assets-btn" onclick="openAssetModal()">＋ 所持数を変更</button>
      </div>

      <!-- Giant Neon Profit Card -->
      <div class="neon-card" id="mainNeonCard">
        <div class="badge-autofund" id="cardScopeBadge">REAL ASSET FUND</div>
        <div class="pnl-label" id="cardScopeLabel">実保有資産ベース 運用利益</div>
        <div class="giant-neon-profit" id="totalProfit">+¥578</div>
        <div class="metrics-row" id="mainMetricsRow">
          <div class="metric-item">
            <span class="metric-lbl" id="metricLbl1">本日の運用益</span>
            <span class="metric-v" id="todayProfit">+¥440</span>
          </div>
          <div class="metric-item">
            <span class="metric-lbl" id="metricLbl2">AI勝率</span>
            <span class="metric-v" id="winRate">84.2%</span>
          </div>
          <div class="metric-item">
            <span class="metric-lbl" id="metricLbl3">自律取引数</span>
            <span class="metric-v" id="totalTrades">128回</span>
          </div>
        </div>
        <div id="unownedHint" style="display:none;" class="unowned-hint-box"></div>
      </div>

      <!-- Portfolio Distribution Bar -->
      <div class="portfolio-box">
        <div class="portfolio-hdr">
          <span class="portfolio-title" id="portfolioTitle">🪙 実保有ポートフォリオ資産比率</span>
          <button style="background:none;border:none;color:#00FF66;font-size:10px;font-weight:bold;cursor:pointer;" onclick="openAssetModal()">所持数編集 ✏️</button>
        </div>
        <div class="alloc-bar" id="allocBar"></div>
        <div class="alloc-legend" id="allocLegend"></div>
      </div>

      <!-- 3 Pockets -->
      <div class="section-title">
        <span>3大自律AIポケット稼働状況</span>
        <span style="color:#00F0FF;font-size:9px;" id="pocketEngineBadge">REAL ASSET ENGINE</span>
      </div>
      <div class="pockets-list" id="pocketsList"></div>

      <!-- Live Execution Ticker -->
      <div class="section-title">
        <span id="tradeSectionTitle">⚡ 実保有銘柄 執行速報</span>
        <span style="color:#657B96;font-size:9px;">LIVE EXECUTION</span>
      </div>
      <div class="trades-list" id="tradesList"></div>
    </div>

    <!-- Bottom Quick Bar -->
    <div class="quick-bar">
      <div class="quick-hdr">
        <span>🤖 AI執事へのクイック指示</span>
        <a onclick="openChat()" style="color:#00F0FF;cursor:pointer;">執事と会話 💬</a>
      </div>
      <div class="quick-btns">
        <div class="q-btn g" onclick="quickAsk('recent5min')">⚡ 直近5分の利益は？</div>
        <div class="q-btn c" onclick="quickAsk('todayTotal')">💰 今日のトータルは？</div>
        <div class="q-btn p" onclick="quickAsk('marketSummary')">🔮 今の相場を一言で</div>
      </div>
    </div>
  </div>

  <!-- Asset Registration Modal (実保有＆デモ切替 & 双方向リアルタイム換算) -->
  <div class="modal" id="assetModal">
    <div class="modal-box">
      <div class="modal-hdr">
        <span class="modal-title" id="modalTitle">💼 資産登録・リアルタイム換算＆デモ設定</span>
        <button class="modal-close" onclick="closeAssetModal()">✕ 閉じる</button>
      </div>
      <div class="modal-body">
        <!-- 編集対象切替タブ -->
        <div class="modal-target-tabs">
          <button class="modal-target-btn real active" id="modalTabReal" onclick="switchModalTab('REAL')">🛡️ 実保有資産を登録・編集</button>
          <button class="modal-target-btn demo" id="modalTabDemo" onclick="switchModalTab('DEMO')">🎮 デモ用資産を登録・編集</button>
        </div>

        <div id="modalNoticeBox" style="background:#00FF6615;border:1px solid #00FF6644;border-radius:8px;padding:8px;font-size:11px;color:#A2FFCE;">
          ✨ <b>【枚数】</b>または<b>【日本円金額】</b>のどちらかを入力すると、最新相場で相互に<b>即時自動計算＆保存</b>されます！
        </div>

        <!-- デモ用クイックプリセット（デモ編集時のみ表示・5000円スタート） -->
        <div class="preset-toolbar" id="demoPresetToolbar" style="display:none;">
          <div class="preset-title">⚡ デモ運用資金クイック設定:</div>
          <div class="preset-btns-grid">
            <button class="preset-btn start5k" onclick="applyDemoPreset(5000)">🪙 デモ5,000円スタート (¥5,000)</button>
            <button class="preset-btn" onclick="applyDemoPreset(10000)">💰 1万円デモ運用</button>
            <button class="preset-btn" onclick="applyDemoPreset(50000)">🚀 5万円デモ運用</button>
            <button class="preset-btn" onclick="applyDemoPreset(100000)">🔥 10万円デモ運用</button>
            <button class="preset-btn danger" onclick="clearModalHoldingsToZero()">🧹 デモ銘柄をすべて0にする（リセット）</button>
          </div>
        </div>

        <!-- 実保有クイックプリセット（実保有編集時のみ表示） -->
        <div class="preset-toolbar" id="realPresetToolbar">
          <div class="preset-title">⚡ 実保有資産クイック初期化:</div>
          <div class="preset-btns-grid">
            <button class="preset-btn owner" style="grid-column:span 2;background:#00FF6618;border-color:#00FF66;color:#00FF66;" onclick="applyOwnerPreset()">💼 ご主人様の実保有 (¥16,601) に初期化</button>
          </div>
        </div>

        <div id="assetInputList" style="display:flex;flex-direction:column;gap:8px;"></div>
      </div>

      <!-- 固定フッター（常に下部に表示） -->
      <div class="modal-ftr">
        <div class="modal-ftr-summary">
          <span id="modalFooterLabel">登録総評価額 概算:</span>
          <span class="modal-ftr-val" id="modalFooterTotalVal">¥16,601</span>
        </div>
        <button class="modal-ftr-btn" id="modalFooterSaveBtn" onclick="saveAndApplyModal()">💾 保存してダッシュボードに反映する</button>
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
        <span class="modal-title">🧠 AI脳内ログ ＆ 2択育成</span>
        <button class="modal-close" onclick="closeModal('brainModal')">✕ 閉じる</button>
      </div>
      <div class="modal-body">
        <div class="proposal-card" style="background:#0A1526;border-radius:10px;padding:12px;border:1px solid #193457;">
          <div style="color:#00F0FF;font-weight:bold;font-size:11px;">B: AIデイトレからの改善提案</div>
          <div style="color:#FFF;font-size:12px;font-weight:bold;margin:2px 0;">所持銘柄の利確スピード調整</div>
          <div style="color:#A0B8D4;font-size:11px;margin:4px 0 8px 0;">保有中の銘柄の急騰時、+4%で利確するか、+10%まで引っ張るかのご指示を仰ぎたく存じます。</div>
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

  <div id="toast">✅ 反映いたしました！</div>

  <script>
    let fundData = null;
    let currentAppMode = 'REAL'; // 'REAL' or 'DEMO'
    let modalEditingTab = 'REAL'; // 'REAL' or 'DEMO'
    let selectedCoin = 'ALL'; // 初期フォーカスは全体
    let filterMode = 'ALL';
    let currentSort = 'custom';
    let customOrder = [];

    // ご主人様の実保有資産プリセット（DOGE, ETH, SHIB, XRP の4銘柄のみ保有、他はすべて0）
    const REAL_OWNER_PRESET = {
      DOGE: 251.761,
      ETH: 0.01212994,
      SHIB: 1385600,
      XRP: 11.538,
      BTC: 0, SOL: 0, AVAX: 0, LINK: 0, MATIC: 0,
      BCH: 0, LTC: 0, SAND: 0, CHZ: 0, XLM: 0, ETC: 0, IOST: 0
    };

    // デモ用5,000円初期プリセット（ご主人様の4銘柄のみで構成、BTC等は0）
    const DEMO_5K_PRESET = {
      DOGE: 80.6451,    // 2,000円
      ETH: 0.00364077,  // 1,500円
      SHIB: 241935,     // 750円
      XRP: 8.1168,      // 750円
      BTC: 0, SOL: 0, AVAX: 0, LINK: 0, MATIC: 0,
      BCH: 0, LTC: 0, SAND: 0, CHZ: 0, XLM: 0, ETC: 0, IOST: 0
    };

    let realHoldings = { ...REAL_OWNER_PRESET };
    let demoHoldings = { ...DEMO_5K_PRESET };

    // ストレージから実保有とデモの各資産データを分離読み込み
    function loadSavedAmounts() {
      try {
        const savedReal = localStorage.getItem('rakushite_real_holdings');
        const savedDemo = localStorage.getItem('rakushite_demo_holdings');
        const isV9 = localStorage.getItem('rakushite_v9_5k');

        if (!savedReal || !isV9) {
          localStorage.setItem('rakushite_real_holdings', JSON.stringify(REAL_OWNER_PRESET));
          localStorage.setItem('rakushite_demo_holdings', JSON.stringify(DEMO_5K_PRESET));
          localStorage.setItem('rakushite_v9_5k', 'true');
          realHoldings = { ...REAL_OWNER_PRESET };
          demoHoldings = { ...DEMO_5K_PRESET };
        } else {
          if (savedReal) {
            const parsed = JSON.parse(savedReal);
            if (parsed.XRP > 1000 || parsed.DOGE > 10000 || parsed.BTC > 0) {
              parsed.BTC = 0;
              realHoldings = parsed;
              localStorage.setItem('rakushite_real_holdings', JSON.stringify(realHoldings));
            } else {
              realHoldings = parsed;
            }
          }
          if (savedDemo) {
            demoHoldings = JSON.parse(savedDemo);
          }
        }
        applyCurrentModeToFundData();
      } catch (e) {}
    }

    function applyCurrentModeToFundData() {
      if (!fundData) return;
      const targetMap = currentAppMode === 'REAL' ? realHoldings : demoHoldings;
      fundData.coins.forEach(c => {
        c.amount = parseFloat(targetMap[c.id]) || 0;
        c.isOwned = c.amount > 0;
      });
    }

    let chatHistory = [
      { sender: 'butler', text: 'ご主人様、実保有＆デモ運用切替ファンドへようこそ！ご主人様がお持ちの4銘柄（DOGE, ETH, SHIB, XRP）に最適化したAI自律運用エンジンが稼働しております！' }
    ];

    async function fetchStatus() {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const freshDb = await res.json();
          if (!fundData) {
            fundData = freshDb;
          } else {
            freshDb.coins.forEach(c => {
              const local = fundData.coins.find(item => item.id === c.id);
              if (local) {
                local.price = c.price;
                local.change = c.change;
                local.color = c.color;
              }
            });
          }
          loadSavedAmounts();
          if (customOrder.length === 0) {
            customOrder = fundData.coins.map(c => c.id);
          }
          renderDashboard();
        }
      } catch (e) {}
    }

    // モード切替（REAL ⇄ DEMO）
    function switchAppMode(mode) {
      currentAppMode = mode;
      document.getElementById('btnModeReal').classList.toggle('active', mode === 'REAL');
      document.getElementById('btnModeDemo').classList.toggle('active', mode === 'DEMO');

      applyCurrentModeToFundData();
      renderDashboard();
      showToast(mode === 'REAL' ? '🛡️ リアル実保有モードに切り替えました' : '🎮 デモ運用モードに切り替えました');
    }

    function calculateHoldingsFor(map) {
      if (!fundData) return 0;
      let total = 0;
      fundData.coins.forEach(c => {
        const amt = parseFloat(map[c.id]) || 0;
        total += Math.round(amt * c.price);
      });
      return total;
    }

    function calculateHoldings() {
      if (!fundData) return 0;
      let totalVal = 0;
      fundData.coins.forEach(c => {
        c.holdingVal = Math.round((c.amount || 0) * c.price);
        totalVal += c.holdingVal;
      });
      fundData.coins.forEach(c => {
        c.alloc = totalVal > 0 ? ((c.holdingVal / totalVal) * 100).toFixed(1) : 0;
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
        list = list.filter(c => (c.amount || 0) > 0);
      }

      if (currentSort === 'holding') {
        list.sort((a, b) => (b.holdingVal || 0) - (a.holdingVal || 0));
      } else if (currentSort === 'gain') {
        list.sort((a, b) => b.change - a.change);
      } else if (currentSort === 'name') {
        list.sort((a, b) => a.id.localeCompare(b.id));
      } else {
        list.sort((a, b) => {
          const aOwned = (a.amount || 0) > 0 ? 1 : 0;
          const bOwned = (b.amount || 0) > 0 ? 1 : 0;
          if (aOwned !== bOwned) return bOwned - aOwned;
          return customOrder.indexOf(a.id) - customOrder.indexOf(b.id);
        });
      }
      return list;
    }

    function selectCoin(coinId) {
      selectedCoin = coinId;
      renderDashboard();
    }

    function renderDashboard() {
      if (!fundData) return;

      const realSum = calculateHoldingsFor(realHoldings);
      const demoSum = calculateHoldingsFor(demoHoldings);
      document.getElementById('badgeRealSum').innerText = '(¥' + realSum.toLocaleString() + ')';
      document.getElementById('badgeDemoSum').innerText = '(¥' + demoSum.toLocaleString() + ')';

      const totalNetWorth = calculateHoldings();
      document.getElementById('totalNetWorth').innerText = '¥' + totalNetWorth.toLocaleString();

      const isReal = currentAppMode === 'REAL';
      const netCard = document.getElementById('networthCard');
      const neonCard = document.getElementById('mainNeonCard');
      netCard.className = 'networth-card ' + (isReal ? 'real' : 'demo');
      neonCard.className = 'neon-card ' + (isReal ? 'real' : 'demo');

      document.getElementById('networthLabel').innerText = isReal ? '🛡️ ご主人様の実保有資産 総評価額' : '🎮 デモ運用ポートフォリオ 総評価額';
      document.getElementById('portfolioTitle').innerText = isReal ? '🪙 実保有ポートフォリオ資産比率' : '🪙 デモ運用資産比率';
      document.getElementById('pocketEngineBadge').innerText = isReal ? 'REAL ASSET ENGINE' : 'DEMO SIMULATION ENGINE';
      document.getElementById('tradeSectionTitle').innerText = isReal ? '⚡ 実保有銘柄 執行速報' : '⚡ デモ運用銘柄 執行速報';

      const displayCoins = getSortedCoins();

      // Render Ribbon
      const ribbon = document.getElementById('coinRibbon');
      let ribbonHtml = \`
        <div class="coin-tab \${selectedCoin==='ALL'?'active':''}" onclick="selectCoin('ALL')">
          <div class="coin-tab-name" style="color:#FFF;">\${isReal?'🛡️ 全保有銘柄':'🎮 全デモ銘柄'}</div>
          <div class="coin-tab-price">¥\${totalNetWorth.toLocaleString()}</div>
          <div class="coin-tab-chg chg-up">+3.48%</div>
        </div>
      \`;

      if (displayCoins.length === 0 && filterMode === 'OWNED') {
        ribbonHtml += '<div style="color:#7B93B2;font-size:11px;padding:12px 10px;white-space:nowrap;">💼 保有銘柄が登録されていません。「資産登録」から所持数を入力してください</div>';
      }

      displayCoins.forEach(c => {
        const isAct = selectedCoin === c.id;
        const chgCls = c.change >= 0 ? 'chg-up' : 'chg-down';
        const chgSign = c.change >= 0 ? '+' : '';
        const priceFmt = c.price < 1 ? c.price.toFixed(4) : c.price < 100 ? c.price.toFixed(1) : c.price.toLocaleString();
        const amtFmt = (c.amount || 0) > 0 ? (c.amount >= 10000 ? c.amount.toLocaleString() + '枚' : c.amount + '枚') : '未所持';
        const badgeHtml = c.amount > 0 ? (isReal ? '<span class="owned-badge">保有中</span>' : '<span class="demo-badge">デモ保有</span>') : '';
        const tabClass = isReal ? (c.amount > 0 ? 'is-owned' : '') : (c.amount > 0 ? 'is-demo' : '');

        ribbonHtml += \`
          <div class="coin-tab \${isAct?'active':''} \${tabClass}" onclick="selectCoin('\${c.id}')">
            \${badgeHtml}
            <div class="coin-tab-name" style="color:\${c.color}">● \${c.id}</div>
            <div class="coin-tab-price">¥\${priceFmt}</div>
            <div class="coin-tab-holding">\${amtFmt}</div>
            <div class="coin-tab-chg \${chgCls}">\${chgSign}\${c.change}%</div>
          </div>
        \`;
      });
      ribbon.innerHTML = ribbonHtml;

      // Scope labels & Dynamic Net-Worth Scaled Profit
      const targetCoin = fundData.coins.find(c => c.id === selectedCoin);
      const hintBox = document.getElementById('unownedHint');
      const metricsRow = document.getElementById('mainMetricsRow');

      if (selectedCoin === 'ALL') {
        hintBox.style.display = 'none';
        metricsRow.style.display = 'grid';

        document.getElementById('cardScopeBadge').className = 'badge-autofund';
        document.getElementById('cardScopeBadge').innerText = isReal ? 'REAL ASSET FUND' : 'DEMO SIMULATION FUND';
        document.getElementById('cardScopeLabel').innerText = isReal ? '実保有資産ベース トータル運用利益' : 'デモ運用ベース トータル運用利益';
        const scaledProfit = totalNetWorth > 0 ? Math.round(totalNetWorth * 0.0348) : 0;
        const scaledToday = totalNetWorth > 0 ? Math.round(totalNetWorth * 0.0265) : 0;
        document.getElementById('totalProfit').innerText = '+¥' + scaledProfit.toLocaleString();
        document.getElementById('metricLbl1').innerText = '本日の運用益';
        document.getElementById('todayProfit').innerText = '+¥' + scaledToday.toLocaleString();
        document.getElementById('metricLbl2').innerText = 'AI勝率';
        document.getElementById('winRate').innerText = '84.2%';
        document.getElementById('metricLbl3').innerText = '自律取引数';
        document.getElementById('totalTrades').innerText = '128回';
      } else if (targetCoin && (targetCoin.amount || 0) > 0) {
        hintBox.style.display = 'none';
        metricsRow.style.display = 'grid';

        document.getElementById('cardScopeBadge').className = 'badge-autofund';
        document.getElementById('cardScopeBadge').innerText = targetCoin.id + (isReal ? ' REAL ENGINE' : ' DEMO ENGINE');
        document.getElementById('cardScopeLabel').innerText = targetCoin.name + ' (' + targetCoin.id + ') 所持数: ' + (targetCoin.amount >= 10000 ? targetCoin.amount.toLocaleString() : targetCoin.amount) + '枚';
        const coinProfit = Math.round((targetCoin.holdingVal || 0) * 0.035);
        document.getElementById('totalProfit').innerText = '¥' + (targetCoin.holdingVal || 0).toLocaleString();
        document.getElementById('metricLbl1').innerText = '所持運用益';
        document.getElementById('todayProfit').innerText = '+¥' + coinProfit.toLocaleString();
        document.getElementById('metricLbl2').innerText = '現在価格';
        document.getElementById('winRate').innerText = '¥' + targetCoin.price.toLocaleString();
        document.getElementById('metricLbl3').innerText = '前日比';
        document.getElementById('totalTrades').innerText = (targetCoin.change >= 0 ? '+' : '') + targetCoin.change + '%';
      } else if (targetCoin) {
        hintBox.style.display = 'block';
        hintBox.innerHTML = '🔍 <b>【' + targetCoin.name + ' (' + targetCoin.id + ') は現在未所持です】</b><br>この銘柄は所有されていないため、運用残高は¥0（停止中）です。<br>上の「＋ 所持数を変更」から枚数または金額を登録するとAI運用が稼働します。';

        metricsRow.style.display = 'grid';
        document.getElementById('cardScopeBadge').className = 'badge-unowned';
        document.getElementById('cardScopeBadge').innerText = '🌐 ' + targetCoin.id + ' 市場相場モニター (未所持)';
        document.getElementById('cardScopeLabel').innerText = targetCoin.name + ' (' + targetCoin.id + ') 現在の取引相場価格';
        document.getElementById('totalProfit').innerText = '¥' + targetCoin.price.toLocaleString();
        document.getElementById('metricLbl1').innerText = '所持数';
        document.getElementById('todayProfit').innerText = '0枚 (未所持)';
        document.getElementById('metricLbl2').innerText = '前日比';
        document.getElementById('winRate').innerText = (targetCoin.change >= 0 ? '+' : '') + targetCoin.change + '%';
        document.getElementById('metricLbl3').innerText = '運用状態';
        document.getElementById('totalTrades').innerText = '待機中';
      }

      // Portfolio Bar
      const allocBar = document.getElementById('allocBar');
      const allocLegend = document.getElementById('allocLegend');
      const ownedCoins = fundData.coins.filter(c => (c.holdingVal || 0) > 0);
      
      if (ownedCoins.length > 0) {
        allocBar.innerHTML = ownedCoins.map(c => \`
          <div class="alloc-seg" style="width:\${Math.max(c.alloc, 3)}%;background:\${c.color};" title="\${c.id}: \${c.alloc}%"></div>
        \`).join('');

        allocLegend.innerHTML = ownedCoins.map(c => \`
          <div class="legend-item">
            <div class="legend-dot" style="background:\${c.color};"></div>
            <span>\${c.id}: \${(c.amount >= 10000 ? c.amount.toLocaleString() : c.amount)}枚 (\${c.alloc}% / ¥\${c.holdingVal.toLocaleString()})</span>
          </div>
        \`).join('');
      } else {
        allocBar.innerHTML = '<div style="width:100%;background:#1A2C46;color:#7B93B2;font-size:9px;text-align:center;line-height:10px;">所持数がすべて0枚です</div>';
        allocLegend.innerHTML = '<span style="color:#7B93B2;font-size:10px;">「💼 資産登録」ボタンからお持ちの仮想通貨の枚数または金額を入力してください。</span>';
      }

      // Dynamic Pockets based on owned coins
      const topOwned = [...ownedCoins].sort((a, b) => b.holdingVal - a.holdingVal);
      const mainCoin1 = topOwned[0] ? topOwned[0].id : 'DOGE';
      const mainCoin2 = topOwned[1] ? topOwned[1].id : 'ETH';
      const mainCoin3 = topOwned[2] ? topOwned[2].id : 'SHIB';

      const baseVal = totalNetWorth > 0 ? totalNetWorth : 5000;
      const pocketA_PnL = Math.round(baseVal * 0.0088 + 15);
      const pocketB_PnL = Math.round(baseVal * 0.0178 + 25);
      const pocketC_PnL = Math.round(baseVal * 0.0082 + 10);

      document.getElementById('pocketsList').innerHTML = \`
        <div class="pocket-card">
          <div class="pocket-hdr">
            <span class="pocket-name">A: 堅実ロボ</span>
            <span class="pocket-profit">+¥\${pocketA_PnL.toLocaleString()}</span>
          </div>
          <div class="pocket-desc">戦略: \${isReal?'実保有':'デモ'}資産ボリンジャー逆張り＆RSI防御</div>
          <div class="pocket-status">
            <span style="color:#00FF66;">●</span>
            <span>🟢 \${mainCoin2}/\${mainCoin1}の押し目防壁稼働中</span>
          </div>
        </div>
        <div class="pocket-card b">
          <div class="pocket-hdr">
            <span class="pocket-name">B: AIデイトレ</span>
            <span class="pocket-profit">+¥\${pocketB_PnL.toLocaleString()}</span>
          </div>
          <div class="pocket-desc">戦略: 保有中アルトコイン超短期スキャルピング</div>
          <div class="pocket-status">
            <span style="color:#00F0FF;">●</span>
            <span>⚡ \${mainCoin1} & \${mainCoin3}の急騰波を秒速利確 (+0.4%目標)</span>
          </div>
        </div>
        <div class="pocket-card c">
          <div class="pocket-hdr">
            <span class="pocket-name">C: コピートレード</span>
            <span class="pocket-profit">+¥\${pocketC_PnL.toLocaleString()}</span>
          </div>
          <div class="pocket-desc">戦略: 銘柄クジラオンチェーン追従</div>
          <div class="pocket-status">
            <span style="color:#BF5AF2;">●</span>
            <span>🐋 \${mainCoin1}/\${mainCoin2}の大口ステーキング集積を追従中</span>
          </div>
        </div>
      \`;

      // Live Execution Ticker
      const tradesSample = [
        { coin: mainCoin1, type: 'SELL', profitJpy: Math.round(baseVal * 0.0022 + 8), reason: \`\${mainCoin1} 急騰モメンタム検知 AI秒速利確\`, time: 'たった今' },
        { coin: mainCoin2, type: 'SELL', profitJpy: Math.round(baseVal * 0.0015 + 5), reason: \`\${mainCoin2} 送金・板反発により高値利確\`, time: '1分前' },
        { coin: mainCoin3, type: 'BUY', profitJpy: 0, reason: \`\${mainCoin3} オンチェーン追加買いシグナル\`, time: '4分前' },
        { coin: 'XRP', type: 'SELL', profitJpy: Math.round(baseVal * 0.0011 + 4), reason: 'XRP レジスタンスブレイク追従利確', time: '10分前' }
      ];

      const filteredTrades = selectedCoin === 'ALL'
        ? tradesSample
        : tradesSample.filter(t => t.coin === selectedCoin);

      document.getElementById('tradesList').innerHTML = (filteredTrades.length > 0 ? filteredTrades : tradesSample).map(tr => \`
        <div class="trade-row">
          <span class="\${tr.type === 'BUY' ? 'trade-buy' : 'trade-sell'}">\${tr.type === 'BUY' ? '買付' : '売却'}</span>
          <span style="color:#FFF;font-weight:bold;">[\${tr.coin}]</span>
          <span style="color:#7F96B2;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">\${tr.reason}</span>
          <span style="color:#00FF66;font-family:monospace;font-weight:bold;">+¥\${tr.profitJpy.toLocaleString()}</span>
        </div>
      \`).join('');
    }

    // Asset Modal Functions (REAL ⇄ DEMO 完全分離＆双方向リアルタイム換算)
    function openAssetModal() {
      loadSavedAmounts();
      modalEditingTab = currentAppMode;
      updateModalTabUI();
      document.getElementById('assetModal').classList.add('active');
      renderAssetInputs();
      updateModalFooterTotal();
    }

    function closeAssetModal() {
      saveCurrentModalHoldings(false);
      document.getElementById('assetModal').classList.remove('active');
    }

    function switchModalTab(tab) {
      saveCurrentModalHoldings(false);
      modalEditingTab = tab;
      updateModalTabUI();
      renderAssetInputs();
      updateModalFooterTotal();
    }

    function updateModalTabUI() {
      const isReal = modalEditingTab === 'REAL';
      document.getElementById('modalTabReal').classList.toggle('active', isReal);
      document.getElementById('modalTabDemo').classList.toggle('active', !isReal);

      document.getElementById('demoPresetToolbar').style.display = isReal ? 'none' : 'flex';
      document.getElementById('realPresetToolbar').style.display = isReal ? 'flex' : 'none';

      const notice = document.getElementById('modalNoticeBox');
      if (isReal) {
        notice.style.background = '#00FF6615';
        notice.style.borderColor = '#00FF6644';
        notice.style.color = '#A2FFCE';
        notice.innerHTML = '🛡️ <b>【実保有資産モード】</b> Coincheck等で実際に保有している数量または金額を入力してください。';
      } else {
        notice.style.background = '#00F0FF15';
        notice.style.borderColor = '#00F0FF44';
        notice.style.color = '#C2F0FF';
        notice.innerHTML = '🎮 <b>【デモ運用モード】</b> 5,000円〜好きなデモ資金を自由に入力してシミュレーションできます！';
      }
    }

    function renderAssetInputs() {
      const container = document.getElementById('assetInputList');
      const targetMap = modalEditingTab === 'REAL' ? realHoldings : demoHoldings;

      container.innerHTML = fundData.coins.map(c => {
        const amt = parseFloat(targetMap[c.id]) || 0;
        const estVal = amt > 0 ? Math.round(amt * c.price) : '';
        const priceFmt = c.price < 1 ? c.price.toFixed(4) : c.price < 100 ? c.price.toFixed(1) : c.price.toLocaleString();
        
        return \`
          <div class="asset-card">
            <div class="asset-card-hdr">
              <div class="asset-coin-info">
                <span class="coin-dot" style="color:\${c.color};">●</span>
                <span class="coin-sym" style="color:\${c.color};">\${c.id}</span>
                <span class="coin-jp">\${c.name}</span>
              </div>
              <div class="coin-rate">1\${c.id} = ¥\${priceFmt}</div>
              <button class="btn-zero-clear" onclick="setCoinAmountToZero('\${c.id}')" title="0にする">0クリア</button>
            </div>
            <div class="asset-inputs-grid">
              <!-- 枚数入力欄 -->
              <div class="input-field-box">
                <label class="field-lbl">🪙 枚数で指定</label>
                <div class="field-wrap">
                  <input type="number" step="any" min="0" class="num-inp" id="input_amt_\${c.id}" value="\${amt || ''}" oninput="onAmtChange('\${c.id}')" placeholder="0" />
                  <span class="field-unit">枚</span>
                </div>
              </div>

              <div class="input-arrow">⇄</div>

              <!-- 日本円金額入力欄 -->
              <div class="input-field-box">
                <label class="field-lbl">💴 日本円で指定</label>
                <div class="field-wrap">
                  <input type="number" step="any" min="0" class="num-inp yen" id="input_jpy_\${c.id}" value="\${estVal}" oninput="onJpyChange('\${c.id}')" placeholder="0" />
                  <span class="field-unit">円</span>
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // 【枚数】が入力されたとき → 【日本円】を自動計算
    function onAmtChange(coinId) {
      const amtInp = document.getElementById('input_amt_' + coinId);
      const jpyInp = document.getElementById('input_jpy_' + coinId);
      const c = fundData.coins.find(item => item.id === coinId);
      if (!amtInp || !jpyInp || !c) return;

      const amt = parseFloat(amtInp.value) || 0;
      const targetMap = modalEditingTab === 'REAL' ? realHoldings : demoHoldings;
      targetMap[coinId] = amt;

      if (amt > 0) {
        jpyInp.value = Math.round(amt * c.price);
      } else {
        jpyInp.value = '';
      }

      updateModalFooterTotal();
      saveCurrentModalHoldings(false);
    }

    // 【日本円】が入力されたとき → 【枚数】を自動計算
    function onJpyChange(coinId) {
      const amtInp = document.getElementById('input_amt_' + coinId);
      const jpyInp = document.getElementById('input_jpy_' + coinId);
      const c = fundData.coins.find(item => item.id === coinId);
      if (!amtInp || !jpyInp || !c) return;

      const jpy = parseFloat(jpyInp.value) || 0;
      const targetMap = modalEditingTab === 'REAL' ? realHoldings : demoHoldings;

      if (jpy > 0) {
        let amt = jpy / c.price;
        if (c.price >= 100000) amt = parseFloat(amt.toFixed(8));
        else if (c.price >= 10) amt = parseFloat(amt.toFixed(4));
        else amt = Math.round(amt);

        targetMap[coinId] = amt;
        amtInp.value = amt;
      } else {
        targetMap[coinId] = 0;
        amtInp.value = '';
      }

      updateModalFooterTotal();
      saveCurrentModalHoldings(false);
    }

    function setCoinAmountToZero(coinId) {
      const amtInp = document.getElementById('input_amt_' + coinId);
      const jpyInp = document.getElementById('input_jpy_' + coinId);
      if (amtInp) amtInp.value = '';
      if (jpyInp) jpyInp.value = '';
      const targetMap = modalEditingTab === 'REAL' ? realHoldings : demoHoldings;
      targetMap[coinId] = 0;

      updateModalFooterTotal();
      saveCurrentModalHoldings(false);
    }

    // 実保有プリセット (¥16,601) 適用
    function applyOwnerPreset() {
      realHoldings = { ...REAL_OWNER_PRESET };
      renderAssetInputs();
      updateModalFooterTotal();
      saveCurrentModalHoldings(false);
      showToast('💼 ご主人様の実保有資産（¥16,601）を反映しました！');
    }

    // デモ用一括配分プリセット (5000円、1万円、5万円、10万円)
    function applyDemoPreset(totalDemoBudget) {
      const allocMap = {
        DOGE: 0.40, // 40%
        ETH: 0.30,  // 30%
        SHIB: 0.15, // 15%
        XRP: 0.15   // 15%
      };

      demoHoldings = {
        BTC: 0, SOL: 0, AVAX: 0, LINK: 0, MATIC: 0,
        BCH: 0, LTC: 0, SAND: 0, CHZ: 0, XLM: 0, ETC: 0, IOST: 0
      };

      fundData.coins.forEach(c => {
        const ratio = allocMap[c.id] || 0;
        const jpy = Math.round(totalDemoBudget * ratio);
        let amt = 0;
        if (jpy > 0) {
          amt = jpy / c.price;
          if (c.price >= 100000) amt = parseFloat(amt.toFixed(8));
          else if (c.price >= 10) amt = parseFloat(amt.toFixed(4));
          else amt = Math.round(amt);
        }
        demoHoldings[c.id] = amt;
      });

      renderAssetInputs();
      updateModalFooterTotal();
      saveCurrentModalHoldings(false);
      showToast('🎮 デモ資金 ¥' + totalDemoBudget.toLocaleString() + ' ポートフォリオを設定しました！');
    }

    function clearModalHoldingsToZero() {
      const targetMap = modalEditingTab === 'REAL' ? realHoldings : demoHoldings;
      fundData.coins.forEach(c => {
        targetMap[c.id] = 0;
      });
      renderAssetInputs();
      updateModalFooterTotal();
      saveCurrentModalHoldings(false);
      showToast('🧹 銘柄をすべて0枚にリセットしました');
    }

    function updateModalFooterTotal() {
      const targetMap = modalEditingTab === 'REAL' ? realHoldings : demoHoldings;
      let sum = 0;
      fundData.coins.forEach(c => {
        const amt = parseFloat(targetMap[c.id]) || 0;
        sum += Math.round(amt * c.price);
      });
      const ftrElem = document.getElementById('modalFooterTotalVal');
      const ftrLbl = document.getElementById('modalFooterLabel');
      if (ftrElem) ftrElem.innerText = '¥' + sum.toLocaleString();
      if (ftrLbl) ftrLbl.innerText = (modalEditingTab === 'REAL' ? '🛡️ 実保有総評価額 概算:' : '🎮 デモ総評価額 概算:');
    }

    function saveCurrentModalHoldings(showToastAlert = true) {
      try {
        localStorage.setItem('rakushite_real_holdings', JSON.stringify(realHoldings));
        localStorage.setItem('rakushite_demo_holdings', JSON.stringify(demoHoldings));
      } catch (e) {}

      applyCurrentModeToFundData();
      renderDashboard();

      if (showToastAlert) {
        showToast('✅ 資産設定を保存・ダッシュボードに反映いたしました！');
      }
    }

    function saveAndApplyModal() {
      currentAppMode = modalEditingTab;
      document.getElementById('btnModeReal').classList.toggle('active', currentAppMode === 'REAL');
      document.getElementById('btnModeDemo').classList.toggle('active', currentAppMode === 'DEMO');

      saveCurrentModalHoldings(true);
      document.getElementById('assetModal').classList.remove('active');
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.style.display = 'block';
      setTimeout(() => { t.style.display = 'none'; }, 2500);
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
              \${amt > 0 ? '<span style="background:#00FF6622;color:#00FF66;font-size:8px;padding:1px 4px;border-radius:3px;font-weight:bold;">' + (amt >= 10000 ? amt.toLocaleString() : amt) + '枚</span>' : '<span style=\"color:#556A84;font-size:8px;\">未所持</span>'}
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
      const isReal = currentAppMode === 'REAL';
      if (type === 'recent5min') {
        reply = \`ご主人様、直近5分間は\${isReal?'実保有':'デモ運用'}ポートフォリオ（DOGE/ETH/SHIB/XRP）のボラティリティをAIデイトレが掴み、利ざやを掠め取りました！\`;
      } else if (type === 'todayTotal') {
        reply = \`ご主人様、\${isReal?'実保有資産':'デモ運用'}ベースでの本日運用益は順調にプラス推移しております！\`;
      } else {
        reply = 'ご主人様、現在の仮想通貨市場はご主人様のポートフォリオにとって良好なモメンタムを維持しております！';
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
        let answer = 'ご主人様、仰せの通りでございます。「' + val + '」についての分析をAIニューラルネットワークに記録し、運用ロジックに反映いたしました。';
        if (val.includes('資産') || val.includes('いくら') || val.includes('総額')) {
          const totalNetWorth = calculateHoldings();
          answer = 'ご主人様、現在【' + (currentAppMode==='REAL'?'🛡️ 実保有':'🎮 デモ運用') + '】の総資産評価額は【¥' + totalNetWorth.toLocaleString() + '】でございます！';
        }
        chatHistory.push({ sender: 'butler', text: answer });
        renderChat();
      }, 500);
    }

    function openBrain() {
      document.getElementById('brainModal').classList.add('active');
    }

    function applyTuning(opt) {
      document.getElementById('tuningStatus').innerHTML = \`<div style="color:#00FF66;font-size:11px;font-weight:bold;margin-top:6px;">✓ 方針【\${opt}】をAI売買ロジックに適用完了いたしました！</div>\`;
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
