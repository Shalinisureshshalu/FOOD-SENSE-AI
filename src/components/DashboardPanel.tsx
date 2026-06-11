import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PredictionHistoryRecord } from "../types";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Leaf, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  UtensilsCrossed,
  Layers,
  ChevronRight,
  TrendingUp as GrowthIcon,
  ChevronUp,
  Tag,
  MapPin,
  HeartHandshake,
  Users,
  CheckCircle2,
  Loader2,
  Navigation,
  Check
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

interface NgoPartner {
  id: string;
  name: string;
  lat: number;
  lng: number;
  acceptsCategories: string[];
  capacityStatus: "high" | "moderate" | "low";
  capacityText: string;
  contact: string;
}

interface DispatchLog {
  id: string;
  timestamp: string;
  ngoName: string;
  mealName: string;
  quantity: number;
  distance: string;
  status: "Dispatched" | "Arrived" | "Transiting";
}

const INITIAL_NGOS: NgoPartner[] = [
  {
    id: "ngo-city-harvest",
    name: "City Harvest Hunger Relief",
    lat: 37.7852,
    lng: -122.4218,
    acceptsCategories: ["Beverages", "Rice Bowl", "Sandwich", "Salad", "Burger"],
    capacityStatus: "high",
    capacityText: "🟢 850 portions space available",
    contact: "+1 (555) 321-4940"
  },
  {
    id: "ngo-care-share",
    name: "Care-Share Community Kitchens",
    lat: 37.7621,
    lng: -122.3954,
    acceptsCategories: ["Rice Bowl", "Pizza", "Pasta", "Burger", "Starters"],
    capacityStatus: "moderate",
    capacityText: "🟡 240 portions space available",
    contact: "+1 (555) 901-4432"
  },
  {
    id: "ngo-hope-breadline",
    name: "Hope Street Breadline Pantry",
    lat: 37.7948,
    lng: -122.3991,
    acceptsCategories: ["Beverages", "Sandwich", "Starters"],
    capacityStatus: "high",
    capacityText: "🟢 Unlimited storage capability",
    contact: "+1 (555) 777-1289"
  },
  {
    id: "ngo-greenpath",
    name: "GreenPath Eco-Plate Alliance",
    lat: 37.7512,
    lng: -122.4149,
    acceptsCategories: ["Salad", "Seafood", "Starters"],
    capacityStatus: "low",
    capacityText: "🔴 40 portions limit left",
    contact: "+1 (555) 880-9901"
  }
];

// Stagger Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, 
      stiffness: 90, 
      damping: 14 
    } 
  }
} as const;


interface DashboardPanelProps {
  history: PredictionHistoryRecord[];
  onNavigateToForecast: () => void;
  latestPrediction: (PredictionHistoryRecord & { aiInsights: string[] }) | null;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#ec4899", "#8b5cf6", "#14b8a6"];

export default function DashboardPanel({ history, onNavigateToForecast, latestPrediction }: DashboardPanelProps) {
  const [stats, setStats] = useState({
    totalPredictedOrders: 0,
    averageDemand: 0,
    growth: 12.8,
    wasteReduction: 21.4
  });

  // Zero-Waste Location Tracker and NGO Dispatcher states
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  
  const [ngos, setNgos] = useState<NgoPartner[]>(INITIAL_NGOS);
  const [selectedNgoId, setSelectedNgoId] = useState<string>("ngo-city-harvest");
  const [donationQty, setDonationQty] = useState<number>(65);
  const [donationMealName, setDonationMealName] = useState<string>("Citrus Iced Mint Tea");
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

  const [dispatchLogs, setDispatchLogs] = useState<DispatchLog[]>([
    {
      id: "tx-ngo-8921",
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ngoName: "City Harvest Hunger Relief",
      mealName: "Citrus Iced Mint Tea",
      quantity: 45,
      distance: "1.2 km",
      status: "Arrived"
    },
    {
      id: "tx-ngo-4512",
      timestamp: new Date(Date.now() - 1 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ngoName: "Hope Street Breadline Pantry",
      mealName: "Homestyle Jeera Dal Rice Bowl",
      quantity: 110,
      distance: "2.7 km",
      status: "Transiting"
    }
  ]);

  // Fallback default coordinates of regional HQ (San Francisco area)
  const FALLBACK_LAT = 37.7749;
  const FALLBACK_LNG = -122.4194;

  // Track coordinates via Geolocation
  const handleTrackLocation = () => {
    setIsTrackingLocation(true);
    setLocationMessage("Acquiring GPS constellation coordinate fix...");

    if (!navigator.geolocation) {
      setTimeout(() => {
        setUserCoords({ latitude: FALLBACK_LAT, longitude: FALLBACK_LNG });
        setLocationMessage("Geolocation unsupported. Defaulting to Central HQ Hub coordinates.");
        setIsTrackingLocation(false);
      }, 1000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationMessage(`Precise biological GPS coordinate fix locked in!`);
        setIsTrackingLocation(false);
      },
      (error) => {
        console.warn("Geolocation API error:", error);
        setUserCoords({ latitude: FALLBACK_LAT, longitude: FALLBACK_LNG });
        setLocationMessage("Position access denied. Defaulting to Central HQ Hub coordinates.");
        setIsTrackingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Distance calculator (Haversine Formula) in km
  const getDistanceToNgo = (ngo: NgoPartner) => {
    const lat1 = userCoords?.latitude ?? FALLBACK_LAT;
    const lon1 = userCoords?.longitude ?? FALLBACK_LNG;
    const lat2 = ngo.lat;
    const lon2 = ngo.lng;

    const R = 6371; // radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return `${d.toFixed(1)} km`;
  };

  // Preset or default the donation meal from the latest prediction automatically if available!
  useEffect(() => {
    if (latestPrediction) {
      setDonationMealName(latestPrediction.category);
      // Under medium or low demand, offer standard safety stock as surplus portions suggestion
      const suggestedSurplus = Math.max(20, Math.round(latestPrediction.predictedOrders * 0.15));
      setDonationQty(suggestedSurplus);
    }
  }, [latestPrediction]);

  // Dispatch live donation logic
  const handleDispatchSurplus = (e: React.FormEvent) => {
    e.preventDefault();
    const targetedNgo = ngos.find(n => n.id === selectedNgoId);
    if (!targetedNgo) return;

    setIsDispatching(true);
    setDispatchAlert(null);

    // Simulate scheduling communication delay
    setTimeout(() => {
      const distanceStr = getDistanceToNgo(targetedNgo);
      const newLog: DispatchLog = {
        id: `tx-ngo-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ngoName: targetedNgo.name,
        mealName: donationMealName,
        quantity: donationQty,
        distance: distanceStr,
        status: "Dispatched"
      };

      setDispatchLogs(prev => [newLog, ...prev]);
      
      // Update local NGO capability counts to show responsive reaction
      setNgos(prev => 
        prev.map(n => {
          if (n.id === targetedNgo.id && n.capacityStatus !== "low") {
            return {
              ...n,
              capacityText: `🟢 Capacity updated: ${850 - donationQty} spaces left`
            };
          }
          return n;
        })
      );

      setIsDispatching(false);
      setDispatchAlert(`Success! Forwarded ${donationQty} portions of ${donationMealName} to ${targetedNgo.name}!`);
      setTimeout(() => setDispatchAlert(null), 5000);
    }, 1500);
  };


  useEffect(() => {
    if (history.length > 0) {
      const total = history.reduce((sum, item) => sum + item.predictedOrders, 0);
      const avg = Math.round(total / history.length);
      setStats({
        totalPredictedOrders: total,
        averageDemand: avg,
        growth: 14.2,
        wasteReduction: 22.8
      });
    }
  }, [history]);

  // Transform historical records into chart schemas
  // 1. Weekly Demand Trend
  const getWeeklyData = () => {
    const grouped: Record<number, { week: number; totalOrders: number; count: number }> = {};
    history.forEach(item => {
      const wk = item.week;
      if (!grouped[wk]) {
        grouped[wk] = { week: wk, totalOrders: 0, count: 0 };
      }
      grouped[wk].totalOrders += item.predictedOrders;
      grouped[wk].count += 1;
    });
    return Object.values(grouped)
      .sort((a, b) => a.week - b.week)
      .map(g => ({
        name: `Wk ${g.week}`,
        Orders: Math.round(g.totalOrders / g.count)
      }));
  };

  // 2. Cuisine Aggregation
  const getCuisineData = () => {
    const cuisineCounts: Record<string, number> = {};
    history.forEach(item => {
      cuisineCounts[item.cuisine] = (cuisineCounts[item.cuisine] || 0) + item.predictedOrders;
    });
    return Object.entries(cuisineCounts).map(([name, value]) => ({ name, value }));
  };

  // 3. Category Breakdown
  const getCategoryData = () => {
    const categoryCounts: Record<string, number> = {};
    history.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + item.predictedOrders;
    });
    return Object.entries(categoryCounts).map(([name, Orders]) => ({ name, Orders }));
  };

  // 4. Promo vs Non-Promo Comparison
  const getPromoImpactData = () => {
    let promoSum = 0, promoCount = 0;
    let nonPromoSum = 0, nonPromoCount = 0;

    history.forEach(item => {
      const hasPromo = item.emailPromotion || item.homepageFeatured;
      if (hasPromo) {
        promoSum += item.predictedOrders;
        promoCount++;
      } else {
        nonPromoSum += item.predictedOrders;
        nonPromoCount++;
      }
    });

    return [
      {
        name: "Standard Runs",
        AverageDemand: nonPromoCount > 0 ? Math.round(nonPromoSum / nonPromoCount) : 0,
        color: "#64748b"
      },
      {
        name: "With Marketing Campaigns",
        AverageDemand: promoCount > 0 ? Math.round(promoSum / promoCount) : 0,
        color: "#10b981"
      }
    ];
  };

  // 5. Price Sensitivity Scatter List
  const getPriceSensitivityData = () => {
    return history.map(item => ({
      CheckoutPrice: item.checkoutPrice,
      Orders: item.predictedOrders,
      name: item.category
    })).sort((a, b) => a.CheckoutPrice - b.CheckoutPrice);
  };

  const weeklyData = getWeeklyData();
  const cuisineData = getCuisineData();
  const categoryData = getCategoryData();
  const promoData = getPromoImpactData();
  const priceData = getPriceSensitivityData();

  return (
    <div className="space-y-8">
      {/* SaaS Dashboard Indicator Cards Grid (Staggered Animation) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Aggregate Orders */}
        <motion.div 
          variants={cardVariants}
          className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-mono font-medium block mb-1 uppercase tracking-wider">
                Total Predicted Orders
              </span>
              <span className="text-3xl font-bold text-slate-850 dark:text-neutral-50 font-mono">
                {stats.totalPredictedOrders.toLocaleString()}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-500">
            <ChevronUp className="w-4 h-4 shrink-0" />
            <span>+14.2% demand volume growth</span>
          </div>
        </motion.div>

        {/* Card 2: Average Demand */}
        <motion.div 
          variants={cardVariants}
          className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-mono font-medium block mb-1 uppercase tracking-wider">
                Average Meal Volume
              </span>
              <span className="text-3xl font-bold text-slate-850 dark:text-neutral-50 font-mono">
                {stats.averageDemand}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 font-mono">
            Across {history.length} persistent scenarios
          </div>
        </motion.div>

        {/* Card 3: Optimization waste reduction rate */}
        <motion.div 
          variants={cardVariants}
          className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-mono font-medium block mb-1 uppercase tracking-wider">
                Waste Reduction Target
              </span>
              <span className="text-3xl font-bold text-emerald-500 font-mono">
                {stats.wasteReduction}%
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 font-sans">
            Optimized storage refrigeration limits
          </div>
        </motion.div>

        {/* Card 4: Demand Speed Rate */}
        <motion.div 
          variants={cardVariants}
          className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-mono font-medium block mb-1 uppercase tracking-wider">
                Active Promotions Growth
              </span>
              <span className="text-3xl font-bold text-indigo-500 font-mono">
                +2.45x
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <GrowthIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 font-mono">
            Impulse surge during homepage featured items
          </div>
        </motion.div>
      </motion.div>


      {/* Latest Prediction Spotlight & CTA Banner */}
      {latestPrediction ? (
        <div className="grid grid-cols-1 md:grid-cols-3 border border-emerald-500/30 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/5 overflow-hidden">
          {/* Output quantitative details */}
          <div className="p-6 md:col-span-1 border-r border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-4">
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 text-[10px] uppercase font-bold tracking-widest rounded inline-block font-mono">
              Latest Scored Result
            </span>
            <div>
              <span className="text-[11px] text-slate-400 block uppercase font-mono">Predicted Demand</span>
              <span className="text-4xl font-bold font-mono text-emerald-500 mt-1 block">
                {latestPrediction.predictedOrders} <span className="text-sm font-sans font-normal text-slate-500">Orders</span>
              </span>
            </div>
            <div>
              <span className="text-xs px-2.5 py-1 text-white bg-emerald-500 font-semibold rounded-full inline-block">
                {latestPrediction.demandLevel} Demand Tier
              </span>
            </div>
            <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <span className="font-semibold block text-slate-800 dark:text-slate-200 mb-0.5">Inventory Directive:</span>
              {latestPrediction.inventoryAction}
            </div>
          </div>

          {/* AI insights details */}
          <div className="p-6 md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-3.5">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Live Gemini AI Operations Advisory
              </span>
              <div className="space-y-2.5">
                {latestPrediction.aiInsights.map((insight, idx) => (
                  <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-emerald-500 font-mono shrink-0">0{idx + 1}.</span>
                    <p className="leading-relaxed font-mono">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-slate-200 dark:border-slate-800/60 pt-4 text-xs text-slate-400">
              <span className="font-mono">Week {latestPrediction.week} &middot; Meal Code {latestPrediction.mealId} &middot; Center {latestPrediction.centerId}</span>
              <button
                onClick={onNavigateToForecast}
                className="text-emerald-500 hover:text-emerald-600 font-semibold flex items-center gap-1 cursor-pointer"
              >
                Launch new scenario <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-slate-300 dark:border-slate-800 p-8 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-950/20">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-3 animate-pulse" />
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No predictions recorded for this session yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            Test custom prices and marketing ads to see machine learning outputs mapped instantly.
          </p>
          <button
            onClick={onNavigateToForecast}
            className="text-xs bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition"
          >
            Launch Demands Forecast Form
          </button>
        </div>
      )}

      {/* Real-Time Geolocation NGO Food Surplus demand Broker */}
      <div className="border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded inline-block font-mono">
                Sustainable Logistics
              </span>
              <span className="flex items-center gap-1 text-xs text-rose-500 font-bold font-mono">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                Live Compass
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <HeartHandshake className="w-4.5 h-4.5 text-emerald-500" />
              Zero-Waste NGO food availability & surplus demand broker
            </h4>
            <p className="text-xs text-slate-400">
              Synchronize physical warehouse GPS to calculate dynamic transit distances and dispatch surplus ingredients directly to local NGOs.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleTrackLocation}
              disabled={isTrackingLocation}
              className={`text-xs px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer select-none ${
                userCoords 
                  ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                  : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white shadow-sm"
              }`}
            >
              {isTrackingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Querying GPS...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  {userCoords ? "Position Synchronized" : "Verify Current Location"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Location Status Alerts */}
        {locationMessage && (
          <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-850 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <p className="text-slate-500 dark:text-slate-350">{locationMessage}</p>
            {userCoords && (
              <span className="ml-auto text-[10px] text-slate-450">
                Lat: {userCoords.latitude.toFixed(4)}, Lng: {userCoords.longitude.toFixed(4)}
              </span>
            )}
          </div>
        )}

        {/* Interactive Dispatch Dashboard splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Proximity NGO List Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block tracking-wider">
              1. Proximity Hunger Relief Partners
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ngos.map(ngo => {
                const isSelected = selectedNgoId === ngo.id;
                const distance = getDistanceToNgo(ngo);
                return (
                  <div
                    key={ngo.id}
                    onClick={() => setSelectedNgoId(ngo.id)}
                    className={`p-4 rounded-xl border transition cursor-pointer text-left space-y-2.5 select-none ${
                      isSelected 
                        ? "border-emerald-500 bg-emerald-500/5 shadow-sm"
                        : "border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/30 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {ngo.name}
                      </div>
                      <div className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                        <Navigation className="w-3 h-3 text-emerald-500 transform rotate-45" />
                        {distance}
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-slate-500 italic block">
                      Capacity: {ngo.capacityText}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {ngo.acceptsCategories.map(cat => (
                        <span key={cat} className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-sans text-slate-450">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-450 border-t border-slate-150 dark:border-slate-800/60 pt-2 font-mono">
                      <span>{ngo.contact}</span>
                      {isSelected && <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">Matched <Check className="w-3 h-3" /></span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allocation & dispatch Form Column */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-100/10 dark:bg-slate-950/20 space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block tracking-wider">
              2. Transfer Demand Forecast
            </span>

            <form onSubmit={handleDispatchSurplus} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-semibold uppercase text-slate-450 tracking-wide mb-1.5">
                  Designated Surplus Package Item
                </label>
                <select
                  value={donationMealName}
                  onChange={(e) => setDonationMealName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg p-2 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                >
                  <option value="Beverages">Beverages (Ginger Ale/Fruit Punch)</option>
                  <option value="Rice Bowl">Rice Bowl (Dal / Kashmir Rice)</option>
                  <option value="Sandwich">Sandwich (Club Wrap Surplus)</option>
                  <option value="Pizza">Pizza (Four-Cheese Sourdough)</option>
                  <option value="Burger">Burger (Crispy Avocado Patty)</option>
                  <option value="Pasta">Pasta (Pesto Capellini)</option>
                  <option value="Salad">Salad (Garden Feta Greens)</option>
                  <option value="Desert">Desert (Nutella Lava Cake)</option>
                  <option value="Starters">Starters (Mozzarella Sticks)</option>
                  <option value="Seafood">Seafood (Jumbo Garlic Prawns)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 mb-1">
                  <span>SURPLUS QUANTITY POOL</span>
                  <span className="font-bold text-emerald-500">{donationQty} Portions</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={donationQty}
                  onChange={(e) => setDonationQty(Number(e.target.value))}
                  className="w-full select-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[9px] text-slate-405 block -mt-1 font-mono">
                  {latestPrediction ? `*Autofilled 15% estimated buffer surplus` : `Configure leftover safe buffers`}
                </span>
              </div>

              {dispatchAlert && (
                <div className="bg-emerald-500/10 border border-emerald-505/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded text-[11px] font-semibold leading-normal">
                  {dispatchAlert}
                </div>
              )}

              <button
                type="submit"
                disabled={isDispatching}
                className="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold text-xs py-2.5 rounded-lg text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isDispatching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Transmitting Dispatch payload...
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5" />
                    Dispatch surplus demand
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Previous Transits Ledger list */}
        {dispatchLogs.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block tracking-wider">
              Zero-Waste Dispatch Ledger Logs (Active Session)
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] text-slate-500">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-widest border-b border-slate-150 dark:border-slate-800 pb-1 flex w-full justify-between">
                    <td className="w-1/6">Log ID</td>
                    <td className="w-1/5">Timestamp</td>
                    <td className="w-1/4">Recipient NGO</td>
                    <td className="w-1/5">Surplus Package Offered</td>
                    <td className="w-1/12 text-center">Quantities</td>
                    <td className="w-1/12 text-right">Status</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-805/40">
                  {dispatchLogs.map((log) => (
                    <tr key={log.id} className="py-2.5 flex w-full justify-between items-center hover:bg-slate-500/5 transition">
                      <td className="w-1/6 font-semibold text-slate-705 dark:text-slate-355">{log.id}</td>
                      <td className="w-1/5 text-slate-400">{log.timestamp}</td>
                      <td className="w-1/4 truncate text-slate-800 dark:text-slate-300 font-sans font-medium">{log.ngoName} ({log.distance})</td>
                      <td className="w-1/5">{log.mealName}</td>
                      <td className="w-1/12 text-center font-bold text-slate-750 dark:text-slate-205">{log.quantity} units</td>
                      <td className="w-1/12 text-right">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase inline-block ${
                          log.status === "Arrived" 
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-505" 
                            : "bg-emerald-500/15 text-emerald-500 animate-pulse"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Main Charts Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Weekly Demand Trend */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Weekly Demand Trend Curve
            </h4>
            <span className="text-[11px] text-slate-400 block font-mono">Continuous order demand average mapped over forecast index weeks</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800/30" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: "12px", background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Area type="monotone" dataKey="Orders" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Demand breakdown by cuisine */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-emerald-500" />
              Cuisine Market Share Aggregates
            </h4>
            <span className="text-[11px] text-slate-400 block font-mono">Consolidated predicted volume shares across regional product designs</span>
          </div>
          <div className="h-[250px] w-full flex flex-col sm:flex-row items-center justify-around">
            <div className="h-full w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cuisineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {cuisineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "12px", background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 shrink-0">
              {cuisineData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-sans text-slate-500">{entry.name}:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{entry.value.toLocaleString()} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Demand by category horizontal distribution */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              Category Demand Distributions
            </h4>
            <span className="text-[11px] text-slate-400 block font-mono">Volume breakdown ranking of standard culinary items</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800/30" />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} tickLine={false} width={80} />
                <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: "12px", background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="Orders" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Promo campaign impact index */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-500" />
              Marketing & Promotions Impact analysis
            </h4>
            <span className="text-[11px] text-slate-400 block font-mono">Comparing average demand yields of organic standard periods vs active ads</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={promoData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800/30" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: "12px", background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="AverageDemand" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {promoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
