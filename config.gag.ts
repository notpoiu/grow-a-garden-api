const ToMinutes = (minutes: number) => minutes * 60 * 1000;
const ToHours = (hours: number) => hours * 60 * 60 * 1000;

export const StockTypes = [
  {
    stock: "gear",
    restockInterval: ToMinutes(5),
  },
  {
    stock: "egg",
    restockInterval: ToMinutes(30),
  },
  {
    stock: "seeds",
    restockInterval: ToMinutes(5),
  },
  {
    stock: "easter",
    restockInterval: ToHours(1),
  },
  {
    stock: "night",
    restockInterval: ToHours(1),
  },
  {
    stock: "honey",
    restockInterval: ToMinutes(30),
  },
  {
    stock: "cosmetics",
    restockInterval: ToHours(4),
  },
];
