export type ResumeAnalysisInput = {
  fileName: string;
  resumeText: string;
  targetRole: string;
  jobDescription?: string;
};

export type KeywordAnalysis = {
  presentKeywords: string[];
  missingKeywords: string[];
};

export type ResumeAnalysisResult = {
  score: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  keywords: KeywordAnalysis;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
};

export type ResumeAnalysisRecord = {
  id: string;
  fileName: string;
  targetRole: string;
  score: number;
  createdAt: string;
  result: ResumeAnalysisResult;
};
