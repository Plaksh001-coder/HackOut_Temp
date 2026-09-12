import {
  ActivityData,
  EmissionSource,
  EmissionCalculation,
  HotspotAnalysis,
  RecommendationResult,
  SimulationParams,
  SimulationResult,
  SavedScenario,
  FactoryProfile
} from '../types';

export const DEMO_FACTORY: FactoryProfile = {
  id: "demo-greentex",
  name: "GreenTex Manufacturing",
  industry: "Textile Manufacturing",
  location: "Surat, Gujarat, India",
  production_type: "Woven & Knit Textiles",
  production_volume: 500000,
  production_volume_unit: "meters/year",
  activity_data: {
    electricity_kwh: 100000,
    natural_gas_m3: 25000,
    raw_materials_kg: 5500,
    waste_tonnes: 25
  },
  sustainability_goals: "Achieve 20% carbon footprint reduction in FY 2026-2027",
  reduction_target_pct: 20,
  budget_inr: 500000,
  created_at: "2026-09-12T10:00:00Z"
};

export const INITIAL_SAVED_SCENARIOS: SavedScenario[] = [
  {
    id: "sim-demo-1",
    factory_id: "demo-greentex",
    scenario_name: "20% Efficiency & Smart LED",
    baseline_emissions: 172.5,
    scenario_emissions: 138.0,
    reduction: 34.5,
    reduction_pct: 20.0,
    estimated_cost: 295000,
    estimated_savings: 184000,
    payback: 1.6,
    created_at: "2026-09-12T10:15:00Z"
  }
];

export function calculateEmissionsDeterministic(
  activity: ActivityData,
  geography: string = "India (CEA)"
): EmissionCalculation {
  const elecFactor = geography === "USA (EPA)" ? 0.386 : (geography === "Global (IEA)" ? 0.475 : 0.82);
  const gasFactor = 2.03;
  const matFactor = 4.50;
  const wasteFactor = 580.0; // kg CO2e per tonne

  const sources: EmissionSource[] = [];
  const scopeTotals = { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 };

  // 1. Electricity
  if (activity.electricity_kwh > 0) {
    const co2Tonnes = (activity.electricity_kwh * elecFactor) / 1000.0;
    scopeTotals['Scope 2'] += co2Tonnes;
    sources.push({
      source: "Electricity",
      category: "Grid Power",
      activity: "grid_electricity",
      value: activity.electricity_kwh,
      unit: "kWh",
      emission_factor: elecFactor,
      factor_unit: "kg CO2e/kWh",
      co2e_tonnes: Number(co2Tonnes.toFixed(2)),
      scope: 'Scope 2' as const,
      confidence: "High",
      source_ref: "Central Electricity Authority CO2 Baseline (2024)"
    });
  }

  // 2. Natural Gas
  if (activity.natural_gas_m3 > 0) {
    const co2Tonnes = (activity.natural_gas_m3 * gasFactor) / 1000.0;
    scopeTotals['Scope 1'] += co2Tonnes;
    sources.push({
      source: "Natural Gas",
      category: "Stationary Combustion",
      activity: "natural_gas",
      value: activity.natural_gas_m3,
      unit: "m³",
      emission_factor: gasFactor,
      factor_unit: "kg CO2e/m³",
      co2e_tonnes: Number(co2Tonnes.toFixed(2)),
      scope: 'Scope 1' as const,
      confidence: "High",
      source_ref: "IPCC National GHG Guidelines (2023)"
    });
  }

  // 3. Raw Materials
  if (activity.raw_materials_kg > 0) {
    const co2Tonnes = (activity.raw_materials_kg * matFactor) / 1000.0;
    scopeTotals['Scope 3'] += co2Tonnes;
    sources.push({
      source: "Raw Materials",
      category: "Upstream Embodied",
      activity: "raw_cotton_textile",
      value: activity.raw_materials_kg,
      unit: "kg",
      emission_factor: matFactor,
      factor_unit: "kg CO2e/kg",
      co2e_tonnes: Number(co2Tonnes.toFixed(2)),
      scope: 'Scope 3' as const,
      confidence: "Medium",
      source_ref: "Higg Materials Sustainability Index (2023)"
    });
  }

  // 4. Waste
  if (activity.waste_tonnes > 0) {
    const co2Tonnes = (activity.waste_tonnes * wasteFactor) / 1000.0;
    scopeTotals['Scope 3'] += co2Tonnes;
    sources.push({
      source: "Waste Generation",
      category: "Disposal / Landfill",
      activity: "industrial_landfill_waste",
      value: activity.waste_tonnes,
      unit: "tonnes",
      emission_factor: wasteFactor,
      factor_unit: "kg CO2e/tonne",
      co2e_tonnes: Number(co2Tonnes.toFixed(2)),
      scope: 'Scope 3' as const,
      confidence: "High",
      source_ref: "IPCC Solid Waste Greenhouse Gas Factors (2023)"
    });
  }

  const total = sources.reduce((acc, s) => acc + s.co2e_tonnes, 0);

  sources.forEach(s => {
    s.percentage = total > 0 ? Number(((s.co2e_tonnes / total) * 100).toFixed(1)) : 0;
  });

  const seasonality = [0.075, 0.078, 0.082, 0.086, 0.092, 0.095, 0.088, 0.084, 0.081, 0.080, 0.079, 0.080];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthly_trend = months.map((m, idx) => ({
    month: m,
    emissions_tco2e: Number((total * seasonality[idx]).toFixed(2))
  }));

  return {
    total_co2e_tonnes: Number(total.toFixed(2)),
    sources,
    scope_breakdown: {
      'Scope 1': Number(scopeTotals['Scope 1'].toFixed(2)),
      'Scope 2': Number(scopeTotals['Scope 2'].toFixed(2)),
      'Scope 3': Number(scopeTotals['Scope 3'].toFixed(2))
    },
    monthly_trend,
    assumptions: [
      `Grid electricity factor: ${elecFactor} kg CO₂e/kWh (${geography}).`,
      `Natural gas stoichiometric factor: 2.03 kg CO₂e/m³.`,
      `Textile yarn embodied footprint: 4.50 kg CO₂e/kg.`,
      `Industrial solid waste disposal: 580 kg CO₂e/tonne.`
    ],
    geography,
    calculation_status: "VALIDATED_DETERMINISTIC"
  };
}

export function detectHotspotsDeterministic(calculation: EmissionCalculation): HotspotAnalysis {
  const sorted = [...calculation.sources].sort((a, b) => b.co2e_tonnes - a.co2e_tonnes);

  const hotspots = sorted.map((s, idx) => {
    const pct = s.percentage || 0;
    let priority = "Low Priority";
    let badge_color: 'red' | 'amber' | 'blue' | 'emerald' = "emerald";

    if (idx === 0 || pct >= 35) {
      priority = "Critical Priority";
      badge_color = "red";
    } else if (pct >= 20) {
      priority = "High Priority";
      badge_color = "amber";
    } else if (pct >= 10) {
      priority = "Medium Priority";
      badge_color = "blue";
    }

    let opp = "Operational efficiency improvements and equipment monitoring.";
    if (s.source === "Electricity") {
      opp = "Rooftop solar, IE4 motor upgrades, and VFD compressors offer high ROI.";
    } else if (s.source === "Natural Gas") {
      opp = "Boiler economizers, heat recovery, and steam pipe insulation cut fuel by 15-25%.";
    } else if (s.source === "Raw Materials") {
      opp = "Material substitution and scrap reduction during cutting/milling.";
    } else if (s.source === "Waste Generation") {
      opp = "Zero-waste-to-landfill recycling and in-house material recovery.";
    }

    return {
      rank: idx + 1,
      source: s.source,
      co2e_tonnes: s.co2e_tonnes,
      percentage: pct,
      scope: s.scope,
      priority,
      badge_color,
      reduction_opportunity: opp,
      explanation: `${s.source} accounts for ${pct}% (${s.co2e_tonnes} tCO₂e) of your total annual carbon footprint. Targeted action here produces the most rapid decarbonization.`
    };
  });

  const top = hotspots[0] || null;
  const summary = top
    ? `${top.source} is your largest emission hotspot, contributing approximately ${top.percentage}% of your estimated footprint (${top.co2e_tonnes} tCO₂e/year).`
    : "No emission sources detected.";

  return {
    top_hotspot: top,
    hotspots,
    summary,
    total_evaluated_sources: hotspots.length,
    primary_source_name: top ? top.source : "None"
  };
}

export function generateRecommendationsDeterministic(
  hotspot: HotspotAnalysis,
  budgetInr: number = 500000
): RecommendationResult {
  const topName = hotspot.primary_source_name;

  const catalog = [
    {
      intervention: "LED + Smart Sensor Retrofit",
      target_hotspot: "Electricity",
      category: "Energy Efficiency",
      cost: 75000,
      reduction: 8.2,
      feasibility: "Very High",
      payback: 0.9,
      source: "Bureau of Energy Efficiency Benchmark"
    },
    {
      intervention: "IE4 Super-Premium Motor Upgrade",
      target_hotspot: "Electricity",
      category: "Energy Efficiency",
      cost: 180000,
      reduction: 16.5,
      feasibility: "High",
      payback: 1.8,
      source: "UNIDO Industrial Energy Accelerator"
    },
    {
      intervention: "Rooftop Solar PV Installation (25 kWp)",
      target_hotspot: "Electricity",
      category: "Renewable Energy",
      cost: 450000,
      reduction: 32.8,
      feasibility: "Medium",
      payback: 3.4,
      source: "MNRE Commercial Solar Benchmark"
    },
    {
      intervention: "Compressed Air Leak Repair & VFD",
      target_hotspot: "Electricity",
      category: "Process Optimization",
      cost: 95000,
      reduction: 11.0,
      feasibility: "High",
      payback: 0.8,
      source: "US DOE Industrial Technologies"
    },
    {
      intervention: "Waste Heat Recovery for Boiler Pre-heating",
      target_hotspot: "Natural Gas",
      category: "Heat Recovery",
      cost: 220000,
      reduction: 24.4,
      feasibility: "Medium",
      payback: 1.9,
      source: "AEEE Industrial Benchmark"
    },
    {
      intervention: "Boiler Economizer & Pipe Insulation",
      target_hotspot: "Natural Gas",
      category: "Heat Recovery",
      cost: 120000,
      reduction: 15.2,
      feasibility: "High",
      payback: 1.1,
      source: "CII Carbon Mitigation Guide"
    },
    {
      intervention: "Fabric Scrap In-house Shredding & Re-spinning",
      target_hotspot: "Waste Generation",
      category: "Waste Reduction",
      cost: 150000,
      reduction: 14.5,
      feasibility: "Medium",
      payback: 2.2,
      source: "Textile Decarbonization Roadmap"
    },
    {
      intervention: "Power Factor Correction Capacitor Bank",
      target_hotspot: "Electricity",
      category: "Energy Efficiency",
      cost: 60000,
      reduction: 6.5,
      feasibility: "High",
      payback: 0.7,
      source: "BEE Industrial Energy Guide"
    }
  ];

  const scored = catalog.map((item) => {
    const isWithin = item.cost <= budgetInr;
    let bracket: 'Low Cost' | 'Medium Cost' | 'High Investment' = 'Low Cost';
    if (item.cost > 300000) bracket = 'High Investment';
    else if (item.cost > 100000) bracket = 'Medium Cost';

    const annualSavings = Math.round(item.cost / item.payback);

    // Scoring formula: Impact (35%) + Feasibility (20%) + Cost Efficiency (25%) + Payback (20%) + Hotspot match bonus
    const hotspotBonus = item.target_hotspot.toLowerCase() === topName.toLowerCase() ? 15 : 0;
    const impactScore = (item.reduction / 35.0) * 35;
    const costEffScore = (item.reduction / (item.cost / 10000)) * 5;
    const paybackScore = Math.max(0, (5 - item.payback) / 5) * 20;
    const totalScore = Math.min(99.5, Number((impactScore + costEffScore + paybackScore + hotspotBonus + (isWithin ? 10 : 0)).toFixed(1)));

    return {
      rank: 1,
      intervention: item.intervention,
      target_hotspot: item.target_hotspot,
      category: item.category,
      estimated_cost_inr: item.cost,
      expected_co2_reduction_tco2e: item.reduction,
      feasibility: item.feasibility,
      payback_years: item.payback,
      estimated_annual_savings_inr: annualSavings,
      cost_bracket: bracket,
      within_budget: isWithin,
      score: totalScore,
      source: item.source,
      why_recommended: `Directly targets ${item.target_hotspot}. Delivers ${item.reduction} tCO₂e reduction with payback in ${item.payback} years (₹${annualSavings.toLocaleString('en-IN')}/year savings). ${isWithin ? 'Fits within your sustainability budget.' : 'High ROI long-term upgrade.'}`
    };
  });

  scored.sort((a, b) => b.score - a.score);
  scored.forEach((s, idx) => { s.rank = idx + 1; });

  const topThree = scored.slice(0, 3);
  const totalReduction = Number(scored.slice(0, 4).reduce((a, b) => a + b.expected_co2_reduction_tco2e, 0).toFixed(1));
  const totalCost = scored.slice(0, 4).reduce((a, b) => a + b.estimated_cost_inr, 0);
  const totalSavings = scored.slice(0, 4).reduce((a, b) => a + b.estimated_annual_savings_inr, 0);

  return {
    recommendations: scored,
    top_three: topThree,
    total_potential_reduction_tco2e: totalReduction,
    recommended_investment_inr: totalCost,
    potential_annual_savings_inr: totalSavings,
    user_budget_inr: budgetInr,
    weights_used: { impact: 0.35, cost_efficiency: 0.25, payback: 0.20, budget: 0.20 }
  };
}

export function simulateDeterministic(
  activity: ActivityData,
  params: SimulationParams,
  geography: string = "India (CEA)"
): SimulationResult {
  const baseline = calculateEmissionsDeterministic(activity, geography);
  const baselineTotal = baseline.total_co2e_tonnes;

  const elecRed = Math.max(0, Math.min(params.electricity_reduction_pct || 0, 70));
  const renewShift = Math.max(0, Math.min(params.renewable_shift_pct || 0, 100));
  const fuelRed = Math.max(0, Math.min(params.fuel_reduction_pct || 0, 70));
  const matRed = Math.max(0, Math.min(params.material_reduction_pct || 0, 50));
  const wasteRed = Math.max(0, Math.min(params.waste_reduction_pct || 0, 70));

  const elecAfterEff = activity.electricity_kwh * (1 - elecRed / 100);
  const finalGridElec = elecAfterEff * (1 - renewShift / 100);
  const finalGas = activity.natural_gas_m3 * (1 - fuelRed / 100);
  const finalMat = activity.raw_materials_kg * (1 - matRed / 100);
  const finalWaste = activity.waste_tonnes * (1 - wasteRed / 100);

  const scenarioCalc = calculateEmissionsDeterministic(
    {
      electricity_kwh: finalGridElec,
      natural_gas_m3: finalGas,
      raw_materials_kg: finalMat,
      waste_tonnes: finalWaste
    },
    geography
  );

  const scenarioTotal = scenarioCalc.total_co2e_tonnes;
  const reduction = Math.max(0, Number((baselineTotal - scenarioTotal).toFixed(2)));
  const reductionPct = baselineTotal > 0 ? Number(((reduction / baselineTotal) * 100).toFixed(1)) : 0;

  // Financial modeling
  const savedElecKwh = activity.electricity_kwh - finalGridElec;
  const savedGasM3 = activity.natural_gas_m3 - finalGas;
  const savedWasteT = activity.waste_tonnes - finalWaste;

  const annualSavings = Math.round(
    savedElecKwh * 8.50 +
    savedGasM3 * 48.00 +
    savedWasteT * 2500.00
  );

  const capex = Math.round(
    (activity.electricity_kwh * (elecRed / 100)) * 2.2 +
    (elecAfterEff * (renewShift / 100)) * 5.8 +
    (activity.natural_gas_m3 * (fuelRed / 100)) * 28.0 +
    savedWasteT * 4000.0
  );

  const payback = annualSavings > 0 ? Number((capex / annualSavings).toFixed(1)) : 0.0;

  const comparison_breakdown = baseline.sources.map((b) => {
    const matched = scenarioCalc.sources.find(s => s.source === b.source);
    const scenVal = matched ? matched.co2e_tonnes : 0;
    return {
      source: b.source,
      baseline_tco2e: b.co2e_tonnes,
      scenario_tco2e: scenVal,
      reduction_tco2e: Number((b.co2e_tonnes - scenVal).toFixed(2))
    };
  });

  return {
    baseline_total_tco2e: baselineTotal,
    scenario_total_tco2e: scenarioTotal,
    co2_reduction_tco2e: reduction,
    reduction_percentage: reductionPct,
    estimated_implementation_cost_inr: capex,
    estimated_annual_savings_inr: annualSavings,
    payback_years: payback,
    scenario_params: params,
    comparison_breakdown,
    new_scope_breakdown: scenarioCalc.scope_breakdown,
    environmental_equivalent: {
      trees_planted_equivalent: Math.round(reduction * 45),
      cars_off_road_equivalent: Number((reduction / 4.6).toFixed(1))
    }
  };
}
