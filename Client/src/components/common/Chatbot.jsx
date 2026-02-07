import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize conversation when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0 && !conversationId) {
      initializeConversation();
    }
  }, [isOpen]);

  const initializeConversation = async () => {
    try {
      setLoading(true);
      const { data } = await api.post('/chatbot/new');
      setConversationId(data.conversationId);
      setMessages([{ role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      toast.error('Failed to start chat. Please try again.');
      const errorMessage = error.response?.data?.error || 'Failed to connect to chatbot';
      setMessages([
        { 
          role: 'assistant', 
          content: `Sorry, I'm having trouble connecting right now. ${errorMessage}` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to UI immediately
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post('/chatbot/chat', {
        message: userMessage,
        conversationId: conversationId,
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      
      // Update conversation ID if provided
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to get response';
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.` 
        }
      ]);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearConversation = async () => {
    try {
      if (conversationId) {
        await api.post('/chatbot/clear', { conversationId });
      }
      setMessages([]);
      setConversationId(null);
      initializeConversation();
      toast.success('Conversation cleared');
    } catch (error) {
      console.error('Clear conversation error:', error);
      toast.error('Failed to clear conversation');
    }
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content.split('\n').map((line, index) => {
      // Bold text (markdown **)
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Headers (markdown ## or ###)
      if (line.startsWith('### ')) {
        return <h3 key={index} className="font-semibold text-lg mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="font-bold text-xl mt-4 mb-2">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={index} className="ml-4 list-disc">{line.replace(/^[-•]\s/, '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} dangerouslySetInnerHTML={{ __html: line }} className="mb-2"></p>;
    });
  };

  return (
    <>
      {/* Chat Button - Fixed position bottom right, responsive */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 glass-button text-white rounded-full p-3 sm:p-4 shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-50 flex items-center gap-2 group"
          aria-label="Open chatbot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="hidden sm:block font-medium text-glass">LankaNutri Advisor</span>
        </button>
      )}

      {/* Chat Window - Responsive: full screen on mobile, card on desktop */}
      {isOpen && (
        <div className="fixed inset-4 sm:inset-auto sm:top-auto sm:left-auto sm:bottom-6 sm:right-6 sm:w-96 sm:max-w-[calc(100vw-2rem)] sm:h-[600px] sm:max-h-[calc(100vh-5rem)] glass-card rounded-2xl shadow-2xl flex flex-col z-50 backdrop-blur-xl">
          {/* Chat Header - Compact on mobile */}
          <div className="glass-dark text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-green-500 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-glass truncate">LankaNutri Advisor</h3>
                <p className="text-xs text-white/80 text-glass hidden sm:block">Your nutrition assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={handleClearConversation}
                className="p-2 sm:p-1 hover:bg-white/20 rounded-xl transition text-white/80 hover:text-white touch-manipulation"
                title="Clear conversation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 sm:p-1 hover:bg-white/20 rounded-xl transition text-white/80 hover:text-white touch-manipulation"
                aria-label="Close chatbot"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area - Scrollable, responsive padding */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4 bg-white/70 overscroll-contain">
            {messages.length === 0 && (
              <div className="text-center text-gray-700 mt-8 text-glass">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2">Starting conversation...</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-xl p-3 text-glass ${
                    msg.role === 'user'
                      ? 'glass-button bg-green-600 text-white'
                      : 'glass-card bg-white/95 text-gray-800 border border-gray-200'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none text-gray-800 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:text-gray-800">
                      {formatMessage(msg.content)}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="glass-card bg-white/95 rounded-xl p-3 border border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Touch-friendly on mobile */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 sm:p-4 bg-white/80 rounded-b-2xl shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="glass-input flex-1 min-w-0 px-4 py-3 sm:py-2 rounded-xl text-base sm:text-sm text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="glass-button text-white px-4 py-3 sm:py-2 rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;

