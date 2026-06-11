import React, { useState, useEffect } from "react";
import { ForecastInput, PredictionResult, PredictionHistoryRecord, UserProfile, DonationRecord } from "./types";
import LandingPage from "./components/LandingPage";
import PredictForm from "./components/PredictForm";
import PredictSurplusForm from "./components/PredictSurplusForm";
import DashboardPanel from "./components/DashboardPanel";
import HistoryHub from "./components/HistoryHub";
import ProfileSettings from "./components/ProfileSettings";
import DonorDashboard from "./components/DonorDashboard";
import NgoDashboard from "./components/NgoDashboard";
import AiDemandDashboard from "./components/AiDemandDashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import GpsDemandMapping from "./components/GpsDemandMapping";
import { 
  Sparkles, 
  BrainCircuit, 
  Compass,
  Briefcase, 
  History, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  LogIn, 
  ChevronRight, 
  LayoutDashboard, 
  Utensils, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X,
  Play,
  TrendingUp,
  Tag,
  HeartHandshake,
  Share2,
  Building,
  Plus,
  Trash2,
  Truck
} from "lucide-react";

export default function App() {
  // Navigation & Public / Public Console State
  const [activeTab, setActiveTab] = useState<"landing" | "donor" | "ngo" | "ai-demand" | "predict-surplus" | "analytics" | "dashboard" | "history" | "profile" | "gps-map">("landing");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

  // Seeded client-side donations array
  const [donations, setDonations] = useState<DonationRecord[]>([
    {
      id: "fs-donation-1",
      foodName: "50 Veg Meals",
      quantity: 50,
      foodType: "Veg Meals",
      expiryTime: "Expires in 4 Hours",
      location: "Anna Nagar, Chennai",
      contact: "+91 98402 12345",
      status: "Unassigned",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      distance: "1.2 km",
      co2Saved: 22.5
    },
    {
      id: "fs-donation-2",
      foodName: "30 Chicken Rice Bowls",
      quantity: 30,
      foodType: "Non-Veg Meals",
      expiryTime: "Expires in 3 Hours",
      location: "Adyar Regional, South",
      contact: "+91 97890 54321",
      status: "NGO Assigned",
      assignedNgo: "Care-Share Community Kitchens (NGO)",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      distance: "2.4 km",
      co2Saved: 13.5
    },
    {
      id: "fs-donation-3",
      foodName: "80 Fruit Salad Bundles",
      quantity: 80,
      foodType: "Raw Materials",
      expiryTime: "Expires in 1 Hour",
      location: "Guindy Sector, West",
      contact: "+91 90031 99887",
      status: "En-Route",
      assignedNgo: "Care-Share Community Kitchens (NGO)",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      distance: "0.8 km",
      co2Saved: 36.0
    }
  ]);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: "suarez.kitchens@foodsense.io",
    name: "Chef Salvador Suarez",
    role: "Senior Culinary Logistics Lead",
    organization: "Suarez Central Kitchens",
    defaultCenterId: "55",
    defaultCenterType: "TYPE_A"
  });

  // Login form views
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [showAuthOverlay, setShowAuthOverlay] = useState<boolean>(false);

  // Core forecast histories
  const [history, setHistory] = useState<PredictionHistoryRecord[]>([]);
  const [latestForecast, setLatestForecast] = useState<(PredictionHistoryRecord & { aiInsights: string[] }) | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PredictionHistoryRecord | null>(null);

  // Theme Sync on start
  useEffect(() => {
    // Check localStorage preference
    const storedTheme = localStorage.getItem("foodsense-theme");
    const isDark = storedTheme !== "light"; // default to dark premium theme
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check auth cache
    const cachedAuth = localStorage.getItem("foodsense-auth");
    if (cachedAuth === "true") {
      setIsAuthenticated(true);
      const cachedProfile = localStorage.getItem("foodsense-profile");
      if (cachedProfile) {
        setUserProfile(JSON.parse(cachedProfile));
      }
    }

    fetchHistory();
    fetchDonations();
  }, []);

  const toggleTheme = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("foodsense-theme", newVal ? "dark" : "light");
    if (newVal) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        if (data.donationsList) {
          setDonations(data.donationsList);
        }
      }
    } catch (err) {
      console.error("Failed to fetch live matching donations ledger:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
        if (data.length > 0) {
          // Identify the most recent calculated entry
          const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setLatestForecast(sorted[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch historical runs database details:", err);
    }
  };

  const handleClearHistory = async () => {
    // Standard revert history action
    try {
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!authEmail || !authPassword) {
      setAuthError("Please fill out both email and password parameters.");
      return;
    }

    // Fully authenticated simulate state
    const cleanProfile: UserProfile = {
      email: authEmail,
      name: userProfile.name,
      role: userProfile.role,
      organization: userProfile.organization,
      defaultCenterId: "55",
      defaultCenterType: "TYPE_A"
    };

    setIsAuthenticated(true);
    setUserProfile(cleanProfile);
    localStorage.setItem("foodsense-auth", "true");
    localStorage.setItem("foodsense-profile", JSON.stringify(cleanProfile));
    setShowAuthOverlay(false);
    setActiveTab("dashboard");
    fetchHistory();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!authEmail || !authPassword || !authName) {
      setAuthError("All credentials parameters are mandatory.");
      return;
    }

    const cleanProfile: UserProfile = {
      email: authEmail,
      name: authName,
      role: "Operations Analyst",
      organization: "Global Cloud Kitchen Hub",
      defaultCenterId: "24",
      defaultCenterType: "TYPE_B"
    };

    setIsAuthenticated(true);
    setUserProfile(cleanProfile);
    localStorage.setItem("foodsense-auth", "true");
    localStorage.setItem("foodsense-profile", JSON.stringify(cleanProfile));
    setShowAuthOverlay(false);
    setActiveTab("dashboard");
    fetchHistory();
  };

  const handleGoogleMockLogin = () => {
    const googleProfile: UserProfile = {
      email: "google.collaborator@foodsense.io",
      name: "Google Enterprise Partner",
      role: "Logistics Specialist",
      organization: "FoodSense Cloud Ingress",
      defaultCenterId: "55",
      defaultCenterType: "TYPE_A"
    };

    setIsAuthenticated(true);
    setUserProfile(googleProfile);
    localStorage.setItem("foodsense-auth", "true");
    localStorage.setItem("foodsense-profile", JSON.stringify(googleProfile));
    setShowAuthOverlay(false);
    setActiveTab("dashboard");
    fetchHistory();
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("foodsense-auth");
    localStorage.removeItem("foodsense-profile");
    setActiveTab("landing");
  };

  const handlePredictionComplete = (result: PredictionResult & { input: ForecastInput }) => {
    fetchHistory();
    // Reconstruct record mapping
    const newRecord: PredictionHistoryRecord = {
      id: "fs-interactive-" + Date.now(),
      date: new Date().toISOString(),
      week: result.input.week,
      centerId: result.input.centerId,
      mealId: result.input.mealId,
      checkoutPrice: result.input.checkoutPrice,
      basePrice: result.input.basePrice,
      emailPromotion: result.input.emailPromotion,
      homepageFeatured: result.input.homepageFeatured,
      cityCode: result.input.cityCode,
      regionCode: result.input.regionCode,
      operationalArea: result.input.operationalArea,
      category: result.input.category,
      cuisine: result.input.cuisine,
      centerType: result.input.centerType,
      predictedOrders: result.predicted_orders,
      demandLevel: result.demand_level,
      inventoryAction: result.inventory_action,
      aiInsights: result.ai_insights
    };

    setLatestForecast(newRecord);
    setActiveTab("ai-demand");
  };

  const handleAddDonation = async (newDon: Omit<DonationRecord, "id" | "timestamp" | "status" | "co2Saved">) => {
    try {
      const response = await fetch("/api/donate-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDon),
      });
      if (response.ok) {
        const added = await response.json();
        setDonations(prev => [added, ...prev]);
        fetchDonations();
      }
    } catch (err) {
      console.error("Failed to post surplus donation:", err);
    }
  };

  const handleDeleteDonation = async (id: string) => {
    try {
      const response = await fetch(`/api/donations/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setDonations(prev => prev.filter(d => d.id !== id));
        fetchDonations();
      }
    } catch (err) {
      console.error("Failed to delete donation record:", err);
    }
  };

  const handleAcceptDonation = (id: string, ngoName: string) => {
    setDonations(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: "NGO Assigned",
          assignedNgo: ngoName,
          distance: "1.4 km"
        };
      }
      return d;
    }));
  };

  const handleSchedulePickup = (id: string, slot: string) => {
    setDonations(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: "En-Route",
          expiryTime: `Pickup: ${slot}`
        };
      }
      return d;
    }));
  };

  const handleSimulateStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/donations/${id}/simulate`, {
        method: "POST"
      });
      if (response.ok) {
        const updated = await response.json();
        setDonations(prev => prev.map(d => d.id === id ? updated : d));
        fetchDonations();
      }
    } catch (err) {
      console.error("Failed to simulate transit status update:", err);
    }
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem("foodsense-profile", JSON.stringify(newProfile));
  };

  const handleGetStartedCTA = () => {
    if (isAuthenticated) {
      setActiveTab("donor");
    } else {
      setShowAuthOverlay(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Top sticky Navigation Header */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between ">
        <div 
          onClick={() => setActiveTab("landing")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/10 transform group-hover:rotate-6 transition-all">
            <HeartHandshake className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-neutral-50 tracking-tight font-sans text-base block">
              FoodSense <span className="text-emerald-500 text-xs uppercase tracking-widest font-mono font-bold pl-1">Rescue</span>
            </span>
          </div>
        </div>

        {/* Desktop console navigation tabs */}
        {isAuthenticated && activeTab !== "landing" && (
          <div className="hidden md:flex gap-1 bg-slate-150/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.8 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                activeTab === "dashboard" 
                  ? "bg-white dark:bg-slate-950 text-emerald-500 shadow-sm border border-slate-200/50 dark:border-slate-800" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Cockpit
            </button>
            <button
              onClick={() => setActiveTab("donor")}
              className={`flex items-center gap-1.5 px-3 py-1.8 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                activeTab === "donor" 
                  ? "bg-white dark:bg-slate-950 text-emerald-500 shadow-sm border border-slate-200/50 dark:border-slate-800" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-500 shrink-0" />
              Donor Portal
            </button>
            <button
              onClick={() => {
                setActiveTab("predict-surplus");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.8 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                activeTab === "predict-surplus" 
                  ? "bg-white dark:bg-slate-950 text-emerald-500 shadow-sm border border-slate-200/50 dark:border-slate-800" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              Surplus Predictor
            </button>
            <button
              onClick={() => setActiveTab("ngo")}
              className={`flex items-center gap-1.5 px-3 py-1.8 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                activeTab === "ngo" 
                  ? "bg-white dark:bg-slate-950 text-emerald-500 shadow-sm border border-slate-200/50 dark:border-slate-800" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Building className="w-4 h-4 text-blue-500 shrink-0" />
              NGO Live Feed
            </button>
            <button
              onClick={() => setActiveTab("gps-map")}
              className={`flex items-center gap-1.5 px-3 py-1.8 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all ${
                activeTab === "gps-map" 
                  ? "bg-white dark:bg-slate-950 text-emerald-500 shadow-sm border border-slate-200/50 dark:border-slate-800" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Compass className="w-4 h-4 text-rose-500 animate-spin-slow shrink-0" />
              Live Tracker Map
            </button>
          </div>
        )}

        {/* Global actions: Dark Mode, Log state */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition cursor-pointer"
            title="Toggle theme styling presets"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {activeTab === "landing" ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 dark:text-neutral-50">
                      {userProfile.name}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      {userProfile.organization}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("dashboard");
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4.5 py-2 rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    Dashboard Console
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Premium Interactive Profile Dropdown Hub */
                <div className="relative font-sans">
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 text-right cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60 p-1.5 rounded-xl transition border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                    id="profile-dropdown-trigger"
                  >
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-bold text-slate-800 dark:text-neutral-50 tracking-tight leading-normal">
                        {userProfile.name}
                      </div>
                      <div className="text-[9.5px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider leading-none">
                        {userProfile.organization}
                      </div>
                    </div>
                    
                    {/* Initials Avatar badge */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-extrabold font-mono shadow-sm border border-emerald-400/20">
                      {userProfile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  </button>

                  {/* Absolute Popup Panel overlay */}
                  {profileDropdownOpen && (
                    <>
                      {/* Invisible backdrop shield to close on blur */}
                      <div 
                        className="fixed inset-0 z-40 cursor-default" 
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      
                      <div 
                        className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left"
                        id="profile-dropdown-menu"
                      >
                        {/* Dropdown Header Info block */}
                        <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-900/80 flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-extrabold font-mono shadow-md">
                            {userProfile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                          <div className="truncate min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-neutral-50 truncate leading-tight">{userProfile.name}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate leading-normal">{userProfile.email || "salvador@foodsense.io"}</p>
                            <span className="inline-block mt-1 text-[8.5px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider leading-none">
                              {userProfile.role || "Logistics Master"}
                            </span>
                          </div>
                        </div>

                        {/* Dropdown Options List */}
                        <div className="p-1 px-2 space-y-0.5 mt-2">
                          <span className="px-2.5 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block py-1">
                            LOGISTICS SUITE
                          </span>
                          
                          <button
                            onClick={() => {
                              setActiveTab("ai-demand");
                              setProfileDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                              activeTab === "ai-demand" 
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold" 
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                          >
                            <Utensils className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span>AI Demand Forecast</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab("analytics");
                              setProfileDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                              activeTab === "analytics" 
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold" 
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                            <span>Carbon & Impact Stats</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab("history");
                              setProfileDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                              activeTab === "history" 
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold" 
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                          >
                            <History className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span>Scenario Ledger</span>
                          </button>

                          <div className="border-t border-slate-100 dark:border-slate-900/80 my-1.5" />
                          <span className="px-2.5 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block py-1">
                            PREFERENCES
                          </span>

                          <button
                            onClick={() => {
                              setActiveTab("profile");
                              setProfileDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                              activeTab === "profile" 
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold" 
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                          >
                            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>Profile & Target Centers</span>
                          </button>
                        </div>

                        {/* Dropdown Signout Footer */}
                        <div className="border-t border-slate-100 dark:border-slate-900/85 mt-2.5 pt-2 px-2">
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              handleSignOut();
                            }}
                            className="w-full text-left text-xs font-bold text-rose-500 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-2.5 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out Workspace</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthOverlay(true)}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-medium px-4.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-100 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Immersive Mobile Navigation header (Authenticated State Only) */}
      {isAuthenticated && activeTab !== "landing" && (
        <div className="md:hidden flex justify-around border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-2 px-2 flex-wrap gap-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[10px] font-bold ${
              activeTab === "dashboard" ? "text-emerald-500" : "text-slate-400"
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            Cockpit
          </button>
          <button
            onClick={() => setActiveTab("donor")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[10px] font-bold ${
              activeTab === "donor" ? "text-emerald-500" : "text-slate-400"
            }`}
          >
            <HeartHandshake className="w-4.5 h-4.5" />
            Donor
          </button>
          <button
            onClick={() => setActiveTab("predict-surplus")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[10px] font-bold ${
              activeTab === "predict-surplus" ? "text-emerald-500" : "text-slate-400"
            }`}
          >
            <Sparkles className="w-4.5 h-4.5" />
            Surplus
          </button>
          <button
            onClick={() => setActiveTab("ngo")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[10px] font-bold ${
              activeTab === "ngo" ? "text-emerald-500" : "text-slate-400"
            }`}
          >
            <Building className="w-4.5 h-4.5" />
            NGO Live
          </button>
          <button
            onClick={() => setActiveTab("gps-map")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[10px] font-bold relative ${
              activeTab === "gps-map" ? "text-emerald-500" : "text-slate-400"
            }`}
          >
            <Compass className="w-4.5 h-4.5 animate-spin-slow" />
            Live Map
          </button>
        </div>
      )}

      {/* Main Container Views Switcher */}
      <main className={`relative z-10 ${activeTab !== "landing" ? "max-w-6xl mx-auto px-4 py-8" : ""}`}>
        {activeTab === "landing" && (
          <LandingPage 
            onGetStarted={handleGetStartedCTA} 
            onViewDemo={() => {
              if (isAuthenticated) {
                setActiveTab("donor");
              } else {
                handleGoogleMockLogin();
              }
            }} 
          />
        )}

        {activeTab === "donor" && (
          <DonorDashboard 
            donations={donations} 
            onAddDonation={handleAddDonation} 
            onDeleteDonation={handleDeleteDonation}
            onSimulateStatus={handleSimulateStatus}
          />
        )}

        {activeTab === "ngo" && (
          <NgoDashboard 
            donations={donations} 
            onAcceptDonation={handleAcceptDonation}
            onSchedulePickup={handleSchedulePickup}
          />
        )}

        {activeTab === "ai-demand" && (
          <AiDemandDashboard 
            onPredictionComplete={handlePredictionComplete}
            onExportToDonation={handleAddDonation}
            latestPrediction={latestForecast}
          />
        )}

        {activeTab === "predict-surplus" && (
          <PredictSurplusForm onAddDonation={handleAddDonation} />
        )}

        {activeTab === "analytics" && (
          <AnalyticsDashboard />
        )}

        {activeTab === "dashboard" && (
          <DashboardPanel 
            history={history} 
            onNavigateToForecast={() => setActiveTab("ai-demand")}
            latestPrediction={latestForecast}
          />
        )}

        {activeTab === "history" && (
          <HistoryHub 
            history={history} 
            onSelectRecord={(rec) => setSelectedRecord(rec)}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === "gps-map" && (
          <GpsDemandMapping 
            donations={donations} 
            onAcceptDonation={handleAcceptDonation}
            onAddDonation={handleAddDonation}
            onSimulateStatus={handleSimulateStatus}
            userProfile={userProfile}
          />
        )}

        {activeTab === "profile" && (
          <ProfileSettings 
            profile={userProfile} 
            history={history}
            onUpdateProfile={handleUpdateProfile} 
            onLogout={handleSignOut}
          />
        )}
      </main>

      {/* Prediction scenario detail modal overlay (Section 5, 6 UI recommendation alerts) */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-805 rounded-2xl shadow-2xl overflow-hidden text-left font-sans">
            <div className="bg-slate-950/90 border-b border-slate-800 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-semibold block mb-0.5">
                  Analytical Scenario Inspection
                </span>
                <h3 className="text-sm font-semibold text-white">Record ID: {selectedRecord.id}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Quantities indicator panel */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Predicted Orders Volume</span>
                  <span className="text-3xl font-bold font-mono text-emerald-500 block mt-2">
                    {selectedRecord.predictedOrders}
                  </span>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Elastic Price Factor</span>
                  <span className="text-sm font-semibold text-white mt-2 block">
                    Checkout: ${selectedRecord.checkoutPrice.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Base: ${selectedRecord.basePrice.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Status Section (Section 5 smart inventory recommendations) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Smart Inventory Recommendation Panel
                </span>
                {selectedRecord.demandLevel === "High" ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                      HIGH DEMAND STATUS ACTION ITEM
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      <strong>Quantity Action:</strong> Increase physical inventory and staff readiness. Schedule extra workstation pre-prepping slots. Elevate target safety buffer margins by 25%.
                    </p>
                  </div>
                ) : selectedRecord.demandLevel === "Low" ? (
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-amber-500">
                      <AlertTriangle className="w-5 h-5" />
                      LOW DEMAND STATUS ACTION ITEM
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      <strong>Quantity Action:</strong> Reduce preparation quantities. Freeze perishable protein chains, suspend manual batch prep triggers, and run lean on dairy ingredients to prevent waste overheads.
                    </p>
                  </div>
                ) : (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-indigo-500">
                      <Info className="w-5 h-5" />
                      MEDIUM DEMAND STATUS ACTION ITEM
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      <strong>Quantity Action:</strong> Maintain standard inventory buffers. Keep consistent staffing limits in play, but prepare baseline quantities only to safe target scales.
                    </p>
                  </div>
                )}
              </div>

              {/* AI Business Insights (Section 6) */}
              <div className="space-y-3.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  AI Business Optimization Insights
                </span>
                <div className="space-y-2.5">
                  {selectedRecord.aiInsights && selectedRecord.aiInsights.map((insight, idx) => (
                    <div key={idx} className="bg-slate-950 p-3.5 rounded-lg border border-slate-805 text-xs text-slate-300 leading-relaxed font-mono flex gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">0{idx + 1}.</span>
                      <p>{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comprehensive parameters summary */}
              <div className="border-t border-slate-800 pt-4 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Forecast Week:</span>
                  <span className="font-mono text-slate-300">{selectedRecord.week} (index map)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Operating Center:</span>
                  <span className="font-mono text-slate-300">Center #{selectedRecord.centerId} ({selectedRecord.centerType})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Category Focus:</span>
                  <span className="font-mono text-slate-300">{selectedRecord.category} ({selectedRecord.cuisine} cuisine)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Footprint Space Area:</span>
                  <span className="font-mono text-slate-300">{selectedRecord.operationalArea} Thousand m²</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/90 border-t border-slate-800 p-5 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="text-left space-y-0.5">
                <span className="text-[10px] text-emerald-400 font-mono block uppercase font-bold tracking-wider">
                  🎯 Suggested Redistribution Buffer
                </span>
                <span className="text-xs text-slate-300 font-semibold font-sans">
                  {Math.max(25, Math.round(selectedRecord.predictedOrders * 0.15))} portions ({selectedRecord.category})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const suggestedQty = Math.max(25, Math.round(selectedRecord.predictedOrders * 0.15));
                    const mealCategory = selectedRecord.category || "Veg Meals";
                    const mealName = `Surplus Ref: ${selectedRecord.category || "Rescued Meals"}`;
                    const customLoc = selectedRecord.centerId === "55" ? "Anna Nagar, Chennai" : "Adyar Regional, South";
                    
                    handleAddDonation({
                      foodName: mealName,
                      quantity: suggestedQty,
                      foodType: mealCategory,
                      expiryTime: "Expires in 6 Hours",
                      location: customLoc,
                      contact: "+91 98402 12345",
                      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60"
                    });
                    
                    alert(`Redistribution Manifest Generated Successfully!\nThis predicted inventory surplus (${suggestedQty} portions) is now matched and live on care-seeker feeds!`);
                    setSelectedRecord(null);
                    setActiveTab("donor");
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Export to NGO Partner
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Auth Drawer / Overlay Modal */}
      {showAuthOverlay && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl p-8 relative space-y-6">
            <button
              onClick={() => setShowAuthOverlay(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Platform identity header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                {authView === "login" ? "Welcome back to FoodSense" : "Establish Logistics Ingress Account"}
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Secure access gateway to AI-powered culinary forecasting engines.
              </p>
            </div>

            {/* Basic Auth Form */}
            {authView === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. lead@foodsense.io"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 font-sans text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Console Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 font-sans text-slate-800 dark:text-slate-200"
                  />
                </div>

                {authError && (
                  <p className="text-xs text-rose-500 font-semibold">{authError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-medium py-3 rounded-xl text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Platform Sandbox
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Full Human Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 font-sans text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. research@corp.io"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 font-sans text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Consoles Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 font-sans text-slate-800 dark:text-slate-200"
                  />
                </div>

                {authError && (
                  <p className="text-xs text-rose-500 font-semibold">{authError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                >
                  Create Ingress Account
                </button>
              </form>
            )}

            {/* Quick Demo Access triggers & Divider */}
            <div className="relative flex py-2 items-center justify-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              <span className="flex-shrink mx-4 text-xs font-mono text-slate-400">OR BYPASS AUTH</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleGoogleMockLogin}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                Continue with simulated Google Workspace Account
              </button>
              <button
                onClick={handleGoogleMockLogin}
                className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
              >
                Sign in instantly using Demo Credentials
              </button>
            </div>

            {/* View togglers */}
            <p className="text-center text-xs text-slate-400">
              {authView === "login" ? (
                <>
                  No ingress account registered?{" "}
                  <span 
                    onClick={() => setAuthView("signup")}
                    className="text-emerald-500 cursor-pointer hover:underline font-semibold"
                  >
                    Create account
                  </span>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <span 
                    onClick={() => setAuthView("login")}
                    className="text-emerald-500 cursor-pointer hover:underline font-semibold"
                  >
                    Bypass authentication
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
