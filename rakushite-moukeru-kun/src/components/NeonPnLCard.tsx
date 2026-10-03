import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NeonPnLCardProps {
  totalProfitJpy: number;
  todayProfitJpy: number;
  unrealizedPnL: number;
  winRate: number;
  totalTrades: number;
  onSimulateShock: () => void;
  onSimulateSurge: () => void;
}

export const NeonPnLCard: React.FC<NeonPnLCardProps> = ({
  totalProfitJpy,
  todayProfitJpy,
  unrealizedPnL,
  winRate,
  totalTrades,
  onSimulateShock,
  onSimulateSurge,
}) => {
  const isPositive = totalProfitJpy >= 0;
  const sign = isPositive ? '+' : '';
  const formattedProfit = `${sign}¥${Math.abs(totalProfitJpy).toLocaleString()}`;

  return (
    <View style={styles.card}>
      {/* ネオン装飾コーナー */}
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />

      <View style={styles.labelRow}>
        <Text style={styles.cyberBadge}>AUTONOMOUS PROFIT ENGINE</Text>
        <Text style={styles.mainLabel}>現在のトータル利益</Text>
      </View>

      {/* 巨大ネオン文字表示 */}
      <View style={styles.neonNumberContainer}>
        <Text style={[styles.giantNeonText, isPositive ? styles.neonGreen : styles.neonRed]}>
          {formattedProfit}
        </Text>
      </View>

      {/* サブステータス行 */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>本日の利益</Text>
          <Text style={[styles.metricValue, todayProfitJpy >= 0 ? styles.greenText : styles.redText]}>
            {todayProfitJpy >= 0 ? `+¥${todayProfitJpy.toLocaleString()}` : `-¥${Math.abs(todayProfitJpy).toLocaleString()}`}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>保有中含み益</Text>
          <Text style={[styles.metricValue, unrealizedPnL >= 0 ? styles.blueText : styles.redText]}>
            {unrealizedPnL >= 0 ? `+¥${unrealizedPnL.toLocaleString()}` : `-¥${Math.abs(unrealizedPnL).toLocaleString()}`}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>AI勝率 / 取引数</Text>
          <Text style={styles.metricValueHighlight}>
            {winRate.toFixed(1)}% <Text style={styles.subTrades}>({totalTrades}回)</Text>
          </Text>
        </View>
      </View>

      {/* 相場シミュレーションテスト操作（パニック防御＆急騰テスト用） */}
      <View style={styles.simulationControlRow}>
        <Text style={styles.simLabel}>🧪 相場ストレステスト:</Text>
        <TouchableOpacity style={styles.simBtnDown} onPress={onSimulateShock}>
          <Text style={styles.simBtnTextDown}>⚡ 5%急落を擬似発生</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.simBtnUp} onPress={onSimulateSurge}>
          <Text style={styles.simBtnTextUp}>🚀 急騰を擬似発生</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#070E1B',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#00F0FF44',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: '#00FF66',
  },
  cornerTL: { top: 6, left: 6, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 6, right: 6, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 6, left: 6, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 6, right: 6, borderBottomWidth: 2, borderRightWidth: 2 },

  labelRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  cyberBadge: {
    color: '#00F0FF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2.5,
    backgroundColor: '#00F0FF15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  mainLabel: {
    color: '#A0B4CC',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  neonNumberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  giantNeonText: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  neonGreen: {
    color: '#00FF66',
    textShadowColor: '#00FF66DD',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  neonRed: {
    color: '#FF3366',
    textShadowColor: '#FF3366DD',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#040811',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#00F0FF20',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#1E2D45',
    marginVertical: 2,
  },
  metricLabel: {
    color: '#657B96',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  metricValueHighlight: {
    color: '#00F0FF',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  subTrades: {
    fontSize: 10,
    color: '#657B96',
  },
  greenText: {
    color: '#00FF66',
  },
  blueText: {
    color: '#00F0FF',
  },
  redText: {
    color: '#FF3366',
  },
  simulationControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#122035',
    paddingTop: 10,
  },
  simLabel: {
    color: '#52667E',
    fontSize: 10,
    fontWeight: '600',
  },
  simBtnDown: {
    backgroundColor: '#FF336618',
    borderColor: '#FF336655',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  simBtnTextDown: {
    color: '#FF6688',
    fontSize: 10,
    fontWeight: '700',
  },
  simBtnUp: {
    backgroundColor: '#00FF6618',
    borderColor: '#00FF6655',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  simBtnTextUp: {
    color: '#00FF88',
    fontSize: 10,
    fontWeight: '700',
  },
});
