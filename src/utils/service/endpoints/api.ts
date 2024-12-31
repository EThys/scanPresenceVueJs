export const ApiRoutes = {
  //route for authentification
  login: 'login',
  logout: 'logout',
  register: 'register',
  changePassword: 'changePassword',
  //route for invoice
  addInvoice: 'addInvoice',
  getAllTickets: 'all/tickets',
  uploadCsv: 'uploadCsv',
  searchTicket:'tickets/search',
  updatePresence: (id:any) => `tickets/${id}/presence`
}
