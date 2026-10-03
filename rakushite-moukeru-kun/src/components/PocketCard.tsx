import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PocketInfo } from '../types';

interface PocketCardProps {
  pockets: PocketInfo[];
  onSelectPocket: (pocket: PocketInfo) => void;
}

export const PocketCard: React.FC<PocketCardProps> = ({ pockets, onSelectPocket }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>3大自律AIポケット稼働状況</Text>
        <Text style={styles.sectionSub}>MULTI-POCKET RISK HEDGING</Text>
      </View>

      <View style={styles.pocketList}>
        {pockets.map((pocket) => {
          const totalProfit = pocket.realizedPnL + pocket.unrealizedPnL;
          const isProfit = totalProfit >= 0;

          return (
            <TouchableOpacity
              key={pocket.id}
              style={[
                styles.card,
                pocket.id === 'pocketA' && styles.borderA,
                pocket.id === 'pocketB' && styles.borderB,
                pocket.id === 'pocketC' && styles.borderC,
              ]}
              activeOpacity={0.85}
              onPress={() => onSelectPocket(pocket)}
            >
              {/* カードヘッダー */}
              <View style={styles.cardHeader}>
                <View style={styles.nameRow}>
                  <Text style={styles.pocketName}>{pocket.name}</Text>
                  <View
                    style={[
                      styles.tagBadge,
                      pocket.id === 'pocketA' && styles.tagA,
                      pocket.id === 'pocketB' && styles.tagB,
                      pocket.id === 'pocketC' && styles.tagC,
                    ]}
                  >
                    <Text style={styles.tagText}>{pocket.tag}</Text>
                  </View>
                </View>

                <View style={styles.profitBadge}>
                  <Text style={styles.profitSub}>累計損益</Text>
                  <Text style={[styles.profitText, isProfit ? styles.textGreen : styles.textRed]}>
                    {isProfit ? `+¥${totalProfit.toLocaleString()}` : `-¥${Math.abs(totalProfit).toLocaleString()}`}
                  </Text>
                </View>
              </View>

              {/* 戦略と保有状況 */}
              <View style={styles.detailsRow}>
                <Text style={styles.strategyText}>戦略: {pocket.strategyName}</Text>
                <Text style={styles.holdingText}>
                  保有: {pocket.btcHolding.toFixed(5)} BTC
                </Text>
              </View>

              {/* 1行のチカチカ光るステータスパネル */}
              <View style={styles.statusPanel}>
                <View style={styles.statusBlinkDot} />
                <Text style={styles.statusText} numberOfLines={1}>
                  {pocket.statusText}
                </Text>
                <Text style={styles.statusTime}>{pocket.lastActionTime}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 14,
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
  pocketList: {
    gap: 10,
  },
  card: {
    backgroundColor: '#081120',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#182C4A',
  },
  borderA: {
    borderLeftWidth: 4,
    borderLeftColor: '#00F0FF',
  },
  borderB: {
    borderLeftWidth: 4,
    borderLeftColor: '#00FF66',
  },
  borderC: {
    borderLeftWidth: 4,
    borderLeftColor: '#BF5AF2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pocketName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagA: { backgroundColor: '#00F0FF20' },
  tagB: { backgroundColor: '#00FF6620' },
  tagC: { backgroundColor: '#BF5AF220' },
  tagText: {
    color: '#E0F4FF',
    fontSize: 9,
    fontWeight: '700',
  },
  profitBadge: {
    alignItems: 'flex-end',
  },
  profitSub: {
    color: '#657B96',
    fontSize: 8,
    fontWeight: '600',
  },
  profitText: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  textGreen: {
    color: '#00FF66',
    textShadowColor: '#00FF6655',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  textRed: {
    color: '#FF3366',
    textShadowColor: '#FF336655',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strategyText: {
    color: '#7F96B2',
    fontSize: 10,
    fontWeight: '500',
  },
  holdingText: {
    color: '#A0B4CC',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  statusPanel: {
    backgroundColor: '#040913',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00F0FF22',
  },
  statusBlinkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FF66',
    marginRight: 6,
  },
  statusText: {
    flex: 1,
    color: '#C6DCF5',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  statusTime: {
    color: '#4F6580',
    fontSize: 9,
    fontWeight: '500',
    marginLeft: 6,
  },
});
