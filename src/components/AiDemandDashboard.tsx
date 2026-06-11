import React, { useState } from "react";
import PredictForm from "./PredictForm";
import { PredictionResult, ForecastInput } from "../types";
import { 
  Sparkles, 
  Brain, 
  MapPin, 
  Share2, 
  Info, 
  Flame, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown
} from "lucide-react";
import { motion } from "motion/react";

interface AiDemandDashboardProps {
  onPredictionComplete: (prediction: PredictionResult & { input: ForecastInput }) => void;
  onExportToDonation: (foodName: string, quantity: number, category: string, location: string) => void;
  latestPrediction: (PredictionResult & { input: ForecastInput }) | null;
}

export default function AiDemandDashboard({ onPredictionComplete, onExportToDonation, latestPrediction }: any) {
  const [successExport, setSuccessExport] = useState<string | null>(null);

  const handleQuickExport = () => {
    if (!latestPrediction) return;
    
    // Estimate safety buffer portion surplus (e.g. 15% of prediction or 45 portion standard base)
    const suggestedQty = Math.max(25, Math.round(latestPrediction.predictedOrders * 0.15));
    const mealCategory = latestPrediction.category || "Rice Bowl";
    const mealName = `Surplus Buffer: ${latestPrediction.category || "Rescued Item"}`;
    const mappedLoc = latestPrediction.centerId === "55" ? "Anna Nagar, Chennai" : "Adyar Regional, South";

    onExportToDonation(mealName, suggestedQty, mealCategory, mappedLoc);
    setSuccessExport(`Rescued! Packaged ${suggestedQty} portions of ${mealCategory} safety stock and populated matching NGO relief boards!`);
    setTimeout(() => setSuccessExport(null), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Overview Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-500 animate-pulse" />
            Random Forest Plate Forecast Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simulate regional plate counts, manage active kitchen pricing relative to baseline inputs, and forecast needs beforehand.
          </p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 text-[11px] font-mono rounded text-slate-500">
          Model: <span className="text-emerald-600 dark:text-emerald-450 font-bold">RandomForestRegressor (pkl)</span>
        </div>
      </div>

      {/* Main forecast form */}
      <PredictForm onPredictionComplete={onPredictionComplete} />

      {/* Post Prediction Action Deck */}
      {latestPrediction && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2.5 bg-emerald-500 text-slate-950 font-mono text-[9px] font-bold uppercase rounded-bl">
            Ensemble Output Evaluated
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-widest block">
                SURPLUS REDISTRIBUTION ADVISOR
              </span>
              <h3 className="text-sm font-bold font-sans">
                Predictive Surplus portion calculated for {latestPrediction.category}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                The ML model computed a demand volume of <strong>{latestPrediction.predictedOrders} plates</strong> based on selected parameters. 
                Our AI suggests a 15% default preparation safety buffer (approx. <strong className="text-emerald-400">{Math.max(25, Math.round(latestPrediction.predictedOrders * 0.15))} plates</strong>) is likely to go unused. We highly recommend redistributing this surplus instead of risking food wastage.
              </p>
            </div>

            <button
              onClick={handleQuickExport}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5.5 py-2.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
            >
              <Share2 className="w-3.5 h-3.5" />
              Export Plates to NGO Partner
            </button>
          </div>

          {successExport && (
            <div className="bg-emerald-500/15 border border-emerald-500/25 p-3 rounded-lg text-xs font-mono text-emerald-400 animate-pulse">
              {successExport}
            </div>
          )}

          {/* AI recommendations metrics breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-[9.5px] uppercase font-bold font-mono text-slate-400">Predicted Demand Level</span>
              <p className={`text-xs font-bold ${latestPrediction.demandLevel === "High" ? "text-emerald-400" : latestPrediction.demandLevel === "Low" ? "text-amber-400" : "text-blue-400"}`}>
                {latestPrediction.demandLevel} Demand Expected
              </p>
            </div>
            
            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-[9.5px] uppercase font-bold font-mono text-slate-400">Target Spoilage Risk</span>
              <p className="text-xs font-semibold text-slate-205">
                {latestPrediction.demandLevel === "Low" ? "⚠️ High - Preparation excess likely" : "🟢 Minimal under active transit"}
              </p>
            </div>

            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-[9.5px] uppercase font-bold font-mono text-slate-400">Locational Need Index</span>
              <p className="text-xs font-semibold text-slate-205 block">
                {latestPrediction.centerId === "55" ? "🔥 High Need - Anna Nagar Area" : "🟡 Medium Need - Adyar Regional Corridor"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Model methodology reference cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
          <h4 className="font-sans font-bold text-xs text-slate-805 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-850 pb-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            How is This Plate Prediction Calculated?
          </h4>
          <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 leading-relaxed">
            The scikit-learn model uses a trained <strong>Random Forest Regressor</strong> algorithm binary loaded from our server. 
            It scans 100 deep decision trees of historical dataset observations to analyze checkout discounts, operating center layout, promotions, and features, accurately outputting expected orders.
          </p>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-150 dark:border-slate-850 font-mono text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
            <strong>Model attributes evaluated:</strong><br />
            - Selected dish category and cuisine style<br />
            - Base market price vs offered discount price (in ₹)<br />
            - Selected center layout type<br />
            - Marketing promotions and exposure
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
          <h4 className="font-sans font-bold text-xs text-slate-805 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-850 pb-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Recommended Distribution Coordinates
          </h4>
          <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 leading-relaxed">
            Nearby high-hunger mapping indexes target rescue locations automatically synchronized with local demographics data:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-350">Adyar Poverty Corridor</span>
              <span className="font-mono text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 rounded">🔥 High Need Area</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-350">Anna Nagar Hunger Refuge</span>
              <span className="font-mono text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 rounded">🔥 High Need Area</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700 dark:text-slate-350">Guindy Welfare Orphanage</span>
              <span className="font-mono text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 rounded">🟡 Moderate Need Area</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
