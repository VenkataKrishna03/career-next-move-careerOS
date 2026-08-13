export type RoadmapInput = {
  education: string;
  skills: string;
  targetRole: string;
  experienceLevel: string;
  hoursPerDay: string;
};

export type RoadmapPhase = {
  title: string;
  duration: string;
  focus: string;
  tasks: string[];
};

export type SkillGap = {
  skill: string;
  why: string;
  priority: "high" | "medium" | "low" | string;
};

export type RoadmapProject = {
  name: string;
  description: string;
  skills: string[];
};

export type CareerRoadmap = {
  careerPath: string;
  summary: string;
  readinessScore: number;
  currentSkills: string[];
  skillGaps: SkillGap[];
  phases: RoadmapPhase[];
  weeklyPlan: string[];
  projects: RoadmapProject[];
  jobReadinessTips: string[];
};
