export default {
  ssr: false,
  target: 'static',
  server: {
    port: 4000,
    host: '0.0.0.0',
  },
  buildModules: ['@nuxt/typescript-build', 'nuxt-typed-vuex'],
  modules: ['../src/module.ts'],
}
