import React, { useState, useEffect } from "react";
import { 
  MEAL_OPTIONS, 
  CENTER_IDS, 
  CENTER_TYPES, 
  CITY_REGION_MAPPING,
  CATEGORIES,
  CUISINES
} from "../constants";
import { ForecastInput, PredictionResult } from "../types";
import { 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Compass, 
  Calendar, 
  UtensilsCrossed,
  BrainCircuit,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface PredictFormProps {
  onPredictionComplete: (prediction: PredictionResult & { input: ForecastInput }) => void;
}

const LOADING_STEPS = [
  "Contacting FoodSense prediction hub...",
  "Running Random Forest Regressor engine...",
  "Evaluating seasonal demands for Chennai hubs...",
  "Applying local region multipliers...",
  "Finalizing predicted plate counts..."
];

export default function PredictForm({ onPredictionComplete }: PredictFormProps) {
  // Inputs state
  const [selectedMealId, setSelectedMealId] = useState("1062");
  const [selectedCenterId, setSelectedCenterId] = useState("55");
  const [week, setWeek] = useState(112);
  const [checkoutPrice, setCheckoutPrice] = useState(135.5);
  const [basePrice, setBasePrice] = useState(145.0);
  const [emailPromotion, setEmailPromotion] = useState(true);
  const [homepageFeatured, setHomepageFeatured] = useState(false);
  const [cityCode, setCityCode] = useState("647");
  const [regionCode, setRegionCode] = useState("56");
  const [operationalArea, setOperationalArea] = useState(4.5);
  const [category, setCategory] = useState("Beverages");
  const [cuisine, setCuisine] = useState("Thai");
  const [centerType, setCenterType] = useState("TYPE_A");

  // UX states
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [successInfo, setSuccessInfo] = useState<any>(null);

  // Sync inputs when Meal ID changes
  useEffect(() => {
    const meal = MEAL_OPTIONS.find(m => m.id === selectedMealId);
    if (meal) {
      setCategory(meal.category);
      setCuisine(meal.cuisine);
      setBasePrice(meal.defaultBasePrice);
      // Give a slight default checkout discount
      setCheckoutPrice(Math.round(meal.defaultBasePrice * 0.95 * 10) / 10);
    }
  }, [selectedMealId]);

  // Sync inputs when Center ID changes
  useEffect(() => {
    const mapping = CITY_REGION_MAPPING[selectedCenterId];
    if (mapping) {
      setCityCode(mapping.cityCode);
      setRegionCode(mapping.regionCode);
      setOperationalArea(mapping.defaultArea);
    }
  }, [selectedCenterId]);

  // Rotate loading step texts during submission
  useEffect(() => {
    let interval: any;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => {
          if (prev < LOADING_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 730);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setSuccessInfo(null);

    // Baseline validation
    if (checkoutPrice <= 0 || basePrice <= 0) {
      setValidationError("Prices must be greater than zero in ₹.");
      return;
    }
    if (week < 1 || week > 145) {
      setValidationError("Forecast Week index must operate within bounds [1 to 145].");
      return;
    }

    setIsSubmitting(true);

    const inputData: ForecastInput = {
      week,
      centerId: selectedCenterId,
      mealId: selectedMealId,
      checkoutPrice,
      basePrice,
      emailPromotion,
      homepageFeatured,
      cityCode,
      regionCode,
      operationalArea,
      category,
      cuisine,
      centerType,
    };

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error("Prediction API failed to calculate demand results.");
      }

      const results = await response.json();

      // For premium interactive visual transition
      await new Promise((res) => setTimeout(res, 2000));

      // Append record onto history database in the background
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inputData,
          predictedOrders: results.predicted_orders,
          demandLevel: results.demand_level,
          inventoryAction: results.inventory_action,
          aiInsights: results.ai_insights
        })
      });

      setSuccessInfo(results);
      onPredictionComplete({
        ...results,
        input: inputData
      });
    } catch (err: any) {
      setValidationError(err.message || "An unexpected algorithm error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMeal = MEAL_OPTIONS.find(m => m.id === selectedMealId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold font-sans tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
          Predictive Plates Demand Forecasting
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          This AI module predicts the exact number of food plates / meals demanded by community centers in advance, helping chefs cook exactly enough and avoid wasting surplus food!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Parameters Form Card */}
        <div className="lg:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-5 py-3 flex items-center justify-between">
            <span className="font-sans text-xs font-bold text-slate-705 dark:text-slate-300">
              Set Forecast Parameters
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 rounded font-bold">
              Random Forest Regressor pkl
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Core user parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Select Meal */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Select Indian Food Item
                </label>
                <div className="relative">
                  <select
                    value={selectedMealId}
                    onChange={(e) => setSelectedMealId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    {MEAL_OPTIONS.map((meal) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.name} (Code #{meal.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Select Center */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Operating Center & Kitchen
                </label>
                <select
                  value={selectedCenterId}
                  onChange={(e) => setSelectedCenterId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                >
                  {CENTER_IDS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Context Summary Grid */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 grid grid-cols-3 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Type</span>
                <span className="text-slate-705 dark:text-slate-300 font-bold mt-0.5 block">
                  {category}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Cuisine Style</span>
                <span className="text-slate-705 dark:text-slate-300 font-bold mt-0.5 block">
                  {cuisine}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Operation Mode</span>
                <span className="text-slate-705 dark:text-slate-300 font-bold mt-0.5 block">
                  {centerType === "TYPE_A" ? "Large Kitchen" : centerType === "TYPE_B" ? "Cloud Kitchen" : "Fast Depot"}
                </span>
              </div>
            </div>

            {/* Prices in Indian Rupees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Base Price / Market Rate (₹ Price)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step="1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-7 pr-3 text-xs outline-none focus:border-emerald-500 font-semibold text-slate-850 dark:text-slate-200"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Value of a standard premium serving.</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Offered Checkout Price (₹ Discount Rate)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step="1"
                    value={checkoutPrice}
                    onChange={(e) => setCheckoutPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-7 pr-3 text-xs outline-none focus:border-emerald-500 font-semibold text-slate-850 dark:text-slate-200"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Effective price paid by matching beneficiaries/buyers.</span>
              </div>
            </div>

            {/* Price ratio warnings */}
            {checkoutPrice < basePrice * 0.7 && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-2.5 rounded-xl flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">High Elastic Discount Detected</span>
                  Checkout price is listed at {Math.round((1 - checkoutPrice/basePrice)*100)}% discount. This generates high order demand but creates margin pressure.
                </div>
              </div>
            )}

            {/* Marketing promotions checkbox line */}
            <div className="bg-slate-50/50 dark:bg-slate-955/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40 space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={emailPromotion}
                  onChange={(e) => setEmailPromotion(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded text-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-805 dark:text-slate-204 block">
                    Active Email Promotion Campaign
                  </span>
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Trigger announcement of food availability to volunteer & NGO pools.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={homepageFeatured}
                  onChange={(e) => setHomepageFeatured(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded text-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-805 dark:text-slate-204 block">
                    Homepage Featured Exposure
                  </span>
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Highlight this meal at the top of the mobile order portal for immediate pickup visibility.
                  </span>
                </div>
              </label>
            </div>

            {/* COLLAPSIBLE ADVANCED PARAMETERS SECTION */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/25 dark:bg-slate-955/20">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/40 transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Advanced Parameters (Calculated Automatically)</span>
                </div>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showAdvanced && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 animate-in fade-in duration-200 bg-white dark:bg-slate-955/40">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Forecast Target Week Code
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="145"
                      value={week}
                      onChange={(e) => setWeek(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2 text-xs outline-none font-mono text-slate-800 dark:text-slate-200"
                    />
                    <span className="text-[9px] text-slate-400 mt-0.5 block">Index parameter (1-145).</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Kitchen Operational Size Area
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={operationalArea}
                      onChange={(e) => setOperationalArea(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2 text-xs outline-none font-mono text-slate-800 dark:text-slate-200"
                    />
                    <span className="text-[9px] text-slate-400 mt-0.5 block">Regional range in K m².</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      City Code ID
                    </label>
                    <input
                      type="text"
                      disabled
                      value={cityCode}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Region Code ID
                    </label>
                    <input
                      type="text"
                      disabled
                      value={regionCode}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>

            {validationError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-2.5 rounded-lg text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {validationError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all transform active:scale-95 disabled:scale-100 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-white" />
                  Analyzing Seasonal Dataset...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Predict Plate Orders Demand
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Operational Constraints Guidance */}
        <div className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm">
            <h3 className="font-sans font-bold text-xs text-slate-805 dark:text-slate-100 mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-500" />
              Machine Learning Range Bounds
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Our Random Forest model evaluates prices, discount ratios, and local factors against Indian datasets:
            </p>
            <ul className="space-y-3 text-[11px]">
              <li className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <span className="text-slate-500">Checkout Price</span>
                <span className="font-mono text-slate-705 dark:text-slate-350">₹{checkoutPrice.toFixed(0)} <span className="text-emerald-500 font-bold">(Elastic)</span></span>
              </li>
              <li className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <span className="text-slate-500">Base rate benchmark</span>
                <span className="font-mono text-slate-705 dark:text-slate-350">₹{basePrice.toFixed(0)}</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <span className="text-slate-500">Discount Ratio</span>
                <span className="font-mono text-slate-705 dark:text-slate-350">
                  {(basePrice / Math.max(1, checkoutPrice)).toFixed(1)}x
                </span>
              </li>
              <li className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <span className="text-slate-500">Operational Size</span>
                <span className="font-mono text-slate-705 dark:text-slate-350">{operationalArea} K m²</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-500">Dish Category</span>
                <span className="font-sans font-bold text-indigo-505 text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded">
                  {category} / {cuisine}
                </span>
              </li>
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/20 rounded-2xl p-5">
            <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 font-mono">
              // HOW DOES THIS PREDICTOR HELP?
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              When you adjust the pricing or select dishes, the Random Forest model on the backend scans 100 decision trees to estimate demand.
              By matching production with forecasts, our kitchens ensure there are no stockouts, and any potential surplus is highlighted for donation instantly!
            </p>
          </div>
        </div>
      </div>

      {/* Full Screen Interactive Loader */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Spinning decorative background layout */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 blur-3xl pointer-events-none" />

            {/* Glowing core indicator */}
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-pulse">
              <BrainCircuit className="w-8 h-8 text-white animate-spin" style={{ animationDuration: "3s" }} />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white tracking-tight">Consulting Random Forest Regressor</h4>
              <p className="text-[11px] text-slate-400 font-mono">
                Calculating Kolkata/Chennai Plate Forecast &middot; ID {selectedMealId}
              </p>
            </div>

            {/* Dynamic loading steps visualizer */}
            <div className="bg-slate-950/85 border border-slate-800 rounded-xl p-4 min-h-[60px] flex items-center justify-center text-center">
              <p className="text-xs text-emerald-400 font-mono leading-relaxed animate-pulse">
                {LOADING_STEPS[loadingStepIndex]}
              </p>
            </div>

            <div className="flex justify-center gap-1">
              {LOADING_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i <= loadingStepIndex ? "bg-emerald-500" : "bg-slate-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
