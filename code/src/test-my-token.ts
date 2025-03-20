import {
    addressFromContractId, binToHex, contractIdFromAddress, stringToHex, sleep,
    NodeProvider, DUST_AMOUNT
 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { MyToken, MyTokenTypes } from '../artifacts/ts'

async function test() {
  const nodeProvider = new NodeProvider("http://127.0.0.1:22973")
  const signer = await getSigner()

  const { contractInstance: myToken } = await MyToken.deploy(
    signer, {
     initialFields: { name: stringToHex("MyToken"), owner: signer.address },
     issueTokenAmount: 1000n
  })

  console.assert(myToken.address === addressFromContractId(myToken.contractId))
  console.assert(binToHex(contractIdFromAddress(myToken.address)) === myToken.contractId)
  const myTokenId = myToken.contractId

  async function getTokenBalance(address: string, tokenId: string) {
    const balance = await nodeProvider.addresses.getAddressesAddressBalance(address)
    console.assert(balance.tokenBalances?.[0].id === tokenId)
    return balance.tokenBalances?.[0].amount
  }

  console.assert(await getTokenBalance(myToken.address, myTokenId) === "1000")

  const { returns: name } = await myToken.view.getName()
  console.assert(name === stringToHex("MyToken"))

  const { returns: owner } = await myToken.view.getOwner()
  console.assert(owner === signer.address)

  const results = await myToken.multicall({
    getName: {},
    getOwner: {}
  })

  console.assert(results.getName.returns === stringToHex("MyToken"))
  console.assert(results.getOwner.returns === signer.address)

  await myToken.transact.withdraw({ signer, attoAlphAmount: DUST_AMOUNT })
  console.assert(await getTokenBalance(myToken.address, myTokenId) === "900")
  console.assert(await getTokenBalance(signer.address, myTokenId) === "100")

  let transferEvent: MyTokenTypes.TransferEvent | undefined
  myToken.subscribeTransferEvent({
    messageCallback: (event) => {
      transferEvent = event
    },
    errorCallback: (error) => {
      console.error(error)
    },
    pollingInterval: 500
  })

  await sleep(1000)
  console.assert(transferEvent?.contractAddress === myToken.address)
  console.assert(transferEvent?.fields.amount === 100n)
  console.assert(transferEvent?.fields.to === signer.address)
  console.assert(transferEvent?.fields.version === 0n)

  process.exit(0)
}

test()