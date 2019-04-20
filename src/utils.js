export const normalize = (val, max, min) => {
  // Shift to positive to avoid issues when crossing the 0 line
  if (min < 0) {
    max += 0 - min;
    val += 0 - min;
    min = 0;
  }
  // Shift values from 0 - max
  val = val - min;
  max = max - min;
  return Math.max(0, Math.min(1, val / max));
};

export const sortByPrice = (a, b) => a.price - b.price;
export const sortByPriceDesc = (a, b) => b.price - a.price;
