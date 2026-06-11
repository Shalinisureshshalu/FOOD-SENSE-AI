import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor

# Ensure target directories exist
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")
os.makedirs(MODEL_DIR, exist_ok=True)

# Define exact categorical mappings to ensure consistent encoding between training and production
EVENT_TYPE_MAP = {'Wedding': 0, 'Corporate Event': 1, 'Birthday Party': 2, 'Festival': 3, 'Conference': 4}
SEASON_MAP = {'Summer': 0, 'Winter': 1, 'Rainy': 2}
DAY_TYPE_MAP = {'Weekday': 0, 'Weekend': 1}
MENU_TYPE_MAP = {'Vegetarian': 0, 'Non-Vegetarian': 1, 'Mixed': 2}

def generate_synthetic_data(num_samples=1200):
    np.random.seed(42)
    
    # 1. Expected Guests
    expected_guests = np.random.randint(50, 1000, size=num_samples)
    
    # 2. Event Types
    event_types_list = list(EVENT_TYPE_MAP.keys())
    event_types = np.random.choice(event_types_list, size=num_samples)
    
    # 3. Seasons
    seasons_list = list(SEASON_MAP.keys())
    seasons = np.random.choice(seasons_list, size=num_samples)
    
    # 4. Day Types
    day_types_list = list(DAY_TYPE_MAP.keys())
    day_types = np.random.choice(day_types_list, size=num_samples)
    
    # 5. Previous Waste (Kg)
    previous_waste = np.random.uniform(2, 60, size=num_samples)
    
    # 6. Historical Demand (Meals Consumed)
    # Historical demand typically correlates strongly with expected guests but has some variance
    historical_demand = expected_guests - np.random.randint(10, 150, size=num_samples)
    # Ensure it's not negative and doesn't exceed guests abnormally
    historical_demand = np.clip(historical_demand, 20, expected_guests - 5)
    
    # 7. Menu Type
    menu_types_list = list(MENU_TYPE_MAP.keys())
    menu_types = np.random.choice(menu_types_list, size=num_samples)
    
    # 8. Target Variable: SurplusFoodKg
    # Formulate a logical, realistic ground truth relation with randomized factors
    surplus_food = []
    for i in range(num_samples):
        # Base surplus calculated from difference of guests booked vs actually consumed, plus previous waste
        guest_diff = max(0, expected_guests[i] - historical_demand[i])
        base_surplus = guest_diff * 0.45 + previous_waste[i] * 0.3
        
        # Event Type multipliers
        et = event_types[i]
        if et == 'Wedding':
            base_surplus += 15.0 # Weddings highly wasteful
        elif et == 'Festival':
            base_surplus += 12.0 # Festivals have high buffer
        elif et == 'Corporate Event':
            base_surplus += 5.0
        elif et == 'Conference':
            base_surplus -= 3.0 # Conferences usually highly structured
            
        # Season factor
        s = seasons[i]
        if s == 'Summer':
            base_surplus += 6.5 # Summer spoilage
        elif s == 'Rainy':
            base_surplus += 3.0 # Wet humidity
            
        # Day Type factor
        dt = day_types[i]
        if dt == 'Weekend':
            base_surplus += 4.0 # Weekend buffer
            
        # Menu Type factor
        mt = menu_types[i]
        if mt == 'Non-Vegetarian':
            base_surplus += 8.0 # Non-veg buffer / preparation waste
        elif mt == 'Mixed':
            base_surplus += 5.0
            
        # Add slight statistical noise
        noise = np.random.normal(0, 2.5)
        final_surplus = max(1.5, base_surplus + noise)
        
        surplus_food.append(round(final_surplus, 1))
        
    df = pd.DataFrame({
        'ExpectedGuests': expected_guests,
        'EventType': [EVENT_TYPE_MAP[x] for x in event_types],
        'Season': [SEASON_MAP[x] for x in seasons],
        'DayType': [DAY_TYPE_MAP[x] for x in day_types],
        'PreviousWaste': previous_waste,
        'HistoricalDemand': historical_demand,
        'MenuType': [MENU_TYPE_MAP[x] for x in menu_types],
        'SurplusFoodKg': surplus_food
    })
    
    return df

def train_and_save():
    print("Generating training dataset for food surplus prediction...")
    df = generate_synthetic_data(1200)
    
    # Split features and target
    X = df[['ExpectedGuests', 'EventType', 'Season', 'DayType', 'PreviousWaste', 'HistoricalDemand', 'MenuType']]
    y = df['SurplusFoodKg']
    
    print("Fitting scikit-learn RandomForestRegressor...")
    model = RandomForestRegressor(
        n_estimators=120,
        max_depth=10,
        min_samples_split=4,
        random_state=42
    )
    model.fit(X, y)
    
    # Score checks
    score = model.score(X, y)
    print(f"Model fitted successfully! Training R^2 score: {score:.4f}")
    
    save_path = os.path.join(MODEL_DIR, "food_surplus_model.pkl")
    joblib.dump(model, save_path)
    print(f"Model successfully saved to: {save_path}")

if __name__ == "__main__":
    train_and_save()
