const nominalizeValue = (value?: string | number) => {
  if (!value) return 0;

  return isNaN(Number(value)) ? 0 : Number(value);
};

export const sevenPointMap: { [key: string]: number } = {
  A: 7,
  B: 6,
  C: 5,
  D: 4,
  'D-': 3,
  E: 2,
  'E-': 1,
  F: 0,
};

export const fivePointMap: { [key: string]: number } = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

export const calculateGpa = (
  data: { grade: string; unit: string | number }[],
  scale: 7 | 5 = 5,
) => {
  if (data.length === 0)
    return {
      gpa: scale,
      tnu: 1,
      tcp: 0,
    };

  let totalUnits = 0;
  let totalWeight = 0;

  for (let i = 0; i < data.length; i++) {
    totalUnits += nominalizeValue(data[i].unit);
    totalWeight +=
      nominalizeValue(
        (scale === 7 ? sevenPointMap : fivePointMap)[data[i].grade],
      ) * nominalizeValue(data[i].unit);
  }

  if (totalUnits === 0)
    return {
      gpa: 0,
      tnu: 1,
      tcp: 0,
    };

  return {
    gpa: totalWeight / totalUnits,
    tnu: totalUnits,
    tcp: totalWeight,
  };
};
