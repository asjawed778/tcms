import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface TableActionMenuProps {
  rowId: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onActionClick: (action: "Update" | "Delete", id: string) => void;
}

const TableActionMenu: React.FC<TableActionMenuProps> = ({
  rowId,
  anchorEl,
  open,
  onClose,
  onOpen,
  onActionClick,
}) => {
  return (
    <>
      <IconButton
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => onOpen(e)}
        color="primary"
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="action-menu"
        anchorEl={open ? anchorEl : null}
        open={open}
        onClose={onClose}
      >
        <MenuItem onClick={() => onActionClick("Update", rowId)}>Update</MenuItem>
        <MenuItem onClick={() => onActionClick("Delete", rowId)}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default TableActionMenu;
