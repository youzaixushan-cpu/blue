export function calculateAge(birthDate: Date, at: Date = new Date()): number {
  let age = at.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    at.getMonth() > birthDate.getMonth() ||
    (at.getMonth() === birthDate.getMonth() && at.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}
