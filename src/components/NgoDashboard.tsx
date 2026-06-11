import React, { useState } from "react";
import { DonationRecord } from "../types";
import { 
  Building, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  AlertTriangle, 
  Navigation, 
  Bell, 
  Truck, 
  Award, 
  Compass, 
  Calendar, 
  Phone
} from "lucide-react";
import { motion } from "motion/react";

interface NgoDashboardProps {
  donations: DonationRecord[];
  onAcceptDonation: (id: string, ngoName: string) => void;
  onRejectDonation?: (id: string) => void;
  onSchedulePickup: (id: string, timeSlot: string) => void;
}

export default function NgoDashboard({ donations, onAcceptDonation, onSchedulePickup, onRejectDonation }: NgoDashboardProps) {
  const [selectedRouteDonation, setSelectedRouteDonation] = useState<DonationRecord | null>(null);
  const [scheduleModalDonation, setScheduleModalDonation] = useState<DonationRecord | null>(null);
  const [scheduledSlot, setScheduledSlot] = useState("Immediate Pickup (Next 30 mins)");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter donations available to NGOs (Status matches Unassigned or NGO Assigned to this demo dashboard)
  const availableSurplus = donations.filter(d => d.status === "Unassigned" || d.assignedNgo);

  const handlePickRoute = (donation: DonationRecord) => {
    setSelectedRouteDonation(donation);
    triggerToast(`Optimized delivery route calculated for ${donation.foodName}!`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApplySchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleModalDonation) return;

    onSchedulePickup(scheduleModalDonation.id, scheduledSlot);
    triggerToast(`Pickup schedule locked in: ${scheduledSlot}`);
    setScheduleModalDonation(null);
  };

  const currentNgoName = "Care-Share Community Kitchens (NGO)";

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-850 dark:bg-slate-950 dark:border-slate-800 text-xs text-white p-4.5 rounded-xl shadow-2xl z-50 animate-bounce flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-500 animate-swing" />
          <span className="font-sans font-semibold text-slate-200">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-emerald-500" />
            NGO & Hunger Relief Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Accept upcoming community surplus, map GPS pickup routes, and manage food collection commitments.
          </p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 uppercase tracking-wide">
          <Award className="w-4 h-4" />
          Guardian Kitchen Access
        </div>
      </div>

      {/* Expiry alerts and Notification panel */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-amber-400 uppercase tracking-widest font-mono">
              ⚡ LIVE EXPIRY CRITICAL ALERT WINDOW
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-0.5">
              Available surplus portions of <strong>Citrus Iced Mint Tea</strong> index expires in 1.8 hours! Pickup coordinate locks recommended immediately to prevent waste.
            </p>
          </div>
        </div>
        <button 
          onClick={() => triggerToast("Acquired live sensor tracking on expiring food surplus.")}
          className="bg-amber-500 hover:bg-amber-600 font-semibold text-xs text-slate-950 px-3.5 py-2 rounded-lg cursor-pointer transition shrink-0 uppercase tracking-wide font-sans block"
        >
          Check Expiry
        </button>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Available Donations Near Me list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider block">
              1. Available Surplus Food Nearby
            </span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded font-mono text-slate-450 uppercase">
              Current NGO: Care-Share Community
            </span>
          </div>

          <div className="space-y-4">
            {availableSurplus.length > 0 ? (
              availableSurplus.map((donation) => {
                const isAcceptedByMe = donation.assignedNgo === currentNgoName;
                const isAcceptedByOther = donation.assignedNgo && donation.assignedNgo !== currentNgoName;

                return (
                  <div
                    key={donation.id}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-4 transition ${
                      isAcceptedByMe 
                        ? "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/5" 
                        : "border-slate-250/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                            BATCH #{donation.id}
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded uppercase font-sans">
                            {donation.foodType}
                          </span>
                          {donation.status === "Arrived" && (
                            <span className="text-[9.5px] bg-emerald-100 text-emerald-600 px-2 rounded-full font-bold">Arrived Securely</span>
                          )}
                        </div>
                        <h4 className="font-sans font-bold text-sm text-slate-805 dark:text-neutral-50 mt-1 flex items-center gap-2">
                          {donation.foodName}
                          <span className="text-emerald-505 dark:text-emerald-400 text-xs">({donation.quantity} Portions Rescued)</span>
                        </h4>
                      </div>

                      {/* Distance */}
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg shrink-0 border border-slate-150 dark:border-slate-800/50">
                        <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{donation.distance || "1.2 km"} away</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-450 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-lg font-sans">
                      <span className="font-bold">Locational Address:</span> {donation.location}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1 font-mono text-slate-400">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span>Shelf Life: {donation.expiryTime}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-slate-400">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span>Donor line: {donation.contact}</span>
                      </div>
                    </div>

                    {/* Image preview */}
                    {donation.image && (
                      <div className="relative h-28 rounded-xl overflow-hidden border border-slate-150 dark:border-slate-800">
                        <img 
                          src={donation.image} 
                          alt={donation.foodName} 
                          className="w-full h-full object-cover filter brightness-90 hover:brightness-100 transition"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-2 items-center justify-between">
                      <div>
                        {isAcceptedByMe && (
                          <span className="text-xs text-emerald-500 font-bold font-sans flex items-center gap-1">
                            <Check className="w-4 h-4" /> Matched to Care-Share Community Kitchens
                          </span>
                        )}
                        {isAcceptedByOther && (
                          <span className="text-xs text-slate-450 italic font-mono flex items-center gap-1">
                            Claimed by partner: {donation.assignedNgo}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {/* ACCEPT TRIGGER */}
                        {!donation.assignedNgo ? (
                          <>
                            <button
                              onClick={() => {
                                onAcceptDonation(donation.id, currentNgoName);
                                triggerToast(`Rescued: Assigned batch #${donation.id} directly to your NGO!`);
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Accept donation
                            </button>
                            {onRejectDonation && (
                              <button
                                onClick={() => onRejectDonation(donation.id)}
                                className="border border-slate-205 dark:border-slate-850 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 px-2 py-2 rounded-lg transition"
                                title="Pass/Decline notification"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        ) : null}

                        {isAcceptedByMe && (
                          <>
                            <button
                              onClick={() => setScheduleModalDonation(donation)}
                              className="bg-slate-900 border border-slate-800 hover:bg-slate-850 dark:bg-white dark:text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition flex items-center gap-1"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              Schedule pickup
                            </button>

                            <button
                              onClick={() => handlePickRoute(donation)}
                              className="border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-500 dark:text-slate-200 font-bold text-xs px-3.5 py-2 rounded-lg transition overflow-hidden"
                            >
                              Route optimized
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-slate-100/40 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-xl p-8 text-center text-slate-400">
                <Building className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                <p className="text-sm font-semibold">No active surplus matching available right now</p>
                <p className="text-xs text-slate-455 max-w-xs mx-auto">
                  When food donors post leftovers or exports from prediction scenario histories occur, they will list instantly in this ledger.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Google Maps optimized routing simulation */}
        <div className="space-y-6">
          <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider block">
            2. High-Tech Route optimization compass
          </span>

          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850 pb-2">
              <Compass className="w-5 h-5 text-emerald-500" />
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Google Directions Optimizer (Simulated)
              </h4>
            </div>

            {selectedRouteDonation ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wide">Target Rescued Package:</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-neutral-50">{selectedRouteDonation.foodName}</p>
                  <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" /> {selectedRouteDonation.location}
                  </p>
                </div>

                {/* Routing Steps */}
                <div className="space-y-2 border-l-2 border-dashed border-emerald-500 pl-4 py-1 ml-2 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="font-bold text-slate-800 dark:text-slate-200">Point A: Central Kitchen Hub (Start)</p>
                    <p className="text-[10px] text-slate-500 font-mono">Load coordinates checklist and verify cold-lock storage.</p>
                  </div>
                  <div className="relative pt-2">
                    <span className="absolute -left-[21px] top-[10px] w-2 h-2 rounded-full bg-blue-500" />
                    <p className="font-bold text-slate-800 dark:text-slate-200">Via Bypass Core Corridor (Transit)</p>
                    <p className="text-[10px] text-slate-500 font-mono">Avoid highway construction. Net optimal ETA: 9 minutes.</p>
                  </div>
                  <div className="relative pt-2">
                    <span className="absolute -left-[21px] top-[10px] w-2 h-2 rounded-full bg-red-500" />
                    <p className="font-bold text-slate-800 dark:text-slate-200">Point B: {selectedRouteDonation.location}</p>
                    <p className="text-[10px] text-slate-400 font-sans">Reach donor coordinates directly to hand off food packages.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-emerald-400 border border-slate-800 space-y-1">
                  <p className="font-bold">// DYNAMIC DISPATCH ROUTING LOCK</p>
                  <p className="text-[11px]">Calculated Distance: {selectedRouteDonation.distance || "1.2 km"}</p>
                  <p className="text-[11px]">Carbon Saved Offset: {(selectedRouteDonation.quantity * 0.45).toFixed(1)} kg CO₂e</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs text-slate-500 space-y-2">
                <Navigation className="w-8 h-8 text-slate-350 mx-auto transform rotate-45" />
                <p className="font-medium">Directions engine inactive</p>
                <p className="text-[11.5px] text-slate-450">
                  Select a matched surplus batch's "Route Optimized" button to load dynamic driving directions across Bay Area checkpoints.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Schedule Picker Modal */}
      {scheduleModalDonation && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider font-sans">
              Schedule Surplus Food Pickup Route
            </h3>
            <p className="text-xs text-slate-500">
              Select a designated collection window to coordinates cargo handling for:
              <br />
              <strong className="text-slate-800 dark:text-white">{scheduleModalDonation.foodName} ({scheduleModalDonation.quantity} portions)</strong>
            </p>

            <form onSubmit={handleApplySchedule} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-450 uppercase mb-2">
                  Select Target Courier Time Window
                </label>
                <select
                  value={scheduledSlot}
                  onChange={(e) => setScheduledSlot(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 text-xs outline-none focus:border-emerald-500 text-slate-805 dark:text-slate-200"
                >
                  <option value="Immediate Pickup (Next 30 mins)">Immediate Pickup (Next 30 mins)</option>
                  <option value="Scheduled Pickup (1 to 2 hours)">Scheduled Pickup (1 to 2 hours)</option>
                  <option value="Standard Evening Delivery Box (6 PM - 8 PM)">Standard Evening Delivery Box (6 PM - 8 PM)</option>
                  <option value="Morning Dispatch Slot (Next Day 8 AM)">Morning Dispatch Slot (Next Day 8 AM)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setScheduleModalDonation(null)}
                  className="border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-505 dark:text-slate-355 font-semibold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-555 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
