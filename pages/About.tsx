
import React from 'react';
import { Target, Heart, ShieldCheck, Star, Users, History, Globe, Shield } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pb-32 bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-4">
            <span className="text-emerald-400 text-sm font-black tracking-widest uppercase">Our Mission</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold leading-tight">Changing Lives Through Radical Transparency</h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
            Founded in 2018, ImpactFlow was born from a simple idea: that donating should be as transparent as it is impactful. 
            We bridge the gap between global generosity and local resilience.
          </p>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
             <History className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-slate-900">Our Journey</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">From a small garage in San Francisco to a global movement, we've never lost sight of our primary goal: the people we serve.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10" />
          {[
            { year: '2018', title: 'The Genesis', desc: 'Started with a single clean water project in Kenya, raising $10k in 48 hours.' },
            { year: '2021', title: 'Global Expansion', desc: 'Opened offices in 4 continents and launched our real-time tracking platform.' },
            { year: '2024', title: 'Radical Impact', desc: 'Reached the milestone of $50M raised and 1M lives directly impacted.' }
          ].map((milestone, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
              <span className="text-4xl font-black text-emerald-600 mb-4 block">{milestone.year}</span>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{milestone.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{milestone.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-serif font-bold text-slate-900">The Values That Drive Every Decision</h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                We don't just facilitate donations; we cultivate trust. Our core values aren't just words on a wall—they are the blueprint for our technological and humanitarian efforts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: 'Uncompromising Integrity', color: 'emerald' },
                  { icon: Globe, title: 'Local-First Approach', color: 'blue' },
                  { icon: Users, title: 'Inclusive Community', color: 'purple' },
                  { icon: Star, title: 'Sustainable Outcomes', color: 'amber' }
                ].map((val, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <val.icon className={`w-6 h-6 text-${val.color}-600`} />
                    <span className="font-bold text-slate-900">{val.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-100/50 rounded-[48px] rotate-3 -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-[500px] object-cover rounded-[40px] shadow-2xl" 
                alt="Our Values in Action" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4">Meet the Visionaries</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">The heart and mind behind ImpactFlow—a dedicated group of professionals committed to changing the world.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              name: 'Dr. Sarah Chen', 
              role: 'Founder & CEO', 
              bio: 'Former UN humanitarian with 15 years of experience in disaster response.',
              img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
            },
            { 
              name: 'Marcus Thorne', 
              role: 'Chief Impact Officer', 
              bio: 'Expert in sustainable development and community-led infrastructure.',
              img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
            },
            { 
              name: 'Elena Rodriguez', 
              role: 'Director of Partnerships', 
              bio: 'Specializing in corporate social responsibility and international relations.',
              img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
            },
            { 
              name: 'David Okafor', 
              role: 'Head of Operations', 
              bio: 'Logistics veteran ensuring aid reaches even the most remote locations.',
              img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
            }
          ].map((member, i) => (
            <div key={i} className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={member.img} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={member.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8 text-center">
                <h4 className="text-2xl font-bold text-slate-900 mb-1">{member.name}</h4>
                <p className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-4">{member.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Presence Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="relative rounded-[48px] overflow-hidden h-[500px] flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.3]" 
            alt="World Map Presence" 
          />
          <div className="relative z-10 text-center text-white space-y-8 px-8">
            <h2 className="text-5xl md:text-6xl font-serif font-bold">One Planet. One Mission.</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We operate in 24 countries, partnering with over 150 local NGOs to ensure that help is always where it's needed most.
            </p>
            <div className="flex flex-wrap justify-center gap-12">
               <div>
                 <p className="text-4xl font-black text-emerald-400">24</p>
                 <p className="text-xs font-black uppercase tracking-widest text-slate-400">Countries</p>
               </div>
               <div>
                 <p className="text-4xl font-black text-emerald-400">150+</p>
                 <p className="text-xs font-black uppercase tracking-widest text-slate-400">Partners</p>
               </div>
               <div>
                 <p className="text-4xl font-black text-emerald-400">1.2M</p>
                 <p className="text-xs font-black uppercase tracking-widest text-slate-400">Lives Touched</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
