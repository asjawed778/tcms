import { Box, Paper, Typography } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import CustomButton from "@/components/CustomButton";
import { AddCircleOutline } from "@mui/icons-material";
import { SubjectAccordion } from "./SubjectAccordion";

interface Props {
  fields: any[];
  subjects: any[];
  expandedIdx: number | null;
  toggleExpand: (idx: number) => void;
  remove: (idx: number) => void;
  dragOverIdx: number | null;
  setDragOverIdx: (idx: number | null) => void;
  handleDrop: (e: React.DragEvent, idx: number) => void;
  handleDropEnd: (e: React.DragEvent) => void;
  addManual: () => void;
  subjectSources: ("drag" | "manual")[];
}

export const SubjectList = ({
  fields,
  subjects,
  expandedIdx,
  toggleExpand,
  remove,
  dragOverIdx,
  setDragOverIdx,
  handleDrop,
  handleDropEnd,
  addManual,
  subjectSources,
}: Props) => {
  
  return (
    <>
      {fields.map((field, idx) => (
        <Box
          key={field.id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverIdx(idx);
          }}
          onDragLeave={() => setDragOverIdx(null)}
          onDrop={(e) => handleDrop(e, idx)}
        >
          <SubjectAccordion
            index={idx}
            subject={subjects[idx]}
            source={subjectSources[idx]}
            expanded={expandedIdx === idx}
            onToggle={() => toggleExpand(idx)}
            onRemove={() => {
              remove(idx);
              if (expandedIdx === idx) setDragOverIdx(null);
            }}
            isDragOver={dragOverIdx === idx}
            totalFields={fields.length}
          />
        </Box>
      ))}
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
            borderColor: dragOverIdx === -1 ? "primary.main" : "grey.300",
            bgcolor: dragOverIdx === -1 ? "primary.50" : "grey.50",
            textAlign: "center",
          }}
        >
          <DragIndicator sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6" color={dragOverIdx === -1 ? "primary" : "text.secondary"}>
            {dragOverIdx === -1 ? "Drop Here!" : "Drop Zone"}
          </Typography>
        </Paper>
      </Box>
      <CustomButton
        label="Add Manual Subject"
        variant="outlined"
        startIcon={<AddCircleOutline />}
        onClick={addManual}
        fullWidth
        sx={{ mt: 2 }}
      />
    </>
  );
};