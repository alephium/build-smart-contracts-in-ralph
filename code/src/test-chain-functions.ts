import { getSigner } from '@alephium/web3-test'
import { Chain } from '../artifacts/ts/scripts'

async function test() {
  const signer = await getSigner()
  await Chain.execute(signer, { initialFields: {} })
}

test()