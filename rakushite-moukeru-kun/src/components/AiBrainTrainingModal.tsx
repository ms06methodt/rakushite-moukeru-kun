import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AiLearningLog, AiTuningProposal } from '../types';

interface AiBrainTrainingModalProps {
  visible: boolean;
  onClose: () => void;
  learningLogs: AiLearningLog[];
  proposals: AiTuningProposal[];
  onSelectOption: (proposalId: string, option: 'A' | 'B') => void;
  onGenerateNewProposal: () => void;
}

export const AiBrainTrainingModal: React.FC<AiBrainTrainingModalProps> = ({
  visible,
  onClose,
  learningLogs,
  proposals,
  onSelectOption,
  onGenerateNewProposal,
}) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'logs'>('proposals');

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>🧠 AI脳内スケルトン ＆ 2択育成</Text>
              <Text style={styles.headerSub}>SELF-LEARNING REINFORCEMENT HUD</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕ 閉じる</Text>
            </TouchableOpacity>
          </View>

          {/* タブセレクター */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'proposals' && styles.activeTabBtn]}
              onPress={() => setActiveTab('proposals')}
            >
              <Text style={[styles.tabText, activeTab === 'proposals' && styles.activeTabText]}>
                🎯 AIからの2択提案 ({proposals.filter(p => !p.applied).length}件)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'logs' && styles.activeTabBtn]}
              onPress={() => setActiveTab('logs')}
            >
              <Text style={[styles.tabText, activeTab === 'logs' && styles.activeTabText]}>
                📜 思考・反省ログ
              </Text>
            </TouchableOpacity>
          </View>

          {/* コンテンツエリア */}
          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContainer}>
            {activeTab === 'proposals' ? (
              <View>
                <View style={styles.proposalNotice}>
                  <Text style={styles.noticeText}>
                    💡 ご主人様はパラメーターを調整する必要はありません。AIの相談に対し【A】か【B】をタップするだけで、次回の売買思考プロンプトが自動進化します。
                  </Text>
                </View>

                {proposals.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyEmoji}>✨</Text>
                    <Text style={styles.emptyText}>現在すべてのAIチューニングが最適な状態です。</Text>
                    <TouchableOpacity style={styles.manualProposalBtn} onPress={onGenerateNewProposal}>
                      <Text style={styles.manualProposalBtnText}>AI執事に改善案を要求する</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  proposals.map((prop) => (
                    <View key={prop.id} style={styles.proposalCard}>
                      <View style={styles.propHeader}>
                        <Text style={styles.propPocketBadge}>{prop.pocketName}</Text>
                        <Text style={styles.propTime}>{prop.createdAt}</Text>
                      </View>

                      <Text style={styles.propTitle}>{prop.title}</Text>
                      <Text style={styles.propReason}>{prop.contextReason}</Text>

                      {/* 2択ボタンエリア */}
                      <View style={styles.optionsContainer}>
                        {/* 選択肢 A */}
                        <TouchableOpacity
                          style={[
                            styles.optionCard,
                            styles.optionCardA,
                            prop.chosenOption === 'A' && styles.selectedOptionA,
                          ]}
                          onPress={() => onSelectOption(prop.id, 'A')}
                          disabled={prop.applied}
                        >
                          <Text style={styles.optionLabelA}>{prop.optionA.label}</Text>
                          <Text style={styles.optionSummary}>{prop.optionA.effectSummary}</Text>
                          {prop.chosenOption === 'A' && (
                            <Text style={styles.appliedTag}>✓ 適用済み (AIロジック更新済)</Text>
                          )}
                        </TouchableOpacity>

                        {/* 選択肢 B */}
                        <TouchableOpacity
                          style={[
                            styles.optionCard,
                            styles.optionCardB,
                            prop.chosenOption === 'B' && styles.selectedOptionB,
                          ]}
                          onPress={() => onSelectOption(prop.id, 'B')}
                          disabled={prop.applied}
                        >
                          <Text style={styles.optionLabelB}>{prop.optionB.label}</Text>
                          <Text style={styles.optionSummary}>{prop.optionB.effectSummary}</Text>
                          {prop.chosenOption === 'B' && (
                            <Text style={styles.appliedTag}>✓ 適用済み (AIロジック更新済)</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            ) : (
              /* AIの思考・反省ログ */
              <View style={styles.logsList}>
                {learningLogs.map((log) => (
                  <View key={log.id} style={styles.logCard}>
                    <View style={styles.logHeader}>
                      <Text style={styles.logTime}>{log.timestamp}</Text>
                      <View style={styles.logConfidenceBadge}>
                        <Text style={styles.logConfidenceText}>確信度: {log.confidenceScore}%</Text>
                      </View>
                    </View>

                    <View style={styles.logSection}>
                      <Text style={styles.logSectionLabel}>🧠 AI思考プロセス:</Text>
                      <Text style={styles.logThoughtText}>{log.thoughtProcess}</Text>
                    </View>

                    <View style={styles.logSection}>
                      <Text style={styles.logSectionLabel}>⚡ 執行判断:</Text>
                      <Text style={styles.logDecisionText}>{log.decision}</Text>
                    </View>

                    <View style={styles.logSection}>
                      <Text style={styles.logSectionLabel}>🔍 事後反省・自己最適化:</Text>
                      <Text style={styles.logReflectionText}>{log.reflectionNotes}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
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
    backgroundColor: '#060E1A',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#00FF6666',
    maxHeight: '90%',
    shadowColor: '#00FF66',
    shadowRadius: 20,
    shadowOpacity: 0.3,
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
    color: '#00FF66',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: '#00F0FF88',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#122540',
    backgroundColor: '#07101E',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTabBtn: {
    borderBottomWidth: 2,
    borderBottomColor: '#00FF66',
    backgroundColor: '#00FF660D',
  },
  tabText: {
    color: '#6F88A6',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#00FF66',
  },
  body: {
    padding: 14,
  },
  bodyContainer: {
    paddingBottom: 24,
  },
  proposalNotice: {
    backgroundColor: '#00F0FF12',
    borderColor: '#00F0FF44',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  noticeText: {
    color: '#D4EEFF',
    fontSize: 11,
    lineHeight: 16,
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    color: '#7692B0',
    fontSize: 12,
    marginBottom: 14,
    textAlign: 'center',
  },
  manualProposalBtn: {
    backgroundColor: '#00FF6622',
    borderColor: '#00FF66',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  manualProposalBtnText: {
    color: '#00FF66',
    fontSize: 12,
    fontWeight: '800',
  },
  proposalCard: {
    backgroundColor: '#0A1526',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#193457',
    marginBottom: 14,
  },
  propHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  propPocketBadge: {
    color: '#00F0FF',
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: '#00F0FF15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  propTime: {
    color: '#556F8E',
    fontSize: 10,
  },
  propTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  propReason: {
    color: '#B2CAE5',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionCard: {
    borderRadius: 8,
    padding: 10,
    borderWidth: 1.5,
  },
  optionCardA: {
    backgroundColor: '#00F0FF0A',
    borderColor: '#00F0FF55',
  },
  selectedOptionA: {
    backgroundColor: '#00F0FF22',
    borderColor: '#00F0FF',
  },
  optionCardB: {
    backgroundColor: '#BF5AF20A',
    borderColor: '#BF5AF255',
  },
  selectedOptionB: {
    backgroundColor: '#BF5AF222',
    borderColor: '#BF5AF2',
  },
  optionLabelA: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  optionLabelB: {
    color: '#DF9BFF',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  optionSummary: {
    color: '#E0EEFF',
    fontSize: 10,
  },
  appliedTag: {
    color: '#00FF66',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
  },
  logsList: {
    gap: 12,
  },
  logCard: {
    backgroundColor: '#0A1526',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#193457',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  logTime: {
    color: '#597495',
    fontSize: 10,
  },
  logConfidenceBadge: {
    backgroundColor: '#00FF6615',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logConfidenceText: {
    color: '#00FF66',
    fontSize: 10,
    fontWeight: '700',
  },
  logSection: {
    marginTop: 6,
  },
  logSectionLabel: {
    color: '#00F0FF',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  logThoughtText: {
    color: '#C6DDF6',
    fontSize: 11,
    lineHeight: 16,
  },
  logDecisionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  logReflectionText: {
    color: '#9EBCD8',
    fontSize: 10,
    fontStyle: 'italic',
  },
});
