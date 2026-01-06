
import React, { useState, useRef } from 'react';
import { AppState, Project, Campaign, NewsUpdate, Donation, ContactMessage, SiteSettings, PaymentMethod } from '../types';
// Fix: Added missing Info icon to imports
import { 
  Plus, Edit2, Trash2, LayoutDashboard, Database, TrendingUp, Sparkles, X, 
  Save, Megaphone, Newspaper, Mail, Download, CheckCircle, Palette, CreditCard, Image as ImageIcon, Upload, Trash, RefreshCw, MailOpen, Eye, ToggleLeft, ToggleRight, Wallet, Bitcoin, Info
} from 'lucide-react';
import { generateProjectDescription } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

interface AdminProps {
  state: AppState;
  manageProjects: {
    add: (p: Project) => void;
    update: (p: Project) => void;
    delete: (id: string) => void;
  };
  manageCampaigns: {
    add: (c: Campaign) => void;
    update: (c: Campaign) => void;
    delete: (id: string) => void;
  };
  manageNews: {
    add: (n: NewsUpdate) => void;
    update: (n: NewsUpdate) => void;
    delete: (id: string) => void;
  };
  manageMessages: {
    markRead: (id: string) => void;
    delete: (id: string) => void;
  };
  updateSettings: (s: SiteSettings) => void;
  updatePaymentMethods: (m: PaymentMethod[]) => void;
  isSyncing?: boolean;
}

const Admin: React.FC<AdminProps> = ({ state, manageProjects, manageCampaigns, manageNews, manageMessages, updateSettings, updatePaymentMethods, isSyncing }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'campaigns' | 'news' | 'donations' | 'messages' | 'settings' | 'payments'>('dashboard');
  const [modalType, setModalType] = useState<'project' | 'campaign' | 'news' | 'message' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(state.settings);
  const [isGenerating, setIsGenerating] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("Image too large (max 2MB)."); return; }
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadReceipt = async (donation: Donation) => {
    const doc = new jsPDF();
    const target = donation.projectId ? state.projects.find(p => p.id === donation.projectId)?.title : "General Fund";
    doc.setFontSize(22);
    doc.setTextColor(5, 150, 105);
    doc.text(state.settings.organizationName, 20, 30);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Official Receipt - ${donation.id}`, 20, 40);
    doc.text(`Donor: ${donation.donorName}`, 20, 60);
    doc.text(`Amount: $${donation.amount}`, 20, 70);
    const verifyUrl = `${window.location.origin}/#/verify/${donation.id}`;
    const qr = await QRCode.toDataURL(verifyUrl);
    doc.addImage(qr, 'PNG', 150, 60, 40, 40);
    doc.save(`Receipt-${donation.id}.pdf`);
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const openModal = (type: 'project' | 'campaign' | 'news' | 'message', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    if (type === 'message' && item) {
      manageMessages.markRead(item.id);
    }
    setForm(item || { title: '', description: '', goal: 1000, category: 'Community', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800', status: 'active' });
  };

  const handleSave = () => {
    const id = editingItem?.id || Math.random().toString(36).substr(2, 9).toUpperCase();
    const data = { ...form, id, currentAmount: editingItem?.currentAmount || 0, createdAt: editingItem?.createdAt || new Date().toISOString() };
    if (modalType === 'project') editingItem ? manageProjects.update(data) : manageProjects.add(data);
    if (modalType === 'campaign') editingItem ? manageCampaigns.update(data) : manageCampaigns.add(data);
    if (modalType === 'news') manageNews.add({ ...data, author: 'Admin', date: new Date().toISOString() });
    setModalType(null);
  };

  const handleAI = async () => {
    if (!form.title) return alert("Enter a title first");
    setIsGenerating(true);
    const desc = await generateProjectDescription(form.title);
    setForm(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const togglePaymentMethod = (id: string) => {
    const updated = state.paymentMethods.map(pm => pm.id === id ? { ...pm, isActive: !pm.isActive } : pm);
    updatePaymentMethods(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10">
      <div className="lg:w-72 space-y-2">
        <div className="px-6 py-4 mb-4 bg-emerald-50 rounded-2xl flex items-center justify-between">
           <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">Supabase</span>
           {isSyncing ? <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" /> : <CheckCircle className="w-4 h-4 text-emerald-600" />}
        </div>
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'projects', label: 'Projects', icon: Database },
          { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
          { id: 'news', label: 'News Feed', icon: Newspaper },
          { id: 'donations', label: 'Donations', icon: TrendingUp },
          { id: 'messages', label: 'Messages', icon: Mail },
          { id: 'settings', label: 'Branding', icon: Palette },
          { id: 'payments', label: 'Payments', icon: CreditCard }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all relative ${
              activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
            {tab.id === 'messages' && state.messages.some(m => !m.isRead) && <span className="absolute top-4 right-6 w-2 h-2 bg-red-500 rounded-full" />}
          </button>
        ))}
      </div>

      <div className="flex-grow">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border"><p className="text-xs font-black uppercase text-slate-400 mb-2">Total Raised</p><p className="text-4xl font-black">${state.donations.reduce((s, d) => s + d.amount, 0).toLocaleString()}</p></div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border"><p className="text-xs font-black uppercase text-slate-400 mb-2">Impact Projects</p><p className="text-4xl font-black">{state.projects.length}</p></div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border"><p className="text-xs font-black uppercase text-slate-400 mb-2">New Messages</p><p className="text-4xl font-black">{state.messages.filter(m => !m.isRead).length}</p></div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-serif font-bold text-slate-900">Payment Gateways</h2>
              {isSyncing && <div className="flex items-center space-x-2 text-emerald-600 animate-pulse"><RefreshCw className="w-4 h-4 animate-spin" /><span className="text-xs font-black uppercase tracking-widest">Syncing Status</span></div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.paymentMethods.map(pm => (
                <div key={pm.id} className={`bg-white p-8 rounded-[32px] border transition-all flex items-center justify-between ${pm.isActive ? 'border-emerald-100 shadow-lg shadow-emerald-50' : 'border-slate-100 opacity-60 grayscale'}`}>
                  <div className="flex items-center space-x-6">
                    <div className={`p-4 rounded-2xl ${pm.isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {pm.type === 'Credit Card' ? <CreditCard /> : pm.type === 'PayPal' ? <Wallet /> : pm.type === 'Crypto' ? <Bitcoin /> : <TrendingUp />}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{pm.name}</h4>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{pm.type}</p>
                    </div>
                  </div>
                  <button onClick={() => togglePaymentMethod(pm.id)} className={`p-3 rounded-2xl transition-all ${pm.isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 bg-slate-50'}`}>
                    {pm.isActive ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 flex items-start space-x-6">
               <Info className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
               <p className="text-emerald-800 text-sm font-medium leading-relaxed">Changes to payment methods are reflected instantly on the <strong>/donate</strong> page. We recommend keeping at least one primary method (Credit Card or PayPal) active to ensure consistent funding.</p>
            </div>
          </div>
        )}

        {/* Previous tabs logic... */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-slate-900">Donor Inquiries</h2>
            <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden divide-y">
              {state.messages.map(msg => (
                <div key={msg.id} className={`p-8 hover:bg-slate-50 transition-colors flex items-center justify-between ${!msg.isRead ? 'bg-emerald-50/30' : ''}`}>
                  <div className="flex items-center space-x-6">
                    <div className={`p-4 rounded-2xl ${!msg.isRead ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{msg.isRead ? <MailOpen /> : <Mail />}</div>
                    <div>
                      <div className="flex items-center space-x-2"><h4 className="text-xl font-bold text-slate-900">{msg.name}</h4>{!msg.isRead && <span className="bg-emerald-600 text-[10px] text-white px-2 py-0.5 rounded-full font-black uppercase">New</span>}</div>
                      <p className="text-sm font-medium text-slate-500">{msg.email} • {new Date(msg.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={() => openModal('message', msg)} className="p-3 bg-white text-slate-400 hover:text-emerald-600 rounded-xl border shadow-sm"><Eye className="w-5 h-5" /></button>
                    <button onClick={() => { if(confirm('Delete message?')) manageMessages.delete(msg.id); }} className="p-3 bg-white text-slate-400 hover:text-red-600 rounded-xl border shadow-sm"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="bg-white rounded-[40px] border overflow-hidden shadow-sm animate-in fade-in duration-500">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b"><tr><th className="px-8 py-6 text-xs font-black uppercase text-slate-400">Donor</th><th className="px-8 py-6 text-xs font-black uppercase text-slate-400">Amount</th><th className="px-8 py-6 text-xs font-black uppercase text-slate-400">Target</th><th className="px-8 py-6 text-xs font-black uppercase text-slate-400">Action</th></tr></thead>
              <tbody className="divide-y">
                {state.donations.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors"><td className="px-8 py-6 font-bold text-slate-900">{d.donorName || 'Anonymous'}</td><td className="px-8 py-6 font-black text-emerald-600 text-lg">${d.amount.toLocaleString()}</td><td className="px-8 py-6 text-sm text-slate-500">{d.projectId ? state.projects.find(p => p.id === d.projectId)?.title : 'General Fund'}</td><td className="px-8 py-6"><button onClick={() => downloadReceipt(d)} className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl font-bold text-xs tracking-widest"><Download className="w-4 h-4" /><span>Receipt</span></button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Projects/Campaigns/News Tabs */}
        {(activeTab === 'projects' || activeTab === 'campaigns' || activeTab === 'news') && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center"><h2 className="text-4xl font-serif font-bold text-slate-900 capitalize">{activeTab}</h2><button onClick={() => openModal(activeTab === 'projects' ? 'project' : activeTab === 'campaigns' ? 'campaign' : 'news')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2"><Plus className="w-5 h-5" /><span>Create New</span></button></div>
            <div className="grid grid-cols-1 gap-6">
              {(activeTab === 'projects' ? state.projects : activeTab === 'campaigns' ? state.campaigns : state.news).map((item: any) => (
                <div key={item.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center space-x-6"><div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border"><img src={item.imageUrl} className="w-full h-full object-cover" /></div><div><h4 className="text-xl font-bold text-slate-900">{item.title}</h4><p className="text-sm font-bold text-slate-400">{item.goal ? `$${item.currentAmount?.toLocaleString() || 0} / $${item.goal.toLocaleString()}` : new Date(item.date).toLocaleDateString()}</p></div></div>
                  <div className="flex space-x-3"><button onClick={() => openModal(activeTab === 'projects' ? 'project' : activeTab === 'campaigns' ? 'campaign' : 'news', item)} className="p-4 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-2xl"><Edit2 className="w-5 h-5" /></button><button onClick={() => { if(confirm('Delete?')) { if(activeTab === 'projects') manageProjects.delete(item.id); if(activeTab === 'campaigns') manageCampaigns.delete(item.id); if(activeTab === 'news') manageNews.delete(item.id); } }} className="p-4 bg-slate-50 text-slate-400 hover:text-red-600 rounded-2xl"><Trash2 className="w-5 h-5" /></button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 animate-in fade-in duration-500">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 flex items-center space-x-3"><Palette className="w-8 h-8 text-emerald-600" /><span>Visual Identity</span></h2>
            <form onSubmit={handleSettingsSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4"><label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Logo</label><div className="flex items-center space-x-6"><div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">{settingsForm.logoUrl ? <img src={settingsForm.logoUrl} className="w-full h-full object-contain" /> : <ImageIcon className="w-8 h-8 text-slate-300" />}</div><button type="button" onClick={() => logoInputRef.current?.click()} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2"><Upload className="w-4 h-4" /><span>Upload</span></button><input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setSettingsForm({...settingsForm, logoUrl: url}))} /></div></div>
                <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Brand Color</label><div className="flex items-center space-x-4"><input type="color" value={settingsForm.primaryColor} onChange={e => setSettingsForm({...settingsForm, primaryColor: e.target.value})} className="h-14 w-14 rounded-2xl cursor-pointer border-0 p-0 overflow-hidden" /><input type="text" value={settingsForm.primaryColor} onChange={e => setSettingsForm({...settingsForm, primaryColor: e.target.value})} className="flex-grow px-5 py-3 bg-slate-50 border rounded-xl font-mono text-sm uppercase" /></div></div>
              </div>
              <div className="space-y-6 pt-6 border-t"><input type="text" placeholder="Organization Name" value={settingsForm.organizationName} onChange={e => setSettingsForm({...settingsForm, organizationName: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" /><input type="text" placeholder="Hero Title" value={settingsForm.heroTitle} onChange={e => setSettingsForm({...settingsForm, heroTitle: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-bold" /><textarea rows={3} placeholder="Hero Subtitle" value={settingsForm.heroSubtitle} onChange={e => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border rounded-2xl font-medium" /></div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all">{isSyncing ? "Saving..." : "Save Identity Changes"}</button>
            </form>
          </div>
        )}
      </div>

      {/* Shared Modals */}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            {modalType === 'message' ? (
              <div className="p-12 space-y-8">
                <div className="flex justify-between items-start"><div><h3 className="text-3xl font-serif font-bold text-slate-900">{form.subject}</h3><p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">From: {form.name}</p></div><button onClick={() => setModalType(null)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100"><X className="w-6 h-6 text-slate-400" /></button></div>
                <div className="bg-slate-50 p-8 rounded-[32px] text-lg text-slate-700 leading-relaxed font-medium italic">"{form.message}"</div>
                <div className="flex gap-4"><a href={`mailto:${form.email}`} className="flex-grow py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xl hover:bg-emerald-700 text-center">Reply via Email</a><button onClick={() => { manageMessages.delete(form.id); setModalType(null); }} className="px-8 py-5 bg-red-50 text-red-600 rounded-[24px] font-black text-xl hover:bg-red-100">Delete</button></div>
              </div>
            ) : (
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center"><h3 className="text-3xl font-serif font-bold text-slate-900 capitalize">Edit {modalType}</h3><button onClick={() => setModalType(null)} className="p-3 bg-slate-50 rounded-2xl"><X className="w-8 h-8 text-slate-400" /></button></div>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2"><div className="relative h-48 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden">{form.imageUrl ? <img src={form.imageUrl} className="w-full h-full object-cover" /> : <Upload className="w-10 h-10 text-slate-300 mx-auto" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setForm({...form, imageUrl: url}))} /></div><input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold" /><div className="relative"><textarea rows={4} placeholder="Description" value={form.description || form.content} onChange={e => setForm({...form, description: e.target.value, content: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-medium" />{modalType !== 'news' && <button onClick={handleAI} disabled={isGenerating} className="absolute bottom-4 right-4 bg-emerald-100 text-emerald-600 p-3 rounded-xl hover:bg-emerald-600 hover:text-white">{isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}</button>}</div>{modalType !== 'news' && <input type="number" placeholder="Goal" value={form.goal} onChange={e => setForm({...form, goal: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-black text-xl" />}</div>
                <button onClick={handleSave} className="w-full py-6 bg-emerald-600 text-white rounded-[24px] font-black text-2xl hover:bg-emerald-700 shadow-2xl">{isSyncing ? "Syncing..." : "Save to Database"}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
