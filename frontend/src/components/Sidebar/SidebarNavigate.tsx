import React from "react";
import { NavLink } from "react-router-dom";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";

type SidebarItemProps = {
  name: string;
  icon: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
};

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
  "&.active .MuiListItemButton-root": {
    color: theme.palette.primary.main,
  },
}));

const SidebarNavigate: React.FC<SidebarItemProps> = ({ name, icon, to, onClick, className = "" }) => {
  const content = (
    <ListItemButton onClick={onClick} className={className}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={name} />
    </ListItemButton>
  );

  return to ? (
    <StyledNavLink to={to} end>
      {content}
    </StyledNavLink>
  ) : (
    content
  );
};

export default SidebarNavigate;
