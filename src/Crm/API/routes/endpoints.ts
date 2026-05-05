export const crm_endpoints = {
  // AUTH
  auth: {
    login: "/auth/login-user",
  },
  //IMPRIMIBLES
  tickets_boleta: {
    byId: (id: number) => `/tickets-soporte/get-ticket-boleta/${id}`,
  },
  //PARA TICKETS EN GENERAL
  ticket: {
    post_commentary: `/ticket-seguimiento`,

    tickets_list_search: `/tickets-soporte`,

    update_ticket: (id: number) =>
      `/tickets-soporte/update-ticket-soporte/${id}`,

    delete_ticket: (id: number) => `/tickets-soporte/delete-ticket/${id}`,
  },
} as const;
