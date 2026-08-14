/**
 * Sample dashboard data.
 * Shaped like the future per-user payload so components can switch to live
 * data without changing their props.
 */

export type OverviewStat = {
  key: string;
  emoji: string;
  label: string;
  value: string;
  hint: string;
};

export type CareerProgress = {
  goal: string;
  targetRole: string;
  progress: number;
  nextStep: string;
};

export type SkillGapData = {
  have: string[];
  missing: string[];
  recommended: string[];
};

export type Recommendation = {
  title: string;
  description: string;
  impact: string;
};

export type DashboardData = {
  overview: OverviewStat[];
  progress: CareerProgress;
  skills: SkillGapData;
  recommendations: Recommendation[];
};

export const sampleDashboardData: DashboardData = {
  overview: [
    { key: "match", emoji: "🎯", label: "Career Match Score", value: "72%", hint: "Good fit for Data Analyst" },
    { key: "done", emoji: "📚", label: "Skills Completed", value: "8", hint: "of 18 tracked skills" },
    { key: "improve", emoji: "⚠️", label: "Skills to Improve", value: "5", hint: "3 marked high priority" },
    { key: "roadmap", emoji: "🗺️", label: "Roadmap Progress", value: "35%", hint: "Phase 2 of 5 in progress" },
  ],
  progress: {
    goal: "Break into data analytics within 6 months",
    targetRole: "Data Analyst",
    progress: 35,
    nextStep: "Learn SQL Basics",
  },
  skills: {
    have: ["Python", "Excel", "Data Cleaning", "Git", "Communication"],
    missing: ["SQL", "Statistics", "Power BI", "Pandas"],
    recommended: ["Data Storytelling", "A/B Testing", "dbt", "Dashboard Design"],
  },
  recommendations: [
    {
      title: "Improve your Python skills",
      description: "Move from basics to Pandas and NumPy so you can handle real analysis workloads.",
      impact: "High impact",
    },
    {
      title: "Build 2 portfolio projects",
      description: "A sales dashboard and a customer churn analysis will cover most interview questions.",
      impact: "Medium impact",
    },
    {
      title: "Practice SQL interview questions",
      description: "Focus on JOINs, window functions and aggregation before applying to roles.",
      impact: "High impact",
    },
  ],
};
