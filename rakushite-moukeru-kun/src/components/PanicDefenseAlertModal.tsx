import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PanicDefenseAlertModalProps {
  visible: boolean;
  onClose: () => void;
  dropPercent: number;
  explanation: string;
  reassurance: string;
}

export const PanicDefenseAlertModal: React.FC<PanicDefenseAlertModalProps> = ({
  visible,
  onClose,
  dropPercent,
  explanation,
  reassurance,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* 警告ネオンヘッダー */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🛡️</Text>
            <Text style={styles.headerTitle}>AI急落防御システム・緊急作動</Text>
          </View>

          {/* 下落率バッジ */}
          <View style={styles.dropBadgeContainer}>
            <Text style={styles.dropBadgeText}>
              24時間比: {dropPercent < 0 ? `${dropPercent.toFixed(1)}%` : `-${dropPercent.toFixed(1)}%`} 急落検知
            </Text>
          </View>

          {/* 解説（中学生レベルの分かりやすい説明） */}
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>🤵‍♂️ AI執事による現状解説</Text>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>

          {/* 放置でOK！安心結論バッジ */}
          <View style={styles.reassuranceBox}>
            <Text style={styles.reassuranceText}>{reassurance}</Text>
          </View>

          {/* 了解ボタン */}
          <TouchableOpacity style={styles.understandBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.understandBtnText}>了解した（放置してAIに任せる） ☕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000F2',
    justifyContent: 'center',
    padding: 18,
  },
  modalBox: {
    backgroundColor: '#0D0814',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FF3366',
    padding: 20,
    shadowColor: '#FF3366',
    shadowRadius: 25,
    shadowOpacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    color: '#FF3366',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dropBadgeContainer: {
    backgroundColor: '#FF336622',
    borderColor: '#FF3366',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 14,
  },
  dropBadgeText: {
    color: '#FF6688',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  explanationBox: {
    backgroundColor: '#121020',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2D1B36',
    marginBottom: 12,
  },
  explanationTitle: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  explanationText: {
    color: '#E8D4F0',
    fontSize: 12,
    lineHeight: 18,
  },
  reassuranceBox: {
    backgroundColor: '#00FF661A',
    borderColor: '#00FF66',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  reassuranceText: {
    color: '#00FF66',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  understandBtn: {
    backgroundColor: '#00FF66',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#00FF66',
    shadowRadius: 10,
    shadowOpacity: 0.4,
  },
  understandBtnText: {
    color: '#031208',
    fontSize: 14,
    fontWeight: '900',
  },
});
