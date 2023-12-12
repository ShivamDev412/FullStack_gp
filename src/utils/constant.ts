export function generateTimeSlots() {
  const startTime = 9; 
  const endTime = 14;
  const timeSlots = [];

  for (let hour = startTime; hour < endTime; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(time);
    }
  }
  return timeSlots;
}
