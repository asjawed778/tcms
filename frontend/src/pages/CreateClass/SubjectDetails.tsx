import React, { useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useFieldArray, useFormContext } from "react-hook-form";

import CustomButton from "@/components/ui/CustomButton";
import Books from "./Books";

const SubjectDetails: React.FC = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
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
      initialized.current = true;
    }
  }, [fields.length, append]);

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
        />
      ))}

      <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <CustomButton
          label="Add Another Subject"
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
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
            })
          }
        />
      </Grid>
    </Grid>
  );
};

export default SubjectDetails;