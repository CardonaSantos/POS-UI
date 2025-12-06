export const handleOpenWhatsapp = (number: string) => {
  const cleaned = number.replace(/[\s\-().]/g, "");
  return `https://wa.me/502${cleaned}`;
};

export const handleCall = (number: string) => {
  const cleaned = number.replace(/[\s\-().]/g, "");
  return `tel:+502${cleaned}`;
};
