import { ONE_ALPH, stringToHex, web3 } from '@alephium/web3'
import { getSigner, mintToken } from '@alephium/web3-test'
import { FancyTokenFactory, FancyToken } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const nodeProvider = web3.getCurrentNodeProvider()

  const signer = await getSigner()
  const { contractInstance: fancyTokenTemplate } = await FancyToken.deploy(signer, {
    initialFields: { name: '' },
    initialAttoAlphAmount: ONE_ALPH
  })

  const { contractInstance: fancyTokenFactory } = await FancyTokenFactory.deploy(signer, {
    initialFields: { fancyTokenTemplateId: fancyTokenTemplate.contractId },
    initialAttoAlphAmount: ONE_ALPH
  })

  await fancyTokenFactory.transact.mint({
    signer,
    args: { name: stringToHex('test') },
    attoAlphAmount: ONE_ALPH
  })

  async function getBalance(address: string) {
    return await nodeProvider.addresses.getAddressesAddressBalance(address)
  }
  const signerBalance = await getBalance(signer.address)
  console.log('signerBalance', signerBalance)
}

test()