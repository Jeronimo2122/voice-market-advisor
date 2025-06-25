
import { useState } from "react";
import { Mic, MicOff, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const toggleListening = () => {
    setIsListening(!isListening);
    console.log(isListening ? "Stopping voice assistant" : "Starting voice assistant");
    // This will be connected to Gemini Live later
  };

  return (
    <>
      {/* Floating Voice Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={toggleListening}
          className={`rounded-full h-16 w-16 shadow-lg transition-all duration-300 ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
          }`}
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
          <Card className="w-80 bg-slate-800/90 backdrop-blur-md border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">AI Shopping Assistant</h3>
                  <p className="text-sm text-slate-400">
                    {isListening ? "Listening..." : "Ready to help!"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
              
              <div className="text-sm text-slate-300 space-y-2">
                <p>💡 Try saying:</p>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  <li>"Tell me about this camera"</li>
                  <li>"Find me gaming headphones"</li>
                  <li>"What's good for content creation?"</li>
                </ul>
              </div>

              {isListening && (
                <div className="mt-3 flex items-center justify-center">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"
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
