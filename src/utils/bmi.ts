export function calculateBMI(weight: number, height: number): number {
  if (!weight || !height || height <= 0) return 0;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi <= 0) return '-';
  if (bmi < 18.5) return 'Kurus (Kekurangan Berat Badan)';
  if (bmi < 25.0) return 'Normal (Ideal)';
  if (bmi < 30.0) return 'Kelebihan Berat Badan';
  return 'Obesitas (Sangat Gemuk)';
}
