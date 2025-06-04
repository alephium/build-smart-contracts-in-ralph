import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner, mintToken } from '@alephium/web3-test'
import { ChainedSwapToken, Swap } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const nodeProvider = web3.getCurrentNodeProvider()

  const { tokenId: tokenIdA } = await mintToken(signer.address, 100n)
  const { tokenId: tokenIdB } = await mintToken(signer.address, 100n)
  const { tokenId: tokenIdC } = await mintToken(signer.address, 100n)

  const { contractInstance: swapAB } = await Swap.deploy(signer, {
    initialFields: {
      tokenId1: tokenIdA,
      tokenId2: tokenIdB,
      token1Reserve: 0n,
      token2Reserve: 0n
    }
  })

  const { contractInstance: swapBC } = await Swap.deploy(signer, {
    initialFields: {
      tokenId1: tokenIdB,
      tokenId2: tokenIdC,
      token1Reserve: 0n,
      token2Reserve: 0n
    }
  })

  await swapAB.transact.addLiquidity({
    signer, args: {
      lp: signer.address,
      token1Amount: 10n,
      token2Amount: 10n
    },
    tokens: [{ id: tokenIdA, amount: 10n }, { id: tokenIdB, amount: 10n }]
  })

  await swapBC.transact.addLiquidity({
    signer, args: {
      lp: signer.address,
      token1Amount: 10n,
      token2Amount: 10n
    },
    tokens: [{ id: tokenIdB, amount: 10n }, { id: tokenIdC, amount: 10n }]
  })

  const swapper = await getSigner()
  await signer.signAndSubmitTransferTx({
    signerAddress: signer.address,
    destinations: [{
      address: swapper.address,
      attoAlphAmount: ONE_ALPH,
      tokens: [{ id: tokenIdA, amount: 5n }]
    }]
  })

  await ChainedSwapToken.execute({
    signer: swapper,
    initialFields: {
      tokenPair12: swapAB.contractId,
      tokenPair23: swapBC.contractId,
      token1: tokenIdA,
      token2: tokenIdB
    },
    tokens: [{ id: tokenIdA, amount: 5n }]
  })

  const swapperTokenBalances = (await nodeProvider.addresses.getAddressesAddressBalance(swapper.address)).tokenBalances ?? []
  const tokenC = swapperTokenBalances.find(token => token.id === tokenIdC)
  console.assert(tokenC?.amount === "3", `Expected 3 tokens of ${tokenIdC}, got ${tokenC?.amount}`)
}

test()