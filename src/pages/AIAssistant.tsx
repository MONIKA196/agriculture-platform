import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Bot, 
  User, 
  Leaf, 
  Loader2,
  Trash2,
  Sparkles
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const suggestedQuestions = [
  "How do I identify tomato blight?",
  "Best fertilizer for rice crops?",
  "When should I plant wheat?",
  "How to control aphids organically?",
  "Irrigation tips for summer crops",
  "Signs of nitrogen deficiency",
];

const AIAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data as Message[]);
    }
  };

  const saveMessage = async (role: "user" | "assistant", content: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ user_id: user.id, role, content })
      .select()
      .single();

    if (!error && data) {
      return data as Message;
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    setInput("");
    setIsLoading(true);

    // Add user message to UI
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message
    await saveMessage("user", text);

    try {
      const response = await supabase.functions.invoke("ai-chatbot", {
        body: { 
          message: text,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        },
      });

      if (response.error) throw response.error;

      const reply = response.data.reply;

      // Add assistant message to UI
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message
      await saveMessage("assistant", reply);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", user.id);

    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "Your chat history has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="lg:ml-64 h-screen flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                AI Farm Assistant
              </h1>
              <p className="text-muted-foreground text-sm">
                Ask me anything about farming, crops, diseases, and more
              </p>
            </div>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearHistory}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
            )}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-card rounded-2xl shadow-md p-4 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center mb-4">
                  <Leaf className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="font-semibold text-lg mb-2">Welcome to AgroSmart AI</h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  I'm your personal farming assistant. Ask me about crop diseases, 
                  fertilizers, weather advice, pest control, and more!
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-left text-sm p-3 rounded-xl bg-muted hover:bg-primary/10 transition-colors border border-border"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted p-4 rounded-2xl">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask about crops, diseases, fertilizers..."
              className="h-12"
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleSend()} 
              variant="hero" 
              size="lg"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAssistant;
