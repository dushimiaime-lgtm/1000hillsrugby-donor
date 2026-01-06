
import React from 'react';
import { Link } from 'react-router-dom';
import { AppState, Campaign } from '../types';
import { ArrowRight, Clock, AlertCircle } from 'lucide-react';

const Campaigns: React.FC<{ state: AppState }> = ({ state }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">Active Campaigns</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Urgent missions and time-sensitive relief efforts. Your immediate action makes the difference.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {state.campaigns.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const progress = Math.min(Math.round((campaign.currentAmount / campaign.goal) * 100), 100);
  const isUrgent = campaign.status === 'urgent';

  return (
    <div className={`relative bg-white rounded-3xl overflow-hidden shadow-sm border ${isUrgent ? 'border-amber-200' : 'border-slate-100'} hover:shadow-2xl transition-all duration-500`}>
      <div className="h-64 relative">
        <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute top-6 left-6 flex space-x-2">
          {isUrgent && (
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
              <AlertCircle className="w-3 h-3 mr-1" /> URGENT
            </span>
          )}
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm uppercase">
            ENDS {new Date(campaign.deadline).toLocaleDateString()}
          </span>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-bold text-white mb-1">{campaign.title}</h3>
          <div className="flex items-center text-slate-200 text-sm font-medium">
            <Clock className="w-4 h-4 mr-2" />
            <span>Target reached: {progress}%</span>
          </div>
        </div>
      </div>
      <div className="p-8">
        <p className="text-slate-600 mb-8 leading-relaxed h-20 line-clamp-3">
          {campaign.description}
        </p>
        
        <div className="space-y-4">
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${isUrgent ? 'bg-amber-500' : 'bg-emerald-500'}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Raised</p>
              <p className="text-2xl font-bold text-slate-900">${campaign.currentAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Goal</p>
              <p className="text-xl font-bold text-slate-500">${campaign.goal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <Link 
          to="/donate" 
          state={{ campaignId: campaign.id }}
          className={`mt-8 w-full flex items-center justify-center py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
            isUrgent 
              ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-100' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
          }`}
        >
          Support Campaign <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default Campaigns;
