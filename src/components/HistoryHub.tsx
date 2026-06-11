import React, { useState } from "react";
import { PredictionHistoryRecord } from "../types";
import { MEAL_OPTIONS } from "../constants";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  Download, 
  Info, 
  Eye,
  Trash2,
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock
} from "lucide-react";

interface HistoryHubProps {
  history: PredictionHistoryRecord[];
  onSelectRecord: (record: PredictionHistoryRecord) => void;
  onClearHistory?: () => void;
}

export default function HistoryHub({ history, onSelectRecord, onClearHistory }: HistoryHubProps) {
  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDemand, setSelectedDemand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  // Fetch human readable meal names from constants ID map
  const getMealName = (mealId: string) => {
    const meal = MEAL_OPTIONS.find(m => m.id === mealId);
    return meal ? meal.name : `Meal Code ${mealId}`;
  };

  // Filter & Sort math
  const filteredHistory = history
    .filter((record) => {
      const mealName = getMealName(record.mealId).toLowerCase();
      const category = record.category.toLowerCase();
      const cuisine = record.cuisine.toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = 
        mealName.includes(query) || 
        record.mealId.includes(query) || 
        category.includes(query) || 
        cuisine.includes(query);

      const matchesDemand = selectedDemand === "All" || record.demandLevel === selectedDemand;
      const matchesCategory = selectedCategory === "All" || record.category === selectedCategory;

      return matchesSearch && matchesDemand && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "highest") {
        return b.predictedOrders - a.predictedOrders;
      }
      if (sortBy === "lowest") {
        return a.predictedOrders - b.predictedOrders;
      }
      return 0;
    });

  // Export ledger to standard JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `foodsense_predictions_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Left search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 md:w-4.5 h-4 md:h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search meal, category, cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-emerald-500 font-sans text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Right Filters drop dropdowns */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-start md:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold font-mono uppercase shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Filter parameters:
            </div>

            {/* Demand Tier */}
            <select
              value={selectedDemand}
              onChange={(e) => setSelectedDemand(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 rounded-lg p-2 text-xs outline-none cursor-pointer"
            >
              <option value="All">All Demand Tiers</option>
              <option value="High">High Demand Only</option>
              <option value="Medium">Medium Demand Only</option>
              <option value="Low">Low Demand Only</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 rounded-lg p-2 text-xs outline-none cursor-pointer"
            >
              <option value="newest">Newest Scenarios First</option>
              <option value="oldest">Oldest Scenarios First</option>
              <option value="highest">Highest Predicted Volume</option>
              <option value="lowest">Lowest Predicted Volume</option>
            </select>

            <button
              onClick={handleExportJSON}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer ml-auto md:ml-0"
              title="Download full JSON transaction ledger"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Grid Ledger Table Card */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-4 px-6">Timestamp / Week</th>
                <th className="py-4 px-6">Meal Details</th>
                <th className="py-4 px-6 text-center">Center Metrics</th>
                <th className="py-4 px-6 text-right">Effective Pricing</th>
                <th className="py-4 px-6 text-center">Forecast Volume</th>
                <th className="py-4 px-6 text-center">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-805/50 text-sm">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record) => {
                  const isHigh = record.demandLevel === "High";
                  const isLow = record.demandLevel === "Low";
                  const isPromoActive = record.emailPromotion || record.homepageFeatured;

                  return (
                    <tr 
                      key={record.id} 
                      className="hover:bg-slate-500/5 transition cursor-pointer"
                      onClick={() => onSelectRecord(record)}
                    >
                      {/* Date & Week */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 font-sans font-semibold text-slate-800 dark:text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          Forecast Week: {record.week}
                        </span>
                      </td>

                      {/* Meal Description */}
                      <td className="py-4 px-6">
                        <div className="font-sans font-semibold text-slate-850 dark:text-slate-100">
                          {getMealName(record.mealId)}
                        </div>
                        <div className="text-[11px] text-slate-405 font-mono">
                          Meal #{record.mealId} &middot; {record.category} &middot; {record.cuisine} style
                        </div>
                      </td>

                      {/* Center Info */}
                      <td className="py-4 px-6 text-center">
                        <span className="font-mono text-slate-800 dark:text-slate-300 font-bold">
                          Center #{record.centerId}
                        </span>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {record.centerType} &middot; {record.operationalArea}K m²
                        </div>
                      </td>

                      {/* Pricing elasticity */}
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                          ${record.checkoutPrice.toFixed(1)}
                        </span>
                        <div className="text-[10px] text-slate-400 block font-mono">
                          Base: ${record.basePrice.toFixed(1)}
                        </div>
                        {isPromoActive && (
                          <span className="text-[9px] bg-emerald-500/15 text-emerald-500 font-mono px-1 rounded inline-block mt-0.5">
                            Promo Active
                          </span>
                        )}
                      </td>

                      {/* Forecast Orders */}
                      <td className="py-4 px-6 text-center">
                        <span className={`text-base font-bold font-mono ${isHigh ? "text-emerald-500" : isLow ? "text-amber-500" : "text-blue-500"}`}>
                          {record.predictedOrders}
                        </span>
                        <div className="text-[10px] text-slate-400 block font-sans">
                          orders expected
                        </div>
                      </td>

                      {/* Tier level and examine button */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-between gap-4">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            isHigh 
                              ? "bg-emerald-500/10 text-emerald-500" 
                              : isLow 
                                ? "bg-amber-500/10 text-amber-500" 
                                : "bg-blue-500/10 text-blue-500"
                          }`}>
                            {record.demandLevel} Demand
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRecord(record);
                            }}
                            className="text-slate-400 hover:text-emerald-500 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                            title="Inspect complete details and AI recommendations"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-slate-400 text-sm">
                    No matching prediction history found. Learn metrics by filling out the forecast scenario parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* History statistics bar */}
        <div className="bg-slate-50/50 dark:bg-slate-950/20 px-6 py-3.5 border-t border-slate-150 dark:border-slate-800 text-xs text-slate-500 flex justify-between items-center font-mono">
          <span>Displaying {filteredHistory.length} of {history.length} records</span>
          {onClearHistory && history.length > 5 && (
            <button
              onClick={() => {
                if(window.confirm("Restore dashboard? This reverts simulated history logs to default seed records.")) {
                  onClearHistory();
                }
              }}
              className="text-rose-500 hover:text-rose-600 font-semibold cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Revert Seeds
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
