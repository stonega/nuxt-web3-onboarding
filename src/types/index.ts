import { Account, OnboardAPI } from '@web3-onboard/core/dist/types'
import { getAccessorType } from 'typed-vuex'
import * as walletModule from '../runtime/state'

export const CONFIG_KEY = 'web3-onboarding'

export type OnboardStatus = 'initial' | 'connecting' | 'authorized'

export interface SelectedWalletState {
  label: string
  icon: string
  accounts: Account[]
}

export type OnboardState = {
  selectedWallet?: SelectedWalletState
  chainId: string
  onboardStatus: OnboardStatus
}

const accessor = getAccessorType(walletModule)
export interface Onboading {
  onboard: OnboardAPI
  state: typeof accessor
}

export interface ModuleOptions {
  appName?: string
  walletConnectOptions: {
    bridge: string
  }
  infraKey?: string
}
