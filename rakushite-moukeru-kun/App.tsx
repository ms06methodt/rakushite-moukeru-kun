import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CyberHeader } from './src/components/CyberHeader';
import { NeonPnLCard } from './src/components/NeonPnLCard';
import { PocketCard } from './src/components/PocketCard';
import { QuickCommandBar } from './src/components/QuickCommandBar';
import { ButlerChatModal } from './src/components/ButlerChatModal';
import { AiBrainTrainingModal } from './src/components/AiBrainTrainingModal';
import { PanicDefenseAlertModal } from './src/components/PanicDefenseAlertModal';
import { RealFundMigrationModal } from './src/components/RealFundMigrationModal';
import { SettingsModal } from './src/components/SettingsModal';

import {
  AiLearningLog,
  AiTuningProposal,
  AppSettings,
  ButlerMessage,
  CoincheckTicker,
  PocketInfo,
  TradeRecord,
} from './src/types';
import { CoincheckService } from './src/services/coincheckService';
import { GeminiService } from './src/services/geminiService';
import { SimulationEngine } from './src/services/simulationEngine';
import {
  DEFAULT_POCKETS,
  DEFAULT_SETTINGS,
  StorageService,
} from './src/services/storageService';

export default function App() {
  const [ticker, setTicker] = useState<CoincheckTicker | null>(null);
  const [pockets, setPockets] = useState<PocketInfo[]>(DEFAULT_POCKETS);
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [messages, setMessages] = useState<ButlerMessage[]>([]);
  const [proposals, setProposals] = useState<AiTuningProposal[]>([]);
  const [learningLogs, setLearningLogs] = useState<AiLearningLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // モーダル開閉状態
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBrainOpen, setIsBrainOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGraduationOpen, setIsGraduationOpen] = useState(false);
  const [panicAlert, setPanicAlert] = useState<{
    dropPercent: number;
    title: string;
    explanation: string;
    reassurance: string;
  } | null>(null);

  const [isThinking, setIsThinking] = useState(false);
  const [graduationAvailable, setGraduationAvailable] = useState(false);

  // 初期化ロード
  useEffect(() => {
    async function init() {
      const loadedSettings = await StorageService.loadSettings();
      const loadedPockets = await StorageService.loadPockets();
      const loadedTrades = await StorageService.loadTrades();
      const loadedMessages = await StorageService.loadMessages();
      const loadedProposals = await StorageService.loadProposals();
      const loadedLogs = await StorageService.loadLearningLogs();

      setSettings(loadedSettings);
      setPockets(loadedPockets);
      setTrades(loadedTrades);
      setMessages(loadedMessages);
      setProposals(loadedProposals);
      setLearningLogs(loadedLogs);

      // 初回ティッカー取得
      const initialTicker = await CoincheckService.fetchTicker();
      setTicker(initialTicker);
    }
    init();
  }, []);

  // リアルタイム・ティッカー更新ループ (5秒ごと)
  useEffect(() => {
    const timer = setInterval(async () => {
      const newTicker = await CoincheckService.fetchTicker();
      setTicker(newTicker);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 自律自動売買サイクル (6秒ごと)
  useEffect(() => {
    const tradeInterval = setInterval(() => {
      if (!ticker || settings.killSwitchActive) return;

      const result = SimulationEngine.runCycle(pockets, ticker, settings, trades);

      setPockets(result.pockets);
      StorageService.savePockets(result.pockets);

      if (result.newTrades.length > 0) {
        const updated = [...result.newTrades, ...trades];
        setTrades(updated);
        StorageService.saveTrades(updated);
      }

      if (result.newLearningLogs.length > 0) {
        const updatedLogs = [...result.newLearningLogs, ...learningLogs];
        setLearningLogs(updatedLogs);
        StorageService.saveLearningLogs(updatedLogs);
      }

      if (result.newProposal) {
        const updatedProposals = [result.newProposal, ...proposals];
        setProposals(updatedProposals);
        StorageService.saveProposals(updatedProposals);
      }

      if (result.graduationAvailable && !graduationAvailable) {
        setGraduationAvailable(true);
      }

      if (result.panicAlert && !panicAlert) {
        setPanicAlert(result.panicAlert);
      }
    }, settings.autoTradingIntervalSeconds * 1000);

    return () => clearInterval(tradeInterval);
  }, [ticker, pockets, trades, learningLogs, proposals, settings, graduationAvailable, panicAlert]);

  // トータル利益＆勝率計算
  const totalRealizedPnL = pockets.reduce((sum, p) => sum + p.realizedPnL, 0);
  const totalUnrealizedPnL = pockets.reduce((sum, p) => sum + p.unrealizedPnL, 0);
  const totalProfit = totalRealizedPnL + totalUnrealizedPnL;
  const todayProfit = Math.round(totalRealizedPnL * 0.75 + totalUnrealizedPnL);

  const totalWins = pockets.reduce((sum, p) => sum + p.winCount, 0);
  const totalTradesCount = pockets.reduce((sum, p) => sum + p.tradeCount, 0);
  const winRate = totalTradesCount > 0 ? (totalWins / totalTradesCount) * 100 : 75.0;

  // クイックコマンド実行
  const handleQuickCommand = async (type: 'recent5min' | 'todayTotal' | 'marketSummary') => {
    const recent5minProfit = Math.floor(Math.random() * 180) + 40;
    const responseText = GeminiService.getQuickCommandResponse(type, {
      totalProfitJpy: totalProfit,
      todayProfitJpy: todayProfit,
      recent5minProfitJpy: recent5minProfit,
      currentBtcPrice: ticker?.last || 13500000,
      change24hPercent: ticker?.change24hPercent || 1.25,
    });

    const userLabel =
      type === 'recent5min' ? '⚡ 直近5分の利益は？' : type === 'todayTotal' ? '💰 今日のトータルは？' : '🔮 今の相場を一言で';

    const userMsg: ButlerMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: userLabel,
      timestamp: 'たった今',
      category: 'quick',
    };

    const butlerMsg: ButlerMessage = {
      id: `b_${Date.now()}`,
      sender: 'butler',
      text: responseText,
      timestamp: 'たった今',
      category: 'quick',
    };

    const updated = [butlerMsg, userMsg, ...messages];
    setMessages(updated);
    StorageService.saveMessages(updated);
    setIsChatOpen(true);
  };

  // チャットメッセージ送信
  const handleSendMessage = async (text: string) => {
    const userMsg: ButlerMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'たった今',
      category: 'chat',
    };

    const updatedWithUser = [userMsg, ...messages];
    setMessages(updatedWithUser);
    setIsThinking(true);

    try {
      const responseText = await GeminiService.generateResponse(text, settings.geminiApiKey, {
        totalProfitJpy: totalProfit,
        pockets,
        recentTrades: trades.slice(0, 5),
        currentBtcPrice: ticker?.last || 13500000,
      });

      const butlerMsg: ButlerMessage = {
        id: `b_${Date.now()}`,
        sender: 'butler',
        text: responseText,
        timestamp: 'たった今',
        category: 'chat',
      };

      const finalMessages = [butlerMsg, ...updatedWithUser];
      setMessages(finalMessages);
      StorageService.saveMessages(finalMessages);
    } finally {
      setIsThinking(false);
    }
  };

  // AI 2択提案の選択
  const handleSelectProposalOption = (proposalId: string, option: 'A' | 'B') => {
    const updated = proposals.map((p) => {
      if (p.id === proposalId) {
        return {
          ...p,
          chosenOption: option,
          applied: true,
        };
      }
      return p;
    });
    setProposals(updated);
    StorageService.saveProposals(updated);

    const targetProp = proposals.find((p) => p.id === proposalId);
    if (targetProp) {
      const chosenText = option === 'A' ? targetProp.optionA.label : targetProp.optionB.label;
      const butlerAck: ButlerMessage = {
        id: `ack_${Date.now()}`,
        sender: 'butler',
        text: `ご主人様、指示【${chosenText}】を賜りました！${targetProp.pocketName}の売買プロンプト・戦略パラメータをただちに再学習させました。`,
        timestamp: 'たった今',
        category: 'proposal',
      };
      const newMsgList = [butlerAck, ...messages];
      setMessages(newMsgList);
      StorageService.saveMessages(newMsgList);
    }
  };

  // 擬似ストレステスト（-5%急落）
  const handleSimulateShock = () => {
    if (!ticker) return;
    const dropPercent = -5.4;
    const panicData = GeminiService.generatePanicDefenseExplanation(dropPercent, ticker.last);
    setPanicAlert({
      dropPercent,
      ...panicData,
    });
  };

  // 擬似急騰テスト
  const handleSimulateSurge = () => {
    if (!ticker) return;
    const surgeProfit = 420;
    const updatedPockets = pockets.map((p) => {
      if (p.id === 'pocketB') {
        return {
          ...p,
          realizedPnL: p.realizedPnL + surgeProfit,
          winCount: p.winCount + 1,
          tradeCount: p.tradeCount + 1,
          statusText: '🚀 急騰モメンタム検知：電撃利確 (+¥420) 完了！',
        };
      }
      return p;
    });
    setPockets(updatedPockets);
    StorageService.savePockets(updatedPockets);
  };

  // 実弾移行の確定
  const handleConfirmMigration = (apiKey: string, apiSecret: string) => {
    const updatedSettings: AppSettings = {
      ...settings,
      coincheckApiKey: apiKey || settings.coincheckApiKey,
      coincheckApiSecret: apiSecret || settings.coincheckApiSecret,
      isRealTradingEnabled: true,
    };
    setSettings(updatedSettings);
    StorageService.saveSettings(updatedSettings);
    setIsGraduationOpen(false);

    const graduationMsg: ButlerMessage = {
      id: `grad_${Date.now()}`,
      sender: 'butler',
      text: '🎉 ご主人様、GOサインを賜り身の引き締まる思いでございます！Coincheck実弾連携モードを有効化いたしました。これまで培った最適化モデルに基づき、安全第一でご主人様の純資産を増やしてまいります。',
      timestamp: 'たった今',
      category: 'chat',
    };
    setMessages([graduationMsg, ...messages]);
    setIsChatOpen(true);
  };

  // データリセット
  const handleResetDemoData = () => {
    setPockets(DEFAULT_POCKETS);
    setTrades([]);
    setLearningLogs([]);
    setProposals([]);
    StorageService.savePockets(DEFAULT_POCKETS);
    StorageService.saveTrades([]);
    StorageService.saveLearningLogs([]);
    StorageService.saveProposals([]);
    setIsSettingsOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#050B14" />

      <View style={styles.appContainer}>
        {/* サイバーヘッダー */}
        <CyberHeader
        ticker={ticker}
        isRealTrading={settings.isRealTradingEnabled}
        killSwitchActive={settings.killSwitchActive}
        onOpenBrainModal={() => setIsBrainOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGraduation={() => setIsGraduationOpen(true)}
        graduationAvailable={graduationAvailable}
      />

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        {/* メイン: 巨大ネオン利益表示（ローソク足チャート排除） */}
        <NeonPnLCard
          totalProfitJpy={totalProfit}
          todayProfitJpy={todayProfit}
          unrealizedPnL={totalUnrealizedPnL}
          winRate={winRate}
          totalTrades={totalTradesCount}
          onSimulateShock={handleSimulateShock}
          onSimulateSurge={handleSimulateSurge}
        />

        {/* 3大自律AIポケット稼働状況 */}
        <PocketCard
          pockets={pockets}
          onSelectPocket={() => setIsBrainOpen(true)}
        />

        {/* 最近のトレード速報 */}
        <View style={styles.recentTradesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ AIリアルタイム執行速報</Text>
            <Text style={styles.sectionSub}>LIVE EXECUTION TICKER</Text>
          </View>
          <View style={styles.tradesList}>
            {trades.slice(0, 3).map((tr) => (
              <View key={tr.id} style={styles.tradeItem}>
                <View style={styles.tradeLeft}>
                  <View style={[styles.typeBadge, tr.type === 'BUY' ? styles.badgeBuy : styles.badgeSell]}>
                    <Text style={styles.typeText}>{tr.type === 'BUY' ? '買付' : '売却'}</Text>
                  </View>
                  <View>
                    <Text style={styles.tradePocketName}>{tr.pocketName}</Text>
                    <Text style={styles.tradeReason} numberOfLines={1}>{tr.reason}</Text>
                  </View>
                </View>

                <View style={styles.tradeRight}>
                  {tr.profitJpy !== undefined ? (
                    <Text style={[styles.profitText, tr.profitJpy >= 0 ? styles.profitPlus : styles.profitMinus]}>
                      {tr.profitJpy >= 0 ? `+¥${tr.profitJpy.toLocaleString()}` : `-¥${Math.abs(tr.profitJpy).toLocaleString()}`}
                    </Text>
                  ) : (
                    <Text style={styles.tradeTotalText}>¥{tr.totalJpy.toLocaleString()}</Text>
                  )}
                  <Text style={styles.tradeTime}>{tr.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 画面下部: ネオンクイックコマンドバー */}
      <QuickCommandBar
        onExecuteCommand={handleQuickCommand}
        onOpenFullChat={() => setIsChatOpen(true)}
      />

      {/* モーダル群 */}
      <ButlerChatModal
        visible={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isThinking={isThinking}
      />

      <AiBrainTrainingModal
        visible={isBrainOpen}
        onClose={() => setIsBrainOpen(false)}
        learningLogs={learningLogs}
        proposals={proposals}
        onSelectOption={handleSelectProposalOption}
        onGenerateNewProposal={() => {
          const newP = GeminiService.generateTuningProposal(pockets[0], -50);
          setProposals([newP, ...proposals]);
        }}
      />

      {panicAlert && (
        <PanicDefenseAlertModal
          visible={!!panicAlert}
          onClose={() => setPanicAlert(null)}
          dropPercent={panicAlert.dropPercent}
          explanation={panicAlert.explanation}
          reassurance={panicAlert.reassurance}
        />
      )}

      <RealFundMigrationModal
        visible={isGraduationOpen}
        onClose={() => setIsGraduationOpen(false)}
        onConfirmMigration={handleConfirmMigration}
        winRate={winRate}
        totalDemoProfit={totalProfit}
      />

      <SettingsModal
        visible={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newS) => {
          setSettings(newS);
          StorageService.saveSettings(newS);
        }}
        onResetDemoData={handleResetDemoData}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#010409',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#030711',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#00F0FF22',
  },
  mainScroll: {
    flex: 1,
  },
  recentTradesSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#E0F0FF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionSub: {
    color: '#00F0FF88',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  tradesList: {
    gap: 8,
  },
  tradeItem: {
    backgroundColor: '#070F1E',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#13243B',
  },
  tradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeBuy: {
    backgroundColor: '#00F0FF22',
  },
  badgeSell: {
    backgroundColor: '#00FF6622',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tradePocketName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tradeReason: {
    color: '#718AA8',
    fontSize: 9,
    maxWidth: 180,
  },
  tradeRight: {
    alignItems: 'flex-end',
  },
  tradeTotalText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  profitText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  profitPlus: {
    color: '#00FF66',
  },
  profitMinus: {
    color: '#FF3366',
  },
  tradeTime: {
    color: '#506680',
    fontSize: 9,
  },
});
