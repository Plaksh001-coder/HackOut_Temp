"""Supervised ML predictions trained from the industrial benchmark dataset."""

import os
from typing import Any, Dict

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(
    BACKEND_DIR, "emission_system", "data", "industrial_emissions_enhanced.csv"
)

CATEGORICAL_FEATURES = ["industry", "factory_size"]
INTERVENTION_CATEGORICAL_FEATURES = CATEGORICAL_FEATURES + ["top_hotspot"]
NUMERIC_FEATURES = [
    "production",
    "electricity_kwh",
    "natural_gas_scm",
    "diesel_litre",
    "raw_material_kg",
    "waste_kg",
    "budget",
    "reduction_target",
]
FEATURES = CATEGORICAL_FEATURES + NUMERIC_FEATURES
INTERVENTION_FEATURES = INTERVENTION_CATEGORICAL_FEATURES + NUMERIC_FEATURES


def _normalise_industry(value: Any) -> str:
    value = str(value or "").lower()
    if "textile" in value:
        return "Textile"
    if "automotive" in value:
        return "Automotive Parts"
    if "electronic" in value:
        return "Electronics"
    return str(value or "Unknown").title()


def _normalise_hotspot(value: Any) -> str:
    value = str(value or "Electricity").lower()
    if "gas" in value:
        return "Natural Gas"
    if "waste" in value:
        return "Waste"
    return "Electricity"


class GreenMindML:
    """Train lightweight classifiers once and predict factory priorities."""

    def __init__(self, data_path: str = DATA_PATH):
        self.data_path = data_path
        self.dataset = pd.read_csv(data_path)
        self.models = {
            "hotspot": self._train("top_hotspot"),
            "intervention": self._train("recommended_intervention"),
        }

    def _train(self, target: str) -> Pipeline:
        feature_columns = FEATURES if target == "top_hotspot" else INTERVENTION_FEATURES
        categorical_features = CATEGORICAL_FEATURES if target == "top_hotspot" else INTERVENTION_CATEGORICAL_FEATURES
        features = self.dataset[feature_columns].copy()
        features["industry"] = features["industry"].map(_normalise_industry)
        if "top_hotspot" in features:
            features["top_hotspot"] = features["top_hotspot"].map(_normalise_hotspot)
        preprocessor = ColumnTransformer(
            transformers=[
                ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical_features),
                ("numeric", "passthrough", NUMERIC_FEATURES),
            ]
        )
        model = RandomForestClassifier(
            n_estimators=160,
            max_depth=10,
            random_state=42,
            class_weight="balanced",
        )
        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("model", model),
        ])
        pipeline.fit(features, self.dataset[target].astype(str))
        return pipeline

    def _features(self, factory_profile: Dict[str, Any], hotspot: str) -> pd.DataFrame:
        activity = factory_profile.get("activity_data", factory_profile)
        row = {
            "industry": _normalise_industry(factory_profile.get("industry", "Unknown")),
            "factory_size": str(factory_profile.get("factory_size", "Medium")),
            "top_hotspot": _normalise_hotspot(hotspot),
            "production": float(factory_profile.get("production_volume", factory_profile.get("production", 100000)) or 0),
            "electricity_kwh": float(activity.get("electricity_kwh", 0) or 0),
            "natural_gas_scm": float(activity.get("natural_gas_m3", activity.get("natural_gas_scm", 0)) or 0),
            "diesel_litre": float(activity.get("diesel_litre", 0) or 0),
            "raw_material_kg": float(activity.get("raw_materials_kg", activity.get("raw_material_kg", 0)) or 0),
            "waste_kg": float(activity.get("waste_tonnes", 0) or 0) * 1000,
            "budget": float(factory_profile.get("budget_inr", factory_profile.get("budget", 500000)) or 0),
            "reduction_target": float(factory_profile.get("reduction_target_pct", factory_profile.get("reduction_target", 20)) or 0),
        }
        return pd.DataFrame([row], columns=INTERVENTION_FEATURES)

    def _prediction(self, model: Pipeline, features: pd.DataFrame) -> Dict[str, Any]:
        probabilities = model.predict_proba(features)[0]
        classes = model.named_steps["model"].classes_
        index = int(probabilities.argmax())
        return {
            "label": str(classes[index]),
            "confidence": round(float(probabilities[index]), 3),
        }

    def predict(self, factory_profile: Dict[str, Any], calculated_hotspot: str) -> Dict[str, Any]:
        all_features = self._features(factory_profile, calculated_hotspot)
        hotspot_features = all_features[FEATURES]
        hotspot = self._prediction(self.models["hotspot"], hotspot_features)
        intervention = self._prediction(self.models["intervention"], all_features)
        return {
            "hotspot": hotspot,
            "intervention": intervention,
            "model": "Random Forest classifiers trained on industrial benchmark data",
            "training_rows": int(len(self.dataset)),
            "features": {
                "hotspot": FEATURES,
                "intervention": INTERVENTION_FEATURES,
            },
            "authoritative_note": "Predictions support prioritization; deterministic emissions and financial calculations remain authoritative.",
        }
