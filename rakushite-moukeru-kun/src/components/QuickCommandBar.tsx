import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickCommandBarProps {
  onExecuteCommand: (command: 'recent5min' | 'todayTotal' | 'marketSummary') => void;
  onOpenFullChat: () => void;
}

export const QuickCommandBar: React.FC<QuickCommandBarProps> = ({
  onExecuteCommand,
  onOpenFullChat,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🤖 AI執事へのクイック音声・指示</Text>
        <TouchableOpacity onPress={onOpenFullChat}>
          <Text style={styles.chatLink}>執事と会話する 💬</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.cmdButton, styles.cmdBtnGreen]}
          activeOpacity={0.7}
          onPress={() => onExecuteCommand('recent5min')}
        >
          <Text style={styles.btnIcon}>⚡</Text>
          <Text style={styles.btnText}>直近5分の利益は？</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cmdButton, styles.cmdBtnCyan]}
          activeOpacity={0.7}
          onPress={() => onExecuteCommand('todayTotal')}
        >
          <Text style={styles.btnIcon}>💰</Text>
          <Text style={styles.btnText}>今日のトータルは？</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cmdButton, styles.cmdBtnPurple]}
          activeOpacity={0.7}
          onPress={() => onExecuteCommand('marketSummary')}
        >
          <Text style={styles.btnIcon}>🔮</Text>
          <Text style={styles.btnText}>今の相場を一言で</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#050C18',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#00F0FF33',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#7B93B2',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chatLink: {
    color: '#00F0FF',
    fontSize: 11,
    fontWeight: '700',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cmdButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
  },
  cmdBtnGreen: {
    backgroundColor: '#00FF6612',
    borderColor: '#00FF6666',
  },
  cmdBtnCyan: {
    backgroundColor: '#00F0FF12',
    borderColor: '#00F0FF66',
  },
  cmdBtnPurple: {
    backgroundColor: '#BF5AF212',
    borderColor: '#BF5AF266',
  },
  btnIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
});
