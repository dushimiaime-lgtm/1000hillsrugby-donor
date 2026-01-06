
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppState } from '../types';
import { ShieldCheck, Calendar, Heart, ArrowLeft, Globe } from 'lucide-react';

const Verify: React.FC<{ state: AppState }> = ({ state }) => {
  const { id } = useParams<{ id: string }>();
  const donation = state.donations.find(d => d.id === id);
  const project = donation?.projectId ? state.projects.find(p => p.id === donation.projectId) : null;
  const campaign = donation?.campaignId ? state.campaigns.find(c => c.id === donation.campaignId) : null;

  if (!donation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-[40px] inline-block mb-8">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold">Invalid Donation Record</h2>
          <p>We couldn't find a donation matching this reference ID.</p>
        </div>
        <br />
        <Link to="/" className="text-emerald-600 font-bold hover:underline inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in duration-700">
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-emerald-600 p-10 text-white text-center">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">Verified Donation</h1>
          <p className="opacity-80 font-bold uppercase tracking-widest text-xs">OFFICIAL IMPACTFLOW REGISTRY</p>
        </div>

        <div className="p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">REFERENCE ID</p>
                <p className="text-xl font-mono font-bold text-slate-900">{donation.id}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">DATE OF DONATION</p>
                <div className="flex items-center text-slate-700 font-bold">
                  <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
                  {new Date(donation.date).toLocaleString()}
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">DONOR</p>
                <p className="text-lg font-bold text-slate-900">{donation.isAnonymous ? "Anonymous Donor" : donation.donorName}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">AMOUNT</p>
                <p className="text-5xl font-black text-emerald-600">${donation.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">IMPACT AREA</p>
                <div className="flex items-center text-slate-700 font-bold">
                  <Heart className="w-4 h-4 mr-2 text-red-500" fill="currentColor" />
                  {project?.title || campaign?.title || "General Operations"}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">A MESSAGE FROM OUR TEAM</h4>
            <p className="text-slate-600 leading-relaxed italic">
              "This donation has been successfully processed and allocated to the selected humanitarian cause. We maintain a zero-waste policy, ensuring your generosity translates directly into meaningful action for those in need."
            </p>
          </div>
          
          <div className="flex justify-center pt-8">
            <Link to="/" className="px-10 py-4 border-2 border-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95">
              Explore More Causes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
