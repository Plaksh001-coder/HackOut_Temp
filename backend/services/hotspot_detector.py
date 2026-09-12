from typing import Dict, List, Any

class HotspotDetector:
    def detect_hotspots(self, emission_results: Dict[str, Any]) -> Dict[str, Any]:
        sources = emission_results.get("sources", [])
        if not sources:
            return {
                "top_hotspot": None,
                "hotspots": [],
                "summary": "No emission sources detected. Please input factory activity data.",
                "actionable_priority": "Awaiting Data"
            }

        # Sort sources in descending order of CO2e tonnes
        sorted_sources = sorted(sources, key=lambda x: x.get("co2e_tonnes", 0), reverse=True)
        total_emissions = emission_results.get("total_co2e_tonnes", 0)

        hotspots = []
        for index, s in enumerate(sorted_sources):
            pct = s.get("percentage", 0.0)
            # Priority classification
            if index == 0 or pct >= 35.0:
                priority = "Critical Priority"
                badge_color = "red"
            elif pct >= 20.0:
                priority = "High Priority"
                badge_color = "amber"
            elif pct >= 10.0:
                priority = "Medium Priority"
                badge_color = "blue"
            else:
                priority = "Low Priority"
                badge_color = "emerald"

            # Contextual reduction opportunity note
            src_name = s.get("source", "")
            if src_name == "Electricity":
                opp = "Rooftop solar, IE4 motor upgrades, and VFD compressors offer high ROI."
            elif src_name == "Natural Gas":
                opp = "Boiler economizers, heat recovery, and steam pipe insulation cut fuel by 15-25%."
            elif src_name == "Raw Materials":
                opp = "Material substitution and scrap reduction during cutting/milling."
            elif src_name == "Waste Generation":
                opp = "Zero-waste-to-landfill recycling and in-house material recovery."
            else:
                opp = "Operational efficiency improvements and equipment monitoring."

            hotspots.append({
                "rank": index + 1,
                "source": src_name,
                "co2e_tonnes": s.get("co2e_tonnes", 0),
                "percentage": pct,
                "scope": s.get("scope", "Scope 2"),
                "priority": priority,
                "badge_color": badge_color,
                "reduction_opportunity": opp,
                "explanation": (
                    f"{src_name} represents {pct}% ({s.get('co2e_tonnes')} tCO₂e) of your total annual carbon footprint. "
                    f"Direct focus on this category yields the steepest reduction curve."
                )
            })

        top_hotspot = hotspots[0] if hotspots else None
        summary_msg = ""
        if top_hotspot:
            summary_msg = (
                f"{top_hotspot['source']} is your largest emission hotspot, "
                f"contributing approximately {top_hotspot['percentage']}% of your estimated footprint "
                f"({top_hotspot['co2e_tonnes']} tCO₂e/year)."
            )

        return {
            "top_hotspot": top_hotspot,
            "hotspots": hotspots,
            "summary": summary_msg,
            "total_evaluated_sources": len(hotspots),
            "primary_source_name": top_hotspot["source"] if top_hotspot else "None"
        }
