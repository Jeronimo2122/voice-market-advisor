import { useState } from "react";
import { Mic, MicOff, MessageCircle, Volume2, VolumeX, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

const VoiceAssistant = () => {
  const [isVisible, setIsVisible] = useState(true);
  const {
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
  } = useVoiceAssistant();

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTestSpeech = () => {
    testSpeech("Hello! This is a test of the speech generation system.");
  };

  const getStatusText = () => {
    if (isProcessing) return "Processing...";
    if (isListening) return "Listening...";
    if (isSpeaking) return "Speaking...";
    return "Ready to help!";
  };

  const getButtonColor = () => {
    if (isListening) return 'bg-red-600 hover:bg-red-700 animate-pulse';
    if (isProcessing) return 'bg-yellow-600 hover:bg-yellow-700';
    if (isSpeaking) return 'bg-green-600 hover:bg-green-700';
    return 'bg-blue-600 hover:bg-blue-700 hover:scale-110';
  };

  return (
    <>
      {/* Floating Voice Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={handleVoiceToggle}
          disabled={isProcessing || isSpeaking}
          className={`rounded-full h-16 w-16 shadow-lg transition-all duration-300 ${getButtonColor()}`}
        >
          {isListening ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Voice Assistant Panel */}
      {isVisible && (
        <div className="fixed bottom-24 right-6 z-40 animate-fade-in">
          <Card className="w-96 bg-slate-800/90 backdrop-blur-md border-slate-700 max-h-96">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">AI Shopping Assistant</h3>
                  <p className="text-sm text-slate-400">{getStatusText()}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {isSpeaking && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={stopSpeaking}
                      className="text-slate-400 hover:text-white h-8 w-8 p-0"
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleTestSpeech}
                    disabled={isSpeaking || isProcessing}
                    className="text-slate-400 hover:text-white h-8 w-8 p-0"
                    title="Test speech generation"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearConversation}
                      className="text-slate-400 hover:text-white h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="text-slate-400 hover:text-white h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              </div>
              
              {/* Error Display */}
              {error && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 mb-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Conversation History */}
              {messages.length > 0 ? (
                <ScrollArea className="h-48 mb-3">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-2 rounded-lg text-sm ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-sm text-slate-300 space-y-2 mb-3">
                  <p>💡 Try saying:</p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    <li>"Tell me about this camera"</li>
                    <li>"Find me gaming headphones"</li>
                    <li>"What's good for content creation?"</li>
                    <li>"Show me products under $500"</li>
                  </ul>
                </div>
              )}

              {/* Status Indicators */}
              {(isListening || isProcessing || isSpeaking) && (
                <div className="flex items-center justify-center">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full animate-pulse ${
                          isListening ? 'bg-red-500' :
                          isProcessing ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
