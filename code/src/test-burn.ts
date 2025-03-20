import { web3 } from '@alephium/web3'
import { getSigner, mintToken } from '@alephium/web3-test'
import { Burn } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const nodeProvider = web3.getCurrentNodeProvider()

  const signer = await getSigner()
  const { contractInstance: burn } = await Burn.deploy(signer, { initialFields: {} })
  const { tokenId } = await mintToken(signer.address, 10n)

  await burn.transact.main({
    signer,
    args: { tokenId },
    tokens: [{ id: tokenId, amount: 1n }]
  })

  const balance = await nodeProvider.addresses.getAddressesAddressBalance(
    signer.address
  )
  console.assert(balance.tokenBalances![0].amount === "9")
}

test()