import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-brand-navy">Contact & Support</h1>
        <p className="text-slate-600 text-sm">
          Have questions about SkillBridge, need custom enterprise agreements, or require assistance?
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-bold text-lg text-slate-900">Send Us a Message</h2>
          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-xs space-y-2 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">Message Received!</div>
              <p>Our platform operations team will respond to your inquiry within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Submit Message
              </button>
            </form>
          )}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-bold text-lg text-white">Platform Headquarters</h2>
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-teal" />
                <span>support@skillbridge.io</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-teal" />
                <span>500 Howard Street, Suite 400, San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 text-xs text-slate-300">
            <span className="font-bold text-white block mb-1">Live Concierge Support:</span>
            Enterprise clients have access to 24/7 dedicated Slack/Discord channel integration.
          </div>
        </div>
      </div>
    </div>
  );
};
