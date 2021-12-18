export const calcSeconds = (dur, unit) => {
  if (unit === "days") {
    return dur * 60 * 60 * 24;
  }
  if (unit === "hours") {
    return dur * 60 * 60;
  }
  if (unit === "minutes") {
    return dur * 60;
  }
  if (unit === "seconds") {
    return dur;
  }
};
export const generateAltUnitText = (dur, unit) => {
  if (unit === "days") {
    return "";
  }
  if (unit === "hours") {
    return `~ ${(dur / 24).toFixed(1)} days`;
  }
  if (unit === "minutes") {
    return `~ ${(dur / 60).toFixed(1)} hours`;
  }
  if (unit === "seconds") {
    return `~ ${(dur / 60).toFixed(1)} minutes`;
  }
};
