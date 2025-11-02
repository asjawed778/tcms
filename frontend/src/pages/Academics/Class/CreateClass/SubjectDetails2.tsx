// src/components/SubjectDetails/SubjectDetails.tsx
import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomInputField from "@/components/CustomInputField";
import { useAppTheme } from "@/context/ThemeContext";
import { SubjectCategory, SubjectType } from "@/utils/enum";
import {
  AddCircleOutline,
  Close,
  ExpandMore,
  DragIndicator,
  Search,
  LibraryBooks,
  CheckCircle,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  IconButton,
  Typography,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
  Badge,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

// === PREDEFINED SUBJECTS ===
const PREDEFINED_SUBJECTS = [
  { id: "math", name: "Mathematics", type: SubjectType.CUMPULSARY, category: SubjectCategory.BUSINESS_ECONOMICS },
  { id: "physics", name: "Physics", type: SubjectType.CUMPULSARY, category: SubjectCategory.COMPUTER_TECHNOLOGY },
  { id: "chemistry", name: "Chemistry", type: SubjectType.CUMPULSARY, category: SubjectCategory.COMPUTER_TECHNOLOGY },
  { id: "biology", name: "Biology", type: SubjectType.OPTIONAL, category: SubjectCategory.LANGUAGES_LITERATURE },
  { id: "english", name: "English", type: SubjectType.OPTIONAL, category: SubjectCategory.LANGUAGES_LITERATURE },
  { id: "history", name: "History", type: SubjectType.OPTIONAL, category: SubjectCategory.LANGUAGES_LITERATURE },
  { id: "geography", name: "Geography", type: SubjectType.OPTIONAL, category: SubjectCategory.COMPUTER_TECHNOLOGY },
  { id: "computer", name: "Computer Science", type: SubjectType.OPTIONAL, category: SubjectCategory.COMPUTER_TECHNOLOGY },
  { id: "economics", name: "Economics", type: SubjectType.OPTIONAL, category: SubjectCategory.COMPUTER_TECHNOLOGY },
  { id: "commerce", name: "Commerce", type: SubjectType.OPTIONAL, category: SubjectCategory.COMPUTER_TECHNOLOGY },
];

const SubjectDetails: React.FC = () => {
  const { colors } = useAppTheme();
  const { control, watch } = useFormContext();
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "subjects",
  });

  const subjects = watch("subjects") || [];

  // === STATE ===
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const initialized = useRef(false);

  // === FILTERED LIBRARY ===
  const filteredSubjects = useMemo(() => {
    return PREDEFINED_SUBJECTS.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // === IS ADDED? ===
  const isAdded = (id: string) =>
    subjects.some((s: any) => s.preDefinedId === id);

  // === TOGGLE SELECTION ===
  const toggleSelection = (id: string) => {
    if (isAdded(id)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // === DRAG & DROP ===
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("selectedIds", JSON.stringify(Array.from(selectedIds)));
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIdx(null);
    const ids = JSON.parse(e.dataTransfer.getData("selectedIds") || "[]");
    ids.forEach((id: string, offset: number) => {
      const sub = PREDEFINED_SUBJECTS.find((s) => s.id === id);
      if (sub && !isAdded(id)) {
        insert(dropIndex + offset, {
          preDefinedId: sub.id,
          name: sub.name,
          subjectType: sub.type,
          subjectCategory: sub.category,
          publication: "",
          writer: "",
          ISBN: "",
          syllabus: "",
        });
      }
    });
    setSelectedIds(new Set());
  };

  const handleDropEnd = (e: React.DragEvent) => {
    handleDrop(e, fields.length);
  };

  // === INITIALIZE ONE EMPTY FIELD ===
  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({
        name: "",
        subjectType: "",
        subjectCategory: "",
        publication: "",
        writer: "",
        ISBN: "",
        syllabus: "",
      });
      initialized.current = true;
    }
  }, [fields, append]);

  // === ADD MANUAL ===
  const addManual = () => {
    const newIdx = fields.length;
    append({
      name: "",
      subjectType: "",
      subjectCategory: "",
      publication: "",
      writer: "",
      ISBN: "",
      syllabus: "",
    });
    setExpandedIdx(newIdx);
  };

  // === OPTIONS ===
  const typeOptions = Object.entries(SubjectType).map(([_, v]) => ({ label: v, value: v }));
  const catOptions = Object.entries(SubjectCategory).map(([_, v]) => ({ label: v, value: v }));

  return (
    <Grid container spacing={2} mx={2}>
      {/* LEFT: Selected Subjects */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LibraryBooks sx={{ color: colors.primary }} />
            Selected Subjects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag from right or add manually
          </Typography>
        </Box>

        {/* Subject Forms */}
        {fields.map((field, index) => {
          const subject = subjects[index];
          const isExpanded = expandedIdx === index;

          return (
            <Accordion
              key={field.id}
              expanded={isExpanded}
              onChange={() => setExpandedIdx(isExpanded ? null : index)}
              elevation={dragOverIdx === index ? 8 : 2}
              sx={{
                mb: 2,
                borderRadius: 3,
                border: dragOverIdx === index ? `3px dashed ${colors.primary}` : "1px solid #ccc",
                bgcolor: dragOverIdx === index ? `${colors.primary}08` : "background.paper",
                "&:before": { display: "none" },
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIdx(index);
              }}
              onDragLeave={() => setDragOverIdx(null)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ minHeight: 64, "&.Mui-expanded": { minHeight: 64 } }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -12,
                    left: 16,
                    bgcolor: colors.primary,
                    color: "white",
                    px: 1.5,
                    py: 0.2,
                    borderRadius: 1,
                    fontWeight: "bold",
                    fontSize: ".875rem",
                  }}
                >
                  #{index + 1}
                </Box>

                <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {subject?.name || `New Subject ${index + 1}`}
                  </Typography>
                  {subject?.subjectType && (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Chip label={subject.subjectType} size="small" color="primary" variant="outlined" />
                      {subject?.subjectCategory && (
                        <Chip label={subject.subjectCategory} size="small" color="secondary" variant="outlined" />
                      )}
                    </Box>
                  )}
                </Box>

                {!(index === 0 && fields.length === 1) && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(index);
                      if (expandedIdx === index) setExpandedIdx(null);
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 48,
                      bgcolor: "error.light",
                      color: "white",
                      "&:hover": { bgcolor: "error.main" },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
              </AccordionSummary>

              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomInputField name={`subjects.${index}.name`} label="Subject Name" required={false} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomDropdownField name={`subjects.${index}.subjectType`} label="Subject Type" options={typeOptions} required={false} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomDropdownField name={`subjects.${index}.subjectCategory`} label="Subject Category" options={catOptions} required={false} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomInputField name={`subjects.${index}.publication`} label="Publication" required={false} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomInputField name={`subjects.${index}.writer`} label="Writer" required={false} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomInputField name={`subjects.${index}.ISBN`} label="ISBN" required={false} />
                  </Grid>
                  <Grid size={12}>
                    <CustomInputField name={`subjects.${index}.syllabus`} label="Syllabus" rows={3} required={false} />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}

        {/* Drop Zone at Bottom */}
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverIdx(-1);
          }}
          onDragLeave={() => setDragOverIdx(null)}
          onDrop={handleDropEnd}
          sx={{ mt: 2 }}
        >
          <Paper
            elevation={dragOverIdx === -1 ? 4 : 0}
            sx={{
              p: 4,
              border: 3,
              borderStyle: "dashed",
              borderColor: dragOverIdx === -1 ? colors.primary : "grey.300",
              bgcolor: dragOverIdx === -1 ? `${colors.primary}12` : "grey.50",
              textAlign: "center",
            }}
          >
            <DragIndicator sx={{ fontSize: 40, mb: 1, color: dragOverIdx === -1 ? colors.primary : "text.disabled" }} />
            <Typography variant="h6" color={dragOverIdx === -1 ? "primary" : "text.secondary"}>
              {dragOverIdx === -1 ? "Drop Here!" : "Drop Zone"}
            </Typography>
          </Paper>
        </Box>

        {/* Add Manual */}
        <CustomButton
          label="Add Manual Subject"
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={addManual}
          fullWidth
          sx={{ mt: 2 }}
        />
      </Grid>

      {/* RIGHT: Subject Library */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: `${colors.primary}08`,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">Subject Library</Typography>
            {selectedIds.size > 0 && (
              <Badge badgeContent={selectedIds.size} color="primary">
                <CheckCircle color="primary" />
              </Badge>
            )}
          </Box>

          <TextField
            fullWidth
            size="small"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />

          {selectedIds.size > 0 && (
            <Box
              draggable
              onDragStart={handleDragStart}
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: colors.primary,
                color: "white",
                textAlign: "center",
                cursor: "grab",
                "&:active": { cursor: "grabbing" },
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                Drag {selectedIds.size} Subject{selectedIds.size > 1 ? "s" : ""}
              </Typography>
            </Box>
          )}

          <Box sx={{ flex: 1, overflow: "auto" }}>
            <List dense>
              {filteredSubjects.map((sub) => {
                const added = isAdded(sub.id);
                const selected = selectedIds.has(sub.id);
                return (
                  <Paper
                    key={sub.id}
                    elevation={selected ? 3 : 1}
                    onClick={() => !added && toggleSelection(sub.id)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      cursor: added ? "default" : "pointer",
                      opacity: added ? 0.6 : 1,
                      border: selected ? `2px solid ${colors.primary}` : "2px solid transparent",
                    }}
                  >
                    <ListItem
                      sx={{
                        bgcolor: selected
                          ? `${colors.primary}15`
                          : added
                          ? "action.disabledBackground"
                          : "background.paper",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={selected}
                          disabled={added}
                          onChange={() => !added && toggleSelection(sub.id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography fontWeight={selected ? 600 : 500}>{sub.name}</Typography>}
                        secondary={
                          added ? (
                            <Chip label="Added" size="small" color="success" />
                          ) : (
                            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                              <Chip label={sub.type} size="small" />
                              <Chip label={sub.category} size="small" />
                            </Box>
                          )
                        }
                      />
                    </ListItem>
                  </Paper>
                );
              })}
              {filteredSubjects.length === 0 && (
                <Typography textAlign="center" color="text.secondary" mt={2}>
                  No subjects found
                </Typography>
              )}
            </List>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2, p: 1, bgcolor: `${colors.primary}10`, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Select & drag to add
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SubjectDetails;