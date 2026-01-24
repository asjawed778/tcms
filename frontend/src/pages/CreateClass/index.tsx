import { ComponentType, useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Container,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BasicDetails from "./BasicDetails";
import FeeStructure from "./FeeStructure";
import PageHeader from "@/components/common/PageHeader";
import SubjectDetails from "./SubjectDetails";
interface StepProps {
  onBack?: () => void;
  onNext?: () => void;
  onExit?: () => void;
  classId?: string;
  className?: string;
  setClassId?: React.Dispatch<React.SetStateAction<string>>;
  setClassName?: React.Dispatch<React.SetStateAction<string>>;
}
interface StepConfig {
  label: string;
  component: ComponentType<StepProps>;
  schema?: any;
}

const steps: StepConfig[] = [
  {
    label: "Basic Details",
    component: BasicDetails,
  },
  {
    label: "Subject",
    component: SubjectDetails,
  },
  {
    label: "Fee Structure",
    component: FeeStructure,
  },
];

const CreateClass = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [classId, setClassId] = useState("");
  const [className, setClassName] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();
  const { id: editClassId } = useParams();

  useEffect(() => {
    if (editClassId) {
      setClassId(editClassId);
    }
  }, [editClassId]);

  const StepComponent = steps[activeStep].component;

  const handleStepClick = (index: number) => {
    if (classId || completedSteps.includes(index) || index === activeStep) {
      setActiveStep(index);
    }
  };
  const handleExitClick = () => {
    navigate("/dashboard/academics?tab=class");
  };
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };
  return (
    <Box mt="52px">
      <PageHeader backTo="/dashboard/academics?tab=class" />
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1 }}>
          {steps.map((step, index) => (
            <Step key={index} onClick={() => handleStepClick(index)}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box>
          <StepComponent
            onBack={handleBack}
            onNext={handleNext}
            onExit={handleExitClick}
            setClassId={setClassId}
            setClassName={setClassName}
            className={className}
            classId={classId}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default CreateClass;
