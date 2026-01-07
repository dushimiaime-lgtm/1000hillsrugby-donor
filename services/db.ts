
import { supabase, SUPABASE_IS_CONFIGURED } from './supabaseClient';
import { AppState, Project, Donation, Campaign, NewsUpdate, ContactMessage, SiteSettings, PaymentMethod } from '../types';

/**
 * Supabase Database Service
 * Handles relational data persistence across dedicated tables.
 */
export const db = {
  /**
   * Loads the complete application state from Supabase tables.
   */
  async loadState(): Promise<Partial<AppState>> {
    // Early exit if not configured to prevent fetch timeouts stalling the app
    if (!SUPABASE_IS_CONFIGURED) {
      return {};
    }

    try {
      const [
        { data: projects },
        { data: campaigns },
        { data: donations },
        { data: news },
        { data: messages },
        { data: settings },
        { data: paymentMethods }
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('campaigns').select('*').order('deadline', { ascending: true }),
        supabase.from('donations').select('*').order('date', { ascending: false }),
        supabase.from('news').select('*').order('date', { ascending: false }),
        supabase.from('messages').select('*').order('date', { ascending: false }),
        supabase.from('settings').select('*').maybeSingle(),
        supabase.from('payment_methods').select('*').order('name', { ascending: true })
      ]);

      return {
        projects: projects || [],
        campaigns: campaigns || [],
        donations: donations || [],
        news: news || [],
        messages: messages || [],
        settings: settings || undefined,
        paymentMethods: paymentMethods || []
      };
    } catch (error) {
      console.error("Supabase load error:", error);
      return {};
    }
  },

  async saveProject(project: Project) {
    if (!SUPABASE_IS_CONFIGURED) return;
    return supabase.from('projects').upsert(project);
  },

  async deleteProject(id: string) {
    if (!SUPABASE_IS_CONFIGURED) return;
    return supabase.from('projects').delete().eq('id', id);
  },

  async saveDonation(donation: Donation) {
    if (!SUPABASE_IS_CONFIGURED) return;
    const { error } = await supabase.from('donations').insert(donation);
    if (error) throw error;
    
    if (donation.projectId) {
      const { data: p } = await supabase.from('projects').select('currentAmount').eq('id', donation.projectId).single();
      if (p) {
        await supabase.from('projects')
          .update({ currentAmount: (p.currentAmount || 0) + donation.amount })
          .eq('id', donation.projectId);
      }
    } else if (donation.campaignId) {
      const { data: c } = await supabase.from('campaigns').select('currentAmount').eq('id', donation.campaignId).single();
      if (c) {
        await supabase.from('campaigns')
          .update({ currentAmount: (c.currentAmount || 0) + donation.amount })
          .eq('id', donation.campaignId);
      }
    }
    return { success: true };
  },

  async updatePaymentMethod(method: PaymentMethod) {
    if (!SUPABASE_IS_CONFIGURED) return;
    return supabase.from('payment_methods').upsert(method);
  },

  async saveSettings(settings: SiteSettings) {
    if (!SUPABASE_IS_CONFIGURED) return;
    return supabase.from('settings').upsert({ id: 1, ...settings });
  },

  async saveMessage(message: ContactMessage) {
    if (!SUPABASE_IS_CONFIGURED) return;
    return supabase.from('messages').insert(message);
  },

  async markMessageRead(id: string) {
    if (!SUPABASE_IS_CONFIGURED) return;
    return supabase.from('messages').update({ isRead: true }).eq('id', id);
  },

  async deleteMessage(id: string) {
    if (!SUPABASE_IS_CONFIGURED) return;
    return supabase.from('messages').delete().eq('id', id);
  }
};
