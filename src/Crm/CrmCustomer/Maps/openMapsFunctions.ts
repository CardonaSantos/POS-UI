export const abrirGoogleMaps = (latitud: number, longitud: number) => {
  if (latitud && longitud) {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`,
      "_blank"
    );
  }
};

export const iniciarRuta = (latitud: number, longitud: number) => {
  if (latitud && longitud) {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}`,
      "_blank"
    );
  }
};
