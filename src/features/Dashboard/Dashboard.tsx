import {
  AccountCircle,
  ArrowUpward,
  Dashboard as DashboardIcon,
  Logout,
  NotificationsNone,
  People,
  ReceiptLong,
  Settings,
  TrendingUp,
} from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import {
  Box,
  Card,
  Button,
  Heading,
  SubHeading,
} from "../../components";

const Dashboard = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f8fa",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 250,
          bgcolor: "#fff",
          borderRight: "1px solid",
          borderColor: "divider",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
        }}
      >
        {/* Logo */}
        <Box sx={{ px: 3, py: 3 }}>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            MyApp 🚀
          </Typography>
        </Box>

        <Divider />

        {/* Navigation */}
        <List sx={{ px: 1.5, py: 2 }}>
          <ListItemButton
            selected
            sx={{
              borderRadius: 2,
              mb: 0.5,
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>

            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/users"
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon>
              <People />
            </ListItemIcon>

            <ListItemText primary="Users" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/transactions"
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon>
              <ReceiptLong />
            </ListItemIcon>

            <ListItemText primary="Transactions" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/settings"
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>

            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>

        {/* Logout */}
        <Box sx={{ mt: "auto", p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Logout />}
            component={Link}
            to="/auth/login"
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          ml: { xs: 0, md: "250px" },
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            height: 72,
            px: { xs: 2, md: 4 },
            bgcolor: "#fff",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
          >
            Dashboard
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <IconButton>
              <NotificationsNone />
            </IconButton>

            <Avatar
              sx={{
                width: 38,
                height: 38,
              }}
            >
              <AccountCircle />
            </Avatar>
          </Stack>
        </Box>

        {/* Dashboard Body */}
        <Box
          sx={{
            p: { xs: 2, md: 4 },
          }}
        >
          {/* Welcome */}
          <Box sx={{ mb: 4 }}>
            <Heading>
              Welcome back! 👋
            </Heading>

            <SubHeading>
              Here's what's happening with your account today.
            </SubHeading>
          </Box>

          {/* Stats */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
              mb: 4,
            }}
          >
            <StatCard
              title="Total Revenue"
              value="$24,500"
              change="+12.5%"
              icon={<TrendingUp />}
            />

            <StatCard
              title="Total Users"
              value="12,450"
              change="+8.2%"
              icon={<People />}
            />

            <StatCard
              title="Transactions"
              value="1,248"
              change="+15.4%"
              icon={<ReceiptLong />}
            />

            <StatCard
              title="Growth"
              value="24.8%"
              change="+4.6%"
              icon={<ArrowUpward />}
            />
          </Box>

          {/* Content */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "2fr 1fr",
              },
              gap: 3,
            }}
          >
            {/* Overview */}
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    Overview
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Your performance over the last 30 days
                  </Typography>
                </Box>

                {/* Simple chart placeholder */}
                <Box
                  sx={{
                    height: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    bgcolor: "action.hover",
                  }}
                >
                  <Stack
                    alignItems="center"
                    spacing={1}
                  >
                    <TrendingUp
                      sx={{
                        fontSize: 42,
                        color: "primary.main",
                      }}
                    />

                    <Typography
                      color="text.secondary"
                    >
                      Chart goes here
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Card>

            {/* Recent Activity */}
            <Card sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 3 }}
              >
                Recent Activity
              </Typography>

              <Stack spacing={2.5}>
                <Activity
                  title="New user registered"
                  description="John Doe created an account"
                  time="5 min ago"
                />

                <Activity
                  title="Payment received"
                  description="$1,250 payment completed"
                  time="1 hour ago"
                />

                <Activity
                  title="Account updated"
                  description="Profile information updated"
                  time="3 hours ago"
                />

                <Activity
                  title="New transaction"
                  description="Transaction #TRX-1024"
                  time="5 hours ago"
                />
              </Stack>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const StatCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) => {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "primary.50",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>

        <Typography
          variant="h5"
          fontWeight={700}
        >
          {value}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "success.main",
            fontWeight: 500,
          }}
        >
          {change} from last month
        </Typography>
      </Stack>
    </Card>
  );
};

const Activity = ({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="flex-start"
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          mt: 0.7,
          borderRadius: "50%",
          bgcolor: "primary.main",
          flexShrink: 0,
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          fontWeight={600}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {time}
        </Typography>
      </Box>
    </Stack>
  );
};

export default Dashboard;
