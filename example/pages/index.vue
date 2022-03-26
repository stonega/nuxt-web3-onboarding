<template>
  <div>
    {{ $onboard.state.onboardStatus }}
    <button @click="connectWallet">Connect Wallet</button>
    <button @click="disConnectWallet">Disconnect Wallet</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'IndexPage',
  methods: {
    connectWallet(): void {
      this.$onboard.state.connectWallet()
    },
    disConnectWallet(): void {
      this.$onboard.state.disconnect()
    },
  },
})
</script>
