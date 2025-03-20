import { getSigner } from '@alephium/web3-test'
import { CryptographyFunctions } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const cryptographyFunctions = await CryptographyFunctions.deploy(signer, { initialFields: {} })
  await cryptographyFunctions.contractInstance.view.verifyHash()
  await cryptographyFunctions.contractInstance.view.verifySignature()
  await cryptographyFunctions.contractInstance.view.verifyEthEcRecover()
}

test()