
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Project, Donation, Campaign, NewsUpdate, ContactMessage, AppState, SiteSettings, PaymentMethod } from './types';
import { INITIAL_PROJECTS, INITIAL_DONATIONS, INITIAL_CAMPAIGNS, INITIAL_NEWS, INITIAL_MESSAGES } from './constants';
import { db } from './services/db';
import { supabase } from './services/supabaseClient';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Campaigns from './pages/Campaigns';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Verify from './pages/Verify';
import { Heart, Menu, X, Settings, Bell, CheckCircle, Info, AlertCircle, PartyPopper, Cloud, CloudOff, RefreshCw } from 'lucide-react';

// Notification Context
export interface Notification {
  id: string;
  type: 'success' | 'info' | 'error' | 'donation';
  message: string;
}

const NotificationContext = createContext({
  notify: (message: string, type: 'success' | 'info' | 'error' | 'donation' = 'info') => {}
});

export const useNotify = () => useContext(NotificationContext);

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  
  const [state, setState] = useState<AppState>({
    projects: INITIAL_PROJECTS,
    campaigns: INITIAL_CAMPAIGNS,
    donations: INITIAL_DONATIONS,
    news: INITIAL_NEWS,
    messages: INITIAL_MESSAGES,
    paymentMethods: [
      { id: 'pm1', name: 'Credit Card', type: 'Credit Card', isActive: true },
      { id: 'pm2', name: 'PayPal', type: 'PayPal', isActive: true },
      { id: 'pm3', name: 'Bitcoin', type: 'Crypto', isActive: false },
    ],
    settings: {
      logoUrl: '',
      heroImageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
      organizationName: 'ImpactFlow',
      primaryColor: '#059669',
      heroTitle: 'Every dollar changes a life.',
      heroSubtitle: 'Experience the transparency of humanitarian giving.',
      contactEmail: 'hello@impactflow.org',
      contactPhone: '+1 (555) IMPACT-1',
      address: '400 Mission Street, San Francisco'
    }
  });

  const notify = useCallback((message: string, type: 'success' | 'info' | 'error' | 'donation' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  }, []);

  // Initial Load & Realtime Subscriptions
  useEffect(() => {
    const initialize = async () => {
      setIsSyncing(true);
      const data = await db.loadState();
      
      setState(prev => ({
        ...prev,
        projects: data.projects?.length ? data.projects : prev.projects,
        campaigns: data.campaigns?.length ? data.campaigns : prev.campaigns,
        donations: data.donations?.length ? data.donations : prev.donations,
        news: data.news?.length ? data.news : prev.news,
        messages: data.messages?.length ? data.messages : prev.messages,
        settings: data.settings ? data.settings : prev.settings,
        paymentMethods: data.paymentMethods?.length ? data.paymentMethods : prev.paymentMethods,
      }));
      
      setDbConnected(true);
      setIsSyncing(false);

      // Realtime Listeners
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => {
          db.loadState().then(d => setState(s => ({ ...s, donations: d.donations || s.donations })));
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations' }, payload => {
          notify(`New donation of $${payload.new.amount} received!`, 'donation');
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          notify(`New message from ${payload.new.name}`, 'info');
          db.loadState().then(d => setState(s => ({ ...s, messages: d.messages || s.messages })));
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'payment_methods' }, () => {
          db.loadState().then(d => setState(s => ({ ...s, paymentMethods: d.paymentMethods || s.paymentMethods })));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    initialize();
  }, [notify]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', state.settings.primaryColor);
  }, [state.settings.primaryColor]);

  const addDonation = useCallback(async (donation: Donation) => {
    setIsSyncing(true);
    try {
      await db.saveDonation(donation);
      setState(prev => {
        const newState = { ...prev, donations: [donation, ...prev.donations] };
        if (donation.projectId) {
          newState.projects = prev.projects.map(p => 
            p.id === donation.projectId ? { ...p, currentAmount: p.currentAmount + donation.amount } : p
          );
        } else if (donation.campaignId) {
          newState.campaigns = prev.campaigns.map(c => 
            c.id === donation.campaignId ? { ...c, currentAmount: c.currentAmount + donation.amount } : c
          );
        }
        return newState;
      });
      notify(`Donation confirmed.`, 'success');
    } catch (e) {
      notify('Payment failed to record.', 'error');
      throw e;
    } finally {
      setIsSyncing(false);
    }
  }, [notify]);

  const addMessage = useCallback(async (msg: ContactMessage) => {
    setIsSyncing(true);
    try {
      await db.saveMessage(msg);
      setState(prev => ({ ...prev, messages: [msg, ...prev.messages] }));
      notify(`Message sent.`, 'success');
    } catch (e) {
      notify('Failed to send message.', 'error');
    } finally {
      setIsSyncing(false);
    }
  }, [notify]);

  const manageProjects = {
    add: async (p: Project) => { setIsSyncing(true); await db.saveProject(p); setState(prev => ({ ...prev, projects: [p, ...prev.projects] })); setIsSyncing(false); notify('Project created.', 'success'); },
    update: async (p: Project) => { setIsSyncing(true); await db.saveProject(p); setState(prev => ({ ...prev, projects: prev.projects.map(item => item.id === p.id ? p : item) })); setIsSyncing(false); notify('Project updated.', 'success'); },
    delete: async (id: string) => { setIsSyncing(true); await db.deleteProject(id); setState(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) })); setIsSyncing(false); notify('Project deleted.', 'error'); }
  };

  const manageCampaigns = {
    add: (c: Campaign) => setState(prev => ({ ...prev, campaigns: [c, ...prev.campaigns] })),
    update: (c: Campaign) => setState(prev => ({ ...prev, campaigns: prev.campaigns.map(item => item.id === c.id ? c : item) })),
    delete: (id: string) => setState(prev => ({ ...prev, campaigns: prev.campaigns.filter(c => c.id !== id) }))
  };

  const manageNews = {
    add: (n: NewsUpdate) => setState(prev => ({ ...prev, news: [n, ...prev.news] })),
    update: (n: NewsUpdate) => setState(prev => ({ ...prev, news: prev.news.map(item => item.id === n.id ? n : item) })),
    delete: (id: string) => setState(prev => ({ ...prev, news: prev.news.filter(n => n.id !== id) }))
  };

  const manageMessages = {
    markRead: async (id: string) => { setIsSyncing(true); await db.markMessageRead(id); setState(prev => ({ ...prev, messages: prev.messages.map(m => m.id === id ? { ...m, isRead: true } : m) })); setIsSyncing(false); },
    delete: async (id: string) => { setIsSyncing(true); await db.deleteMessage(id); setState(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) })); setIsSyncing(false); notify('Message deleted.', 'info'); }
  };

  const updateSettings = async (settings: SiteSettings) => { setIsSyncing(true); await db.saveSettings(settings); setState(prev => ({ ...prev, settings })); setIsSyncing(false); notify('Settings updated.', 'success'); };
  
  const updatePaymentMethods = async (methods: PaymentMethod[]) => {
    setIsSyncing(true);
    try {
      // Find the changed method
      const changed = methods.find((m, i) => m.isActive !== state.paymentMethods[i]?.isActive);
      if (changed) {
        await db.updatePaymentMethod(changed);
      }
      setState(prev => ({ ...prev, paymentMethods: methods }));
      notify('Payment methods updated.', 'success');
    } catch (e) {
      notify('Failed to update payment status.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar settings={state.settings} messagesCount={state.messages.filter(m => !m.isRead).length} isSyncing={isSyncing} />
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-md px-4">
            {notifications.map(n => (
              <div key={n.id} className={`pointer-events-auto p-5 rounded-[24px] shadow-2xl border flex items-center gap-4 animate-in slide-in-from-top-8 duration-500 fill-mode-forwards ${
                n.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 
                n.type === 'donation' ? 'bg-slate-900 border-emerald-500 text-white ring-4 ring-emerald-500/20' :
                n.type === 'error' ? 'bg-red-600 border-red-500 text-white' : 
                'bg-slate-800 border-slate-700 text-white'
              }`}>
                {n.type === 'success' ? <CheckCircle className="w-6 h-6 shrink-0" /> : 
                 n.type === 'donation' ? <PartyPopper className="w-6 h-6 shrink-0 text-emerald-400" /> :
                 n.type === 'error' ? <AlertCircle className="w-6 h-6 shrink-0" /> : 
                 <Info className="w-6 h-6 shrink-0" />}
                <div className="flex-grow">
                  <p className="font-black text-sm tracking-tight">{n.message}</p>
                </div>
                <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="shrink-0 p-1 opacity-50 hover:opacity-100 transition-opacity"><X className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home state={state} />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects state={state} />} />
              <Route path="/campaigns" element={<Campaigns state={state} />} />
              <Route path="/donate" element={<Donate state={state} onDonate={addDonation} />} />
              <Route path="/contact" element={<Contact onMessage={addMessage} />} />
              <Route path="/verify/:id" element={<Verify state={state} />} />
              <Route path="/admin" element={
                <Admin 
                  state={state} 
                  manageProjects={manageProjects} 
                  manageCampaigns={manageCampaigns}
                  manageNews={manageNews}
                  manageMessages={manageMessages}
                  updateSettings={updateSettings}
                  updatePaymentMethods={updatePaymentMethods}
                  isSyncing={isSyncing}
                />
              } />
            </Routes>
          </main>
          <Footer settings={state.settings} dbConnected={dbConnected} />
        </div>
      </HashRouter>
    </NotificationContext.Provider>
  );
};

const Navbar: React.FC<{ settings: SiteSettings, messagesCount: number, isSyncing: boolean }> = ({ settings, messagesCount, isSyncing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: 'Donate', path: '/donate' },
    { label: 'Contact', path: '/contact' },
  ];
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              {settings.logoUrl ? <img src={settings.logoUrl} alt="logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-110" /> : (
                <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-100 transition-transform group-hover:rotate-12">
                  <Heart className="w-6 h-6 text-white" fill="currentColor" />
                </div>
              )}
              <span className="text-2xl font-black text-slate-900 tracking-tighter">{settings.organizationName}</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={`text-sm font-bold transition-all relative py-2 ${location.pathname === link.path ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-500'}`}>
                {link.label}
                {location.pathname === link.path && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />}
              </Link>
            ))}
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
               {isSyncing ? <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" /> : <Cloud className="w-3.5 h-3.5 text-slate-400" />}
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isSyncing ? 'Syncing...' : 'Supabase Live'}</span>
            </div>
            <Link to="/admin" className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Settings className="w-6 h-6" />
              {messagesCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black ring-4 ring-white">{messagesCount}</span>}
            </Link>
            <Link to="/donate" className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-emerald-700 shadow-xl transition-all">Donate Now</Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">{isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}</button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-2">
          {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block px-6 py-4 rounded-2xl text-lg font-bold text-slate-700 hover:bg-emerald-50">{link.label}</Link>)}
          <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-6 py-4 rounded-2xl text-lg font-bold text-slate-700 hover:bg-emerald-50">Admin Dashboard</Link>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC<{ settings: SiteSettings, dbConnected: boolean }> = ({ settings, dbConnected }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-20 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-emerald-500" fill="currentColor" />
            <span className="text-3xl font-black text-white tracking-tighter">{settings.organizationName}</span>
          </div>
          <p className="max-w-md text-xl leading-relaxed">{settings.heroSubtitle}</p>
          <div className="flex items-center space-x-3 bg-white/5 w-fit px-4 py-2 rounded-2xl border border-white/10">
            {dbConnected ? <Cloud className="w-4 h-4 text-emerald-500" /> : <CloudOff className="w-4 h-4 text-red-500" />}
            <span className="text-xs font-bold text-white uppercase tracking-widest">{dbConnected ? 'Supabase Connected' : 'Connecting...'}</span>
          </div>
        </div>
        <div>
          <h4 className="text-white font-black mb-8 uppercase tracking-widest text-xs">Headquarters</h4>
          <ul className="space-y-4 text-sm font-medium"><li>{settings.address}</li><li className="text-white">{settings.contactEmail}</li><li>{settings.contactPhone}</li></ul>
        </div>
        <div>
          <h4 className="text-white font-black mb-8 uppercase tracking-widest text-xs">Transparency</h4>
          <ul className="space-y-4 text-sm font-medium"><li><span className="hover:text-emerald-400 cursor-pointer">Annual Reports</span></li><li><span className="hover:text-emerald-400 cursor-pointer">Impact Audits</span></li><li><span className="hover:text-emerald-400 cursor-pointer">Privacy Policy</span></li></ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-10 text-xs font-bold text-center uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© {new Date().getFullYear()} {settings.organizationName} Foundation. Verified Nonprofit Entity.</span>
        <span className="bg-white/10 px-3 py-1 rounded-full text-emerald-400">PostgreSQL Powered</span>
      </div>
    </footer>
  );
};

export default App;
