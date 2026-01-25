import { useEffect, useState } from "react";
import { useUnAssignFacultyMutation } from "@/services/employeeApi";
const parseTimeString = (time: string): { hour: number; minute: number } => {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
};

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface ApiTime {
  hour: number;
  minute: number;
}


export const useUnAssignFaculty = ({
  sessionId,
  day,
  periods,
}: {
  sessionId: string | undefined;
  day: string;
  periods: { timeSlot: TimeSlot }[];
}) => {
  const [facultyOptions, setFacultyOptions] = useState<
    Record<number, DropdownOption[]>
  >({});
  const [unAssignFaculty, { isLoading }] = useUnAssignFacultyMutation();
  useEffect(() => {
    const fetchFaculty = async (
      index: number,
      start: Time,
      end: Time
    ): Promise<void> => {
      try {
        const result = await unAssignFaculty({
          sessionId: sessionId!,
          day,
          startTime: start,
          endTime: end,
        }).unwrap();
        if (Array.isArray(result.data)) {
          const options: DropdownOption[] = result.data.map((f) => ({
            label: f.name,
            value: f._id,
          }));
          setFacultyOptions((prev) => ({ ...prev, [index]: options }));
        } else if (result.data) {
          const options: DropdownOption[] = [
            { label: result.data.name, value: result.data._id },
          ];
          setFacultyOptions((prev) => ({ ...prev, [index]: options }));
        }
      } catch (err) {
        console.error("Failed to fetch faculty:", err);
      }
    };

    if (Array.isArray(periods) && sessionId) {
      periods.forEach((period, index) => {
        const { startTime, endTime } = period?.timeSlot;
        if (startTime && endTime) {
          fetchFaculty(
            index,
            parseTimeString(startTime),
            parseTimeString(endTime)
          );
        }
      });
    }
  }, [periods, sessionId, day, unAssignFaculty]);

  return { facultyOptions, isLoading };
};

