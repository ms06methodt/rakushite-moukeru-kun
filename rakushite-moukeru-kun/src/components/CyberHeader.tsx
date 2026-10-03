import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CoincheckTicker } from '../types';

interface CyberHeaderProps {
  ticker: CoincheckTicker | null;
  isRealTrading: boolean;
  killSwitchActive: boolean;
  onOpenBrainModal: () => void;
  onOpenSettings: () => void;
  onOpenGraduation: () => void;
  graduationAvailable: boolean;
}

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  ticker,
  isRealTrading,
  killSwitchActive,
  onOpenBrainModal,
  onOpenSettings,
  onOpenGraduation,
  graduationAvailable,
}) => {
  const priceFormatted = ticker ? `¥${ticker.last.toLocaleString()}` : '¥13,500,000';
  const changePercent = ticker?.change24hPercent ?? 1.25;
  const isPositive = changePercent >= 0;

  return (
    <View style={styles.container}>
      {/* 上部タイトルバー */}
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleCyber}>楽して儲ける君</Text>
          <Text style={styles.titleSub}>AI AUTONOMOUS CRYPTO FUND</Text>
        </View>

        <View style={styles.actionButtons}>
          {graduationAvailable && !isRealTrading && (
            <TouchableOpacity style={styles.graduationBadge} onPress={onOpenGraduation}>
              <Text style={styles.graduationText}>🎖️ 実弾移行可能</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.iconBtn} onPress={onOpenBrainModal}>
            <Text style={styles.iconBtnText}>🧠 脳内ログ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={onOpenSettings}>
            <Text style={styles.iconBtnText}>⚙️ 設定</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ステータスとティッカーバー */}
      <View style={styles.tickerBar}>
        <View style={styles.modeBadgeContainer}>
          <View style={[styles.modeIndicator, isRealTrading ? styles.realIndicator : styles.demoIndicator]} />
          <Text style={[styles.modeText, isRealTrading ? styles.realText : styles.demoText]}>
            {killSwitchActive ? '⚠️ 緊急停止作動中' : isRealTrading ? '🚀 COINCHECK 実弾稼働' : '🎮 仮想デモ運用中 (ノーリスク)'}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.btcLabel}>BTC/JPY</Text>
          <Text style={styles.btcPrice}>{priceFormatted}</Text>
          <Text style={[styles.btcChange, isPositive ? styles.priceUp : styles.priceDown]}>
            {isPositive ? `+${changePercent}%` : `${changePercent}%`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#050B14',
    borderBottomWidth: 1,
    borderBottomColor: '#00F0FF33',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  titleCyber: {
    color: '#00FF66',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
    textShadowColor: '#00FF6688',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleSub: {
    color: '#00F0FF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  graduationBadge: {
    backgroundColor: '#FFB80022',
    borderColor: '#FFB800',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  graduationText: {
    color: '#FFB800',
    fontSize: 11,
    fontWeight: 'bold',
  },
  iconBtn: {
    backgroundColor: '#0F1E36',
    borderColor: '#00F0FF55',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  iconBtnText: {
    color: '#E2F1FF',
    fontSize: 11,
    fontWeight: '600',
  },
  tickerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A1424',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00F0FF22',
  },
  modeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  demoIndicator: {
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowRadius: 6,
    shadowOpacity: 0.9,
  },
  realIndicator: {
    backgroundColor: '#00FF66',
    shadowColor: '#00FF66',
    shadowRadius: 6,
    shadowOpacity: 0.9,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  demoText: {
    color: '#00F0FF',
  },
  realText: {
    color: '#00FF66',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  btcLabel: {
    color: '#6B829E',
    fontSize: 10,
    fontWeight: '600',
  },
  btcPrice: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  btcChange: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  priceUp: {
    color: '#00FF66',
  },
  priceDown: {
    color: '#FF3366',
  },
});
