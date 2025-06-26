import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from './useProducts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const { data: products = [] } = useProducts();

  const startListening = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check microphone permissions.');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      // Convert speech to text
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio }
      });

      if (transcriptionError) {
        throw new Error(transcriptionError.message);
      }

      const userMessage = transcriptionData.text;
      if (!userMessage || userMessage.trim().length === 0) {
        setError('No speech detected. Please try again.');
        return;
      }

      // Add user message to conversation
      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newUserMessage]);

      // Get AI response
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data: chatData, error: chatError } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: userMessage,
          conversationHistory,
          productContext: products.slice(0, 10) // Send first 10 products for context
        }
      });

      if (chatError) {
        throw new Error(chatError.message);
      }

      const aiResponse = chatData.response;
      
      // Add AI response to conversation
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMessage]);

      // Convert AI response to speech
      await speakText(aiResponse);

    } catch (err) {
      console.error('Error processing audio:', err);
      setError('Failed to process voice input. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      console.log('Starting text-to-speech for:', text.substring(0, 50) + '...');
      
      // Check if browser supports speech synthesis
      if (!window.speechSynthesis) {
        throw new Error('Speech synthesis not supported in this browser');
      }

      // Create a new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Set up event handlers
      utterance.onstart = () => {
        console.log('Speech started');
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        setError(`Speech error: ${event.error}`);
      };

      // Speak the text
      console.log('Starting speech synthesis...');
      window.speechSynthesis.speak(utterance);
      
    } catch (err) {
      console.error('Error with text-to-speech:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setIsSpeaking(false);
      setError(`Failed to generate speech: ${err.message}`);
    }
  };

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const testSpeech = useCallback(async (testText: string) => {
    console.log('Testing speech generation with:', testText);
    await speakText(testText);
  }, []);

  return {
    isListening,
    isProcessing,
    isSpeaking,
    messages,
    error,
    startListening,
    stopListening,
    stopSpeaking,
    clearConversation,
    testSpeech
  };
};
