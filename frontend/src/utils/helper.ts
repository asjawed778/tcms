import * as yup from "yup";

export type Cleanable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Cleanable[]
  | { [key: string]: Cleanable };

export const cleanData = <T extends Cleanable>(payload: T): T | undefined => {
  if (payload === null || payload === undefined || payload === '') {
    return undefined;
  }

  if (payload instanceof Date) {
    return payload;
  }

  if (Array.isArray(payload)) {
    const cleanedArray = payload
      .map(item => cleanData(item))
      .filter(
        item =>
          item !== undefined &&
          !(typeof item === 'object' && item !== null && Object.keys(item).length === 0)
      );

    return cleanedArray.length > 0 ? (cleanedArray as unknown as T) : undefined;
  }

  if (typeof payload === 'object') {
    const cleanedObj: Record<string, any> = {};

    for (const [key, value] of Object.entries(payload)) {
      const cleanedValue = cleanData(value);
      if (cleanedValue !== undefined) {
        cleanedObj[key] = cleanedValue;
      }
    }

    return Object.keys(cleanedObj).length > 0 ? (cleanedObj as T) : undefined;
  }

  return payload;
};

export const validateGroupFields = (
  testName: string,
  errorMessage: string,
  groupFields: string[]
) => {
  return yup
    .string()
    .nullable()
    .test(testName, errorMessage, function () {
      const parent = this.parent;
      const currentField = this.path.split('.').pop(); // field like 'name', 'address'

      const trimmedValues = groupFields.map((key) => (parent[key]?.trim?.() ?? ""));
      const anyFilled = trimmedValues.some((val) => val !== "");
      const currentValue = parent[currentField!]?.trim?.() ?? "";
      if (!anyFilled) return true;
      return currentValue !== "";
    });
};

export const formatTime = (hour: number, minute: number) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;










