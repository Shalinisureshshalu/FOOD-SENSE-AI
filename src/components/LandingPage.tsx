import React, { useState } from "react";
import { 
  HeartHandshake, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  Mail, 
  Github, 
  FileText, 
  Globe, 
  Users, 
  BrainCircuit,
  MessageSquare,
  Utensils,
  PlusCircle,
  Activity,
  Zap,
  MapPin,
  Wand2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export default function LandingPage({ onGetStarted, onViewDemo }: LandingPageProps) {
  // Contact Form States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  // Live simulation states for stats metrics ("Create & Enhance UI" interaction)
  const [activeProviders, setActiveProviders] = useState(124);
  const [matchedCharities, setMatchedCharities] = useState(36);
  const [totalReductions, setTotalReductions] = useState(1240);
  const [transportSpeed, setTransportSpeed] = useState(24);

  // Creation form states
  const [inputFoodName, setInputFoodName] = useState("");
  const [inputCategory, setInputCategory] = useState("Veg Meals");
  const [inputQuantity, setInputQuantity] = useState("45");
  const [enableDynamicRouting, setEnableDynamicRouting] = useState(true);
  const [enableGeminiInsight, setEnableGeminiInsight] = useState(true);
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      setContactStatus("Please fill in all contact parameters.");
      return;
    }
    setContactStatus("Thank you! Your message was logged successfully in our community dispatch tracker.");
    setContactName("");
    setContactEmail("");
    setContactMsg("");
    setTimeout(() => setContactStatus(null), 5000);
  };

  // Handler to simulate creation and enhancement in the live workspace
  const handleSimulateRescueCreation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputFoodName) {
      alert("Please provide a name for the surplus food item before dispatch.");
      return;
    }

    setIsSimulatingDispatch(true);
    setSuccessNotice(null);

    setTimeout(() => {
      const addedQty = parseInt(inputQuantity) || 30;
      
      // Update numbers dynamically
      setActiveProviders(prev => prev + 1);
      setTotalReductions(prev => prev + addedQty);
      if (enableDynamicRouting) {
        setTransportSpeed(prev => Math.max(12, prev - 2)); // optimize route speeds downwards
      }

      setIsSimulatingDispatch(false);
      setSuccessNotice(`Successfully created live rescue block: "${addedQty} servings of ${inputFoodName} (${inputCategory})" has been distributed!`);
      setInputFoodName("");
      
      // Clear message after 6 seconds
      setTimeout(() => {
        setSuccessNotice(null);
      }, 6000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative Grid Line Patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f00a_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f00a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-60 dark:opacity-40" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* 1. Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-24 text-center relative z-10">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6.5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.15] mb-6 font-sans"
        >
          Turn Surplus Food into <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 bg-clip-text text-transparent">Community Nourishment</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-base sm:text-lg text-slate-600 dark:text-slate-450 max-w-3xl mx-auto mb-12 leading-relaxed font-sans"
        >
          Seamlessly bridging the gap between excess food supply and local community hunger. We connect restaurants, hotels, and vendors directly with nearby shelters to deliver fresh, safe meals instantly.
        </motion.p>

        {/* Call to Actions - Sized Larger and Immersive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-18 max-w-3xl mx-auto"
        >
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold px-10 py-5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-98 flex items-center justify-center gap-3 cursor-pointer text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            Launch Rescue Portal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onViewDemo}
            className="w-full sm:w-auto bg-slate-200/80 dark:bg-slate-900/80 hover:bg-slate-350 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-800 font-extrabold px-10 py-5 rounded-2xl transition-all transform hover:-translate-y-1 active:translate-y-0 active:scale-98 flex items-center justify-center gap-3 cursor-pointer text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          >
            Try Open Demo
            <ChevronRight className="w-5.5 h-5.5 text-slate-500 dark:text-slate-400" />
          </button>
        </motion.div>

        {/* Dynamic App Status Ticker & Create-and-Enhance Sim split-grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2 max-w-5xl mx-auto text-left relative">
          
          {/* Main Status Panel (7 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-7 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded">
                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                    Real-Time Rescue Platform
                  </span>
                </div>
                <div className="text-[10px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-500 font-mono">
                  Sync Status: Online
                </div>
              </div>

              {/* Enhanced Stats Cards Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="bg-slate-100/60 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/20 hover:bg-white dark:hover:bg-slate-900/40 transition-all shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono text-[10px] mb-2 font-bold select-none">
                    <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                    Active Donors
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-neutral-50 tracking-tight block">
                    {activeProviders}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                    Verified Food Providers
                  </span>
                </div>

                <div className="bg-slate-100/60 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/20 hover:bg-white dark:hover:bg-slate-900/40 transition-all shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono text-[10px] mb-2 font-bold select-none">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    Charity Partners
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-500 tracking-tight block">
                    {matchedCharities}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                    Registered Active NGOs
                  </span>
                </div>

                <div className="bg-slate-100/60 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/20 hover:bg-white dark:hover:bg-slate-900/40 transition-all shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono text-[10px] mb-2 font-bold select-none">
                    <Zap className="w-3.5 h-3.5 text-indigo-500" />
                    Total Saved
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-neutral-50 tracking-tight block">
                    {totalReductions.toLocaleString()} <span className="text-xs font-mono font-normal">kg</span>
                  </span>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 block mt-1 font-semibold">
                    Saved from waste decay
                  </span>
                </div>

                <div className="bg-slate-100/60 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-purple-500/20 hover:bg-white dark:hover:bg-slate-900/40 transition-all shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono text-[10px] mb-2 font-bold select-none">
                    <Globe className="w-3.5 h-3.5 text-purple-500 animate-spin-slow" />
                    Dispatch Average
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-indigo-500 tracking-tight block">
                    {transportSpeed}m <span className="text-xs font-mono font-normal">avg response</span>
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                    Smart coordination metrics
                  </span>
                </div>

              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono bg-slate-50 dark:bg-slate-950/40 px-3 py-2 rounded-lg leading-none">
              <span className="flex items-center gap-1 leading-none">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Secure local matching enabled
              </span>
              <span>Updated seconds ago</span>
            </div>
          </motion.div>

          {/* Create & Enhance UI Ingress Box (5 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-5 rounded-2xl border-2 border-emerald-500/20 dark:border-emerald-500/10 bg-white dark:bg-slate-900 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
          >
            {/* Background enhancement ring element */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider font-mono mb-4 w-fit select-none">
                <PlusCircle className="w-4 h-4 text-emerald-500 animate-pulse" />
                CREATE & ENHANCE LOGISTICS
              </div>

              <h3 className="font-extrabold text-lg text-slate-900 dark:text-neutral-50 font-sans tracking-tight mb-2">
                Simulate Direct Food Rescue
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Fast-track surplus nutrition to the dynamic match engine. Fill in details to inject a transaction into the live ledger context.
              </p>

              <form onSubmit={handleSimulateRescueCreation} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                    Food Surplus Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g., 60 Veg Biryani Trays"
                      value={inputFoodName}
                      onChange={e => setInputFoodName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.8 text-xs font-sans text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="absolute right-2.5 top-2">
                      <Utensils className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                      Category Type
                    </label>
                    <select
                      value={inputCategory}
                      onChange={e => setInputCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-600 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Veg Meals">Veg Meals</option>
                      <option value="Non-Veg Meals">Non-Veg Meals</option>
                      <option value="Baked Goods">Baked Goods</option>
                      <option value="Raw Staples">Raw Staples</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1">
                      Servings (kg/qty)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="1000"
                      value={inputQuantity}
                      onChange={e => setInputQuantity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.8 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Enhancements Selection Toggles */}
                <div className="pt-2 pb-1 space-y-2.5 border-t border-slate-200 dark:border-slate-800/80 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block">
                          AI Distance Optimization
                        </span>
                        <span className="text-[9px] text-slate-400 block -mt-0.5">
                          Evaluates nearest active couriers & shelters
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={enableDynamicRouting} 
                        onChange={() => setEnableDynamicRouting(!enableDynamicRouting)}
                        className="sr-only peer" 
                      />
                      <div className="w-7 h-4 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block">
                          Gemini Classification Model
                        </span>
                        <span className="text-[9px] text-slate-400 block -mt-0.5">
                          Predictive shelf-life index rating
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={enableGeminiInsight} 
                        onChange={() => setEnableGeminiInsight(!enableGeminiInsight)}
                        className="sr-only peer" 
                      />
                      <div className="w-7 h-4 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSimulatingDispatch}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10 active:scale-98 disabled:opacity-50 mt-2"
                >
                  {isSimulatingDispatch ? (
                    <>
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      Classifying & Dispatching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Inject & Enhance Live Surplus
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Simulated success alert banner with animation */}
            <AnimatePresence>
              {successNotice && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-x-4 bottom-4 p-3 bg-emerald-55 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-900 dark:text-emerald-400 space-y-1 z-30 shadow-lg"
                >
                  <p className="font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Surplus Added!
                  </p>
                  <p className="text-slate-750 dark:text-slate-300 leading-tight">{successNotice}</p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

        </div>
      </div>

      {/* 2. High-Tech Bento Platform Features Panel */}
      <div className="py-24 bg-slate-100/50 dark:bg-slate-950 border-t border-b border-slate-200 dark:border-slate-900 relative z-10">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold mb-4 border border-emerald-500/15">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              INTELLIGENT MATCHING REDISTRIBUTION SYSTEM
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans leading-[1.2]">
              Real-Time Dynamic Waste Logistics
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Our automated network leverages predictive spatial and distance algorithms to identify food surplus zones and align them securely with surrounding shelter kitchens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-850/80 shadow-md transition-all hover:border-emerald-500/35 hover:-translate-y-1 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-500/10">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-850 dark:text-neutral-50 tracking-tight font-sans">
                    Hyperlocal Donor Sourcing
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Surplus hotels, banquet units, and restaurants plug raw/cooked inventory status directly into the live map feed with customizable decay thresholds.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 uppercase tracking-widest font-mono pt-4 select-none">
                Active Match Engine <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-850/80 shadow-md transition-all hover:border-emerald-500/35 hover:-translate-y-1 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-500/10">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-850 dark:text-neutral-50 tracking-tight font-sans">
                    AI Logistics Recommendations
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    On-the-fly Gemini scoring scans available NGO capacities, accepts categories, and travel distance to advise the perfect matches automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-500 uppercase tracking-widest font-mono pt-4 select-none">
                Predictive Analysis <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-850/80 shadow-md transition-all hover:border-emerald-500/35 hover:-translate-y-1 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500/10 to-sky-500/10 flex items-center justify-center text-teal-500 shadow-sm border border-teal-500/10">
                  <Users className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-850 dark:text-neutral-50 tracking-tight font-sans">
                    Verified NGO Claim Dispatch
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Registered charities lock down pickups, trace real-time distances, and receive clear route recommendations, keeping perishables safe from landfill decay.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-teal-500 uppercase tracking-widest font-mono pt-4 select-none">
                Live Handshakes <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. How It works Section */}
      <div className="py-24 bg-slate-50/50 dark:bg-slate-950/20 border-t border-b border-slate-200 dark:border-slate-800/80 relative z-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest font-mono block mb-2">
            INTELLIGENT THREE-PHASE LOGISTICS
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans mb-12">
            How The System Bridges The Gaps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-250/70 dark:border-slate-800/80 rounded-2xl text-left space-y-3 shadow-sm hover:border-emerald-500 transition">
              <span className="text-2xl font-bold text-emerald-500 font-mono">01.</span>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white font-sans">Donors Post Surplus</h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Restaurants or central kitchens fill in basic parameters: food item title, category type, exact physical location, contact and immediate expiry threshold.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-250/70 dark:border-slate-800/80 rounded-2xl text-left space-y-3 shadow-sm hover:border-indigo-500 transition">
              <span className="text-2xl font-bold text-indigo-500 font-mono">02.</span>
              <h4 className="font-bold text-sm text-slate-805 dark:text-white font-sans">Surplus Demand Analysis</h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                The integrated machine learning model evaluates localized price multipliers, operational dimensions, and categorizes nearby high-need welfare locations.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-250/70 dark:border-slate-800/80 rounded-2xl text-left space-y-3 shadow-sm hover:border-teal-500 transition">
              <span className="text-2xl font-bold text-teal-500 font-mono">03.</span>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white font-sans">NGO Claim & Pickup</h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Verified charities see real-time availability coordinates, claim the batch with a click, and lock optimized pickup schedules instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Impact Statistics Section */}
      <div className="py-24 bg-white dark:bg-slate-900/60 relative z-10 border-b border-slate-205 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest font-mono">
              VERIFIED ENVIRONMENTAL AUDIT
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-905 dark:text-white font-sans">
              Quantifiable Relief Metrics Mapped
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-center">
              <HeartHandshake className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-3xl font-extrabold font-mono tracking-tight text-slate-855 dark:text-neutral-50">1,240</h3>
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Portions Saved (kg)</p>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-center">
              <Users className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <h3 className="text-3xl font-extrabold font-mono tracking-tight text-slate-855 dark:text-neutral-50">1,488</h3>
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">People Fed</p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-center">
              <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-3xl font-extrabold font-mono tracking-tight text-slate-855 dark:text-neutral-50">558</h3>
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">CO₂ Offsets (kg)</p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-center">
              <ShieldCheck className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <h3 className="text-3xl font-extrabold font-mono tracking-tight text-slate-855 dark:text-neutral-50">36</h3>
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Connected Charities</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Testimonials Section */}
      <div className="py-24 bg-slate-50/50 dark:bg-slate-950/10 relative z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-2 mb-16">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest font-mono block">
              TESTIMONAL REVIEWS
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              What Our Community Partners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                "Before matching our excess portions on FoodSense, our central kitchens wasted around 12% of prep daily simply because demand forecasted week logs were inaccurate. Now, we export the surplus directly to partner NGOs with one click. It feels incredible."
              </p>
              <div>
                <h4 className="font-semibold text-xs text-slate-800 dark:text-white">Chef Salvador Suarez</h4>
                <p className="text-[10px] text-slate-400 font-mono">Culinary Operations Specialist, Suarez Central Kitchens</p>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                "Being able to accept food donations nearby with guaranteed expiration thresholds has completely saved our food pantry budget. The Google optimized navigation gives our volunteers step-by-step pick-up coordinates instantly."
              </p>
              <div>
                <h4 className="font-semibold text-xs text-slate-800 dark:text-white">Director Evelyn Vance</h4>
                <p className="text-[10px] text-slate-400 font-mono">Breadline Pantry Manager, Care-Share Community</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Contact Ingress Form Section */}
      <div className="py-24 bg-white dark:bg-slate-950 relative z-10">
        <div className="max-w-xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest font-mono block">
              GET IN TOUCH
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-905 dark:text-white font-sans">
              Register Your Kitchen or NGO
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit your coordinate data below to start the verification loop on the dispatch grid.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="bg-slate-100/40 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-slate-800 dark:text-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase mb-1.5">
                Full Name / Organization
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hotel Grand Central / Breadline NGO"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 text-xs rounded-lg outline-none focus:border-emerald-500 text-slate-850 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="partnership@domain.org"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 text-xs rounded-lg outline-none focus:border-emerald-500 text-slate-850 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase mb-1.5">
                Your Message / Coordinates Requested
              </label>
              <textarea
                required
                rows={3}
                placeholder="Detail your kitchen sizes or acceptsCategories parameters..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 text-xs rounded-lg outline-none focus:border-emerald-500 text-slate-850 dark:text-slate-200 resize-none"
              />
            </div>

            {contactStatus && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-xs font-medium">
                {contactStatus}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 border border-slate-850 hover:bg-slate-800 dark:bg-white dark:text-slate-950 font-bold text-xs py-3 rounded-xl cursor-pointer transition shadow"
            >
              Submit Verification Request
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-205 dark:border-slate-850 bg-slate-100/50 dark:bg-slate-950 py-12 relative z-10 text-center">
        <div className="flex justify-center gap-2 items-center mb-4 text-slate-800 dark:text-white">
          <HeartHandshake className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-xs font-sans text-slate-900 dark:text-white">FoodSense Rescue Network</span>
        </div>
        <p className="text-[11px] text-slate-450">&copy; {new Date().getFullYear()} FoodSense AI. All rights reserved. Zero-Waste Hunger Mitigation Platform.</p>
        <div className="flex justify-center gap-6 mt-4 text-[10px] font-mono text-slate-400">
          <span className="hover:text-emerald-505 cursor-pointer">Security Ledger</span>
          <span>&middot;</span>
          <span className="hover:text-emerald-505 cursor-pointer">UN SDGs Agreement</span>
          <span>&middot;</span>
          <span className="hover:text-emerald-505 cursor-pointer">NGO API Access</span>
        </div>
      </footer>

    </div>
  );
}
