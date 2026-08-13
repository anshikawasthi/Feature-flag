export interface ExperimentDefinition {
  flagKey: string;
  name: string;
  hypothesis: string;
}

export const EXPERIMENTS: ExperimentDefinition[] = [
  {
    flagKey: "pricing_experiment",
    name: "Pricing Page Experiment",
    hypothesis: "Tiered pricing increases upgrade conversion vs. flat pricing.",
  },
  {
    flagKey: "button_color_experiment",
    name: "CTA Button Color Experiment",
    hypothesis: "A green primary CTA increases click-through vs. blue.",
  },
  {
    flagKey: "search_experiment",
    name: "Search Ranking Experiment",
    hypothesis: "AI-ranked results improve search result engagement vs. classic ranking.",
  },
  {
    flagKey: "recommendation_experiment",
    name: "Recommendation Engine Experiment",
    hypothesis: "Personalized recommendations increase engagement vs. popularity-based.",
  },
];
