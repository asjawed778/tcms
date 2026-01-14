import { ReactNode } from "react";
import {
  Calculate,
  Science,
  Biotech,
  MenuBook,
  Language,
  HistoryEdu,
  Public,
  Computer,
  AccountBalance,
  Brush,
  MusicNote,
  SelfImprovement,
} from "@mui/icons-material";
import { Subject } from "@/utils/enum";

interface SubjectMeta {
  label: string;
  color: string;
  icon?: ReactNode;
}

const SUBJECT_META_MAP: Record<Subject, SubjectMeta> = {
  [Subject.MATHEMATICS]: {
    label: "Mathematics",
    color: "#1976d2",
    icon: <Calculate />,
  },
  [Subject.SCIENCE]: {
    label: "Science",
    color: "#2e7d32",
    icon: <Science />,
  },
  [Subject.PHYSICS]: {
    label: "Physics",
    color: "#0288d1",
    icon: <Science />,
  },
  [Subject.CHEMISTRY]: {
    label: "Chemistry",
    color: "#6a1b9a",
    icon: <Science />,
  },
  [Subject.BIOLOGY]: {
    label: "Biology",
    color: "#388e3c",
    icon: <Biotech />,
  },
  [Subject.ENGLISH]: {
    label: "English",
    color: "#6a1b9a",
    icon: <MenuBook />,
  },
  [Subject.HINDI]: {
    label: "Hindi",
    color: "#d32f2f",
    icon: <Language />,
  },
  [Subject.SANSKRIT]: {
    label: "Sanskrit",
    color: "#f57c00",
    icon: <Language />,
  },
  [Subject.HISTORY]: {
    label: "History",
    color: "#ed6c02",
    icon: <HistoryEdu />,
  },
  [Subject.GEOGRAPHY]: {
    label: "Geography",
    color: "#00897b",
    icon: <Public />,
  },
  [Subject.CIVICS]: {
    label: "Civics",
    color: "#455a64",
    icon: <AccountBalance />,
  },
  [Subject.COMPUTER_SCIENCE]: {
    label: "Computer Science",
    color: "#1565c0",
    icon: <Computer />,
  },
  [Subject.ACCOUNTANCY]: {
    label: "Accountancy",
    color: "#2e7d32",
    icon: <AccountBalance />,
  },
  [Subject.ART]: {
    label: "Art",
    color: "#ad1457",
    icon: <Brush />,
  },
  [Subject.MUSIC]: {
    label: "Music",
    color: "#5e35b1",
    icon: <MusicNote />,
  },
  [Subject.YOGA]: {
    label: "Yoga",
    color: "#2e7d32",
    icon: <SelfImprovement />,
  },
  [Subject.OTHER]: {
    label: "Other",
    color: "#9e9e9e",
  },
};

export const getSubjectMeta = (
  subject?: string
): SubjectMeta => {
  const key = subject?.toLowerCase() as Subject;

  return SUBJECT_META_MAP[key] ?? SUBJECT_META_MAP[Subject.OTHER];
};
