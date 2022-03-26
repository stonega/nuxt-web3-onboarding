import { mutationTree, getterTree, actionTree } from 'typed-vuex'
import { OnboardState, OnboardStatus, SelectedWalletState } from '../types'

export const state = (): OnboardState => ({
  selectedWallet: undefined,
  chainId: '',
  onboardStatus: 'initial',
})

export const getters = getterTree(state, {
  selectedWallet: (state) => state.selectedWallet,
  onboardStatus: (state) => state.onboardStatus,
  account: (state) => state.selectedWallet?.accounts?.[0],
})

export const mutations = mutationTree(state, {
  setSelectedWallet: (state, wallet?: SelectedWalletState) => {
    state.selectedWallet = wallet
  },
  setChainId: (state, chainId: string) => (state.chainId = chainId),
  setOnboardStatus: (state, status: OnboardStatus) =>
    (state.onboardStatus = status),
  clear: (state) => {
    state.selectedWallet = undefined
    state.onboardStatus = 'initial'
    // unsubscribeOnboard?.()
    state.chainId = ''
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async connectWallet() {
      const walletState = await this.app.$onboard.onboard.connectWallet()
      if (walletState.length > 0) {
        this.app.$accessor.account.login()
      }
    },

    async login() {
      await this.app.$accessor.account.login()
    },

    async logout() {
      await this.app.$accessor.account.logout()
    },

    async disconnect({ state }) {
      const label = state.selectedWallet?.label
      if (label) await this.app.$onboard.onboard.disconnectWallet({ label })
    },

    async changeNetwork(_, chainId: string) {
      await this.app.$onboard.onboard.setChain({ chainId })
    },

    async addNetwork() {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }],
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x61',
                  chainName: 'BSC TESTNET',
                  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                },
              ],
            })
          } catch (addError) {}
        } else {
          console.log('Add network error')
        }
      }
    },
  }
)
export const namespaced = true
