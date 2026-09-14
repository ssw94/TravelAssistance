import { apiClient } from '../../../services/apiClient';
import { AssistantResponse } from '../../../types';

export const assistantService = {
  chat: async (
    message: string,
    history?: Array<{ role: 'user' | 'assistant'; content: string }>,
  ): Promise<AssistantResponse> => {
    const res: any = await apiClient.post('/assistant/chat', { message, history });
    return res.data || res;
  },
};
export default assistantService;
