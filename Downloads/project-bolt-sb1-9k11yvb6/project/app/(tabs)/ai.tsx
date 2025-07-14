import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { Camera, Image as ImageIcon, Zap, MessageCircle, Settings, Send, X, Bot, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';

interface AIAnalysisResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  treatment: string;
  prevention: string;
  additionalInfo?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  image?: string;
  timestamp: Date;
}

export default function AIScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showDiagnosisChat, setShowDiagnosisChat] = useState(false);
  const [diagnosisChatMessages, setDiagnosisChatMessages] = useState<ChatMessage[]>([]);
  const [diagnosisChatInput, setDiagnosisChatInput] = useState('');
  const [diagnosisChatLoading, setDiagnosisChatLoading] = useState(false);

  // Add missing refs
  const chatScrollRef = useRef<FlatList>(null);
  const diagnosisChatScrollRef = useRef<FlatList>(null);

  const handleCameraCapture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
      setShowDiagnosisChat(false);
      setDiagnosisChatMessages([]);
    }
  };

  const handleGallerySelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
      setShowDiagnosisChat(false);
      setDiagnosisChatMessages([]);
    }
  };

  const handleDiagnose = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }


    setDiagnosing(true);
    
    try {
      // Convert image to base64
      const imageResponse = await fetch(selectedImage);
      const blob = await imageResponse.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });

      // Call our secure backend
      const { supabase } = require('@/lib/supabase');
      const apiUrl = `${supabase.supabaseUrl}/functions/v1/ai-analysis`;
      
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          type: 'diagnosis'
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`AI API error: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const content = data.content;
      
      if (!content) {
        throw new Error('No analysis result received');
      }

      // Try to parse JSON response
      try {
        const result = JSON.parse(content);
        setResult({
          disease: result.disease || 'Analysis completed',
          confidence: result.confidence || 75,
          severity: result.severity || 'Medium',
          treatment: result.treatment || 'Consult agricultural expert',
          prevention: result.prevention || 'Follow good agricultural practices',
          additionalInfo: result.additionalInfo,
        });
      } catch (parseError) {
        // If not JSON, create structured response from text
        setResult({
          disease: 'Analysis completed',
          confidence: 75,
          severity: 'Medium',
          treatment: content.includes('treatment') ? content.split('treatment')[1]?.split('\n')[0]?.trim() || 'Consult expert' : 'Consult agricultural expert',
          prevention: content.includes('prevention') ? content.split('prevention')[1]?.split('\n')[0]?.trim() || 'Follow best practices' : 'Follow good agricultural practices',
          additionalInfo: content,
        });
      }

      // Initialize diagnosis chat with the result
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I've analyzed your crop image. Here's what I found:\n\n🔍 **Diagnosis**: ${result?.disease || 'Analysis completed'}\n📊 **Confidence**: ${result?.confidence || 75}%\n⚠️ **Severity**: ${result?.severity || 'Medium'}\n\nFeel free to ask me any questions about treatment, prevention, or general farming advice!`,
        timestamp: new Date(),
      };
      setDiagnosisChatMessages([initialMessage]);

    } catch (error: any) {
      console.error('AI analysis error:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setDiagnosing(false);
    }
  };

  const handleSendMessage = async (isGeneral = true) => {
    const input = isGeneral ? chatInput : diagnosisChatInput;
    const setInput = isGeneral ? setChatInput : setDiagnosisChatInput;
    const messages = isGeneral ? chatMessages : diagnosisChatMessages;
    const setMessages = isGeneral ? setChatMessages : setDiagnosisChatMessages;
    const setLoading = isGeneral ? setChatLoading : setDiagnosisChatLoading;

    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let contextPrompt = '';
      if (!isGeneral && result) {
        contextPrompt = `Context: I previously analyzed a crop image and found: ${result.disease} (${result.confidence}% confidence, ${result.severity} severity). Treatment: ${result.treatment}. Prevention: ${result.prevention}. `;
      }

      const { supabase } = require('@/lib/supabase');
      const apiUrl = `${supabase.supabaseUrl}/functions/v1/ai-analysis`;
      
      const chatResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          type: isGeneral ? 'chat' : 'diagnosis'
        }),
      });

      if (!chatResponse.ok) {
        throw new Error(`AI API error: ${chatResponse.status}`);
      }

      const data = await chatResponse.json();
      const aiResponse = data.content || 'Sorry, I could not process your request.';
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Auto-scroll to bottom
      setTimeout(() => {
        if (isGeneral) {
          chatScrollRef.current?.scrollToEnd();
        } else {
          diagnosisChatScrollRef.current?.scrollToEnd();
        }
      }, 100);

    } catch (error: any) {
      console.error('AI chat error:', error);
      Alert.alert('Error', 'Failed to get AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return Colors.success;
      case 'Medium': return Colors.warning;
      case 'High': return Colors.error;
      default: return Colors.text.secondary;
    }
  };

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.type === 'user' ? styles.userMessage : styles.aiMessage,
    ]}>
      <View style={styles.messageHeader}>
        {item.type === 'ai' ? (
          <Bot size={16} color={Colors.primary} />
        ) : (
          <User size={16} color={Colors.text.inverse} />
        )}
        <Text style={[
          styles.messageUser,
          item.type === 'user' && { color: Colors.text.inverse }
        ]}>
          {item.type === 'ai' ? 'AI Assistant' : 'You'}
        </Text>
      </View>
      <Text style={[
        styles.messageText,
        item.type === 'user' && { color: Colors.text.inverse }
      ]}>
        {item.content}
      </Text>
      <Text style={[
        styles.messageTime,
        item.type === 'user' && { color: Colors.text.inverse + '80' }
      ]}>
        {item.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Crop Diagnosis</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={() => setShowChat(true)}>
              <MessageCircle size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Upload a photo of your crop to get instant AI-powered disease diagnosis
        </Text>

        {/* Image Selection */}
        <View style={styles.imageSection}>
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <View style={styles.imageOverlay}>
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <ImageIcon size={48} color={Colors.text.secondary} />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}

          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.imageActionButton} onPress={handleCameraCapture}>
              <Camera size={24} color={Colors.primary} />
              <Text style={styles.imageActionText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageActionButton} onPress={handleGallerySelect}>
              <ImageIcon size={24} color={Colors.primary} />
              <Text style={styles.imageActionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Diagnose Button */}
        {selectedImage && (
          <TouchableOpacity
            style={[styles.diagnoseButton, diagnosing && styles.diagnoseButtonDisabled]}
            onPress={handleDiagnose}
            disabled={diagnosing}
          >
            <Zap size={20} color={Colors.text.inverse} />
            <Text style={styles.diagnoseButtonText}>
              {diagnosing ? 'Analyzing...' : 'Diagnose with AI'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Loading State */}
        {diagnosing && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar}>
              <View style={styles.loadingProgress} />
            </View>
            <Text style={styles.loadingText}>AI is analyzing your crop image...</Text>
          </View>
        )}

        {/* Results */}
        {result && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Diagnosis Results</Text>
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Confidence:</Text>
                <Text style={styles.confidenceValue}>{result.confidence.toFixed(1)}%</Text>
              </View>
            </View>

            <View style={styles.diseaseCard}>
              <View style={styles.diseaseHeader}>
                <Text style={styles.diseaseName}>{result.disease}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(result.severity) }]}>
                  <Text style={styles.severityText}>{result.severity}</Text>
                </View>
              </View>

              <View style={styles.treatmentSection}>
                <Text style={styles.sectionTitle}>Treatment</Text>
                <Text style={styles.sectionContent}>{result.treatment}</Text>
              </View>

              <View style={styles.preventionSection}>
                <Text style={styles.sectionTitle}>Prevention</Text>
                <Text style={styles.sectionContent}>{result.prevention}</Text>
              </View>
            </View>

            <View style={styles.resultActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowDiagnosisChat(true)}
              >
                <MessageCircle size={16} color={Colors.primary} />
                <Text style={styles.actionButtonText}>Ask Questions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Save Results</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Photography Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Ensure good lighting conditions</Text>
            <Text style={styles.tipItem}>• Focus on affected leaves or areas</Text>
            <Text style={styles.tipItem}>• Avoid blurry or distant shots</Text>
            <Text style={styles.tipItem}>• Include multiple angles if possible</Text>
          </View>
        </View>
      </View>

      {/* General Chat Modal */}
      <Modal
        visible={showChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>AI Assistant</Text>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={chatScrollRef}
            data={chatMessages}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id}
            style={styles.chatMessages}
            contentContainerStyle={styles.chatMessagesContent}
          />

          {chatLoading && (
            <View style={styles.loadingMessage}>
              <Text style={styles.loadingMessageText}>AI is thinking...</Text>
            </View>
          )}

          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Ask about farming, crops, diseases..."
              value={chatInput}
              onChangeText={setChatInput}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleSendMessage(true)}
              disabled={chatLoading}
            >
              <Send size={20} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Diagnosis Chat Modal */}
      <Modal
        visible={showDiagnosisChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Diagnosis Chat</Text>
            <TouchableOpacity onPress={() => setShowDiagnosisChat(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={diagnosisChatScrollRef}
            data={diagnosisChatMessages}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id}
            style={styles.chatMessages}
            contentContainerStyle={styles.chatMessagesContent}
          />

          {diagnosisChatLoading && (
            <View style={styles.loadingMessage}>
              <Text style={styles.loadingMessageText}>AI is thinking...</Text>
            </View>
          )}

          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Ask about treatment, prevention, or care..."
              value={diagnosisChatInput}
              onChangeText={setDiagnosisChatInput}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleSendMessage(false)}
              disabled={diagnosisChatLoading}
            >
              <Send size={20} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  imageSection: {
    marginBottom: 24,
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  changeImageButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeImageText: {
    fontSize: 12,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  imagePlaceholder: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
  },
  imageActionText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  diagnoseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  diagnoseButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  diagnoseButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '70%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  resultContainer: {
    marginBottom: 32,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confidenceLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  diseaseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  treatmentSection: {
    marginBottom: 16,
  },
  preventionSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text.secondary,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  tipsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeText: {
    fontSize: 16,
    color: Colors.primary,
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatMessagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: Colors.surface,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  messageUser: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  messageText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  loadingMessage: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  loadingMessageText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  chatTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apiKeyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  apiKeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  apiKeyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  apiKeyContent: {
    padding: 20,
    gap: 16,
  },
  apiKeyDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 8,
  },
  apiKeyNote: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  apiKeyInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});