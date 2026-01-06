
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { ContactMessage } from '../types';

const Contact: React.FC<{ onMessage: (msg: ContactMessage) => void }> = ({ onMessage }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMsg: ContactMessage = {
      id: 'MSG-' + Math.random().toString(36).substr(2, 7).toUpperCase(),
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      date: new Date().toISOString(),
      isRead: false
    };

    onMessage(newMsg);
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-16">
          <div className="space-y-6">
            <h1 className="text-6xl font-serif font-bold text-slate-900">Reach out to us.</h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              Our team is dedicated to providing swift responses to all inquiries. Whether you're a donor, potential partner, or volunteer, we're here for you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {[
              { icon: Mail, label: 'Email Address', val: 'hello@impactflow.org', color: 'emerald' },
              { icon: Phone, label: 'Phone Number', val: '+1 (555) IMPACT-1', color: 'blue' },
              { icon: MapPin, label: 'Headquarters', val: '400 Mission Street, San Francisco', color: 'purple' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-8 group">
                <div className={`bg-${item.color}-50 p-5 rounded-3xl group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-8 h-8 text-${item.color}-600`} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{item.label}</h4>
                  <p className="text-xl font-bold text-slate-900 leading-tight">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
             <div className="flex items-center space-x-4 mb-8">
              <MessageSquare className="w-8 h-8 text-emerald-400" />
              <h4 className="text-2xl font-serif font-bold italic">Join the Ground Team</h4>
            </div>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We're always looking for passionate individuals to join our field teams in active project zones. 
            </p>
            <button className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-2xl text-emerald-400 font-bold transition-all">Volunteer Registration &rarr;</button>
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-10 lg:p-14 animate-in slide-in-from-right duration-1000">
          <form onSubmit={handleSubmit} className="space-y-8">
            {sent && (
              <div className="bg-emerald-50 text-emerald-700 p-6 rounded-3xl text-center font-bold text-lg animate-in fade-in slide-in-from-top-4 duration-300 border border-emerald-100">
                Message delivered to our team!
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" 
                />
              </div>
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Subject</label>
              <input 
                type="text" 
                required
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" 
              />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Your Message</label>
              <textarea 
                rows={5} 
                required
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" 
              />
            </div>
            <button 
              type="submit"
              className="w-full py-6 bg-emerald-600 text-white rounded-[24px] font-black text-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 flex items-center justify-center space-x-4 active:scale-[0.98]"
            >
              <Send className="w-7 h-7" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
