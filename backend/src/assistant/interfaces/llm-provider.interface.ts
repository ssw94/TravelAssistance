export interface AssistantContext {
  userId?: string;
  userPreferredCurrency?: string;
  userTravelStyle?: string;
  activeTrips?: Array<{
    id: string;
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
  }>;
}

export interface AssistantPlanSuggestion {
  destination: string;
  durationDays: number;
  estimatedBudget: number;
  currency: string;
  highlights: string[];
  packingList?: string[];
  bestTimeToVisit?: string;
  dayByDayPlan: Array<{
    dayNumber: number;
    title: string;
    activities: Array<{
      time: string;
      title: string;
      type: string;
      cost: number;
      location?: string;
    }>;
  }>;
}

export interface AssistantResponse {
  reply: string;
  planSuggestion?: AssistantPlanSuggestion;
  quickReplies?: string[];
}

export interface ILlmProvider {
  generateResponse(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    context: AssistantContext,
  ): Promise<AssistantResponse>;
}
