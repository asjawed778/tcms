import React, { useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useFieldArray, useFormContext } from "react-hook-form";

import CustomButton from "@/components/ui/CustomButton";
import Books from "./Books";

const SubjectDetails: React.FC = () => {
  const { control } = useFormContext();
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
        bgcolor: "#fff",
        borderRadius: "8px",
        minHeight: "20px",
        p: 1,
      }}
    >
      {fields.map((field, index) => (
        <Books
          key={field.id}
          subjectIndex={index}
          onRemove={() => remove(index)}
          showRemoveButton={fields.length > 1}
          expanded={expandedIndex === index}
          onToggle={() =>
            setExpandedIndex(expandedIndex === index ? null : index)
          }
        />
      ))}

      <Grid
        size={{ xs: 12 }}
        sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
      >
        <CustomButton
          label="Add Another Subject"
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            append({
              name: "",
              subjectType: "",
              subjectCategory: "",
              syllabus: "",
              books: [
                {
                  coverPhoto: "",
                  title: "",
                  author: "",
                  publication: "",
                  ISBN: "",
                },
              ],
            });

            setExpandedIndex(fields.length);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SubjectDetails;
