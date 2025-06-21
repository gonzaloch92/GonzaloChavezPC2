const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/convert' }, // Redirige la raíz a /convert
      { path: 'convert', component: () => import('pages/CurrencyConverter.vue') },
    ],
  },

  // Siempre dejar esto al final
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
