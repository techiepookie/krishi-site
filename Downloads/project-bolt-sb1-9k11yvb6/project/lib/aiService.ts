import { Alert } from 'react-native';

export interface AIAnalysisResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  treatment: string;
  prevention: string;
  additionalInfo?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  image?: string;
  timestamp: Date;
}

class AIService {
  private baseUrl: string = 'https://api.openai.com/v1';
  private backendUrl: string = 'https://your-backend-api.com'; // Replace with actual backend URL

  async analyzeImage(imageUri: string): Promise<AIAnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);
      
      // Send to secure backend instead of direct API call
      const response = await fetch(`${this.backendUrl}/ai/analyze-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          analysisType: 'crop-diagnosis'
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No analysis result received');
      }

      // Try to parse JSON response
      try {
        const result = JSON.parse(content);
        return {
          disease: result.disease || 'Unknown condition',
          confidence: result.confidence || 0,
          severity: result.severity || 'Medium',
          treatment: result.treatment || 'Consult agricultural expert',
          prevention: result.prevention || 'Follow good agricultural practices',
          additionalInfo: result.additionalInfo,
        };
      } catch (parseError) {
        // If not JSON, create structured response from text
        return this.parseTextResponse(content);
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  }

  async chatWithAI(message: string, imageUri?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AI API key not configured');
    }

    try {
      const messages: any[] = [
        {
          role: 'system',
          content: 'You are an agricultural expert AI assistant. Provide helpful advice about farming, crops, diseases, and agricultural practices. Keep responses concise and practical.',
        },
      ];

      if (imageUri) {
        const base64Image = await this.convertImageToBase64(imageUri);
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: message },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        });
      } else {
        messages.push({
          role: 'user',
          content: message,
        });
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }

  private async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('Failed to convert image to base64');
    }
  }

  private parseTextResponse(text: string): AIAnalysisResult {
    // Extract information from text response
    const diseaseMatch = text.match(/disease[:\s]+([^\n.]+)/i);
    const confidenceMatch = text.match(/confidence[:\s]+(\d+)/i);
    const severityMatch = text.match(/severity[:\s]+(low|medium|high)/i);
    
    return {
      disease: diseaseMatch?.[1]?.trim() || 'Analysis completed',
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 75,
      severity: (severityMatch?.[1]?.toLowerCase() as any) || 'Medium',
      treatment: text.includes('treatment') ? text.split('treatment')[1]?.split('\n')[0]?.trim() || 'Consult expert' : 'Consult agricultural expert',
      prevention: text.includes('prevention') ? text.split('prevention')[1]?.split('\n')[0]?.trim() || 'Follow best practices' : 'Follow good agricultural practices',
      additionalInfo: text,
    };
  }

  async saveApiKey(key: string): Promise<void> {
    try {
      const { storage } = require('./storage');
      await storage.setItem('aiApiKey', key);
      this.setApiKey(key);
    } catch (error) {
      console.error('Save API key error:', error);
    }
  }

  async loadApiKey(): Promise<void> {
    try {
      const { storage } = require('./storage');
      const key = await storage.getItem('aiApiKey');
      if (key) {
        this.setApiKey(key);
      }
    } catch (error) {
      console.error('Load API key error:', error);
    }
  }
}

export const aiService = new AIService();