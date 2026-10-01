export const applicationStages = ["applied", "screening", "interview", "offer", "hired", "rejected"] as const;
export type ApplicationStage = (typeof applicationStages)[number];
