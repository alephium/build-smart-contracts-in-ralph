import { getSigner } from '@alephium/web3-test'
import { TupleExample } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const tuple = await TupleExample.deploy(signer, { initialFields: {} })
  await tuple.contractInstance.view.test()
}

test()