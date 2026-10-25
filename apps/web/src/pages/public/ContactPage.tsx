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
    <div className="bg-[#0B3D2E] text-[#F6F1E4] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
            CONCIERGE INQUIRIES
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#F6F1E4]">Contact & Support</h1>
          <p className="text-xs sm:text-sm text-[#BFD0C6] leading-relaxed">
            Have questions about enterprise terms, custom milestones, or require concierge assistance?
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">Send a Message</h2>
            {submitted ? (
              <div className="p-6 rounded-[8px] bg-[#072A20] text-[#7BC49A] text-xs space-y-2 text-center border border-[#1F5A46]">
                <CheckCircle2 className="w-8 h-8 text-[#7BC49A] mx-auto" />
                <div className="font-serif text-base text-[#F6F1E4]">Inquiry Dispatched</div>
                <p className="text-[#BFD0C6]">Our concierge team will respond directly to your inquiry within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F1E4] mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                    placeholder="e.g. Liam Vance"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F6F1E4] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                    placeholder="liam@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F6F1E4] mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                    placeholder="Describe your project, question, or organization size..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors shadow-sm"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

          <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">Platform Office</h2>
              <div className="space-y-4 text-xs text-[#BFD0C6]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C9A24B] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#F6F1E4] block">Headquarters</span>
                    SkillBridge Technologies Inc.<br />
                    500 Howard Street, Suite 400<br />
                    San Francisco, CA 94105
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C9A24B] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#F6F1E4] block">Direct Inquiries</span>
                    support@skillbridge.io<br />
                    enterprise@skillbridge.io
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-[#C9A24B] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#F6F1E4] block">Hours</span>
                    Monday – Friday, 8:00 AM – 6:00 PM PT
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#BFD0C6]">
              <span className="text-[#E5CB86] font-medium block mb-1">Dispute Resolution Policy:</span>
              All active contracts are protected by our neutral arbitration process with escrow disbursement safety.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
