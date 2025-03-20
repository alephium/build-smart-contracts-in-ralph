import {
    binToHex, codec, stringToHex, subContractId,
    DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider
  } from '@alephium/web3'
  import { getSigner } from '@alephium/web3-test'
  import { AwesomeNFT, AwesomeNFTCollection } from '../artifacts/ts'
  
  async function test() {
    const nodeProvider = new NodeProvider('http://127.0.0.1:22973')
    const signer = await getSigner()
  
    const { contractInstance: awesomeNFTTemplate } = await AwesomeNFT.deploy(
      signer,
      { initialFields: { collectionId: '', nftIndex: 0n, uri: '' } }
    )
  
    const collectionUri = 'https://collection-uri'
    const { contractInstance: nftCollection } = await AwesomeNFTCollection.deploy(
      signer,
      {
        initialFields: {
          nftTemplateId: awesomeNFTTemplate.contractId,
          collectionUri: stringToHex(collectionUri),
          totalSupply: 0n
        },
      }
    )
  
    const collectionInterfaceId = await nodeProvider.guessStdInterfaceId(nftCollection.contractId)
    console.assert(collectionInterfaceId === '0002')
    const collectionMetadata = await nodeProvider.fetchNFTCollectionMetaData(nftCollection.contractId)
    console.assert(collectionMetadata.collectionUri === collectionUri)
    console.assert(collectionMetadata.totalSupply === 0n)
  
    const nftUri = 'https://nft-uri/0'
    await nftCollection.transact.mint({
      signer,
      args: { nftUri: stringToHex(nftUri) },
      attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT + DUST_AMOUNT
    })
  
    // NFT collection create NFT as a sub contract, using index as the sub contract path
    // For the first NFT, the index is `0`
    const nftSubContractPath = binToHex(codec.u256Codec.encode(0n))
    const nftContractId = subContractId(nftCollection.contractId, nftSubContractPath, 0)
  
    const nftInterfaceId = await nodeProvider.guessStdInterfaceId(nftContractId)
    console.assert(nftInterfaceId === '0003')
    const nftTokenType = await nodeProvider.guessStdTokenType(nftContractId)
    console.assert(nftTokenType === 'non-fungible')
  
    const nftMetadata = await nodeProvider.fetchNFTMetaData(nftContractId)
    console.assert(nftMetadata.tokenUri === nftUri)
    console.assert(nftMetadata.collectionId === nftCollection.contractId)
    console.assert(nftMetadata.nftIndex === 0n)
  }
  
  test()