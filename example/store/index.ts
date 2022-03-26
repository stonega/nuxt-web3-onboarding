import { getAccessorType } from 'typed-vuex'
import * as account from './account'

export const accessorType = getAccessorType({
  modules: {
    account,
  },
})
