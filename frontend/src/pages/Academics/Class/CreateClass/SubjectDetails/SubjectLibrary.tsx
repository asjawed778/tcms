import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  Badge,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Search, CheckCircle, Refresh } from "@mui/icons-material";
import { useAppTheme } from "@/context/ThemeContext";
import CustomButton from "@/components/CustomButton";
import CustomSearchField from "@/components/CustomSearchField";

interface DynamicSubject {
  _id: string;
  name: string;
  subjectType: string;
  subjectCategory: string;
  publication?: string;
  writer?: string;
  ISBN?: string;
  syllabus?: string;
}
interface Props {
  filtered: DynamicSubject[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  isAdded: (id: string) => boolean;
  handleDragStart: (e: React.DragEvent) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const SubjectLibrary = ({
  filtered,
  searchQuery,
  setSearchQuery,
  selectedIds,
  toggleSelection,
  isAdded,
  handleDragStart,
  isLoading = false,
  isError = false,
  onRetry,
}: Props) => {
  const { colors } = useAppTheme();
  
  return (
    <Paper
      sx={{
        p: 1,
        borderRadius: 3,
        bgcolor: `${colors.primary}08`,
        height: "100%",
        maxHeight: { xs: "60vh", md: "90vh" },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Subject Library
        </Typography>
        {selectedIds.size > 0 && (
          <Badge badgeContent={selectedIds.size} color="primary">
            <CheckCircle color="primary" />
          </Badge>
        )}
      </Box>
      <CustomSearchField
        value={searchQuery}
        onSearch={setSearchQuery}
        sx={{ mb: 1 }}
      />
      {selectedIds.size > 0 && (
        <Box
          draggable
          onDragStart={handleDragStart}
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: colors.primary,
            color: "white",
            textAlign: "center",
            cursor: "grab",
            "&:active": { cursor: "grabbing" },
            boxShadow: 2,
            mb: 1,
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            Drag {selectedIds.size} Subject{selectedIds.size > 1 ? "s" : ""}
          </Typography>
          <Typography variant="caption">Drop on left panel</Typography>
        </Box>
      )}
      {isLoading ? (
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: `${colors.primary}08`,
            textAlign: "center",
            height: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={32} sx={{ color: colors.primary, mb: 1 }} />
        </Box>
      ) : isError ? (
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: `${colors.primary}08`,
            textAlign: "center",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography color="error" gutterBottom>
            Failed to load subjects
          </Typography>
          <CustomButton
            onClick={onRetry}
            startIcon={<Refresh />}
            size="small"
            variant="outlined"
          >
            Retry
          </CustomButton>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            pr: 1,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: colors.primary,
              borderRadius: 3,
            },
          }}
        >
          <List dense>
            {filtered.map((sub) => {
              const added = isAdded(sub._id);
              const selected = selectedIds.has(sub._id);
              return (
                <Paper
                  key={sub._id}
                  elevation={selected ? 3 : 1}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (
                      target.closest(
                        'input[type="checkbox"], .MuiTouchRipple-root'
                      )
                    )
                      return;
                    if (!added) toggleSelection(sub._id);
                  }}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    cursor: added ? "default" : "pointer",
                    opacity: added ? 0.6 : 1,
                    border: selected
                      ? `2px solid ${colors.primary}`
                      : "2px solid transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: selected
                        ? `${colors.primary}20`
                        : "action.hover",
                    },
                  }}
                >
                  <ListItem
                    sx={{
                      bgcolor: selected
                        ? `${colors.primary}15`
                        : added
                        ? "action.disabledBackground"
                        : "background.paper",
                      py: 0,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox
                        edge="start"
                        checked={selected}
                        disabled={added}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (!added) toggleSelection(sub._id);
                        }}
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight={selected ? 600 : 500}
                        >
                          {sub.name}
                        </Typography>
                      }
                      secondary={
                        added ? (
                          <Chip
                            label="Added"
                            size="small"
                            color="success"
                            sx={{ height: 18, fontSize: "0.65rem" }}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              mt: 0.5,
                              flexWrap: "wrap",
                            }}
                          >
                            <Chip
                              label={sub.subjectType}
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                            <Chip
                              label={sub.subjectCategory}
                              size="small"
                              sx={{ height: 18, fontSize: "0.65rem" }}
                            />
                          </Box>
                        )
                      }
                    />
                  </ListItem>
                </Paper>
              );
            })}
            {filtered.length === 0 && !isLoading && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Search sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No subjects found
                </Typography>
              </Box>
            )}
          </List>
        </Box>
      )}
      <Box
        sx={{
          mt: 2,
          p: 1,
          bgcolor: `${colors.primary}10`,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Select multiple → Drag to add
        </Typography>
      </Box>
    </Paper>
  );
};
