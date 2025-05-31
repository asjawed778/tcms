import { useEffect, useState } from "react";
import { useUnAssignFacultyMutation } from "@/services/facultyApi";
import { DropdownOptions } from "../../type";

interface Time {
  hour: number;
  minute: number;
}

interface TimeSlot {
  start: Time;
  end: Time;
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
  const [facultyMap, setFacultyMap] = useState<
    Record<number, DropdownOptions[]>
  >({});
  const [unAssignFaculty, { isLoading }] = useUnAssignFacultyMutation();
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
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
        console.log("Result: ", result);
        
        if (result?.data?.length > 1) {
          const options: DropdownOptions[] =
            result?.data?.map((f: any) => ({
              label: f.name,
              value: f._id,
            })) || [];
            setFacultyMap((prev) => ({ ...prev, [index]: options }));
        } else{
          const options: DropdownOptions[] = [{
            label: result?.data?.name,
            value: result?.data?._id
          }]
          setFacultyMap((prev) => ({ ...prev, [index]: options }));
        }

      } catch (err) {
        console.error("Failed to fetch faculty:", err);
      }
    };

    if (Array.isArray(periods) && sessionId) {
      periods.forEach((period, index) => {
        const { start, end } = period?.timeSlot;
        const isValidTime =
          start?.hour != null &&
          start?.minute != null &&
          end?.hour != null &&
          end?.minute != null;

        if (isValidTime) {
          const duration = calculateDurationMinutes({ start, end });
          setDurationMinutes(duration);
          fetchFaculty(index, start, end);
        }
      });
    }
  }, [periods, sessionId, day, unAssignFaculty]);

  return { facultyMap, isLoading, durationMinutes };
};

export const calculateDurationMinutes = ({ start, end }: TimeSlot): number => {
  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;
  return endMinutes - startMinutes;
};
