
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppState, Donation } from '../types';
import { useNotify } from '../App';
// Fix: Added missing CreditCard and Bitcoin icons to imports
import { Heart, ShieldCheck, Gift, Wallet, PartyPopper, Loader2, X, AlertTriangle, CreditCard, Bitcoin } from 'lucide-react';
import { generateThankYouNote } from '../services/geminiService';

const Donate: React.FC<{ state: AppState, onDonate: (d: Donation) => Promise<void> }> = ({ state, onDonate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const activePaymentMethods = state.paymentMethods.filter(pm => pm.isActive);
  
  const initialProjectId = location.state?.projectId || '';
  const initialCampaignId = location.state?.campaignId || '';

  const [form, setForm] = useState({
    projectId: initialProjectId,
    campaignId: initialCampaignId,
    amount: 50,
    donorName: '',
    donorEmail: '',
    paymentMethod: activePaymentMethods[0]?.id || '',
    message: '',
    isAnonymous: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState<string | null>(null);

  const amounts = [10, 25, 50, 100, 250, 500];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectId && !form.campaignId) return alert("Please select a cause.");
    if (!form.paymentMethod) return alert("Please select a payment method.");
    
    setIsSubmitting(true);
    
    const newDonation: Donation = {
      id: 'DON-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      amount: form.amount,
      donorName: form.donorName || "Supporter",
      donorEmail: form.donorEmail,
      projectId: form.projectId || undefined,
      campaignId: form.campaignId || undefined,
      message: form.message,
      isAnonymous: form.isAnonymous,
      paymentMethod: state.paymentMethods.find(pm => pm.id === form.paymentMethod)?.name,
      date: new Date().toISOString(),
    };

    try {
      await onDonate(newDonation);
      setIsSubmitting(false);
      setShowSuccessModal(true);
      const targetTitle = form.projectId ? state.projects.find(p => p.id === form.projectId)?.title : state.campaigns.find(c => c.id === form.campaignId)?.title;
      const aiNote = await generateThankYouNote(form.donorName || "Kind Supporter", form.amount, targetTitle || "the mission");
      setThankYouMessage(aiNote);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20 relative">
      {isSubmitting && (
        <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative"><Loader2 className="w-24 h-24 text-emerald-600 animate-spin" /><div className="absolute inset-0 flex items-center justify-center"><Heart className="w-8 h-8 text-emerald-600" fill="currentColor" /></div></div>
          <h3 className="mt-8 text-3xl font-serif font-bold text-slate-900 text-center">Processing Your Contribution...</h3>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl relative">
            <button onClick={() => setShowSuccessModal(false)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-full hover:bg-slate-100"><X className="w-6 h-6 text-slate-400" /></button>
            <div className="p-12 text-center space-y-8">
              <div className="relative inline-block"><div className="bg-emerald-100 w-32 h-32 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl animate-bounce"><PartyPopper className="w-16 h-16 text-emerald-600" /></div></div>
              <div className="space-y-4"><h2 className="text-5xl font-serif font-bold text-slate-900">Thank You!</h2><p className="text-xl text-slate-500">Your gift of <span className="text-emerald-600 font-black">${form.amount.toLocaleString()}</span> is now changing lives.</p></div>
              {thankYouMessage ? <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 relative"><p className="text-2xl text-slate-700 italic font-serif leading-relaxed">"{thankYouMessage}"</p></div> : <div className="flex flex-col items-center space-y-3 opacity-60 py-4"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /><p className="text-sm font-bold uppercase tracking-widest text-slate-400">Gemini is drafting a response...</p></div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"><button onClick={() => navigate('/')} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xl shadow-xl">Return Home</button><button onClick={() => { setShowSuccessModal(false); navigate(`/verify/${new Date().getTime()}`); }} className="w-full py-5 bg-emerald-50 text-emerald-600 rounded-[24px] font-black text-xl">View Receipt</button></div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-12">
        <div className="inline-block px-4 py-1 bg-emerald-50 text-emerald-700 rounded-full font-black text-xs uppercase tracking-widest uppercase">Support a Cause</div>
        <h1 className="text-7xl font-serif font-bold text-slate-900 leading-[1.1]">Join the <span className="text-emerald-600">Impact</span></h1>
        <p className="text-2xl text-slate-600 leading-relaxed max-w-lg">{state.settings.heroSubtitle}</p>
        <div className="grid grid-cols-1 gap-6"><div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-6"><div className="bg-emerald-100 p-4 rounded-2xl"><ShieldCheck className="w-8 h-8 text-emerald-600" /></div><div><h4 className="text-xl font-bold text-slate-900">Secure Processing</h4><p className="text-slate-500">Your data is encrypted and transactions are handled by PCI-compliant providers.</p></div></div></div>
      </div>

      <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 p-12">
        {activePaymentMethods.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="bg-amber-50 p-8 rounded-full"><AlertTriangle className="w-16 h-16 text-amber-600" /></div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Donations Suspended</h2>
            <p className="text-slate-500 max-w-xs">Our team is currently updating our payment gateways. Please check back shortly to complete your contribution.</p>
            <button onClick={() => navigate('/contact')} className="font-bold text-emerald-600 hover:underline">Contact Support</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Select a Cause</label>
              <select value={form.projectId || form.campaignId} onChange={(e) => { const val = e.target.value; const isProject = state.projects.some(p => p.id === val); setForm({ ...form, projectId: isProject ? val : '', campaignId: isProject ? '' : val }); }} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold">
                <option value="">Choose a destination...</option>
                <optgroup label="Active Projects">{state.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</optgroup>
                <optgroup label="Urgent Relief">{state.campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</optgroup>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Amount ($)</label>
              <div className="grid grid-cols-3 gap-3">{amounts.map(amt => <button key={amt} type="button" onClick={() => setForm({...form, amount: amt})} className={`py-4 rounded-2xl font-black text-xl transition-all ${form.amount === amt ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>${amt}</button>)}</div>
              <input type="number" placeholder="Custom" value={form.amount} onChange={(e) => setForm({...form, amount: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-xl" />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePaymentMethods.map(pm => (
                  <button key={pm.id} type="button" onClick={() => setForm({...form, paymentMethod: pm.id})} className={`flex items-center space-x-4 px-6 py-4 rounded-2xl border font-bold transition-all ${form.paymentMethod === pm.id ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                    {pm.type === 'Credit Card' ? <CreditCard className="w-5 h-5" /> : pm.type === 'Crypto' ? <Bitcoin className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                    <span>{pm.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Full Name" required value={form.donorName} onChange={(e) => setForm({...form, donorName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
              <input type="email" placeholder="Email" required value={form.donorEmail} onChange={(e) => setForm({...form, donorEmail: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
            </div>

            <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-[24px] font-black text-2xl hover:bg-emerald-700 shadow-2xl flex items-center justify-center space-x-4 active:scale-[0.98]"><Heart className="w-8 h-8" fill="currentColor" /><span>Complete Contribution</span></button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Donate;
