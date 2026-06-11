import React from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  TrendingUp, 
  Globe, 
  Users, 
  HeartHandshake, 
  Sparkles, 
  FileText 
} from "lucide-react";

const FOOD_SAVED_DATA = [
  { month: "Jan", rescued: 230, co2: 103 },
  { month: "Feb", rescued: 420, co2: 189 },
  { month: "Mar", rescued: 580, co2: 261 },
  { month: "Apr", rescued: 740, co2: 333 },
  { month: "May", rescued: 990, co2: 445 },
  { month: "Jun", rescued: 1240, co2: 558 }
];

const PEOPLE_FED_BY_CATEGORY = [
  { name: "Rice Bowls", meals: 450, color: "#10b981" },
  { name: "Beverages", meals: 290, color: "#3b82f6" },
  { name: "Sandwiches", meals: 340, color: "#f59e0b" },
  { name: "Pizza / Pasta", meals: 180, color: "#8b5cf6" },
  { name: "Salads / Starters", meals: 220, color: "#ec4899" }
];

const NGOS_SUPPORTED_PROGRESS = [
  { week: "Wk 1", ngosConnected: 2, pickUpRequests: 14 },
  { week: "Wk 2", ngosConnected: 4, pickUpRequests: 28 },
  { week: "Wk 3", ngosConnected: 6, pickUpRequests: 42 },
  { week: "Wk 4", ngosConnected: 8, pickUpRequests: 65 },
  { week: "Wk 5", ngosConnected: 10, pickUpRequests: 89 },
  { week: "Wk 6", ngosConnected: 12, pickUpRequests: 112 }
];

const MONTHLY_DONATIONS_TREND = [
  { month: "Jan", donorQty: 180, ngoQty: 120 },
  { month: "Feb", donorQty: 310, ngoQty: 250 },
  { month: "Mar", donorQty: 490, ngoQty: 410 },
  { month: "Apr", donorQty: 680, ngoQty: 620 },
  { month: "May", donorQty: 850, ngoQty: 790 },
  { month: "Jun", donorQty: 1120, ngoQty: 1080 }
];

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            Ecological & Social Impact Board
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time carbon offset logs, volunteer throughput levels, and food saving progression metrics.
          </p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 uppercase font-mono">
          <Sparkles className="w-4 h-4 animate-pulse" />
          Carbon Credit Score: AA+
        </div>
      </div>

      {/* Primary Charts Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Cumulative Food Saved (Area Chart) */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider font-sans">
              Cumulative Food Saved (kg) & CO₂ Reduced
            </h4>
            <p className="text-[11px] text-slate-400">Rescued edible provisions count vs matching estimated methane reduction.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="112%" height="100%" className="-ml-8">
              <AreaChart data={FOOD_SAVED_DATA}>
                <defs>
                  <linearGradient id="rescuedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff", fontSize: "11px" }} />
                <Legend iconType="circle" fontSize={11} />
                <Area type="monotone" name="Rescued Surplus (kg)" dataKey="rescued" stroke="#10b981" fillOpacity={1} fill="url(#rescuedColor)" strokeWidth={2} />
                <Area type="monotone" name="CO₂ Offset (kg)" dataKey="co2" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: People Fed by Meal Category (Bar Chart) */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider font-sans">
              Portions Distributed by Meal Category
            </h4>
            <p className="text-[11px] text-slate-400">Categorized human portion feeds mapped across community centers.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="112%" height="100%" className="-ml-8">
              <BarChart data={PEOPLE_FED_BY_CATEGORY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff", fontSize: "11px" }} />
                <Bar name="Portions Rescued" dataKey="meals" radius={[4, 4, 0, 0]} barSize={36}>
                  {PEOPLE_FED_BY_CATEGORY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Active NGOs Supported Network Progress (Line Chart) */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider font-sans">
              NGO Network Expansion & Fulfillment Speed
            </h4>
            <p className="text-[11px] text-slate-400">Fulfillment request volumes vs connected charities count across SF Bay Area.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="112%" height="100%" className="-ml-8">
              <LineChart data={NGOS_SUPPORTED_PROGRESS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff", fontSize: "11px" }} />
                <Legend iconType="circle" />
                <Line type="monotone" name="Connected Charities" dataKey="ngosConnected" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Complete Pickups Log" dataKey="pickUpRequests" stroke="#ec4899" strokeWidth={2} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Donations Trend (Stacked Area Chart) */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider font-sans">
              Rescued Surplus vs NGO Acceptance Volume
            </h4>
            <p className="text-[11px] text-slate-400">Total surplus food supplied by donors vs verified kilograms redeemed by partner charities.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="112%" height="100%" className="-ml-8">
              <AreaChart data={MONTHLY_DONATIONS_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", color: "#fff", fontSize: "11px" }} />
                <Legend iconType="circle" />
                <Area type="monotone" name="Supplied Surplus (kg)" dataKey="donorQty" stroke="#3b82f6" fill="#3b82f622" strokeWidth={2} />
                <Area type="monotone" name="Rescued by NGOs (kg)" dataKey="ngoQty" stroke="#f59e0b" fill="#f59e0b11" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* General impact credits */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 text-center space-y-2">
        <Globe className="w-8 h-8 text-emerald-500 mx-auto" />
        <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">
          UN Global Goal alignment: Zero Hunger & Sustainable Consumption
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The FoodSense AI Redistribution coordinates system addresses UNEP targets directly by eliminating retail storage waste. RESCUED offsets of 1.2 tonnes of food prevent equivalent garbage methane emissions, restoring nutrition loops.
        </p>
      </div>
    </div>
  );
}
