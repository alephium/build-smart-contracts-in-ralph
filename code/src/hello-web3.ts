import { web3 } from '@alephium/web3'
import { testNodeWallet } from '@alephium/web3-test'
import { HelloWeb3 } from '../artifacts/ts'

async function run() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const signer = await testNodeWallet()
  const helloWeb3 = await HelloWeb3.deploy(signer, { initialFields: {} })
  await helloWeb3.contractInstance.view.main()
}

run()
