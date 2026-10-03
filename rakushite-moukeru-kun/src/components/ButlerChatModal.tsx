import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ButlerMessage } from '../types';

interface ButlerChatModalProps {
  visible: boolean;
  onClose: () => void;
  messages: ButlerMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isThinking: boolean;
}

export const ButlerChatModal: React.FC<ButlerChatModalProps> = ({
  visible,
  onClose,
  messages,
  onSendMessage,
  isThinking,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (!inputText.trim() || isThinking) return;
    const msg = inputText;
    setInputText('');
    await onSendMessage(msg);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <View style={styles.butlerAvatarContainer}>
              <Text style={styles.avatarEmoji}>🤵‍♂️</Text>
              <View>
                <Text style={styles.butlerTitle}>専属AI執事『儲ける君』</Text>
                <Text style={styles.butlerSubtitle}>Gemini 2.5 Flash Autonomous Intelligence</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕ 閉じる</Text>
            </TouchableOpacity>
          </View>

          {/* メッセージ一覧 */}
          <ScrollView style={styles.messageList} contentContainerStyle={styles.messageContainer}>
            {messages.map((item) => {
              const isButler = item.sender === 'butler';
              return (
                <View
                  key={item.id}
                  style={[styles.messageBubble, isButler ? styles.butlerBubble : styles.userBubble]}
                >
                  <View style={styles.msgHeader}>
                    <Text style={[styles.senderName, isButler ? styles.butlerName : styles.userName]}>
                      {isButler ? '🤵‍♂️ 執事' : '👑 ご主人様'}
                    </Text>
                    <Text style={styles.msgTime}>{item.timestamp}</Text>
                  </View>
                  <Text style={styles.msgBody}>{item.text}</Text>
                </View>
              );
            })}

            {isThinking && (
              <View style={[styles.messageBubble, styles.butlerBubble]}>
                <Text style={styles.thinkingText}>🤵‍♂️ 執事が市場データを分析中・少々お待ちください...</Text>
              </View>
            )}
          </ScrollView>

          {/* 入力欄 */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="執事への質問・指示を入力（例: 今日の勝率は？）"
              placeholderTextColor="#5A718C"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!inputText.trim() || isThinking) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || isThinking}
            >
              <Text style={styles.sendBtnText}>送信</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#070F1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    borderWidth: 1,
    borderColor: '#00F0FF44',
    display: 'flex',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#122540',
    backgroundColor: '#0A162B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  butlerAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  butlerTitle: {
    color: '#00FF66',
    fontSize: 14,
    fontWeight: '800',
  },
  butlerSubtitle: {
    color: '#00F0FF88',
    fontSize: 9,
    fontWeight: '600',
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
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  messageBubble: {
    borderRadius: 12,
    padding: 12,
    maxWidth: '92%',
  },
  butlerBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#0E1D36',
    borderWidth: 1,
    borderColor: '#00F0FF33',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#00FF661A',
    borderWidth: 1,
    borderColor: '#00FF6644',
  },
  msgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
  },
  butlerName: {
    color: '#00FF66',
  },
  userName: {
    color: '#00F0FF',
  },
  msgTime: {
    color: '#556D8A',
    fontSize: 9,
  },
  msgBody: {
    color: '#E2F0FF',
    fontSize: 13,
    lineHeight: 19,
  },
  thinkingText: {
    color: '#00F0FF',
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#060D1A',
    borderTopWidth: 1,
    borderTopColor: '#122540',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0E1B2E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#1F3758',
  },
  sendBtn: {
    backgroundColor: '#00FF66',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#2A4D3B',
    opacity: 0.6,
  },
  sendBtnText: {
    color: '#041008',
    fontSize: 13,
    fontWeight: '800',
  },
});
