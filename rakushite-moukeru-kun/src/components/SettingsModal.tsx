import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppSettings } from '../types';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onResetDemoData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  settings,
  onSaveSettings,
  onResetDemoData,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>({ ...settings });

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>⚙️ システム・API設定</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕ 閉じる</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContainer}>
            {/* 緊急停止キルスイッチ */}
            <View style={styles.killSwitchCard}>
              <View style={styles.killSwitchTextContainer}>
                <Text style={styles.killSwitchTitle}>⚠️ 緊急停止キルスイッチ</Text>
                <Text style={styles.killSwitchDesc}>
                  ONにするとすべてのAI自動売買・API発注が即座に完全停止します。
                </Text>
              </View>
              <Switch
                value={localSettings.killSwitchActive}
                onValueChange={(val) => setLocalSettings({ ...localSettings, killSwitchActive: val })}
                trackColor={{ false: '#3E1010', true: '#FF3366' }}
                thumbColor={localSettings.killSwitchActive ? '#FFFFFF' : '#888888'}
              />
            </View>

            {/* 実弾・デモモード切り替え */}
            <View style={styles.settingCard}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>本番実弾取引モード</Text>
                <Text style={styles.settingDesc}>
                  {localSettings.isRealTradingEnabled
                    ? 'Coincheck APIを通じて本物の日本円で注文を執行します。'
                    : 'ノーリスクの仮想資金でAIを育成・検証します。'}
                </Text>
              </View>
              <Switch
                value={localSettings.isRealTradingEnabled}
                onValueChange={(val) => setLocalSettings({ ...localSettings, isRealTradingEnabled: val })}
                trackColor={{ false: '#0E284A', true: '#00FF66' }}
                thumbColor={localSettings.isRealTradingEnabled ? '#FFFFFF' : '#888888'}
              />
            </View>

            {/* Gemini API Key */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🤖 Google Gemini API Key:</Text>
              <TextInput
                style={styles.input}
                placeholder="AI_zaSy... (未設定時は内蔵エンジンが自動応答)"
                placeholderTextColor="#556F8E"
                value={localSettings.geminiApiKey}
                onChangeText={(val) => setLocalSettings({ ...localSettings, geminiApiKey: val })}
                secureTextEntry
                autoCapitalize="none"
              />
              <Text style={styles.inputHint}>
                ※ Gemini 2.5 Flashでより高度な推論・相場分析を行います。
              </Text>
            </View>

            {/* Coincheck API Key */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🔑 Coincheck API Access Key:</Text>
              <TextInput
                style={styles.input}
                placeholder="Coincheckのアクセスキー"
                placeholderTextColor="#556F8E"
                value={localSettings.coincheckApiKey}
                onChangeText={(val) => setLocalSettings({ ...localSettings, coincheckApiKey: val })}
                autoCapitalize="none"
              />
            </View>

            {/* Coincheck Secret Key */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🔐 Coincheck API Secret Key:</Text>
              <TextInput
                style={styles.input}
                placeholder="Coincheckのシークレットキー"
                placeholderTextColor="#556F8E"
                value={localSettings.coincheckApiSecret}
                onChangeText={(val) => setLocalSettings({ ...localSettings, coincheckApiSecret: val })}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* 仮想初期資金の設定 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>💰 仮想デモ初期資金:</Text>
              <View style={styles.presetAmountsRow}>
                {[500, 1000, 5000, 10000, 50000, 100000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[
                      styles.presetBtn,
                      localSettings.initialDemoFundsJpy === amt && styles.activePresetBtn,
                    ]}
                    onPress={() => setLocalSettings({ ...localSettings, initialDemoFundsJpy: amt })}
                  >
                    <Text
                      style={[
                        styles.presetBtnText,
                        localSettings.initialDemoFundsJpy === amt && styles.activePresetBtnText,
                      ]}
                    >
                      ¥{amt.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* データ初期化ボタン */}
            <TouchableOpacity style={styles.resetBtn} onPress={onResetDemoData}>
              <Text style={styles.resetBtnText}>🔄 デモ取引履歴＆学習データをリセット</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* フッター保存ボタン */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>設定を保存する</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000E6',
    justifyContent: 'center',
    padding: 14,
  },
  modalBox: {
    backgroundColor: '#070F1E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00F0FF44',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#122540',
    backgroundColor: '#091526',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerTitle: {
    color: '#00F0FF',
    fontSize: 15,
    fontWeight: '800',
  },
  closeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#162842',
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#A0B8D4',
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: 16,
  },
  bodyContainer: {
    gap: 14,
    paddingBottom: 20,
  },
  killSwitchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#260B12',
    borderWidth: 1.5,
    borderColor: '#FF3366',
    borderRadius: 10,
    padding: 12,
  },
  killSwitchTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  killSwitchTitle: {
    color: '#FF3366',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  killSwitchDesc: {
    color: '#F4BAC7',
    fontSize: 10,
    lineHeight: 14,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0B1728',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#193457',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingDesc: {
    color: '#7694BA',
    fontSize: 10,
    lineHeight: 14,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    color: '#00F0FF',
    fontSize: 11,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#0D1A2E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#FFFFFF',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#1C3658',
  },
  inputHint: {
    color: '#556F8E',
    fontSize: 9,
  },
  presetAmountsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  presetBtn: {
    backgroundColor: '#0E1D33',
    borderColor: '#1F3C64',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activePresetBtn: {
    backgroundColor: '#00FF6622',
    borderColor: '#00FF66',
  },
  presetBtnText: {
    color: '#8CAECF',
    fontSize: 11,
    fontWeight: '700',
  },
  activePresetBtnText: {
    color: '#00FF66',
  },
  resetBtn: {
    backgroundColor: '#1E121E',
    borderColor: '#63264F',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  resetBtnText: {
    color: '#D47FA6',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#122540',
    backgroundColor: '#091526',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  saveBtn: {
    backgroundColor: '#00FF66',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#041408',
    fontSize: 13,
    fontWeight: '900',
  },
});
