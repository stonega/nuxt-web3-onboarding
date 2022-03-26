import { Module } from '@nuxt/types'
import { defu } from 'defu'
import { CONFIG_KEY, ModuleOptions } from './types/index'

const path = require('path')

const web3OnboardingModule: Module<ModuleOptions> = function (moduleOptions) {
  const defaults = {
    walletConnectOptions: {
      bridge: 'https://bridge.walletconnect.org',
    },
  }
  const options: ModuleOptions = defu(
    this.options[CONFIG_KEY],
    moduleOptions,
    defaults
  )

  const runtimeDir = path.resolve(__dirname, 'runtime')
  this.nuxt.options.alias['~web3-onboarding'] = runtimeDir
  this.nuxt.options.build.transpile.push(runtimeDir)

  this.addPlugin({
    src: path.resolve(runtimeDir, 'state.ts'),
    fileName: 'web3-onboard/state.ts',
    options,
  })
  this.addPlugin({
    src: path.resolve(runtimeDir, 'wallet.ts'),
    fileName: 'web3-onboard/wallet.ts',
    options,
  })
}

;(web3OnboardingModule as any).meta = require('../package.json')

export default web3OnboardingModule
