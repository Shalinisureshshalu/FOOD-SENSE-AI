export interface ForecastInput {
  week: number;
  centerId: string;
  mealId: string;
  checkoutPrice: number;
  basePrice: number;
  emailPromotion: boolean;
  homepageFeatured: boolean;
  cityCode: string;
  regionCode: string;
  operationalArea: number;
  category: string;
  cuisine: string;
  centerType: string;
}

export interface PredictionResult {
  predicted_orders: number;
  demand_level: "Low" | "Medium" | "High";
  inventory_action: string;
  ai_insights: string[];
}

export interface PredictionHistoryRecord {
  id: string;
  date: string;
  week: number;
  centerId: string;
  mealId: string;
  checkoutPrice: number;
  basePrice: number;
  emailPromotion: boolean;
  homepageFeatured: boolean;
  cityCode: string;
  regionCode: string;
  operationalArea: number;
  category: string;
  cuisine: string;
  centerType: string;
  predictedOrders: number;
  demandLevel: "Low" | "Medium" | "High";
  inventoryAction: string;
  aiInsights: string[];
}

export interface DashboardStats {
  totalPredictedOrders: number;
  averageDemand: number;
  avgGrowth: number;
  wasteReductionPercent: number;
}

export interface UserProfile {
  email: string;
  name: string;
  role: string;
  organization: string;
  defaultCenterId: string;
  defaultCenterType: string;
}

export interface DonationRecord {
  id: string;
  foodName: string;
  quantity: number;
  foodType: string;
  expiryTime: string;
  location: string;
  contact: string;
  image?: string;
  status: "Unassigned" | "NGO Assigned" | "En-Route" | "Arrived";
  assignedNgo?: string;
  timestamp: string;
  distance?: string;
  co2Saved: number;
}

export interface NgoPartner {
  id: string;
  name: string;
  lat: number;
  lng: number;
  acceptsCategories: string[];
  capacityStatus: "high" | "moderate" | "low";
  capacityText: string;
  contact: string;
}

export interface DispatchLog {
  id: string;
  timestamp: string;
  ngoName: string;
  mealName: string;
  quantity: number;
  distance: string;
  status: "Dispatched" | "Arrived" | "Transiting";
}

export interface SurplusInput {
  expectedGuests: number;
  eventType: string;
  season: string;
  dayType: string;
  previousWaste: number;
  historicalDemand: number;
  menuType: string;
}

export interface SurplusPredictionResult {
  predictedSurplusFood: number;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  recommendation: string;
}
