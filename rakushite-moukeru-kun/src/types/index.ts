export type PocketId = 'pocketA' | 'pocketB' | 'pocketC';

export interface PocketInfo {
  id: PocketId;
  name: string;
  strategyName: string;
  tag: string;
  description: string;
  allocatedJpy: number; // 割り当てられた日本円（仮想/実）
  btcHolding: number; // 保有BTC数量
  avgBuyPrice: number; // 平均取得単価
  realizedPnL: number; // 確定損益
  unrealizedPnL: number; // 含み損益
  winCount: number;
  lossCount: number;
  tradeCount: number;
  statusText: string; // 1行のチカチカ光るステータス
  statusLevel: 'active' | 'analyzing' | 'trading' | 'standby';
  lastActionTime: string;
}

export interface TradeRecord {
  id: string;
  pocketId: PocketId;
  pocketName: string;
  type: 'BUY' | 'SELL';
  btcAmount: number;
  priceJpy: number;
  totalJpy: number;
  profitJpy?: number;
  reason: string;
  timestamp: string;
  isReal: boolean;
}

export interface ButlerMessage {
  id: string;
  sender: 'butler' | 'user';
  text: string;
  timestamp: string;
  category?: 'quick' | 'chat' | 'proposal' | 'alert';
}

export interface AiTuningProposal {
  id: string;
  title: string;
  contextReason: string; // 例: 「直近の急激な下落相場において、一時的な含み損が発生いたしました」
  pocketId: PocketId;
  pocketName: string;
  optionA: {
    id: 'A';
    label: string; // 例: 「リスクを避けて早めに損切りする」
    effectSummary: string; // 損切り幅を-1.5%に設定、保守重視
    promptModifier: string;
  };
  optionB: {
    id: 'B';
    label: string; // 例: 「多少の変動は耐えて利益を伸ばす」
    effectSummary: string; // 利確目標を+4.0%に拡大、ホールド継続
    promptModifier: string;
  };
  chosenOption?: 'A' | 'B';
  createdAt: string;
  applied: boolean;
}

export interface AiLearningLog {
  id: string;
  timestamp: string;
  pocketId: PocketId;
  thoughtProcess: string; // AIの思考ロジック
  marketSentiment: 'SUPER_BULL' | 'BULL' | 'NEUTRAL' | 'BEAR' | 'PANIC';
  decision: string;
  confidenceScore: number; // 0 - 100
  reflectionNotes: string; // トレード後の反省
}

export interface CoincheckTicker {
  last: number;
  bid: number;
  ask: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
  change24h?: number;
  change24hPercent?: number;
}

export interface AppSettings {
  geminiApiKey: string;
  coincheckApiKey: string;
  coincheckApiSecret: string;
  isRealTradingEnabled: boolean;
  killSwitchActive: boolean;
  initialDemoFundsJpy: number;
  autoTradingIntervalSeconds: number;
  panicDropThresholdPercent: number; // デフォルト5%
  lastBaselinePrice: number;
  baselineTime: string;
}
