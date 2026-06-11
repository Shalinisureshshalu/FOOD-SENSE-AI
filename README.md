
# 🍽️ AI Food Waste Redistribution Network

## 📌 Overview

AI Food Waste Redistribution Network is an intelligent platform designed to reduce food waste and combat hunger by connecting food donors such as hotels, restaurants, wedding halls, hostels, and supermarkets with NGOs and shelters.

The system uses Machine Learning to predict surplus food before it becomes waste and recommends nearby NGOs for redistribution.


## 🚀 Problem Statement

India faces a major challenge where millions of people experience food insecurity while large quantities of edible food are wasted every day.

Current food donation systems are mostly manual and reactive, resulting in:

* Food wastage
* Delayed redistribution
* Poor coordination between donors and NGOs
* Lack of predictive planning

This project aims to solve these challenges using Artificial Intelligence and Machine Learning.

## 💡 Proposed Solution

The platform predicts surplus food using historical food consumption data and enables efficient redistribution through NGO recommendations.

The system:

* Predicts surplus food quantity
* Estimates how many people can be fed
* Identifies potential food waste risks
* Connects donors with nearby NGOs
* Maintains donation and prediction history
* Provides analytics and reporting dashboards

## 🧠 Machine Learning Module

### Objective

Predict surplus food before it becomes waste.

### Input Features

* Source Type (Wedding Hall, Hotel, Hostel, etc.)
* Expected Guests / Customers
* Historical Demand
* Previous Waste
* Season
* Day Type
* Menu Type
* Meals Prepared

### Output

* Predicted Surplus Food (Kg)
* Estimated Meals Available
* Estimated People That Can Be Fed
* Risk Level

### Algorithm Used

✅ Random Forest Regressor

Why Random Forest?

* Handles non-linear relationships
* Works well with tabular datasets
* Reduces overfitting
* Provides high prediction accuracy
* Supports feature importance analysis

## 🔄 System Workflow

Donor Registers
↓
Login
↓
Select Source Type
↓
Enter Event / Food Details
↓
ML Model Predicts Surplus Food
↓
People Fed Estimation
↓
Nearby NGO Recommendation
↓
Donation Created
↓
NGO Accepts Donation
↓
Food Redistributed
↓
Analytics Updated

## 🏗️ Tech Stack

### Frontend

* React.js
* Material UI
* React Router
* Axios
* Recharts

### Backend

* FastAPI / Flask
* Python

### Database

* Firebase Authentication
* Firebase Firestore

### Machine Learning

* Scikit-Learn
* Pandas
* NumPy
* Joblib

## 📂 Project Structure

frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   ├── App.js
│   └── index.js

backend/
│
├── model/
│   ├── food_surplus_model.pkl
│
├── app.py
├── requirements.txt
└── database.py

## ✨ Features

### Donor Module

* Registration & Login
* Add Food Donations
* Surplus Food Prediction
* Donation History

### NGO Module

* View Available Donations
* Accept Donations
* Donation Tracking

### Admin Module

* Manage Donors
* Manage NGOs
* Generate Reports
* Analytics Dashboard

### AI Features

* Surplus Food Prediction
* People Fed Estimation
* NGO Recommendation System



