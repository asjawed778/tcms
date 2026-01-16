type SubjectColor = {
  color: string;
  bgcolor: string;
};

export const getSubjectColors = (subject: string): SubjectColor => {
  switch (subject.toUpperCase()) {
    // Languages
    case "ENGLISH":
      return { color: "#1E3A8A", bgcolor: "#DCEEFB" };
    case "HINDI":
      return { color: "#B91C1C", bgcolor: "#FECACA" };
    case "SANSKRIT":
      return { color: "#7C3AED", bgcolor: "#E9D5FF" };
    case "URDU":
      return { color: "#065F46", bgcolor: "#DCFCE7" };
    case "TAMIL":
      return { color: "#9A3412", bgcolor: "#FED7AA" };
    case "TELUGU":
      return { color: "#9D174D", bgcolor: "#FBCFE8" };
    case "MARATHI":
      return { color: "#B45309", bgcolor: "#FDE68A" };
    case "KANNADA":
      return { color: "#0F766E", bgcolor: "#99F6E4" };

    // Math
    case "MATHEMATICS":
    case "MENTAL MATH":
    case "ADDITIONAL MATHEMATICS":
    case "APPLIED MATHEMATICS":
      return { color: "#D97706", bgcolor: "#FEF3C7" };

    // Science
    case "SCIENCE":
    case "GENERAL SCIENCE":
    case "PHYSICS":
      return { color: "#0288D1", bgcolor: "#B3E5FC" };
    case "CHEMISTRY":
      return { color: "#D84315", bgcolor: "#FFCCBC" };
    case "BIOLOGY":
      return { color: "#2E7D32", bgcolor: "#DCFCE7" };
    case "ENVIRONMENTAL STUDIES":
      return { color: "#047857", bgcolor: "#A7F3D0" };

    // Social / Commerce
    case "SOCIAL SCIENCE":
    case "HISTORY":
      return { color: "#6D4C41", bgcolor: "#D7CCC8" };
    case "GEOGRAPHY":
      return { color: "#0E7490", bgcolor: "#B5F3FC" };
    case "CIVICS":
    case "POLITICAL SCIENCE":
      return { color: "#7C3AED", bgcolor: "#E9D5FF" };
    case "ECONOMICS":
      return { color: "#F59E0B", bgcolor: "#FEF3C7" };
    case "ACCOUNTANCY":
      return { color: "#B91C1C", bgcolor: "#FECACA" };
    case "BUSINESS STUDIES":
      return { color: "#16A34A", bgcolor: "#DCFCE7" };

    // Computer / IT
    case "COMPUTER SCIENCE":
    case "INFORMATION TECHNOLOGY":
      return { color: "#F59E0B", bgcolor: "#FEF9C3" };

    // Arts / Music / PE
    case "ART & CRAFT":
    case "FINE ARTS":
      return { color: "#D97706", bgcolor: "#FEF3C7" };
    case "MUSIC":
      return { color: "#9333EA", bgcolor: "#E9D5FF" };
    case "DANCE":
      return { color: "#DB2777", bgcolor: "#FBCFE8" };
    case "PHYSICAL EDUCATION":
    case "YOGA":
      return { color: "#047857", bgcolor: "#D1FAE5" };

    // Psychology / Sociology
    case "PSYCHOLOGY":
      return { color: "#0F766E", bgcolor: "#99F6E4" };
    case "SOCIOLOGY":
      return { color: "#7F1D1D", bgcolor: "#FECACA" };

    default:
      return { color: "#374151", bgcolor: "#E5E7EB" };
  }
};
