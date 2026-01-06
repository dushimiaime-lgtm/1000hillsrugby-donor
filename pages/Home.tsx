
import React from 'react';
import { Link } from 'react-router-dom';
import { AppState, Project } from '../types';
import { Users, Globe, HandHeart, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Home: React.FC<{ state: AppState }> = ({ state }) => {
  const { settings } = state;
  const totalDonated = state.donations.reduce((sum, d) => sum + d.amount, 0);
  
  const impactData = state.projects.map(p => ({
    name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
    value: p.currentAmount || 100
  }));

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-24 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-in slide-in-from-left duration-1000">
            <div className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="text-emerald-700 text-sm font-bold tracking-wide">TRUSTED {settings.organizationName.toUpperCase()} NONPROFIT</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-serif text-slate-900 leading-[1.1]">
              {settings.heroTitle}
            </h1>
            <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
              {settings.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-5">
              <Link to="/donate" className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
                Make an Impact
              </Link>
              <Link to="/campaigns" className="px-10 py-5 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all">
                Urgent Campaigns
              </Link>
            </div>
          </div>
          <div className="relative animate-in slide-in-from-right duration-1000 group">
             <div className="rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src={settings.heroImageUrl} 
                  alt="Impact"
                  className="w-full h-[600px] object-cover bg-slate-100"
                />
             </div>
             <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 hidden sm:block">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-4 rounded-2xl">
                    <HandHeart className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-widest font-black">Raised by {settings.organizationName}</p>
                    <p className="text-4xl font-black text-slate-900">${totalDonated.toLocaleString()}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            {[
              { icon: Globe, label: 'Countries', val: '14+' },
              { icon: Users, label: 'Volunteers', val: '850+' },
              { icon: HandHeart, label: 'Donations', val: state.donations.length },
              { icon: CheckCircle2, label: 'Audits', val: 'Quarterly' }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <stat.icon className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
                <h3 className="text-5xl font-black">{stat.val}</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-16 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {state.projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const progress = Math.min(Math.round((project.currentAmount / project.goal) * 100), 100);
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="relative h-64">
        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 truncate">{project.title}</h3>
        <p className="text-slate-500 mb-8 line-clamp-2 h-12">{project.description}</p>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="font-black text-3xl text-slate-900">${project.currentAmount.toLocaleString()}</span>
            <span className="text-slate-400 font-bold text-sm">Goal: ${project.goal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div className="bg-emerald-500 h-3 transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Link to="/donate" state={{ projectId: project.id }} className="mt-10 w-full flex items-center justify-center bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all">
          Donate Now <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
