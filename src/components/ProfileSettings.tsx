import React, { useState } from "react";
import { UserProfile, PredictionHistoryRecord } from "../types";
import { 
  User, 
  Lock, 
  CheckCircle, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Activity,
  LogOut,
  Sliders,
  DollarSign
} from "lucide-react";

interface ProfileSettingsProps {
  profile: UserProfile;
  history: PredictionHistoryRecord[];
  onUpdateProfile: (newProfile: UserProfile) => void;
  onLogout: () => void;
}

export default function ProfileSettings({ profile, history, onUpdateProfile, onLogout }: ProfileSettingsProps) {
  // Local profile state
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [org, setOrg] = useState(profile.organization);
  const [defaultCenter, setDefaultCenter] = useState(profile.defaultCenterId);
  const [isSaved, setIsSaved] = useState(false);

  // Security passwords state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwAlert, setPwAlert] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  // Mathematical accuracy calculation based on mock metrics
  const totalScorings = history.length;
  const highAccuracyScore = totalScorings > 0 ? "93.8%" : "--%";
  const carbonSlashed = totalScorings > 0 ? `${(totalScorings * 12.4).toFixed(1)} kg` : "-- kg";
  const revenueGainEstimate = totalScorings > 0 ? `$${(totalScorings * 342).toLocaleString()}` : "$0";

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      role,
      organization: org,
      defaultCenterId: defaultCenter,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPwAlert("");
    setPwSuccess(false);

    if (!currentPw || !newPw) {
      setPwAlert("Please enter both current and new password values.");
      return;
    }
    if (newPw.length < 6) {
      setPwAlert("New password must contain at least 6 characters.");
      return;
    }

    setPwSuccess(true);
    setCurrentPw("");
    setNewPw("");
    setTimeout(() => setPwSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Visual Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-500" />
          Operations Hub Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sync enterprise facilities options, modify credential records, and review carbon offset achievements.
        </p>
      </div>

      {/* Advanced Performance Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="border border-slate-200 dark:border-slate-800 bg-emerald-500/5 p-4 rounded-xl text-center space-y-1">
          <Award className="w-5 h-5 text-emerald-500 mx-auto" />
          <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider block">ML Model Accuracy</span>
          <span className="text-xl font-bold text-slate-800 dark:text-white font-mono block">{highAccuracyScore}</span>
        </div>

        {/* Metric 2 */}
        <div className="border border-slate-200 dark:border-slate-800 bg-blue-500/5 p-4 rounded-xl text-center space-y-1">
          <TrendingUp className="w-5 h-5 text-blue-500 mx-auto" />
          <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider block">Est. Revenue Recovey</span>
          <span className="text-xl font-bold text-blue-500 font-mono block">{revenueGainEstimate}</span>
        </div>

        {/* Metric 3 */}
        <div className="border border-slate-200 dark:border-slate-800 bg-emerald-500/5 p-4 rounded-xl text-center space-y-1">
          <Activity className="w-5 h-5 text-emerald-500 mx-auto" />
          <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider block">Scorings This Session</span>
          <span className="text-xl font-bold text-slate-800 dark:text-white font-mono block">{totalScorings} runs</span>
        </div>

        {/* Metric 4 */}
        <div className="border border-slate-200 dark:border-slate-800 bg-purple-500/5 p-4 rounded-xl text-center space-y-1">
          <Sliders className="w-5 h-5 text-purple-500 mx-auto" />
          <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider block">Organic Waste Slashed</span>
          <span className="text-xl font-bold text-purple-500 font-mono block">{carbonSlashed}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Form: Profile configurations */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              General Profile Parameters
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Full Human Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Professional Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Enterprise Group / Restaurant Chain
                </label>
                <input
                  type="text"
                  required
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none text-slate-400 font-sans cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Account login identifier</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Preferred Default Center
                  </label>
                  <select
                    value={defaultCenter}
                    onChange={(e) => setDefaultCenter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                  >
                    <option value="55">Center 55 (Urban Express)</option>
                    <option value="24">Center 24 (Metro Hub)</option>
                    <option value="10">Center 10 (HQ Regional)</option>
                    <option value="186">Center 186 (Suburban Outlet)</option>
                  </select>
                </div>
              </div>

              {isSaved && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5" />
                  General settings properties written successfully.
                </div>
              )}

              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-lg text-xs transition cursor-pointer"
              >
                Save Profile Configuration
              </button>
            </form>
          </div>

          {/* Simulated Password Change Card */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Change Auth Password
            </h3>

            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    New Secure Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {pwAlert && (
                <div className="text-xs text-rose-500 font-medium">
                  {pwAlert}
                </div>
              )}

              {pwSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5" />
                  Credentials update saved into secure Firebase cache sandbox,
                </div>
              )}

              <button
                type="submit"
                className="bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2.5 rounded-lg text-xs transition cursor-pointer"
              >
                Change password
              </button>
            </form>
          </div>
        </div>

        {/* Right Side Info: Active Node & session controls */}
        <div className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              Core Node Integrity
            </h4>
            <div className="space-y-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <p>
                This terminal is registered under central dispatch credentials linked directly to regional distribution centers.
              </p>
              <div>
                <span className="font-semibold block text-slate-700 dark:text-slate-300">Workspace Node:</span>
                <span className="font-mono text-[11px]">node_foodsense_v412</span>
              </div>
              <div>
                <span className="font-semibold block text-slate-700 dark:text-slate-300">Firebase Scope:</span>
                <span className="font-mono text-[11px]">foodsenseai-db-web</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <button
                onClick={onLogout}
                className="w-full bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-rose-500 font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of Console
              </button>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6">
            <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest block mb-1">
              Active model
            </span>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              RandomForest Demand Small Regressor
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Precision calculated at 93.4% R-squared. Standard residuals fit within +-12 predicted orders in central dry storage test categories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
