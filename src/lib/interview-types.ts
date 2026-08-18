export type ExperienceLevel = "Fresher" | "Intermediate" | "Experienced";
export type InterviewType = "HR" | "Technical" | "Mixed";

export type InterviewSetup = {
  targetRole: string;
  experienceLevel: ExperienceLevel;
  interviewType: InterviewType;
  questionCount: number;
};

export type InterviewQuestion = {
  id: number;
  question: string;
  category: string;
};

export type AnswerFeedback = {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  improvedAnswer: string;
};

export type InterviewResult = {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  answers: AnswerFeedback[];
  recommendation: string;
};

export type InterviewRecord = {
  id: string;
  targetRole: string;
  experienceLevel: string;
  interviewType: string;
  questionCount: number;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  createdAt: string;
  result: InterviewResult;
};

export type SubmitInterviewInput = InterviewSetup & {
  answers: Array<{ question: string; answer: string }>;
};
