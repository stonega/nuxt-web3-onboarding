import type { Onboarding } from '../src/module'

declare module 'vue/types/vue' {
  interface Vue {
    $onboard: Onboarding
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $onboard: Onboarding
  }

  interface Context {
    $onboard: Onboarding
  }
}
