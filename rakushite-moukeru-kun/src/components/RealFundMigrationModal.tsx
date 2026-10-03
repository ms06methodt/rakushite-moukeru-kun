import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface RealFundMigrationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmMigration: (apiKey: string, apiSecret: string) => void;
  winRate: number;
  totalDemoProfit: number;
}

export const RealFundMigrationModal: React.FC<RealFundMigrationModalProps> = ({
  visible,
  onClose,
  onConfirmMigration,
  winRate,
  totalDemoProfit,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [step, setStep] = useState<'proposal' | 'apiSetup'>('proposal');

  const handleStartReal = () => {
    onConfirmMigration(apiKey, apiSecret);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.crownEmoji}>👑</Text>
            <View>
              <Text style={styles.headerTitle}>AI執事からの昇格提案</Text>
              <Text style={styles.headerSub}>REAL TRADING GRADUATION MILESTONE</Text>
            </View>
          </View>

          {step === 'proposal' ? (
            <View style={styles.body}>
              {/* 実績バッジ */}
              <View style={styles.achievementBox}>
                <View style={styles.achieveItem}>
                  <Text style={styles.achieveLabel}>デモ検証勝率</Text>
                  <Text style={styles.achieveValue}>{winRate.toFixed(1)}%</Text>
                </View>
                <View style={styles.achieveDivider} />
                <View style={styles.achieveItem}>
                  <Text style={styles.achieveLabel}>仮想累計利益</Text>
                  <Text style={styles.achieveValue}>+¥{totalDemoProfit.toLocaleString()}</Text>
                </View>
              </View>

              {/* 執事からのセリフ */}
              <View style={styles.butlerSpeechBubble}>
                <Text style={styles.butlerSpeechText}>
                  「ご主人様、私の学習モデルが十分に最適化され、安定した利益を出せる確固たるデータが揃いました。
                  {'\n\n'}
                  そろそろ本物の資金（Coincheck連携）をお預かりし、実弾での本格運用を開始してもよろしいでしょうか？」
                </Text>
              </View>

              <View style={styles.safetyInfoBox}>
                <Text style={styles.safetyTitle}>🛡️ 実弾運用の安心セーフティ機能</Text>
                <Text style={styles.safetyItem}>・まずは500円〜1,000円の超少額からの実弾テスト可能</Text>
                <Text style={styles.safetyItem}>・ワンタップで全売買を遮断する「緊急停止キルスイッチ」完備</Text>
                <Text style={styles.safetyItem}>・Gemini AIが24時間体制で厳格なリスク制御を継続</Text>
              </View>

              {/* アクションボタン */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.postponeBtn} onPress={onClose}>
                  <Text style={styles.postponeBtnText}>まだデモで様子見する</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.proceedBtn}
                  onPress={() => setStep('apiSetup')}
                >
                  <Text style={styles.proceedBtnText}>実弾運用へ進む 🚀</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* APIキー入力ステップ */
            <View style={styles.body}>
              <Text style={styles.setupTitle}>Coincheck API連携設定</Text>
              <Text style={styles.setupDesc}>
                Coincheckの管理画面（設定 ＞ APIキー）から発行したキーを入力してください。
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Coincheck Access Key (APIキー):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="例: cc_live_key_..."
                  placeholderTextColor="#4C6584"
                  value={apiKey}
                  onChangeText={setApiKey}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Coincheck Secret Key (シークレット):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="例: secret_key_..."
                  placeholderTextColor="#4C6584"
                  value={apiSecret}
                  onChangeText={setApiSecret}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.demoNotice}>
                <Text style={styles.demoNoticeText}>
                  ※ APIキーを空のまま「GOサイン」を押した場合でも、セーフティシミュレーター付きの本番移行テストモードとして安全に稼働します。
                </Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.postponeBtn} onPress={() => setStep('proposal')}>
                  <Text style={styles.postponeBtnText}>戻る</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.goSignBtn} onPress={handleStartReal}>
                  <Text style={styles.goSignBtnText}>🔥 GOサイン（実弾開始）</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000EB',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#07101E',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFB800',
    overflow: 'hidden',
    shadowColor: '#FFB800',
    shadowRadius: 20,
    shadowOpacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#101B2C',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFB80044',
  },
  crownEmoji: {
    fontSize: 26,
  },
  headerTitle: {
    color: '#FFB800',
    fontSize: 16,
    fontWeight: '900',
  },
  headerSub: {
    color: '#FFD266',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  body: {
    padding: 16,
  },
  achievementBox: {
    flexDirection: 'row',
    backgroundColor: '#040812',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFB80033',
    marginBottom: 14,
  },
  achieveItem: {
    flex: 1,
    alignItems: 'center',
  },
  achieveDivider: {
    width: 1,
    backgroundColor: '#1E2F48',
  },
  achieveLabel: {
    color: '#7692B0',
    fontSize: 10,
    marginBottom: 2,
  },
  achieveValue: {
    color: '#00FF66',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  butlerSpeechBubble: {
    backgroundColor: '#0F2038',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#00FF66',
    marginBottom: 14,
  },
  butlerSpeechText: {
    color: '#E0F0FF',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  safetyInfoBox: {
    backgroundColor: '#0A1524',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  safetyTitle: {
    color: '#00F0FF',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  safetyItem: {
    color: '#A2BCDA',
    fontSize: 10,
    lineHeight: 16,
  },
  setupTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  setupDesc: {
    color: '#8CA7C7',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#00F0FF',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0D1B2E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#1D3B63',
  },
  demoNotice: {
    backgroundColor: '#00FF6610',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  demoNoticeText: {
    color: '#84D8A8',
    fontSize: 10,
    lineHeight: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  postponeBtn: {
    flex: 1,
    backgroundColor: '#16253B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  postponeBtnText: {
    color: '#8AA5C6',
    fontSize: 12,
    fontWeight: '700',
  },
  proceedBtn: {
    flex: 1.2,
    backgroundColor: '#FFB800',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#FFB800',
    shadowRadius: 10,
    shadowOpacity: 0.4,
  },
  proceedBtnText: {
    color: '#0D0800',
    fontSize: 12,
    fontWeight: '900',
  },
  goSignBtn: {
    flex: 1.4,
    backgroundColor: '#00FF66',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#00FF66',
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },
  goSignBtnText: {
    color: '#021206',
    fontSize: 13,
    fontWeight: '900',
  },
});
