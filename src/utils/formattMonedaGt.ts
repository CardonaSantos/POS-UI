import currency from "currency.js";

export const formattMonedaGT = (v: string | number) => {
  return currency(v, {
    symbol: "Q ",
    separator: ",",
    decimal: ".",
    precision: 2,
    pattern: "!#", // Q1,234.56
  }).format();
};

console.log(formattMonedaGT(1500)); // "Q 1,500.00"
console.log(formattMonedaGT(123456.789)); // "Q 123,456.79"
