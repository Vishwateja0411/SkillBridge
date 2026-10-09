import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Search, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Conversation, Message } from '@skillbridge/shared';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await api.getConversations();
      if (res.success) {
        setConversations(res.conversations);
        if (res.conversations.length > 0 && !selectedConv) {
          setSelectedConv(res.conversations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      api.getMessages(selectedConv.id).then((res) => {
        if (res.success) setMessages(res.messages);
      });

      if (socket) {
        socket.emit('join_conversation', selectedConv.id);
        const handleNewMsg = (msg: Message) => {
          if (msg.conversationId === selectedConv.id) {
            setMessages((prev) => [...prev, msg]);
          }
        };
        socket.on('new_message', handleNewMsg);

        return () => {
          socket.emit('leave_conversation', selectedConv.id);
          socket.off('new_message', handleNewMsg);
        };
      }
    }
  }, [selectedConv?.id, socket]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedConv) return;

    const res = await api.sendMessage(selectedConv.id, { text });
    if (res.success) {
      setMessages((prev) => [...prev, res.message]);
      setText('');
      await fetchConversations();
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading messages...</div>;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[750px]">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-bold text-base text-slate-900">Conversations</h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No active conversations</div>
          ) : (
            conversations.map((c) => {
              const active = selectedConv?.id === c.id;
              const other = c.otherUser;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConv(c)}
                  className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                    active ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={other?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${other?.name}`}
                    alt={other?.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900 truncate">{other?.name || 'Collaborator'}</span>
                      <span className="text-[10px] text-slate-400">
                        {c.lastMessage ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {c.lastMessage?.text || 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/40">
        {selectedConv ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConv.otherUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedConv.otherUser?.name}`}
                  alt={selectedConv.otherUser?.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900">{selectedConv.otherUser?.name || 'Collaborator'}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{selectedConv.otherUser?.role} • Direct Project Chat</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Socket Connected</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m) => {
                const isMe = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-brand-indigo text-white rounded-br-none shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};
