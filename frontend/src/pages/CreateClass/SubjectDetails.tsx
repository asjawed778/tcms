import { Grid, Box, Typography } from "@mui/material";
import { LibraryBooks } from "@mui/icons-material";
import { useAppTheme } from "@/context/ThemeContext";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState, useMemo } from "react";
import { SubjectList } from "./SubjectList";
import { useGetAllSubjectQuery } from "@/services/academics.Api";
import { useAppSelector } from "@/store/store";
import { SubjectLibrary } from "./SubjectLibrary";

const SubjectDetails = () => {
  const { colors } = useAppTheme();
  const { control, watch } = useFormContext();
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "subjects",
  });
  const subjects = watch("subjects") || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [subjectSources, setSubjectSources] = useState<("drag" | "manual")[]>(
    []
  );
  const page = 1;
  const limit = 50;

  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );

  const {
    data: subjectData,
    isFetching: subjectFetching,
    isError: subjectError,
    refetch,
  } = useGetAllSubjectQuery(
    {
      sessionId: selectedSession?._id as string,
      page,
      limit,
      search: searchQuery,
    },
    {
      skip: !selectedSession?._id,
    }
  );
  const dynamicSubjects = useMemo(() => {
    return subjectData?.data?.subjects || [];
  }, [subjectData]);
  // useEffect(() => {
  //   if (subjects.length === 0) {
  //     append({
  //       name: "",
  //       subjectType: "",
  //       subjectCategory: "",
  //       publication: "",
  //       writer: "",
  //       ISBN: "",
  //       syllabus: "",
  //     });
  //     setSubjectSources(["manual"]);
  //     setExpandedIdx(0);
  //   }
  // }, []);
  const isAdded = (id: string) =>
    subjects.some((s: any) => s.preDefinedId === id);
  const toggleSelection = (id: string) => {
    if (isAdded(id)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData(
      "selectedIds",
      JSON.stringify(Array.from(selectedIds))
    );
  };
  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(null);
    const ids = JSON.parse(e.dataTransfer.getData("selectedIds") || "[]");
    ids.forEach((id: string, offset: number) => {
      const sub = dynamicSubjects.find((s: any) => s._id === id);
      if (sub && !isAdded(id)) {
        const insertIndex = idx + offset;
        insert(insertIndex, {
          preDefinedId: sub._id,
          name: sub.name,
          subjectType: sub.subjectType,
          subjectCategory: sub.subjectCategory,
          publication: sub.publication || "",
          writer: sub.writer || "",
          ISBN: sub.ISBN || "",
          syllabus: sub.syllabus || "",
        });
        setSubjectSources((prev) => {
          const newArr = [...prev];
          newArr.splice(insertIndex, 0, "drag");
          return newArr;
        });
      }
    });
    setSelectedIds(new Set());
  };
  const handleDropEnd = (e: React.DragEvent) => handleDrop(e, fields.length);
  const addManual = () => {
    const idx = fields.length;
    append({
      name: "",
      subjectType: "",
      subjectCategory: "",
      publication: "",
      writer: "",
      ISBN: "",
      syllabus: "",
    });
    setSubjectSources((prev) => [...prev, "manual"]);
    setExpandedIdx(idx);
  };
  const handleRemove = (idx: number) => {
    remove(idx);
    setSubjectSources((prev) => prev.filter((_, i) => i !== idx));
  };
  return (
    <Grid container spacing={2} mx={2}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <LibraryBooks sx={{ color: colors.primary }} />
            Selected Subjects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag from right or add manually
          </Typography>
        </Box>
        <SubjectList
          fields={fields}
          subjects={subjects}
          expandedIdx={expandedIdx}
          toggleExpand={(idx) =>
            setExpandedIdx(expandedIdx === idx ? null : idx)
          }
          remove={handleRemove}
          subjectSources={subjectSources}
          dragOverIdx={dragOverIdx}
          setDragOverIdx={setDragOverIdx}
          handleDrop={handleDrop}
          handleDropEnd={handleDropEnd}
          addManual={addManual}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SubjectLibrary
          filtered={dynamicSubjects}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedIds={selectedIds}
          toggleSelection={toggleSelection}
          isAdded={isAdded}
          handleDragStart={handleDragStart}
          isLoading={subjectFetching}
          isError={subjectError}
          onRetry={refetch}
        />
      </Grid>
    </Grid>
  );
};

export default SubjectDetails;
