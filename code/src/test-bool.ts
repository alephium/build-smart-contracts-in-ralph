import { getSigner } from '@alephium/web3-test'
import { Bool } from '../artifacts/ts/Bool'

async function test() {
  const signer = await getSigner()
  const bool = await Bool.deploy(signer, { initialFields: {} })
  await bool.contractInstance.view.test()
}

test()