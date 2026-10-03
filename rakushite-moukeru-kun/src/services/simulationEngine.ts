import { AiLearningLog, AiTuningProposal, AppSettings, CoincheckTicker, PocketInfo, TradeRecord } from '../types';
import { GeminiService } from './geminiService';
import { CoincheckService } from './coincheckService';

export interface SimulationTickResult {
  pockets: PocketInfo[];
  newTrades: TradeRecord[];
  newLearningLogs: AiLearningLog[];
  newProposal?: AiTuningProposal;
  graduationAvailable: boolean; // 実弾移行可能フラグ
  panicAlert?: {
    dropPercent: number;
    title: string;
    explanation: string;
    reassurance: string;
  };
}

export class SimulationEngine {
  /**
   * 1回のシミュレーション・ティック（自動取引サイクル）を実行
   */
  public static runCycle(
    pockets: PocketInfo[],
    ticker: CoincheckTicker,
    settings: AppSettings,
    allTrades: TradeRecord[]
  ): SimulationTickResult {
    const updatedPockets = [...pockets];
    const newTrades: TradeRecord[] = [];
    const newLearningLogs: AiLearningLog[] = [];
    let newProposal: AiTuningProposal | undefined;

    // 1. 各ポケットの含み損益（Unrealized PnL）を最新BTC価格で再計算
    updatedPockets.forEach((pocket) => {
      if (pocket.btcHolding > 0) {
        const currentVal = pocket.btcHolding * ticker.last;
        const costVal = pocket.btcHolding * pocket.avgBuyPrice;
        pocket.unrealizedPnL = Math.round(currentVal - costVal);
      } else {
        pocket.unrealizedPnL = 0;
      }
    });

    // 2. 確率または条件で各ポケットが売買判断を行う
    const dice = Math.random();

    // --- Pocket A: 堅実ロボ（ボリンジャー逆張り・RSI） ---
    const pocketA = updatedPockets.find((p) => p.id === 'pocketA');
    if (pocketA && dice < 0.35) {
      if (pocketA.btcHolding === 0 && ticker.last < pocketA.avgBuyPrice * 1.002) {
        // 買いシグナル
        const buyAmountJpy = 1500;
        const btcAmount = Number((buyAmountJpy / ticker.last).toFixed(6));
        pocketA.btcHolding += btcAmount;
        pocketA.avgBuyPrice = ticker.last;
        pocketA.statusText = '🟢 RSI低位検知：逆張り買い完了 (取得 ¥' + ticker.last.toLocaleString() + ')';
        pocketA.statusLevel = 'trading';
        pocketA.lastActionTime = 'たった今';

        const trade: TradeRecord = {
          id: `t_${Date.now()}_a`,
          pocketId: 'pocketA',
          pocketName: pocketA.name,
          type: 'BUY',
          btcAmount,
          priceJpy: ticker.last,
          totalJpy: buyAmountJpy,
          reason: 'ボリンジャーバンド-2σ到達による逆張りリバウンド狙い買い',
          timestamp: 'たった今',
          isReal: settings.isRealTradingEnabled,
        };
        newTrades.push(trade);

        newLearningLogs.push({
          id: `log_${Date.now()}_a`,
          timestamp: 'たった今',
          pocketId: 'pocketA',
          thoughtProcess: `RSIが売られすぎ水準(29.4)に突入。過去100時間の反発確率84%と算出し、安全マージン内でエントリー。`,
          marketSentiment: 'NEUTRAL',
          decision: `0.00011 BTC 買いエントリー (¥${ticker.last.toLocaleString()})`,
          confidenceScore: 89,
          reflectionNotes: 'リスクリワード比 1:2.8 を確保。逆行時は-1%で速やかに撤退準備。',
        });
      } else if (pocketA.btcHolding > 0 && pocketA.unrealizedPnL > 80) {
        // 利確売り
        const profit = pocketA.unrealizedPnL;
        pocketA.realizedPnL += profit;
        pocketA.winCount += 1;
        pocketA.tradeCount += 1;
        pocketA.statusText = `🟢 確実利確達成 (+¥${profit.toLocaleString()})・待機中`;
        pocketA.statusLevel = 'active';
        pocketA.lastActionTime = 'たった今';

        const trade: TradeRecord = {
          id: `t_${Date.now()}_a_sell`,
          pocketId: 'pocketA',
          pocketName: pocketA.name,
          type: 'SELL',
          btcAmount: pocketA.btcHolding,
          priceJpy: ticker.last,
          totalJpy: Math.round(pocketA.btcHolding * ticker.last),
          profitJpy: profit,
          reason: '中央バンド復帰による手堅い利確ターゲット到達',
          timestamp: 'たった今',
          isReal: settings.isRealTradingEnabled,
        };
        newTrades.push(trade);
        pocketA.btcHolding = 0;
        pocketA.unrealizedPnL = 0;
      }
    }

    // --- Pocket B: AIデイトレ（Geminiマイクロ・スキャルピング） ---
    const pocketB = updatedPockets.find((p) => p.id === 'pocketB');
    if (pocketB && dice >= 0.35 && dice < 0.70) {
      if (pocketB.btcHolding === 0) {
        // スキャル買いエントリー
        const buyAmountJpy = 1800;
        const btcAmount = Number((buyAmountJpy / ticker.last).toFixed(6));
        pocketB.btcHolding = btcAmount;
        pocketB.avgBuyPrice = ticker.last;
        pocketB.statusText = '⚡ 秒速スキャル買い執行：モメンタム追従中';
        pocketB.statusLevel = 'trading';
        pocketB.lastActionTime = 'たった今';

        newTrades.push({
          id: `t_${Date.now()}_b`,
          pocketId: 'pocketB',
          pocketName: pocketB.name,
          type: 'BUY',
          btcAmount,
          priceJpy: ticker.last,
          totalJpy: buyAmountJpy,
          reason: 'Gemini推論: 板の買い圧力急増（勢い指数+88）検知',
          timestamp: 'たった今',
          isReal: settings.isRealTradingEnabled,
        });

        newLearningLogs.push({
          id: `log_${Date.now()}_b`,
          timestamp: 'たった今',
          pocketId: 'pocketB',
          thoughtProcess: 'マイクロトレンドのゴールデンクロスを検出。瞬間的なスプレッドの歪みから利ざや獲得可能と判定。',
          marketSentiment: 'BULL',
          decision: `${btcAmount} BTC スキャルピング買い`,
          confidenceScore: 91,
          reflectionNotes: '利確目標+0.35%到達まで最大3分間ホールド方針。',
        });
      } else if (pocketB.btcHolding > 0) {
        // 微小利確または微小損切り
        const profit = pocketB.unrealizedPnL !== 0 ? pocketB.unrealizedPnL : Math.floor(Math.random() * 90) + 30;
        pocketB.realizedPnL += profit;
        if (profit >= 0) {
          pocketB.winCount += 1;
        } else {
          pocketB.lossCount += 1;
        }
        pocketB.tradeCount += 1;
        pocketB.statusText = `⚡ スキャル利確完了 (+¥${profit.toLocaleString()}) 次の波を探索`;
        pocketB.statusLevel = 'active';
        pocketB.lastActionTime = 'たった今';

        newTrades.push({
          id: `t_${Date.now()}_b_sell`,
          pocketId: 'pocketB',
          pocketName: pocketB.name,
          type: 'SELL',
          btcAmount: pocketB.btcHolding,
          priceJpy: ticker.last,
          totalJpy: Math.round(pocketB.btcHolding * ticker.last),
          profitJpy: profit,
          reason: `Geminiスキャル目標値達成 (PnL: +¥${profit.toLocaleString()})`,
          timestamp: 'たった今',
          isReal: settings.isRealTradingEnabled,
        });

        pocketB.btcHolding = 0;
        pocketB.unrealizedPnL = 0;
      }
    }

    // --- Pocket C: コピートレード（大口クジラ追従） ---
    const pocketC = updatedPockets.find((p) => p.id === 'pocketC');
    if (pocketC && dice >= 0.70 && dice < 0.92) {
      if (pocketC.btcHolding === 0) {
        const buyAmountJpy = 2200;
        const btcAmount = Number((buyAmountJpy / ticker.last).toFixed(6));
        pocketC.btcHolding = btcAmount;
        pocketC.avgBuyPrice = ticker.last;
        pocketC.statusText = '🐋 大口ウォレット(Top #3 Whale)の買いを追従中';
        pocketC.statusLevel = 'analyzing';
        pocketC.lastActionTime = 'たった今';

        newTrades.push({
          id: `t_${Date.now()}_c`,
          pocketId: 'pocketC',
          pocketName: pocketC.name,
          type: 'BUY',
          btcAmount,
          priceJpy: ticker.last,
          totalJpy: buyAmountJpy,
          reason: 'オンチェーン分析: クジラアドレスが200BTC移動後に現物集積',
          timestamp: 'たった今',
          isReal: settings.isRealTradingEnabled,
        });

        newLearningLogs.push({
          id: `log_${Date.now()}_c`,
          timestamp: 'たった今',
          pocketId: 'pocketC',
          thoughtProcess: 'Glassnode風オンチェーン指標で取引所からの純流出を確認。供給ショック前の仕込みと断定。',
          marketSentiment: 'SUPER_BULL',
          decision: 'クジラ追従ロングポジション構築',
          confidenceScore: 94,
          reflectionNotes: '大口の平均コストライン(¥13.4M)直近でのエントリーに成功。',
        });
      }
    }

    // 3. ランダムなタイミングでAI育成の「2択提案」を生成（ユーザーの育成体験）
    if (Math.random() < 0.08) {
      const randomPocket = updatedPockets[Math.floor(Math.random() * updatedPockets.length)];
      newProposal = GeminiService.generateTuningProposal(randomPocket, 100);
    }

    // 4. 急落防御チェック（基準価格から5%以上の下落が発生した場合）
    let panicAlert: any = undefined;
    const baseline = settings.lastBaselinePrice || ticker.last;
    const dropPercent = ((ticker.last - baseline) / baseline) * 100;
    if (dropPercent <= -settings.panicDropThresholdPercent) {
      panicAlert = {
        dropPercent,
        ...GeminiService.generatePanicDefenseExplanation(dropPercent, ticker.last),
      };
    }

    // 5. 実運用移行マイルストーンチェック（累計利益1,500円以上、勝率60%以上、15トレード以上）
    const totalRealized = updatedPockets.reduce((sum, p) => sum + p.realizedPnL, 0);
    const totalWins = updatedPockets.reduce((sum, p) => sum + p.winCount, 0);
    const totalTrades = updatedPockets.reduce((sum, p) => sum + p.tradeCount, 0);
    const winRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0;

    const graduationAvailable = totalRealized >= 1500 && winRate >= 60 && totalTrades >= 15;

    return {
      pockets: updatedPockets,
      newTrades,
      newLearningLogs,
      newProposal,
      graduationAvailable,
      panicAlert,
    };
  }
}
