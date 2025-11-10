import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { ExpandMore, Close } from "@mui/icons-material";
import CustomInputField from "@/components/ui/CustomInputField";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import { useAppTheme } from "@/context/ThemeContext";
import { SubjectCategory, SubjectType } from "@/utils/enum";

interface Props {
  index: number;
  subject: any;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  isDragOver: boolean;
  totalFields: number;
  source?: "drag" | "manual";
}

const typeOptions = Object.entries(SubjectType).map(([_, v]) => ({
  label: v,
  value: v,
}));
const catOptions = Object.entries(SubjectCategory).map(([_, v]) => ({
  label: v,
  value: v,
}));

export const SubjectAccordion = ({
  index,
  subject,
  expanded,
  onToggle,
  onRemove,
  isDragOver,
  source,
}: Props) => {
  
  const { colors } = useAppTheme();
  const isReadOnly = source === "drag";
  return (
    <Accordion
      expanded={expanded}
      onChange={onToggle}
      elevation={isDragOver ? 8 : 2}
      sx={{
        mb: 2,
        borderRadius: 4,
        border: isDragOver ? `3px dashed ${colors.primary}` : "1px solid #ccc",
        bgcolor: isDragOver ? `${colors.primary}08` : "background.paper",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box
          sx={{
            position: "absolute",
            top: -12,
            left: 16,
            bgcolor: colors.primary,
            color: "white",
            px: 1,
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
        </Box>
        {/* {!(index === 0 && totalFields === 1) && ( */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            sx={{
              position: "absolute",
              top: 16,
              right: 48,
              bgcolor: "error.light",
              color: "white",
              "&:hover": { bgcolor: "error.main" },
            }}
          >
            <Close sx={{fontSize: 15}} />
          </IconButton>
        {/* )} */}
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name={`subjects.${index}.name`}
              label="Subject Name"
              required={false}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomDropdownField
              name={`subjects.${index}.subjectType`}
              label="Subject Type"
              options={typeOptions}
              required={false}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomDropdownField
              name={`subjects.${index}.subjectCategory`}
              label="Subject Category"
              options={catOptions}
              required={false}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name={`subjects.${index}.publication`}
              label="Publication"
              required={false}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name={`subjects.${index}.writer`}
              label="Writer"
              required={false}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name={`subjects.${index}.ISBN`}
              label="ISBN"
              required={false}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid size={12}>
            <CustomInputField
              name={`subjects.${index}.syllabus`}
              label="Syllabus"
              rows={3}
              required={false}
              disabled={isReadOnly}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
