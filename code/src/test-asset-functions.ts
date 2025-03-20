import { getSigner } from '@alephium/web3-test'
import { AssetFunctions } from '../artifacts/ts'
import { Address, DUST_AMOUNT, NodeProvider } from '@alephium/web3'

async function test() {
  const nodeProvider = new NodeProvider('http://127.0.0.1:22973')
  const signer = await getSigner()

  const { contractInstance: asset } = await AssetFunctions.deploy(signer, {
    initialFields: { owner: signer.address, n: 100n },
    issueTokenAmount: 100n,
    issueTokenTo: signer.address
  })

  async function getTokenBalance(address: Address) {
    const balance = await nodeProvider.addresses.getAddressesAddressBalance(address)
    console.assert(balance.tokenBalances?.[0].id === asset.contractId)

    return {
      totalBalance: balance.tokenBalances?.[0].amount,
      lockedBalance: balance.lockedTokenBalances?.[0].amount
    }
  }

  await asset.transact.burn({
    signer,
    tokens: [{ id: asset.contractId, amount: 1n }]
  })
  const signerBalance = await getTokenBalance(signer.address)
  console.assert(signerBalance.totalBalance === '99')

  await asset.transact.lock({
    signer,
    args: { amount: 1n },
    attoAlphAmount: DUST_AMOUNT,
    tokens: [{ id: asset.contractId, amount: 1n }]
  })
  const signerBalance2 = await getTokenBalance(signer.address)
  console.assert(signerBalance2.totalBalance === '99')
  console.assert(signerBalance2.lockedBalance === '1')

  await asset.transact.deposit({
    signer,
    args: { amount: 1n },
    tokens: [{ id: asset.contractId, amount: 1n }]
  })
  const signerBalance3 = await getTokenBalance(signer.address)
  console.assert(signerBalance3.totalBalance === '98')
  const contractBalance = await getTokenBalance(asset.address)
  console.assert(contractBalance.totalBalance === '1')

  await asset.transact.withdraw({
    signer,
    args: { amount: 1n },
    tokens: [{ id: asset.contractId, amount: 1n }]
  })
  const signerBalance4 = await getTokenBalance(signer.address)
  console.assert(signerBalance4.totalBalance === '99')
}

test()