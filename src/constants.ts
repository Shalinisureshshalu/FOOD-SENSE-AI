export interface MealOption {
  id: string;
  name: string;
  category: string;
  cuisine: string;
  defaultBasePrice: number;
}

export const MEAL_OPTIONS: MealOption[] = [
  { id: "1062", name: "Spiced Shahi Ginger Sharbat", category: "Beverages", cuisine: "Thai", defaultBasePrice: 150.0 },
  { id: "1108", name: "Kadak Masala Chai & Filter Coffee Combo", category: "Beverages", cuisine: "Thai", defaultBasePrice: 120.0 },
  { id: "1438", name: "Sweet Kesar Mango Lassi", category: "Beverages", cuisine: "Continental", defaultBasePrice: 180.0 },
  { id: "1727", name: "Chilled Mint Jaljeera Nimbu Pani", category: "Beverages", cuisine: "Italian", defaultBasePrice: 100.0 },
  { id: "1778", name: "Homestyle Dal Tadka & Jeera Rice Thali", category: "Rice Bowl", cuisine: "Indian", defaultBasePrice: 190.0 },
  { id: "1971", name: "Royal Awadhi Veg Dum Biryani with Raita", category: "Rice Bowl", cuisine: "Indian", defaultBasePrice: 280.0 },
  { id: "1248", name: "Mumbai Veg Grilled Cheese Masala Toast", category: "Sandwich", cuisine: "Continental", defaultBasePrice: 140.0 },
  { id: "2539", name: "Paneer Tikka Desi Naanza (Pizza Style)", category: "Pizza", cuisine: "Italian", defaultBasePrice: 320.0 },
  { id: "2707", name: "Crispy Spicy Potato Aloo Tikki Burger", category: "Burger", cuisine: "Italian", defaultBasePrice: 110.0 },
  { id: "2139", name: "Hot Desi Masala Pasta with Sautéed Veggies", category: "Pasta", cuisine: "Italian", defaultBasePrice: 160.0 },
  { id: "2631", name: "Fresh Cucumber Sprouted Chana Salad", category: "Salad", cuisine: "Italian", defaultBasePrice: 90.0 },
  { id: "2290", name: "Crispy Samosas & Hot Paneer Pakodas Combo", category: "Starters", cuisine: "Continental", defaultBasePrice: 120.0 },
  { id: "1543", name: "Hot Gulab Jamun with Creamy Rabri Core", category: "Desert", cuisine: "Continental", defaultBasePrice: 140.0 },
  { id: "1101", name: "Creamy Butter Garlic Paneer Malai Tikka", category: "Seafood", cuisine: "Continental", defaultBasePrice: 350.0 },
];

export const CATEGORIES = [
  "Beverages",
  "Rice Bowl",
  "Starters",
  "Sandwich",
  "Pizza",
  "Burger",
  "Pasta",
  "Salad",
  "Desert",
  "Seafood",
];

export const CUISINES = ["Italian", "Thai", "Indian", "Continental"];

export const CENTER_TYPES = [
  { value: "TYPE_A", label: "TYPE_A: Large Premium In-House Hub" },
  { value: "TYPE_B", label: "TYPE_B: Mid-Scale Deli/Cloud Kitchen" },
  { value: "TYPE_C", label: "TYPE_C: Fast Pickup Depot" },
];

export const CENTER_IDS = [
  { value: "10", label: "Center 10 (HQ Regional)" },
  { value: "24", label: "Center 24 (Metro Hub)" },
  { value: "55", label: "Center 55 (Urban Express)" },
  { value: "72", label: "Center 72 (Campus Kitchen)" },
  { value: "186", label: "Center 186 (Suburban Outlet)" },
];

export const CITY_REGION_MAPPING: Record<string, { cityCode: string; regionCode: string; defaultArea: number }> = {
  "10": { cityCode: "512", regionCode: "34", defaultArea: 4.8 },
  "24": { cityCode: "590", regionCode: "56", defaultArea: 3.8 },
  "55": { cityCode: "647", regionCode: "56", defaultArea: 4.5 },
  "72": { cityCode: "614", regionCode: "85", defaultArea: 2.4 },
  "186": { cityCode: "702", regionCode: "23", defaultArea: 5.1 },
};
