// src/components/Layout.tsx
import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation, useNavigate } from "react-router-dom";
import { TableRows } from "@mui/icons-material";

interface LayoutProps {
  children: React.ReactNode;
  disableNav?: boolean;
}

const navItems = [
  { label: "My Table", icon: <HomeIcon />, path: "/home" },
  { label: "Explore", icon: <TableRows />, path: "/all" },
  { label: "Profile", icon: <PersonIcon />, path: "/profile" },
];

const NavLayout: React.FC<LayoutProps> = ({ children, disableNav = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = navItems.findIndex((item) => location.pathname.startsWith(item.path));

  return (
    <>
      <Box sx={{ pb: 8, zIndex: 1 }}>{children}</Box>

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 2 }}
        elevation={3}
      >
        <BottomNavigation
          value={currentIndex}
          onChange={(_, newValue) => {
            if (!disableNav) {
              navigate(navItems[newValue].path);
            }
          }}
          showLabels
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              icon={item.icon}
              disabled={disableNav}
              sx={{
                color: disableNav ? "gray" : "inherit",
                "&.Mui-disabled": {
                  color: "gray",
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default NavLayout;
