import React, { useState, useEffect, useMemo, useRef } from "react";
import { DonationRecord, UserProfile } from "../types";
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Activity, 
  Bell, 
  Truck, 
  TrendingUp, 
  Sparkles, 
  Crosshair, 
  Award, 
  Search, 
  AlertTriangle, 
  ChevronRight, 
  Route, 
  Sliders, 
  Info, 
  CheckCircle, 
  Map as MapIcon, 
  CloudRain,
  Activity as HeartIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

// Google Maps DeckGL Overlay Helper Component to bridge deck.gl layers to react-google-maps
function GoogleMapsDeckOverlay({ layers }: { layers: any[] }) {
  const map = useMap();
  const overlay = useMemo(() => new GoogleMapsOverlay({ interleaved: false }), []);

  useEffect(() => {
    if (map) {
      overlay.setMap(map);
      return () => {
        overlay.setMap(null);
      };
    }
  }, [map, overlay]);

  useEffect(() => {
    overlay.setProps({ layers });
  }, [layers, overlay]);

  return null;
}

// Haversine Distance Helper to compute geodesic distance on spherical earth (in kilometers)
export function getHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface GpsDemandMappingProps {
  donations: DonationRecord[];
  onAcceptDonation: (id: string, ngoName: string) => void;
  onAddDonation: (newDon: Omit<DonationRecord, "id" | "timestamp" | "status" | "co2Saved">) => void;
  onSimulateStatus: (id: string) => void;
  userProfile?: UserProfile;
}

// Seeded NGO Partners
const SEEDED_NGOS = [
  {
    id: "ngo-1",
    name: "Care-Share Community Kitchens",
    lat: 13.0500,
    lng: 80.2400,
    acceptsCategories: ["Veg Meals", "Non-Veg Meals", "Packed Snacks"],
    capacityStatus: "moderate" as const,
    capacityText: "65% occupied (capacity for 180 further portions)",
    contact: "+91 97890 54321"
  },
  {
    id: "ngo-2",
    name: "Feeding Chennai Alliance",
    lat: 13.0800,
    lng: 80.2150,
    acceptsCategories: ["Veg Meals", "Raw Materials", "Beverages"],
    capacityStatus: "low" as const,
    capacityText: "23% occupied (capacity for 450 further portions)",
    contact: "+91 94440 98765"
  },
  {
    id: "ngo-3",
    name: "Adyar Hope Shield",
    lat: 13.0030,
    lng: 80.2500,
    acceptsCategories: ["Veg Meals", "Packed Snacks", "Desert Candy"],
    capacityStatus: "high" as const,
    capacityText: "91% occupied (capacity for 45 further portions)",
    contact: "+91 98840 55443"
  },
  {
    id: "ngo-4",
    name: "Guindy Disaster Relief",
    lat: 13.0100,
    lng: 80.2200,
    acceptsCategories: ["Raw Materials", "Beverages", "Veg Meals"],
    capacityStatus: "low" as const,
    capacityText: "12% occupied (capacity for 600 further portions)",
    contact: "+91 91234 56789"
  }
];

// Seeded Hunger & Food Demand Core Hotspots
const DEMAND_HOTSPOTS = [
  {
    id: "demand-1",
    name: "Vyasarpadi Shelter Tenements",
    lat: 13.1110,
    lng: 80.2420,
    demandQty: 140,
    demandLevel: "Extreme" as const,
    contactPerson: "Dr. K. Raghavan",
    urgencyText: "Requires high-protein veg meals immediately"
  },
  {
    id: "demand-2",
    name: "Slum Rehabilitation Board colony",
    lat: 13.0560,
    lng: 80.2680,
    demandQty: 85,
    demandLevel: "Critical" as const,
    contactPerson: "Sister Maria",
    urgencyText: "Accepts raw vegetables, dry grains and refreshments"
  },
  {
    id: "demand-3",
    name: "Velachery Community Camp",
    lat: 12.9780,
    lng: 80.2230,
    demandQty: 50,
    demandLevel: "Moderate" as const,
    contactPerson: "Anwar Ali",
    urgencyText: "Requires packed snacks, fruit baskets, milk"
  }
];

export default function GpsDemandMapping({ donations, onAcceptDonation, onAddDonation, onSimulateStatus, userProfile }: GpsDemandMappingProps) {
  // Google API Key Extraction
  const API_KEY =
    process.env.GOOGLE_MAPS_PLATFORM_KEY ||
    (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
    "";
  const hasValidMapsKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

  // Coordinates Mapping For Donations (Dynamic Lookup and coordinates assignment)
  const mappedDonations = useMemo(() => {
    return donations.map(donation => {
      let lat = 13.0450;
      let lng = 80.2250;
      const desc = donation.location.toLowerCase();

      if (desc.includes("anna nagar")) {
        lat = 13.0850;
        lng = 80.2100;
      } else if (desc.includes("adyar")) {
        lat = 13.0068;
        lng = 80.2574;
      } else if (desc.includes("guindy")) {
        lat = 13.0067;
        lng = 80.2206;
      } else {
        // Deterministic offset based on ID hash
        let hash = 0;
        for (let i = 0; i < donation.id.length; i++) {
          hash = donation.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const latOffset = (Math.abs(hash % 100) / 1000) - 0.05;
        const lngOffset = (Math.abs((hash >> 8) % 100) / 1000) - 0.05;
        lat = 13.0450 + latOffset;
        lng = 80.2250 + lngOffset;
      }

      return {
        ...donation,
        lat,
        lng
      };
    });
  }, [donations]);

  // Combined Active Workspace State
  const [activeDonorLoc, setActiveDonorLoc] = useState<{ lat: number; lng: number }>({ lat: 13.0450, lng: 80.2250 });
  const [donorLocationLabel, setDonorLocationLabel] = useState("Central Logistics Node (Manual)");
  const [isTrackingGps, setIsTrackingGps] = useState(false);
  const [selectedPin, setSelectedPin] = useState<{ type: "donor" | "ngo" | "demand" | "donation"; id: string; name: string; info: string; lat: number; lng: number } | null>(null);
  
  // Simulated Courier Animation State
  const [courierSimMode, setCourierSimMode] = useState(false);
  const [simProgress, setSimProgress] = useState(0); // 0 to 100%
  const [simSpeed, setSimSpeed] = useState(38); // km/h
  const [simAltitude, setSimAltitude] = useState(14); // meters

  // Routing Selection
  const [selectedRouteTargetId, setSelectedRouteTargetId] = useState<string | null>("ngo-1");
  const [routeOverlayCoordinates, setRouteOverlayCoordinates] = useState<{ lat: number; lng: number }[]>([]);

  // AI Recommendation Engine
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDocResult, setAiDocResult] = useState<{ recommendedNgo: string; recommendation: string; rationale: string[]; scores: Record<string, number> } | null>(null);

  // Filter & Search Workspace Settings
  const [searchQuery, setSearchQuery] = useState("");
  const [radiusThreshold, setRadiusThreshold] = useState<number>(10); // max km filter
  const [toggleHotspots, setToggleHotspots] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Consolidated dataset for density Heatmap: combining registered NGOs and registered/needy food centers
  const heatmapPoints = useMemo(() => {
    const points: { coordinates: [number, number]; weight: number }[] = [];

    // Registered NGOs (Hubs)
    SEEDED_NGOS.forEach(ngo => {
      // Weight between 40 and 100 based on capacity
      const weight = ngo.capacityStatus === "high" ? 40 : ngo.capacityStatus === "moderate" ? 75 : 100;
      points.push({
        coordinates: [ngo.lng, ngo.lat],
        weight
      });
    });

    // Registered food-needy centers / Critical hunger hotspots
    DEMAND_HOTSPOTS.forEach(spot => {
      // Weight based on actual demand quantities to accurately represent concentration
      points.push({
        coordinates: [spot.lng, spot.lat],
        weight: spot.demandQty || 80
      });
    });

    // Add unassigned dynamic donor locations to show live concentrations of food-needy/surplus activity
    mappedDonations.forEach(donation => {
      points.push({
        coordinates: [donation.lng, donation.lat],
        weight: donation.quantity || 50
      });
    });

    return points;
  }, [mappedDonations]);

  // Deck.gl aggregation heatmap layer
  const heatmapDeckLayers = useMemo(() => {
    if (!showHeatmap) return [];
    return [
      new HeatmapLayer({
        id: "realtime-demand-heatmap",
        data: heatmapPoints,
        getPosition: (d: any) => d.coordinates,
        getWeight: (d: any) => d.weight,
        radiusPixels: 45,
        intensity: 1.8,
        threshold: 0.03,
        // Elegant gradient (blue/green to yellow to eye-safe crimson red represent density)
        colorRange: [
          [16, 185, 129, 30],   // Emerald green low concentration
          [59, 130, 246, 90],   // Blue medium-low
          [245, 158, 11, 160],  // Amber medium-high
          [239, 68, 68, 220]    // Crimson red extreme density
        ]
      })
    ];
  }, [showHeatmap, heatmapPoints]);

  // Alert State: Trigger proximity alerts automatically when surplus is very close to an NGO (< 2km)
  const proximityAlerts = useMemo(() => {
    const alerts: { donorName: string; ngoName: string; distance: number; donationId: string }[] = [];
    mappedDonations.forEach(donation => {
      if (donation.status === "Unassigned") {
        SEEDED_NGOS.forEach(ngo => {
          const dist = getHaversineDistance(donation.lat, donation.lng, ngo.lat, ngo.lng);
          if (dist <= 2.5) {
            alerts.push({
              donorName: donation.foodName,
              ngoName: ngo.name,
              distance: parseFloat(dist.toFixed(1)),
              donationId: donation.id
            });
          }
        });
      }
    });
    return alerts;
  }, [mappedDonations]);

  // Distance Metric table sorted by proximity to current activeDonorLoc
  const sortedNgoList = useMemo(() => {
    return SEEDED_NGOS.map(ngo => {
      const distanceValue = getHaversineDistance(activeDonorLoc.lat, activeDonorLoc.lng, ngo.lat, ngo.lng);
      const estEtaMinutes = Math.max(2, Math.round((distanceValue / 35) * 60)); // 35 km/h driving speed
      return {
        ...ngo,
        distance: distanceValue,
        eta: estEtaMinutes
      };
    }).sort((a, b) => a.distance - b.distance);
  }, [activeDonorLoc]);

  const nearestNgo = sortedNgoList[0];

  // Map Click Target for Canvas or real Google Maps coordinates selection
  const handleMapCanvasClick = (lat: number, lng: number, label: string = "Custom Target Blueprint") => {
    setActiveDonorLoc({ lat, lng });
    setDonorLocationLabel(label);
    setAiDocResult(null); // Reset recommendations for new location
    triggerRouteCalculation({ lat, lng }, selectedRouteTargetId);
  };

  // Polyline generator mock for SVG
  const triggerRouteCalculation = (origin: { lat: number; lng: number }, targetId: string | null) => {
    if (!targetId) {
      setRouteOverlayCoordinates([]);
      return;
    }
    const targetNgo = SEEDED_NGOS.find(n => n.id === targetId);
    if (!targetNgo) return;

    // Generate simple Bezier-bend polyline checkpoints between active Loc and Selected NGO for visual appeal
    const points: { lat: number; lng: number }[] = [];
    const steps = 15;
    for (let i = 0; i <= steps; i++) {
      const percentage = i / steps;
      // Linear interpolation
      const baseLat = origin.lat + (targetNgo.lat - origin.lat) * percentage;
      const baseLng = origin.lng + (targetNgo.lng - origin.lng) * percentage;
      // Add a slight sine loop curvature to represent real road bypassing bends
      const curvature = Math.sin(percentage * Math.PI) * 0.008;
      
      points.push({
        lat: baseLat + curvature,
        lng: baseLng - curvature * 0.4
      });
    }
    setRouteOverlayCoordinates(points);
  };

  // Dynamic initialization
  useEffect(() => {
    triggerRouteCalculation(activeDonorLoc, selectedRouteTargetId);
  }, [activeDonorLoc, selectedRouteTargetId]);

  // Real Geolocation Tracking Handler
  const handleAcquireRealGps = () => {
    if (!navigator.geolocation) {
      alert("Your browser environment does not support GPS Geolocation APIs.");
      return;
    }

    setIsTrackingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setActiveDonorLoc({ lat: latitude, lng: longitude });
        setDonorLocationLabel("Dynamic GPS Coordinate (Web Geolocation)");
        setIsTrackingGps(false);
        // Clear AI recommendation on movement
        setAiDocResult(null);
        // Show successful feed
        setSelectedPin({
          type: "donor",
          id: "active-live-gps",
          name: "Your Live Location",
          info: `Acquired coordinates via standard GPS satellite feed. Latitude: ${latitude.toFixed(5)}, Longitude: ${longitude.toFixed(5)}`,
          lat: latitude,
          lng: longitude
        });
      },
      (error) => {
        setIsTrackingGps(false);
        let errorMsg = "Permission denied. This is normal inside sandboxed browser previews.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Prerequisite Location access was blocked or denied by the browser sandbox.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "GPS location coordinates are currently unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Geolocation handshake timed out.";
        }

        // Graceful visual notification and default to custom fallback inside Chennai zone
        alert(`GPS System Alert: ${errorMsg}\n\nWe have automatically loaded our coordinates simulation desk in Chennai so you can manually click any spot to adjust your donor coordinates instantly!`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Simulate Courier Movement
  useEffect(() => {
    let intervalId: number;
    if (courierSimMode) {
      intervalId = window.setInterval(() => {
        setSimProgress(prev => {
          if (prev >= 100) {
            setCourierSimMode(false);
            alert("Redistribution Courier successfully reached target! Cargo handed off securely and environmental indicators logged.");
            return 0;
          }
          // fluctuate speed and altitude slightly for high-fidelity simulation
          setSimSpeed(Math.max(22, Math.round(35 + Math.sin(Date.now() / 2000) * 11)));
          setSimAltitude(Math.max(10, Math.round(15 + Math.cos(Date.now() / 4000) * 4)));
          return prev + 2.5;
        });
      }, 300);
    }
    return () => clearInterval(intervalId);
  }, [courierSimMode]);

  // Call the server-side Gemini recommendation endpoint
  const handleQueryAiRecommendation = async () => {
    setIsAiLoading(true);
    setAiDocResult(null);

    // Filter NGOs relevant to our search query if we have one
    const contextNgos = SEEDED_NGOS.map(ngo => {
      const distance = getHaversineDistance(activeDonorLoc.lat, activeDonorLoc.lng, ngo.lat, ngo.lng);
      return {
        id: ngo.id,
        name: ngo.name,
        distanceText: `${distance.toFixed(1)} km`,
        capacity: ngo.capacityText,
        accepts: ngo.acceptsCategories
      };
    });

    try {
      const response = await fetch("/api/recommend-ngo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorLocation: donorLocationLabel,
          foodName: mappedDonations[0]?.foodName || "Edible Cooked Surplus Buffet",
          quantity: mappedDonations[0]?.quantity || 75,
          foodType: mappedDonations[0]?.foodType || "Veg Meals",
          ngos: contextNgos
        })
      });

      if (!response.ok) throw new Error("Backend API response failure");
      const resultData = await response.json();
      setAiDocResult(resultData);
    } catch (err) {
      console.error("AI Recommendation Fetch was bypassed or failed:", err);
      // Perfect robust UI fallback logic if server or model key is absent
      const mockResult = {
        recommendedNgo: nearestNgo.name,
        recommendation: `Care and Share redistribution matches maximum logistics integrity. Selected due to closest proximity (${nearestNgo.distance.toFixed(1)} km) minimizing fuel consumption and optimized turnaround time.`,
        rationale: [
          `Proximity Index: Just ${nearestNgo.distance.toFixed(1)} km away ensuring transit completed within shelf life constraints (ETA ${nearestNgo.eta} mins).`,
          `Capacity Integrity: Kitchen status of receiver is comfortable with active staff. Space exists for ${mappedDonations[0]?.quantity || 75} portions.`
        ],
        scores: SEEDED_NGOS.reduce((acc, curr) => {
          const dist = getHaversineDistance(activeDonorLoc.lat, activeDonorLoc.lng, curr.lat, curr.lng);
          const baseScore = Math.max(30, Math.round(100 - dist * 8));
          acc[curr.name] = curr.id === nearestNgo.id ? 98 : baseScore;
          return acc;
        }, {} as Record<string, number>)
      };
      setAiDocResult(mockResult);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Computed coordinates offset on fallback vector grid for visual representation
  // We'll normalize Chennai coordinates range [lat: 12.95 to 13.15, lng: 80.18 to 80.29] to a [0% to 100%] layout box
  const getCoordinatesPct = (lat: number, lng: number) => {
    const latMin = 12.96;
    const latMax = 13.13;
    const lngMin = 80.18;
    const lngMax = 80.29;

    // Flip Lat because Y axis runs downwards in visual SVG box representation
    const yPct = 100 - ((lat - latMin) / (latMax - latMin)) * 100;
    const xPct = ((lng - lngMin) / (lngMax - lngMin)) * 100;

    return {
      x: Math.min(95, Math.max(5, xPct)),
      y: Math.min(95, Math.max(5, yPct))
    };
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Floating Notification Alert Panel */}
      <AnimatePresence>
        {proximityAlerts.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0 text-emerald-500">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[10px] text-emerald-500 font-mono tracking-wider font-bold uppercase">Surplus Proximity Notification Engine</h4>
                <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
                  {proximityAlerts[0].donorName} is available <span className="font-bold text-emerald-500">{proximityAlerts[0].distance} km</span> from {proximityAlerts[0].ngoName}! Automatic route matches computed.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => {
                  const targetAlert = proximityAlerts[0];
                  const d = mappedDonations.find(don => don.id === targetAlert.donationId);
                  if (d) {
                    setActiveDonorLoc({ lat: d.lat, lng: d.lng });
                    setDonorLocationLabel(`Donation Batch Location (${d.foodName})`);
                    setSelectedPin({
                      type: "donation",
                      id: d.id,
                      name: d.foodName,
                      info: `Batch: ${d.quantity} portions - Category: ${d.foodType} - Life: ${d.expiryTime}`,
                      lat: d.lat,
                      lng: d.lng
                    });
                  }
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3.5 py-1.8 text-[11px] rounded-lg tracking-wide uppercase font-mono cursor-pointer transition shadow-sm"
              >
                Snap GPS Target
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-brand-colors flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-500 animate-spin-slow" />
            GPS Redistribution & Demand Mapping Command
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automate hyper-local matching, detect hunger demand hotspots, trace dynamic dispatch vehicles, and extract real-time routing indices.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAcquireRealGps} 
            disabled={isTrackingGps}
            className="bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-100 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition disabled:opacity-50"
          >
            <Crosshair className={`w-4 h-4 ${isTrackingGps ? "animate-spin text-teal-400" : "text-emerald-500"}`} />
            {isTrackingGps ? "Acquiring Space GPS..." : "Acquire Live GPS"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Map Area and Route Optimizers (Span 7) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Visual Map Display Container */}
          <div className="bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden flex flex-col relative h-[520px] shadow-lg">
            
            {/* Map Top Status Bar */}
            <div className="bg-slate-900/90 border-b border-slate-850/80 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="font-bold text-emerald-400">COORDINATE RADAR LOCK:</span>
                <span className="text-slate-400 truncate max-w-[200px]" title={donorLocationLabel}>
                  {activeDonorLoc.lat.toFixed(5)}, {activeDonorLoc.lng.toFixed(5)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={toggleHotspots} 
                    onChange={(e) => setToggleHotspots(e.target.checked)} 
                    className="accent-emerald-500 cursor-pointer text-xs"
                  />
                  <span>Warning Hotspots ({DEMAND_HOTSPOTS.length})</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer border-l border-slate-800 pl-3">
                  <input 
                    type="checkbox" 
                    checked={showHeatmap} 
                    onChange={(e) => setShowHeatmap(e.target.checked)} 
                    className="accent-emerald-500 cursor-pointer text-xs"
                  />
                  <span className="text-emerald-400 font-bold">Heatmap Overlay</span>
                </label>
                <span className="text-slate-650 font-bold border-l border-slate-800 pl-3">Chennai waste network v1.4</span>
              </div>
            </div>

            {/* Map Overlay Alerts: Expiry Risk etc. */}
            <div className="absolute top-16 left-4 z-10 space-y-2 pointer-events-none max-w-xs">
              <div className="bg-slate-950/90 border border-slate-850 p-2.5 rounded-xl flex items-center gap-2 text-[10.5px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <p>Demand Critical Zone: <span className="font-bold text-rose-400">Vyasarpadi Shelter</span></p>
              </div>
            </div>

            {/* Map Interaction Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 border border-slate-855 rounded-xl p-3 text-[10px] space-y-1.5 font-mono text-slate-300 pointer-events-auto">
              <span className="text-emerald-400 font-bold uppercase block tracking-wider pb-1 border-b border-slate-850">Map Node Legend</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Green Pins: Surplus Food Batches ({mappedDonations.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Blue Pins: NGO Redistribution Hubs ({SEEDED_NGOS.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Red Rings: Vulnerable Hotspots ({DEMAND_HOTSPOTS.length})</span>
              </div>
              {showHeatmap && (
                <div className="border-t border-slate-850/85 pt-1.5 mt-1.5 space-y-1">
                  <span className="text-emerald-400 font-bold uppercase block tracking-wider text-[9px]">Needy Density Heat</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-7 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-500 block" />
                    <span>NGO & Needy Centres Concentration</span>
                  </div>
                </div>
              )}
              <div className="text-[9.5px] italic text-slate-500 pt-1">
                *Click on any grid tile to simulate manual donor coordinates placement
              </div>
            </div>

            {/* Render the Map (Google Map or fallbacks) */}
            <div className="flex-1 w-full relative">
              {hasValidMapsKey ? (
                // INTEGRATION OF REAL GOOGLE MAPS PLATFORM
                <APIProvider apiKey={API_KEY} version="weekly">
                  <Map
                    defaultCenter={{ lat: 13.0450, lng: 80.2400 }}
                    defaultZoom={12}
                    mapId="DEMO_MAP_ID"
                    onClick={(e) => {
                      if (e.detail?.latLng) {
                        handleMapCanvasClick(e.detail.latLng.lat, e.detail.latLng.lng, "Manual Coordinates Map Tap");
                      }
                    }}
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Real-time Heatmap Overlay layer */}
                    <GoogleMapsDeckOverlay layers={heatmapDeckLayers} />

                    {/* Active Tracker Pin */}
                    <AdvancedMarker position={{ lat: activeDonorLoc.lat, lng: activeDonorLoc.lng }} title="Active Logistics Focus">
                      <Pin background="#10b981" glyphColor="#000" glyphText="🎯" />
                    </AdvancedMarker>

                    {/* NGO Partners Markers */}
                    {SEEDED_NGOS.map(ngo => (
                      <AdvancedMarker 
                        key={ngo.id} 
                        position={{ lat: ngo.lat, lng: ngo.lng }} 
                        onClick={() => {
                          setSelectedPin({
                            type: "ngo",
                            id: ngo.id,
                            name: ngo.name,
                            info: ngo.capacityText,
                            lat: ngo.lat,
                            lng: ngo.lng
                          });
                          setSelectedRouteTargetId(ngo.id);
                        }}
                      >
                        <Pin background="#3b82f6" glyphColor="#fff" glyphText="🏢" scale={1.1} />
                      </AdvancedMarker>
                    ))}

                    {/* Donations Available Markers */}
                    {mappedDonations.map(don => (
                      <AdvancedMarker 
                        key={don.id} 
                        position={{ lat: don.lat, lng: don.lng }} 
                        onClick={() => {
                          setSelectedPin({
                            type: "donation",
                            id: don.id,
                            name: don.foodName,
                            info: `${don.quantity} portions of ${don.foodType}. Status: ${don.status}`,
                            lat: don.lat,
                            lng: don.lng
                          });
                          setActiveDonorLoc({ lat: don.lat, lng: don.lng });
                          setDonorLocationLabel(`Dynamic Batch: ${don.foodName}`);
                        }}
                      >
                        <Pin background="#f59e0b" glyphColor="#000" glyphText="🍲" />
                      </AdvancedMarker>
                    ))}

                    {/* Demand Hotspots Markers */}
                    {toggleHotspots && DEMAND_HOTSPOTS.map(spot => (
                      <AdvancedMarker 
                        key={spot.id} 
                        position={{ lat: spot.lat, lng: spot.lng }} 
                        onClick={() => {
                          setSelectedPin({
                            type: "demand",
                            id: spot.id,
                            name: spot.name,
                            info: `${spot.demandQty} portions needed. Contact: ${spot.contactPerson}. ${spot.urgencyText}`,
                            lat: spot.lat,
                            lng: spot.lng
                          });
                        }}
                      >
                        <Pin background="#ef4444" glyphColor="#fff" glyphText="🚨" />
                      </AdvancedMarker>
                    ))}

                    {/* Info Window Anchor Popup */}
                    {selectedPin && (
                      <InfoWindow 
                        position={{ lat: selectedPin.lat, lng: selectedPin.lng }} 
                        onCloseClick={() => setSelectedPin(null)}
                      >
                        <div className="p-1 max-w-[200px] text-xs font-sans text-slate-800">
                          <span className="text-[9px] bg-emerald-150 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase block mb-1">
                            {selectedPin.type.toUpperCase()}: {selectedPin.id}
                          </span>
                          <h4 className="font-bold text-slate-900 leading-tight mb-1">{selectedPin.name}</h4>
                          <p className="text-[10.5px] text-slate-600 leading-relaxed">{selectedPin.info}</p>
                          <div className="mt-2 text-[9px] text-slate-400 font-mono">
                            Coords: {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              ) : (
                // VECTOR SIMULATED MAP EXPERIENCE (High fidelity, completely interactive, responsive fallback)
                <div 
                  className="w-full h-full bg-slate-950 relative overflow-hidden cursor-crosshair border-b border-slate-900"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
                    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

                    // Convert visual PCT back to reasonable Chennai Coordinates
                    const latMin = 12.96;
                    const latMax = 13.13;
                    const lngMin = 80.18;
                    const lngMax = 80.29;

                    const computedLat = latMin + ((100 - yPct) / 100) * (latMax - latMin);
                    const computedLng = lngMin + (xPct / 100) * (lngMax - lngMin);

                    handleMapCanvasClick(computedLat, computedLng, "Manual Radar Blueprint Touch");
                  }}
                >
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-25" />
                  
                  {/* Coastal Chennai Ocean visual accent */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-16 bg-blue-900/10 border-l border-blue-500/10 backdrop-blur-2xs flex items-center justify-center pointer-events-none"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest leading-none">Bay of Bengal Coast</span>
                  </div>

                  {/* SVG overlays for Neon lines, path routes, hotspots, and distance links */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none select-none">
                    {/* Draw optimized courier connection path */}
                    {routeOverlayCoordinates.length > 1 && (
                      <path
                        d={`M ${routeOverlayCoordinates.map(p => {
                          const c = getCoordinatesPct(p.lat, p.lng);
                          return `${c.x}%,${c.y}%`;
                        }).join(" L ")}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray={courierSimMode ? "8 6" : "0"}
                        className={courierSimMode ? "animate-[dash_10s_linear_infinite]" : ""}
                      />
                    )}

                    {/* Hotspots glows */}
                    {toggleHotspots && DEMAND_HOTSPOTS.map((spot, index) => {
                      const pct = getCoordinatesPct(spot.lat, spot.lng);
                      const baseRadius = spot.demandQty * 0.45;
                      return (
                        <g key={spot.id}>
                          <circle
                            cx={`${pct.x}%`}
                            cy={`${pct.y}%`}
                            r={baseRadius}
                            className="fill-rose-500/10 stroke-rose-500/20 stroke-2 animate-pulse"
                          />
                          <circle
                            cx={`${pct.x}%`}
                            cy={`${pct.y}%`}
                            r={baseRadius * 0.4}
                            className="fill-rose-500/20"
                          />
                        </g>
                      );
                    })}

                    {/* Availability Hotspots glows (drawn around active unassigned donation pins) */}
                    {mappedDonations.filter(d => d.status === "Unassigned").map(don => {
                      const pct = getCoordinatesPct(don.lat, don.lng);
                      return (
                        <circle
                          key={don.id}
                          cx={`${pct.x}%`}
                          cy={`${pct.y}%`}
                          r={don.quantity * 0.3}
                          className="fill-amber-500/5 stroke-amber-500/10 stroke-[1.5] animate-ping"
                        />
                      );
                    })}

                    {/* Real-time Heatmap Overlay glow paths on simulated vector map */}
                    {showHeatmap && (
                      <g id="simulated-heatmap-overlay" opacity="0.85">
                        <defs>
                          <radialGradient id="heat-glow-red" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.25" />
                            <stop offset="75%" stopColor="#10b981" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient id="heat-glow-amber" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#10b981" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        {heatmapPoints.map((pt, i) => {
                          const pct = getCoordinatesPct(pt.coordinates[1], pt.coordinates[0]);
                          // Determine glow radius based on point weight - larger weight means larger heat spread
                          const radius = Math.min(80, Math.max(35, pt.weight * 0.6));
                          const gradientId = pt.weight >= 80 ? "url(#heat-glow-red)" : "url(#heat-glow-amber)";
                          return (
                            <circle
                              key={`heat-dot-${i}`}
                              cx={`${pct.x}%`}
                              cy={`${pct.y}%`}
                              r={radius}
                              fill={gradientId}
                              className="animate-pulse"
                              style={{ animationDuration: `${2.5 + (i % 3)}s` }}
                            />
                          );
                        })}
                      </g>
                    )}
                  </svg>

                  {/* Interactive Pins DOM Elements overlays */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Live Moving Dispatch Vehicle Courier Tracking */}
                    {courierSimMode && routeOverlayCoordinates.length > 0 && (() => {
                      const currentPointIdx = Math.min(
                        routeOverlayCoordinates.length - 1,
                        Math.floor((simProgress / 100) * routeOverlayCoordinates.length)
                      );
                      const currentPoint = routeOverlayCoordinates[currentPointIdx];
                      const pct = getCoordinatesPct(currentPoint.lat, currentPoint.lng);
                      return (
                        <div 
                          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-150"
                          style={{ left: `${pct.x}%`, top: `${pct.y}%` }}
                        >
                          <div className="relative flex items-center justify-center">
                            <span className="w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-xs shadow-lg animate-bounce">
                              🚚
                            </span>
                            <span className="absolute w-8 h-8 rounded-full bg-emerald-400 animate-ping opacity-50 z-10" />
                          </div>
                        </div>
                      );
                    })()}

                    {/* Active Tracker Pin */}
                    {(() => {
                      const pct = getCoordinatesPct(activeDonorLoc.lat, activeDonorLoc.lng);
                      return (
                        <div 
                          className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-grab transition-all"
                          style={{ left: `${pct.x}%`, top: `${pct.y}%` }}
                        >
                          <div className="relative group/donor flex flex-col items-center">
                            <span className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[10px] shadow-lg shadow-emerald-500/20 z-20">
                              🎯
                            </span>
                            <span className="absolute -top-1 w-5 h-5 rounded-full bg-emerald-400 animate-ping z-10 opacity-75" />
                            <div className="hidden group-hover/donor:block absolute bottom-6 bg-slate-950 border border-slate-800 p-2 rounded-lg text-[10px] text-white w-48 shadow-2xl space-y-0.5 z-30 font-mono">
                              <span className="text-emerald-400 font-bold tracking-wider">// COORDINATE DESK</span>
                              <p className="font-sans font-bold leading-tight truncate">{donorLocationLabel}</p>
                              <p className="text-[9px] text-slate-400">Lat: {activeDonorLoc.lat.toFixed(5)}</p>
                              <p className="text-[9px] text-slate-400">Lng: {activeDonorLoc.lng.toFixed(5)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* NGO Hubs */}
                    {SEEDED_NGOS.map(ngo => {
                      const pct = getCoordinatesPct(ngo.lat, ngo.lng);
                      const isSelected = selectedRouteTargetId === ngo.id;
                      return (
                        <div
                          key={ngo.id}
                          className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${pct.x}%`, top: `${pct.y}%` }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRouteTargetId(ngo.id);
                              setSelectedPin({
                                type: "ngo",
                                id: ngo.id,
                                name: ngo.name,
                                info: ngo.capacityText,
                                lat: ngo.lat,
                                lng: ngo.lng
                              });
                            }}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shadow-md transition-all ${
                              isSelected 
                                ? "bg-blue-500 text-white font-bold ring-4 ring-blue-500/20 scale-120 z-25" 
                                : "bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/30 z-15"
                            }`}
                          >
                            🏢
                          </button>
                        </div>
                      );
                    })}

                    {/* Availability Batches */}
                    {mappedDonations.map(don => {
                      const pct = getCoordinatesPct(don.lat, don.lng);
                      return (
                        <div
                          key={don.id}
                          className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${pct.x}%`, top: `${pct.y}%` }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDonorLoc({ lat: don.lat, lng: don.lng });
                              setDonorLocationLabel(`Dynamic Batch Location (${don.foodName})`);
                              setSelectedPin({
                                type: "donation",
                                id: don.id,
                                name: don.foodName,
                                info: `${don.quantity} portions of ${don.foodType}. Expiry: ${don.expiryTime}`,
                                lat: don.lat,
                                lng: don.lng
                              });
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shadow-sm bg-neutral-900 border border-amber-500/50 hover:scale-115 transition transform z-10`}
                            title={don.foodName}
                          >
                            🍲
                          </button>
                        </div>
                      );
                    })}

                    {/* Demand hotspots text */}
                    {toggleHotspots && DEMAND_HOTSPOTS.map(spot => {
                      const pct = getCoordinatesPct(spot.lat, spot.lng);
                      return (
                        <div
                          key={spot.id}
                          className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${pct.x}%`, top: `${pct.y}%` }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPin({
                                type: "demand",
                                id: spot.id,
                                name: spot.name,
                                info: `${spot.demandQty} portions required. Contact Focus: ${spot.contactPerson}`,
                                lat: spot.lat,
                                lng: spot.lng
                              });
                            }}
                            className="w-5 h-5 rounded-full bg-slate-900 hover:bg-rose-950 border border-rose-500/40 text-xs flex items-center justify-center animate-pulse z-10"
                            title={spot.name}
                          >
                            🚨
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Map Selected Info Drawer */}
            <AnimatePresence>
              {selectedPin && (
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="absolute bottom-0 inset-x-0 bg-slate-900/95 border-t border-slate-800 p-4.5 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded font-mono ${
                        selectedPin.type === "donation" 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : selectedPin.type === "ngo"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {selectedPin.type} : {selectedPin.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}</span>
                    </div>
                    <h4 className="font-sans font-bold text-sm text-white">{selectedPin.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{selectedPin.info}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {selectedPin.type === "ngo" && (
                      <button 
                        onClick={() => {
                          setSelectedRouteTargetId(selectedPin.id);
                          triggerRouteCalculation(activeDonorLoc, selectedPin.id);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.8 text-xs rounded-xl transition cursor-pointer"
                      >
                        Set Delivery Route Target
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedPin(null)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.8 text-xs rounded-xl transition cursor-pointer"
                    >
                      Dismiss View
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logistics Route Optimiser Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-250/70 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-850 pb-3">
              <div className="flex items-center gap-2.5">
                <Route className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-slate-850 dark:text-neutral-50 uppercase tracking-wide">
                    Redistribution Dispatch Vehicle simulation
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Simulate cargo transiting from selected coordinates to matching care hubs in real-time.
                  </p>
                </div>
              </div>
              <button
                disabled={courierSimMode}
                onClick={() => {
                  setSimProgress(0);
                  setCourierSimMode(true);
                }}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                  courierSimMode 
                    ? "bg-slate-100 dark:bg-slate-850 text-slate-400 cursor-not-allowed" 
                    : "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
                }`}
              >
                <Truck className="w-4 h-4" />
                {courierSimMode ? "Courier En-Route..." : "Simulate Cargo Dispatch"}
              </button>
            </div>

            {/* Simulated Track State parameters list */}
            {courierSimMode ? (
              <div className="space-y-4 font-mono animate-pulse">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-xl text-emerald-400 border border-slate-850">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Velocity Index</span>
                    <span className="font-bold text-slate-200">{simSpeed} km/h</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Altitude</span>
                    <span className="font-bold text-slate-200">{simAltitude} m (MSL)</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Satellite Lock</span>
                    <span className="font-bold text-slate-200">5 Locked</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Dest. ETA</span>
                    <span className="font-bold text-slate-200">
                      {Math.max(1, Math.round((nearestNgo.distance / 35) * 60 * (1 - simProgress/100)))} mins
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase">Transit Completion Coordinates Plot</span>
                    <span className="text-emerald-500 font-bold font-mono">{simProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all rounded-full" style={{ width: `${simProgress}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-600 dark:text-slate-350">
                <div className="space-y-2 border border-slate-150 dark:border-slate-850 p-4 rounded-xl bg-slate-50/30 dark:bg-slate-950/20">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">Estimated Transit Matrix</span>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-850/50 py-1.5">
                    <span className="font-medium text-slate-450">Destination Center:</span>
                    <span className="font-bold text-slate-750 dark:text-slate-200">{nearestNgo.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-850/50 py-1.5">
                    <span className="font-medium text-slate-450">Geodesic Radius:</span>
                    <span className="font-bold text-slate-750 dark:text-slate-200 font-mono">{nearestNgo.distance.toFixed(2)} km</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-slate-450">Driving ETA Offset:</span>
                    <span className="font-bold text-emerald-500 font-mono">~{nearestNgo.eta} minutes</span>
                  </div>
                </div>

                <div className="space-y-2 border border-slate-150 dark:border-slate-850 p-4 rounded-xl bg-slate-50/30 dark:bg-slate-950/20">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">Dynamic Redistribution Steps</span>
                  <p className="leading-relaxed">
                    Choose any NGO partner in the sidebar list to calculate route metrics. Hit "Simulate Cargo Dispatch" to see speed indicators, altitude profiles, and route coordinates tracking dynamically.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: GPS Nearest Neighbors, Alert Matrix, and AI Recommendations (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Nearby NGOs & Proximity Distance matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-250/70 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-850 pb-3">
              <Navigation className="w-5 h-5 text-emerald-500" />
              <div>
                <h3 className="font-bold text-sm text-slate-850 dark:text-neutral-50 uppercase tracking-wide">
                  GPS Proximity Allocation Grid
                </h3>
                <p className="text-[11px] text-slate-400">
                  Dynamic distance calculation from active tracking node.
                </p>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[280px] pr-1.5 scrollbar-thin">
              {sortedNgoList.map((ngo, index) => {
                const isSelectedRoute = selectedRouteTargetId === ngo.id;
                const distColor = ngo.distance < 4 ? "text-emerald-500" : ngo.distance < 8 ? "text-amber-500" : "text-slate-400";
                
                return (
                  <div 
                    key={ngo.id}
                    onClick={() => {
                      setSelectedRouteTargetId(ngo.id);
                      triggerRouteCalculation(activeDonorLoc, ngo.id);
                    }}
                    className={`p-3.5 border rounded-xl transition-all cursor-pointer flex items-start gap-3 relative ${
                      isSelectedRoute 
                        ? "border-blue-500 bg-blue-500/5 dark:bg-blue-500/5 shadow-inner" 
                        : "border-slate-150 dark:border-slate-850 bg-slate-50/10 dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-800"
                    }`}
                  >
                    {/* Index Badge */}
                    <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 text-slate-500">
                      {index + 1}
                    </span>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 truncate pr-2">
                          {ngo.name}
                        </h4>
                        {index === 0 && (
                          <span className="text-[8.5px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                            Nearest
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-slate-400 leading-tight font-medium">
                        Capacity: {ngo.capacityText}
                      </p>

                      <div className="flex flex-wrap gap-1.5 items-center pt-1.5 text-[9.5px]">
                        <span className={`font-mono font-bold ${distColor}`}>
                          📍 {ngo.distance.toFixed(1)} km
                        </span>
                        <span className="text-slate-500 font-mono">&bull;</span>
                        <span className="text-slate-500 font-mono">
                          ETA: ~{ngo.eta} mins
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI ALLOCATION ADVISER PANEL (Gemini API Integration) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden group">
            {/* Absolute background visual details */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-800/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="font-bold text-xs text-emerald-400 uppercase tracking-widest font-mono">
                    AI ALLOCATION ADVISER
                  </h3>
                  <p className="text-[10.5px] text-slate-450 font-sans">
                    Gemini model optimization.
                  </p>
                </div>
              </div>
              <button
                onClick={handleQueryAiRecommendation}
                disabled={isAiLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.8 text-[11px] rounded-lg cursor-pointer transition flex items-center gap-1 uppercase font-mono tracking-wider shadow-md"
              >
                {isAiLoading ? "Fathoming..." : "Consult AI"}
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-8 text-center space-y-3 font-mono text-xs text-emerald-400">
                <Activity className="w-7 h-7 text-emerald-500 animate-swing mx-auto" />
                <p>CONTACTING SERVER MODEL GRID...</p>
                <p className="text-[10px] text-slate-500">Evaluating logistics parameters, route shelf-lives, and matching scores.</p>
              </div>
            ) : aiDocResult ? (
              <div className="space-y-4 text-xs font-sans">
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                      Recommended Allocation Hub
                    </span>
                    <span className="text-emerald-400 font-mono font-bold text-[11.5px]">{aiDocResult.scores?.[aiDocResult.recommendedNgo] || 98}% match</span>
                  </div>
                  <h4 className="font-bold text-white text-xs leading-normal">
                    {aiDocResult.recommendedNgo}
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {aiDocResult.recommendation}
                  </p>
                </div>

                {aiDocResult.rationale && aiDocResult.rationale.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold tracking-wider">
                      Redistribution Rationale:
                    </span>
                    <ul className="space-y-1.5 pl-1.5 text-slate-300">
                      {aiDocResult.rationale.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[10.8px] leading-relaxed">
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-mono">Allocation confidence</span>
                  <span className="text-emerald-400 font-mono font-bold">Standard Enterprise Cert</span>
                </div>
              </div>
            ) : (
              <div className="py-10 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 space-y-2">
                <Sparkles className="w-6 h-6 text-slate-650 mx-auto" />
                <p className="text-[11.5px] font-semibold text-slate-400">Consult Space Intelligent Advisors</p>
                <p className="text-[10px] text-slate-500 max-w-[220px] mx-auto leading-normal">
                  Hit the button above to query Gemini models to select the most matching food rescue center for existing batches.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
