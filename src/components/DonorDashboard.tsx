import React, { useState } from "react";
import { DonationRecord } from "../types";
import { 
  HeartHandshake, 
  Plus, 
  Trash2, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building, 
  Sparkles, 
  FileText, 
  Activity, 
  TrendingUp, 
  Globe, 
  Users, 
  Phone
} from "lucide-react";
import { motion } from "motion/react";

interface DonorDashboardProps {
  donations: DonationRecord[];
  onAddDonation: (donation: Omit<DonationRecord, "id" | "timestamp" | "status" | "co2Saved">) => void;
  onDeleteDonation?: (id: string) => void;
  onSimulateStatus: (id: string) => void;
}

export default function DonorDashboard({ donations, onAddDonation, onDeleteDonation, onSimulateStatus }: DonorDashboardProps) {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState<number>(35);
  const [foodType, setFoodType] = useState("Vegetarian Meals");
  const [expiryTime, setExpiryTime] = useState("4 Hours");
  const [location, setLocation] = useState("Anna Nagar, Chennai");
  const [contact, setContact] = useState("+91 98402 12345");
  const [mockImageUrl, setMockImageUrl] = useState("");
  const [formAlert, setFormAlert] = useState<string | null>(null);

  // Stats calculation
  const totalPortions = donations.reduce((acc, curr) => acc + curr.quantity, 0) + 1240; // baseline seed + dynamic
  const ngoConnected = 12;
  const peopleFed = Math.round(totalPortions * 1.2);
  const co2Reduced = Math.round(totalPortions * 0.45); // kg of CO2 saved (approx 0.45 kg per portion of food waste rescued)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || quantity <= 0 || !location || !contact) {
      setFormAlert("Please complete all mandatory donor parameters.");
      return;
    }

    onAddDonation({
      foodName,
      quantity,
      foodType,
      expiryTime: `Expires in ${expiryTime}`,
      location,
      contact,
      image: mockImageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60"
    });

    setFoodName("");
    setFormAlert("Rescued surplus posted instantly to matching nearby NGOs nearby!");
    setTimeout(() => {
      setFormAlert(null);
    }, 5000);
  };

  const handleImagePlaceholder = () => {
    setMockImageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60");
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-emerald-500" />
            Surplus Food Donor Portal
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Reseal edible surplus inventory instantly, trace active logistics transits, and track carbon metrics.
          </p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-350 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
          Donor Badge: <span className="text-emerald-500 font-bold">Premium Enterprise</span>
        </div>
      </div>

      {/* Stats Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-250/70 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider block">Total Food Saved</span>
          <h3 className="text-2xl font-bold text-slate-850 dark:text-neutral-50 tracking-tight font-mono">{totalPortions} <span className="text-xs text-slate-500 font-sans">portions</span></h3>
          <p className="text-[11px] text-slate-500">RESISTED FROM FILLING MUNICIPAL LANDFILLS</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-250/70 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Building className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider block">Active NGO Partners</span>
          <h3 className="text-2xl font-bold text-slate-850 dark:text-neutral-50 tracking-tight font-mono">{ngoConnected} <span className="text-xs text-slate-500 font-sans">verified</span></h3>
          <p className="text-[11px] text-slate-500">INSTANT DISPATCH DISSEMINATION GRID</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-250/70 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider block">Est. People Fed</span>
          <h3 className="text-2xl font-bold text-slate-850 dark:text-neutral-50 tracking-tight font-mono">{peopleFed} <span className="text-xs text-slate-500 font-sans">meals</span></h3>
          <p className="text-[11px] text-slate-500">NURTURING MARGINALIZED COMMUNITIES</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-250/70 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Globe className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider block">CO₂ Rescued</span>
          <h3 className="text-2xl font-bold text-slate-850 dark:text-neutral-50 tracking-tight font-mono">{co2Reduced} <span className="text-xs text-slate-500 font-sans">kg CO₂e</span></h3>
          <p className="text-[11px] text-slate-500">OFFSETTING HARMFUL GREENHOUSE EMISSIONS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column: Add food form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-250 md:border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850 pb-3">
              <Plus className="w-5 h-5 text-emerald-500" />
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide font-sans">
                Post Edible Surplus
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Food Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Veg Meals, কাশ্মীর Rice"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Surplus Quantities
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Rescued Food Category
                  </label>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-xs outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200 font-sans"
                  >
                    <option value="Veg Meals">Vegetarian Meals</option>
                    <option value="Non-Veg Meals">Non-Vegetarian Meals</option>
                    <option value="Packed Snacks">Packed Snacks / Breads</option>
                    <option value="Raw Materials">Raw Vegetables & Curries</option>
                    <option value="Beverages">Liquid Refreshments</option>
                    <option value="Desert Candy">Baker Desserts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Expiry Threshold
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4 Hours / Tonight"
                    value={expiryTime}
                    onChange={(e) => setExpiryTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Donor Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Anna Nagar, Chennai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Contact Coordinates
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98402 xxxxx"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Visual Food Image URL (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleImagePlaceholder}
                    className="text-[10px] text-emerald-500 font-mono font-semibold hover:underline"
                  >
                    Use Sample Image
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={mockImageUrl}
                  onChange={(e) => setMockImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-2.5 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              {formAlert && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-xs font-medium">
                  {formAlert}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-xs py-2.8 rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Post & Match NGO Surplus
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Track active donations and simulation updates */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 dark:border-slate-850 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide font-sans flex items-center gap-1.5">
                  <Truck className="w-4.5 h-4.5 text-emerald-500" />
                  Live Redistribution & Pickup Status Ledger
                </h3>
                <p className="text-[11px] text-slate-400">
                  Rescued batches listed below. Interact using the actions button to simulate physical transit checkpoints.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {donations.length > 0 ? (
                donations.map((donation) => {
                  let statusColor = "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700";
                  if (donation.status === "NGO Assigned") {
                    statusColor = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
                  } else if (donation.status === "En-Route") {
                    statusColor = "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse";
                  } else if (donation.status === "Arrived") {
                    statusColor = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30";
                  }

                  return (
                    <motion.div
                      layout
                      key={donation.id}
                      className="p-4 border border-slate-200 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/20 rounded-xl space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-slate-150 dark:border-slate-850/60 pb-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-2 py-0.5 text-slate-450 rounded font-mono font-bold uppercase">
                            BATCH ID: {donation.id}
                          </span>
                          <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 mt-1">
                            {donation.foodName} &middot; <span className="text-emerald-500">{donation.quantity} Portions</span>
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Category: {donation.foodType}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded inline-block font-mono ${statusColor}`}>
                          {donation.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-550 dark:text-slate-350">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{donation.location}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{donation.expiryTime}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{donation.contact}</span>
                        </div>
                      </div>

                      {donation.assignedNgo && (
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/65 text-xs text-slate-550 dark:text-slate-350 flex items-center gap-2">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-bold uppercase font-mono">Rescuer Matched</span>
                          <span className="font-semibold">{donation.assignedNgo}</span>
                          {donation.distance && <span className="font-mono text-slate-400 ml-auto">{donation.distance} away</span>}
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap gap-2 justify-end items-center border-t border-slate-150 dark:border-slate-850/40">
                        <button
                          onClick={() => onSimulateStatus(donation.id)}
                          disabled={donation.status === "Arrived"}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            donation.status === "Arrived"
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                              : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          {donation.status === "Unassigned" && "Match Best NGO"}
                          {donation.status === "NGO Assigned" && "Simulate Dispatch Courier"}
                          {donation.status === "En-Route" && "Simulate Safe Cargo Arrival"}
                          {donation.status === "Arrived" && "Safe Rescued Delivery Lock"}
                        </button>
                        
                        {onDeleteDonation && (
                          <button
                            onClick={() => onDeleteDonation(donation.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                            title="Recall donation batch"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-medium">No live active rescued batches posted</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Edible surpluses posted via the left form will register instantly in nearby NGO databases.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
