import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Paper,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useAppDispatch, useAppSelector } from '../../../store/store';
import { setChatDrawerOpen, showToast } from '../../../store/slices/uiSlice';
import { assistantService } from '../services/assistantService';
import { tripService } from '../../trips/services/tripService';
import { AssistantResponse, AssistantPlanSuggestion } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import dayjs from 'dayjs';

export const ChatWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isChatDrawerOpen);
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
      content: `👋 Hi ${user?.firstName || 'there'}! I am your AI Travel Assistant. Where would you like to travel, or how can I assist with your itinerary?`,
      quickReplies: [
        'Plan a 5-day Goa trip under ₹30,000',
        'What should I pack for Kerala in December?',
        'Suggest family-friendly places near Mumbai',
        'What can I do in Jaipur in 3 days?',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
          content: 'Sorry, I encountered a temporary connection issue. Please try again in a moment.',
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
        name: `${plan.destination} AI Planned Vacation`,
        destination: plan.destination,
        startDate,
        endDate,
        numberOfTravelers: 2,
        budget: plan.estimatedBudget,
        currency: plan.currency || 'INR',
        notes: `AI Plan highlights:\n${plan.highlights?.join('\n')}`,
      });

      dispatch(showToast({ message: `🎉 Trip to ${plan.destination} created successfully!`, severity: 'success' }));
    } catch {
      dispatch(showToast({ message: 'Failed to create trip from AI plan', severity: 'error' }));
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={() => dispatch(setChatDrawerOpen(false))}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 460 },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: (theme) => (theme.palette.mode === 'light' ? '#f8fafc' : '#0b111e'),
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? '#ffffff' : '#111827'),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              AI Travel Assistant
            </Typography>
            <Typography variant="caption" color="success.main" fontWeight={600}>
              ● Online & Ready to Plan
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={() => dispatch(setChatDrawerOpen(false))} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Message Stream */}
      <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                gap: 1,
                maxWidth: '88%',
                alignItems: 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              {msg.role === 'assistant' && (
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', mt: 0.5 }}>
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 1.8,
                  borderRadius: 3,
                  bgcolor:
                    msg.role === 'user'
                      ? 'primary.main'
                      : (theme) => (theme.palette.mode === 'light' ? '#ffffff' : '#1e293b'),
                  color: msg.role === 'user' ? '#ffffff' : 'text.primary',
                  border: msg.role === 'assistant' ? (theme) => `1px solid ${theme.palette.divider}` : 'none',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {msg.content}
                </Typography>
              </Paper>
            </Box>

            {/* Structured Plan Card if attached */}
            {msg.planSuggestion && (
              <Card
                sx={{
                  mt: 1.5,
                  ml: { xs: 0, sm: 4 },
                  width: '90%',
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#ffffff' : '#1e293b'),
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                      📍 {msg.planSuggestion.destination}
                    </Typography>
                    <Chip
                      label={formatCurrency(msg.planSuggestion.estimatedBudget, msg.planSuggestion.currency)}
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  {/* Highlights */}
                  {msg.planSuggestion.highlights && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" gutterBottom>
                        Highlights:
                      </Typography>
                      {msg.planSuggestion.highlights.map((h, i) => (
                        <Typography key={i} variant="caption" color="text.secondary" sx={{ display: 'flex', gap: 0.5, mb: 0.3 }}>
                          • {h}
                        </Typography>
                      ))}
                    </Box>
                  )}

                  {/* Day by Day Plan Preview */}
                  {msg.planSuggestion.dayByDayPlan && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" gutterBottom>
                        Itinerary Preview ({msg.planSuggestion.durationDays} Days):
                      </Typography>
                      {msg.planSuggestion.dayByDayPlan.slice(0, 3).map((d) => (
                        <Box key={d.dayNumber} sx={{ mb: 0.8, pl: 1, borderLeft: '2px solid', borderColor: 'primary.light' }}>
                          <Typography variant="caption" fontWeight={700} color="text.primary">
                            {d.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {d.activities?.map((a) => a.title).join(' → ')}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    fullWidth
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => msg.planSuggestion && handleCreateTripFromPlan(msg.planSuggestion)}
                  >
                    Save as My Trip
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Reply Suggestions */}
            {msg.quickReplies && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1, ml: { xs: 0, sm: 4 } }}>
                {msg.quickReplies.map((qr, qIdx) => (
                  <Chip
                    key={qIdx}
                    label={qr}
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage(qr)}
                    sx={{
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      '&:hover': { bgcolor: 'primary.light', color: 'primary.dark' },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
              <SmartToyIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <CircularProgress size={20} />
            <Typography variant="caption" color="text.secondary">
              Designing your travel recommendations...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Form */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        sx={{
          p: 2,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? '#ffffff' : '#111827'),
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Ask anything... e.g. Plan 5 days in Goa"
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
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
          }}
        >
          <SendRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Drawer>
  );
};
export default ChatWidget;
