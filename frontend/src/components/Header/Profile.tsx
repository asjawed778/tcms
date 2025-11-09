import React, { useState } from "react";
import {
  Avatar,
  Menu,
  IconButton,
  Typography,
  Divider,
  Box,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { Dashboard, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout } from "@/store/reducers/authSlice";
import toast from "react-hot-toast";
import { useLogoutUserMutation } from "@/services/authApi";
import CustomButton from "../ui/CustomButton";
import { resetSession } from "@/store/reducers/sessionSlice";

const menuItems = [
  { icon: <Dashboard />, label: "Dashboard", route: "/dashboard" },
];

const Profile: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      handleClose();
      dispatch(logout());
      dispatch(resetSession());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      dispatch(logout());
      dispatch(resetSession());
      toast.success("Logged out successfully");
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar
          sx={{ width: 32, height: 32 }}
          src={user?.profilePic}
          alt="profile"
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: 250,
              borderRadius: 3,
              mt: 1.5,
              p: 1,
              overflow: "visible",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 16,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
                boxShadow: "-1px -1px 1px rgba(0,0,0,0.1)",
              },
            },
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={1} px={1.5} py={1}>
          <Avatar src={user?.profilePic} />
          <Box>
            <Typography fontWeight="bold">{user?.firstName} {user?.lastName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role?.name}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {menuItems.map(({ icon, label, route  }) => (
          <MenuItem
            key={label}
            onClick={() => {
              handleClose();
              if (route) navigate(route);
            }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            {label}
          </MenuItem>
        ))}

        <Divider sx={{ my: 1 }} />
        <CustomButton
          type="button"
          variant="outlined"
          color="secondary"
          startIcon={<Logout fontSize="small" />}
          loading={isLoading}
          fullWidth
          onClick={handleLogout}
        >
          logout
        </CustomButton>
      </Menu>
    </>
  );
};
export default Profile;
