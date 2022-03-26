import { actionTree } from 'typed-vuex'

export const state = (): { name: string } => ({
  name: '',
})

export const actions = actionTree(
  {
    state,
  },
  {
    login(): void {
      console.log('login')
    },
    logout(): void {
      console.log('login')
    },
  }
)
