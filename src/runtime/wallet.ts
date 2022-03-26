import { Plugin, NuxtAppOptions } from '@nuxt/types'
import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import walletLinkModule from '@web3-onboard/walletlink'
import { useAccessor } from 'typed-vuex'
import { distinctUntilChanged} from 'rxjs/operators'
import { Onboading } from '../types'
import * as walletModule from './state'

const extend = (app: NuxtAppOptions, mixin: any) => {
  if (!app.mixins) {
    app.mixins = []
  }
  app.mixins.push(mixin)
}

const wallet: Plugin = (ctx, inject) => {
  ctx.store.registerModule('wallet', walletModule, {
    preserveState: false,
  })
  const state = useAccessor(ctx.store, walletModule, 'wallet')

  const injected = injectedModule()
  const walletConnect = walletConnectModule({
    bridge: 'https://bridge.walletconnect.org',
    qrcodeModalOptions: {
      mobileLinks: [],
    },
  })

  const walletLink = walletLinkModule({ darkMode: true })
  const supportedChains = [
    {
      id: '0x4',
      token: 'ETH',
      label: 'Rinkeby',
      rpcUrl: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    },
  ]
  const onboard = Onboard({
    wallets: [injected, walletConnect, walletLink],
    chains: supportedChains,
    appMetadata: {
      name: 'Dao family',
      icon: 'https://docs.walletconnect.com/img/walletconnect-logo.svg',
      description: 'Dao family using Onboard',
      recommendedInjectedWallets: [
        { name: 'MetaMask', url: 'https://metamask.io' },
      ],
    },
  })
  const walletsSub = onboard.state.select('wallets')
  const subscribe = walletsSub.pipe(distinctUntilChanged()).subscribe(async (wallets) => {
    // eslint-disable-next-line no-console
    console.log({ wallets })
    if (wallets.length > 0) {
      if (
        wallets[0].accounts[0].address !==
          state.selectedWallet?.accounts[0].address &&
        state.onboardStatus === 'authorized'
      ) {
        await state.login()
      }
      const selectedWallet = {
        label: wallets[0].label,
        icon: wallets[0].icon,
        accounts: wallets[0].accounts,
      }
      state.setSelectedWallet(selectedWallet)
      state.setOnboardStatus('authorized')
      state.setChainId(wallets[0].chains[0].id)
    }
    const connectedWallets = wallets.map(({ label }) => label)
    localStorage.setItem('connectedWallets', JSON.stringify(connectedWallets))
  })
  const previouslyConnectedWallets = JSON.parse(
    localStorage.getItem('connectedWallets') ?? '[]'
  )

  // res.unsubscribe
  if (previouslyConnectedWallets.length > 0) {
    onboard.connectWallet({
      autoSelect: {
        label: previouslyConnectedWallets[0],
        disableModals: true,
      },
    })
    // this.app.$accessor.user.fetchUser()
    // this.app.$accessor.user.fetchZones()
    // this.app.$accessor.dict.fetchTokenInfos()
  }
  extend(ctx.app, {
    beforeDestroy() {
      subscribe.unsubscribe()
      console.log('Cancel')
    },
  })
  inject('onboard', { onboard, state } as Onboading)
}

export default wallet
