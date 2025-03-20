import { NodeProvider, stringToHex } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { ShinyToken } from '../artifacts/ts'

async function test() {
  const nodeProvider = new NodeProvider('http://127.0.0.1:22973')
  const signer = await getSigner()

  const issueTokenAmount = 10000n
  const shinyToken = await ShinyToken.deploy(signer, {
    initialFields: {},
    issueTokenAmount,
    issueTokenTo: signer.address
  })
  const shinyTokenId = shinyToken.contractInstance.contractId

  const signerBalance = await nodeProvider.addresses.getAddressesAddressBalance(signer.address)
  console.assert(signerBalance.tokenBalances!.length === 1)
  console.assert(signerBalance.tokenBalances![0].id === shinyTokenId)
  console.assert(BigInt(signerBalance.tokenBalances![0].amount) === issueTokenAmount)

  const interfaceId = await nodeProvider.guessStdInterfaceId(shinyTokenId)
  console.assert(interfaceId === '0001')

  const tokenType = await nodeProvider.guessStdTokenType(shinyTokenId)
  console.assert(tokenType === 'fungible')

  const tokenMetaData = await nodeProvider.fetchFungibleTokenMetaData(shinyTokenId)
  console.assert(tokenMetaData.name === stringToHex('ShinyToken'))
  console.assert(tokenMetaData.symbol === stringToHex('Stk'))
  console.assert(tokenMetaData.decimals === 0)
  console.assert(tokenMetaData.totalSupply === issueTokenAmount)
}

test()