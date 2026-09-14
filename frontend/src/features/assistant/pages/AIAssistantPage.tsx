import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { assistantService } from '../services/assistantService';
import { tripService } from '../../trips/services/tripService';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import { AssistantResponse, AssistantPlanSuggestion } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import Heading, { SubHeading } from '../../../components/Heading';
import Button from '../../../components/Button';
import dayjs from 'dayjs';

export const AIAssistantPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      role: 'user' | 'assistant';
      content: string;
      planSuggestion?: AssistantPlanSuggestion;
      quickReplies?: string[];
    }>
  >([
    {
      role: 'assistant',
      content: `Hello ${user?.firstName || 'Traveler'}! 🌍 I am your AI Travel Assistant. I can generate full day-by-day itineraries, estimate budgets, suggest packing lists, and help you find hidden local gems.

What destination or travel style are you thinking about?`,
      quickReplies: [
        'Plan a 5-day Goa trip under ₹30,000',
        'What should I pack for Kerala in December?',
        'Suggest family-friendly places near Mumbai',
        'What can I do in Jaipur in 3 days?',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, content: text.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      const response: AssistantResponse = await assistantService.chat(text.trim(), historyPayload);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
          planSuggestion: response.planSuggestion,
          quickReplies: response.quickReplies,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTripFromPlan = async (plan: AssistantPlanSuggestion) => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please log in to save this trip to your account', severity: 'warning' }));
      return;
    }

    try {
      const today = dayjs();
      const startDate = today.add(14, 'day').format('YYYY-MM-DD');
      const endDate = today.add(14 + plan.durationDays - 1, 'day').format('YYYY-MM-DD');

      await tripService.create({
        name: `${plan.destination} AI Planned Journey`,
        destination: plan.destination,
        startDate,
        endDate,
        numberOfTravelers: 2,
        budget: plan.estimatedBudget,
        currency: plan.currency || 'INR',
        notes: `AI Plan highlights:\n${plan.highlights?.join('\n')}`,
      });

      dispatch(showToast({ message: `🎉 Trip to ${plan.destination} created successfully! Check your Trips page.`, severity: 'success' }));
    } catch {
      dispatch(showToast({ message: 'Failed to create trip from AI plan', severity: 'error' }));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Heading badge="24/7 AI Companion">AI Travel Assistant</Heading>
        <SubHeading>
          Conversational travel intelligence powered to generate custom itineraries, packing guides, and budget optimization.
        </SubHeading>
      </Box>

      {/* Suggested Prompt Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: '🏖️ 5-Day Goa Beach Getaway', prompt: 'Plan a 5-day Goa trip under ₹30,000' },
          { title: '🧳 Kerala Winter Packing Guide', prompt: 'What should I pack for Kerala in December?' },
          { title: '👨‍👩‍👧 Weekend Escapes near Mumbai', prompt: 'Suggest family-friendly places near Mumbai' },
          { title: '🏰 3-Day Royal Jaipur Tour', prompt: 'What can I do in Jaipur in 3 days?' },
        ].map((card, i) => (
          <Grid item key={i} xs={12} sm={6} md={3}>
            <Card
              onClick={() => handleSendMessage(card.prompt)}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 16px rgba(2, 132, 199, 0.12)',
                },
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                &ldquo;{card.prompt}&rdquo;
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Full Chat Container */}
      <Paper
        sx={{
          borderRadius: 4,
          height: '68vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        {/* Chat Feed */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  maxWidth: { xs: '92%', md: '75%' },
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                {msg.role === 'assistant' && (
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', mt: 0.5 }}>
                    <SmartToyIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3.5,
                    bgcolor:
                      msg.role === 'user'
                        ? 'primary.main'
                        : (theme) => (theme.palette.mode === 'light' ? '#ffffff' : '#1e293b'),
                    color: msg.role === 'user' ? '#ffffff' : 'text.primary',
                    border: msg.role === 'assistant' ? (theme) => `1px solid ${theme.palette.divider}` : 'none',
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                    {msg.content}
                  </Typography>
                </Paper>
              </Box>

              {/* Plan Suggestion Card */}
              {msg.planSuggestion && (
                <Card
                  sx={{
                    mt: 2,
                    ml: { xs: 0, sm: 6 },
                    maxWidth: { xs: '100%', md: '75%' },
                    borderRadius: 3,
                    bgcolor: (theme) => (theme.palette.mode === 'light' ? '#ffffff' : '#1e293b'),
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                          📍 {msg.planSuggestion.destination}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Suggested Duration: {msg.planSuggestion.durationDays} Days • Best Time: {msg.planSuggestion.bestTimeToVisit}
                        </Typography>
                      </Box>
                      <Chip
                        label={`Est. ${formatCurrency(msg.planSuggestion.estimatedBudget, msg.planSuggestion.currency)}`}
                        size="medium"
                        color="secondary"
                        sx={{ fontWeight: 800, fontSize: '0.9rem' }}
                      />
                    </Box>

                    {/* Highlights */}
                    {msg.planSuggestion.highlights && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                          Top Highlights:
                        </Typography>
                        <Grid container spacing={1}>
                          {msg.planSuggestion.highlights.map((h, i) => (
                            <Grid item key={i} xs={12} sm={6}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', gap: 0.8 }}>
                                ✓ {h}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {/* Packing Checklist */}
                    {msg.planSuggestion.packingList && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                          Recommended Packing Checklist:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                          {msg.planSuggestion.packingList.map((p, i) => (
                            <Chip key={i} label={p} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Day by Day Plan Preview */}
                    {msg.planSuggestion.dayByDayPlan && (
                      <Box sx={{ mb: 2.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                          Day-by-Day Schedule:
                        </Typography>
                        {msg.planSuggestion.dayByDayPlan.map((d) => (
                          <Box key={d.dayNumber} sx={{ mb: 1.5, pl: 1.5, borderLeft: '3px solid', borderColor: 'primary.main' }}>
                            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                              {d.title}
                            </Typography>
                            {d.activities?.map((act, actIdx) => (
                              <Typography key={actIdx} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                • <strong>{act.time}</strong> - {act.title} {act.location ? `(${act.location})` : ''}
                              </Typography>
                            ))}
                          </Box>
                        ))}
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => msg.planSuggestion && handleCreateTripFromPlan(msg.planSuggestion)}
                    >
                      Save this Itinerary to My Trips
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Replies */}
              {msg.quickReplies && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5, ml: { xs: 0, sm: 6 } }}>
                  {msg.quickReplies.map((qr, qIdx) => (
                    <Chip
                      key={qIdx}
                      label={qr}
                      onClick={() => handleSendMessage(qr)}
                      variant="outlined"
                      sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { bgcolor: 'primary.light', color: 'primary.dark' } }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}>
                <SmartToyIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                Crafting personalized travel itinerary and estimates...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Bar */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          sx={{
            p: 2.5,
            bgcolor: (theme) => (theme.palette.mode === 'light' ? '#ffffff' : '#111827'),
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            gap: 1.5,
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask anything... e.g. Suggest a 4-day romantic itinerary in Paris under €2,000"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!inputMessage.trim() || isLoading}
            sx={{
              bgcolor: 'primary.main',
              color: '#ffffff',
              px: 2.5,
              borderRadius: 2.5,
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            <SendRoundedIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};
export default AIAssistantPage;
