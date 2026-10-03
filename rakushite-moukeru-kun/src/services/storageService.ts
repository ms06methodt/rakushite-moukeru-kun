import AsyncStorage from '@react-native-async-storage/async-storage';
import { AiLearningLog, AiTuningProposal, AppSettings, ButlerMessage, PocketInfo, TradeRecord } from '../types';

const KEYS = {
  SETTINGS: 'rakushite_settings',
  POCKETS: 'rakushite_pockets',
  TRADES: 'rakushite_trades',
  MESSAGES: 'rakushite_messages',
  PROPOSALS: 'rakushite_proposals',
  LEARNING_LOGS: 'rakushite_learning_logs',
};

export const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  coincheckApiKey: '',
  coincheckApiSecret: '',
  isRealTradingEnabled: false,
  killSwitchActive: false,
  initialDemoFundsJpy: 10000,
  autoTradingIntervalSeconds: 6,
  panicDropThresholdPercent: 5.0,
  lastBaselinePrice: 13500000,
  baselineTime: new Date().toISOString(),
};

export const DEFAULT_POCKETS: PocketInfo[] = [
  {
    id: 'pocketA',
    name: 'A: 堅実ロボ',
    strategyName: 'ボリンジャー逆張り＆RSI防御',
    tag: '低リスク・高勝率',
    description: '市場の極端なブレを感知し、底値で拾って確実に反発益を確定する守りの要。',
    allocatedJpy: 3500,
    btcHolding: 0.00025,
    avgBuyPrice: 13450000,
    realizedPnL: 380,
    unrealizedPnL: 45,
    winCount: 14,
    lossCount: 2,
    tradeCount: 16,
    statusText: '🟢 バンド下限検知中…安全待機モード',
    statusLevel: 'active',
    lastActionTime: '1分前',
  },
  {
    id: 'pocketB',
    name: 'B: AIデイトレ',
    strategyName: 'Gemini超短期スキャルピング',
    tag: '中リスク・回転重視',
    description: 'Gemini推論で秒単位の微細なモメンタムを予測し、高速で利益をかすめ取る攻撃部隊。',
    allocatedJpy: 3500,
    btcHolding: 0.00018,
    avgBuyPrice: 13480000,
    realizedPnL: 820,
    unrealizedPnL: 72,
    winCount: 28,
    lossCount: 9,
    tradeCount: 37,
    statusText: '⚡ スキャルピング執行中: +0.4%利確ターゲット',
    statusLevel: 'trading',
    lastActionTime: '20秒前',
  },
  {
    id: 'pocketC',
    name: 'C: コピートレード',
    strategyName: 'クジラ大口ウォレット追従',
    tag: '高リターン・トレンド追従',
    description: '100BTC超の大口クジラや敏腕プロトレーダーのオンチェーン売買を自動追従。',
    allocatedJpy: 3000,
    btcHolding: 0.00032,
    avgBuyPrice: 13420000,
    realizedPnL: 490,
    unrealizedPnL: 110,
    winCount: 9,
    lossCount: 3,
    tradeCount: 12,
    statusText: '🐋 大口ウォレット(0x3f...b9)の買い増しを追従中',
    statusLevel: 'analyzing',
    lastActionTime: '2分前',
  },
];

export class StorageService {
  public static async loadSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('設定読み込みエラー:', e);
    }
    return DEFAULT_SETTINGS;
  }

  public static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('設定保存エラー:', e);
    }
  }

  public static async loadPockets(): Promise<PocketInfo[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.POCKETS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('ポケット読み込みエラー:', e);
    }
    return DEFAULT_POCKETS;
  }

  public static async savePockets(pockets: PocketInfo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.POCKETS, JSON.stringify(pockets));
    } catch (e) {
      console.error('ポケット保存エラー:', e);
    }
  }

  public static async loadTrades(): Promise<TradeRecord[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TRADES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('トレード履歴読み込みエラー:', e);
    }
    return [
      {
        id: 't_1',
        pocketId: 'pocketB',
        pocketName: 'B: AIデイトレ',
        type: 'SELL',
        btcAmount: 0.00015,
        priceJpy: 13520000,
        totalJpy: 2028,
        profitJpy: 145,
        reason: 'Geminiスキャルピング微小利確 (+0.72%)',
        timestamp: '10分前',
        isReal: false,
      },
      {
        id: 't_2',
        pocketId: 'pocketA',
        pocketName: 'A: 堅実ロボ',
        type: 'BUY',
        btcAmount: 0.00025,
        priceJpy: 13450000,
        totalJpy: 3362,
        reason: 'RSI 28 到達・売られすぎゾーンからの押し目拾い',
        timestamp: '25分前',
        isReal: false,
      },
      {
        id: 't_3',
        pocketId: 'pocketC',
        pocketName: 'C: コピートレード',
        type: 'BUY',
        btcAmount: 0.00032,
        priceJpy: 13420000,
        totalJpy: 4294,
        reason: '米系ファンド大口アドレスの150BTC現物買いを感知して追従',
        timestamp: '1時間前',
        isReal: false,
      },
    ];
  }

  public static async saveTrades(trades: TradeRecord[]): Promise<void> {
    try {
      // 直近100件まで保持
      await AsyncStorage.setItem(KEYS.TRADES, JSON.stringify(trades.slice(0, 100)));
    } catch (e) {
      console.error('トレード履歴保存エラー:', e);
    }
  }

  public static async loadMessages(): Promise<ButlerMessage[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MESSAGES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('執事メッセージ読み込みエラー:', e);
    }
    return [
      {
        id: 'm_init',
        sender: 'butler',
        text: 'ご主人様、ようこそお越しくださいました！AI執事『楽して儲ける君』でございます。\n\n現在、仮想デモ運用にて【3つのAIポケット】が自動巡回を開始いたしました。ご主人様は何もしなくても、システムが勝手に利益の最適化を行ってまいります。何か気になる点がございましたら、下のボタンまたはメッセージでお気軽にお申し付けくださいませ。',
        timestamp: 'たった今',
        category: 'chat',
      },
    ];
  }

  public static async saveMessages(messages: ButlerMessage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages.slice(0, 50)));
    } catch (e) {
      console.error('メッセージ保存エラー:', e);
    }
  }

  public static async loadProposals(): Promise<AiTuningProposal[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROPOSALS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('提案データ読み込みエラー:', e);
    }
    return [];
  }

  public static async saveProposals(proposals: AiTuningProposal[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.PROPOSALS, JSON.stringify(proposals.slice(0, 20)));
    } catch (e) {
      console.error('提案保存エラー:', e);
    }
  }

  public static async loadLearningLogs(): Promise<AiLearningLog[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.LEARNING_LOGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('AI学習ログ読み込みエラー:', e);
    }
    return [
      {
        id: 'log_1',
        timestamp: '5分前',
        pocketId: 'pocketB',
        thoughtProcess: 'ボラティリティ急増を検知。短期移動平均線の上抜けパターンと板の買い気配優勢度合から確率78%で上昇と推論。',
        marketSentiment: 'BULL',
        decision: '0.00018 BTC 成行買いエントリー実行',
        confidenceScore: 88,
        reflectionNotes: '利確幅+0.4%を短時間で達成。エントリー速度のチューニングが奏功した。',
      },
      {
        id: 'log_2',
        timestamp: '18分前',
        pocketId: 'pocketA',
        thoughtProcess: '下落時の出来高減少を確認。セリングクライマックスではなく健全な押し目と判定。',
        marketSentiment: 'NEUTRAL',
        decision: '逆張り買い指値配置',
        confidenceScore: 92,
        reflectionNotes: '早すぎる買い下がりを防ぎ、安全マージンを確保できた。',
      },
    ];
  }

  public static async saveLearningLogs(logs: AiLearningLog[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LEARNING_LOGS, JSON.stringify(logs.slice(0, 50)));
    } catch (e) {
      console.error('学習ログ保存エラー:', e);
    }
  }
}
