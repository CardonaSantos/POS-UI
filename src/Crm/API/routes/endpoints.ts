export const crm_endpoints = {
  // AUTH
  auth: {
    login: "/auth/login-user",
  },

  zonas_facturacion: {
    get_all: "/facturacion-zona",

    post_zona_f: "/facturacion-zona",

    patch_zona: "/facturacion-zona/update-zona-facturacion",

    delete_zona: (id: number) => `/facturacion-zona/${id}`,
  },

  //IMPRIMIBLES
  tickets_boleta: {
    byId: (id: number) => `/tickets-soporte/get-ticket-boleta/${id}`,
  },
  //PARA TICKETS EN GENERAL
  ticket: {
    post_commentary: `/ticket-seguimiento`,

    create_ticket: `/tickets-soporte`,

    tickets_list_search: `/tickets-soporte`,

    update_ticket: (id: number) =>
      `/tickets-soporte/update-ticket-soporte/${id}`,

    delete_ticket: (id: number) => `/tickets-soporte/delete-ticket/${id}`,
  },
} as const;
