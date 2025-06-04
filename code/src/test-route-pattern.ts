import { web3 } from '@alephium/web3'
import { testNodeWallet } from '@alephium/web3-test'
import { Internal, Router } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const signer = await testNodeWallet()
  const {contractInstance: internal} = await Internal.deploy(signer, { initialFields: {} })
  const router = await Router.deploy(signer, { initialFields: { internal: internal.contractId } })
  await router.contractInstance.transact.default({ signer })
  await router.contractInstance.transact.preserveCaller({ signer })
}

test()
