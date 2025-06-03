# Smart Contracts Development in Ralph

Smart contract development in Ralph is designed with two key principles in mind: simplicity and security. As a straightforward yet robust programming language, Ralph empowers developers to create secure smart contracts with ease, while avoiding common issues found in other blockchain platforms.

The design philosophy of the Ralph language focuses on explicit asset management and clear control flow. This approach helps developers better understand and reason about their code. By making asset flows and state changes more visible and predictable, Ralph reduces the chances of subtle bugs that could lead to security issues. Additionally, Ralph makes common smart contract vulnerabilities, such as reentrancy attacks, impossible by design.

The UTXO-based asset management model offers additional security benefits. It prevents unlimited authorization of assets by restricting access to only the UTXOs included in a transaction. It also disables flashloans because assets cannot be borrowed and returned within the same transaction.

These features create a development environment where security is not an afterthought but an integral part of the language's design. As we delve deeper into Ralph's features and capabilities throughout this chapter, you'll discover how this emphasis on simplicity and security translates into practical benefits for smart contract development.

## Programming Model

Before delving into the specifics of smart contract development in Ralph, it's important to understand Alephium's unique stateful UTXO (sUTXO) model, which forms the foundation for its smart contract capabilities. This section starts by comparing the classical UTXO model and account-based model, then examines how Alephium's sUTXO model combines their strengths to create a powerful new paradigm.

### UTXO vs Account models

The UTXO (Unspent Transaction Output) model and the Account model represent two fundamentally different paradigms for managing blockchain state and transactions, each offering unique advantages and trade-offs.

The UTXO model, introduced by Bitcoin, treats transactions as a series of digital cash transfers. Each transaction consumes previous unspent outputs and creates new ones, similar to how physical coin is exchanged. When you spend money, you use up existing coins (inputs) and may receive change back (outputs). This model offers several compelling benefits. Since UTXOs can be processed independently, the system enables natural parallelization for transaction validation. The model also enhances privacy as users can use different addresses for each transaction. Additionally, it allows for efficient batching of multiple payments into single transactions. Most importantly, the UTXO model has proven its security through Bitcoin's decade-plus history of securing billions in value.

However, the UTXO model has significant limitations when it comes to smart contract development. The lack of persistent state between transactions makes it difficult to implement complex business logic. For example, tracking aggregated data such as a counter across transactions is challenging, even though it is a common scenario in modern smart contracts. Furthermore, the expressiveness of the UTXO scripting language is often deliberately restricted to enhance security.

The Account model, popularized by Ethereum, maintains a global record of accounts. Each account has its own balance and state that can be modified through transactions. This model simplifies smart contract development by making state globally accessible and providing a programming paradigm similar to object-oriented programming, which is widely adopted and well-understood by developers.

However, the Account model has its own set of challenges. The shared global state makes parallel execution inherently difficult, the system is more vulnerable to MEV exploits, and it often lacks robust built-in security features at the language level. For instance, users must approve token contracts to act on their behalf before spending, which in practice often leads in unlimited authorization. If such a contract is malicious or compromised, it could drain a user's entire token balance unchecked. This approval model introduces complexity and potential security risks that are not present in the UTXO model.

Each model has its trade-offs, which is why Alephium developed stateful UTXO (sUTXO) model which thoughtfully combines the advantages of both approaches while mitigating their drawbacks. This hybrid model represents a significant step forward in blockchain architecture, offering developers the best of both worlds.

### Stateful UTXO

In the sUTXO model, assets are managed using UTXOs, preserving the security and parallelization advantages inherent in the traditional UTXO model. Users can own an arbitrary number of UTXOs to manage their assets, while each smart contract is assigned exactly one UTXO. This design seamlessly unifies asset management for both users and contracts, making it simple and consistent.

In contrast, contract states are managed using the account-based model. Each contract has its own persistent state that can be modified across transactions. This approach allows developers to implement complex business logic more easily.

In the sUTXO model, transactions enable both simple asset transfers and smart contract interactions. For simple asset transfers, they follow the traditional UTXO pattern: consuming existing UTXOs as inputs and generating new ones as outputs. The sUTXO model enhances this by enabling transactions to also interact with smart contracts. This means a single transaction can transfer assets between users and contracts while simultaneously executing contract logic and updating contract states.

For example, when swapping tokens on a decentralized exchange (DEX), the transaction would:

1. Consume the user's UTXO containing the input tokens
2. Execute the DEX contract's swap logic
3. Update the contract's internal state (e.g. liquidity pools)
4. Create new UTXOs containing the output tokens for the user and the contract

Through this innovative model, Alephium combines the best of both worlds: the scalability and security benefits inherent to the UTXOs model, along with the flexibility and expressiveness of the account-based model.

### Hybrid Programming Model

Alephium's sUTXO model requires a specialized programming language (Ralph) and virtual machine (Alphred). They work together to provide an expressive yet secure programming environment. The UTXO-based asset management treats tokens as first-class citizens, just like native ALPH tokens, and eliminates a class of common UX and security issues found in account-based models such as unlimited token approvals. Together with Ralph's carefully designed programming constructs, the Alphred VM prevents reentrancy attacks, unintended function calls, and accidental state updates. It also ensures that assets move strictly as specified by the contract code, making it extremely difficult for malicious actors to manipulate asset transfers in unintended ways. These built-in security features free developers to focus more on building their dApps.

Alephium also supports Bitcoin-like stateless programming where logic is entirely contained within the scope of UTXOs. For example, it supports Pay-to-Script-Hash (`P2SH`) to create sophisticated spending conditions using the Ralph programming language, which is more expressive than Bitcoin script. In fact, the support of Schnorr signatures in Alephium is implemented using this approach.

The separation of asset and contract states, along with support for both stateful and stateless programming, opens up new opportunities for dApp development. This hybrid approach draws interesting parallels to the evolution of programming languages. The UTXO model's immutability and lack of shared state are akin to functional programming (FP), which focuses on pure functions and immutable data. In contrast, the account-based model resembles object-oriented programming (OOP), where objects manage mutable state that changes over time. Notably, both the classical UTXO model and pure functional languages like Haskell are more challenging to program and have not gained widespread adoption among developers. Conversely, despite frequent criticisms of Java's state management, it remains dominant in the industry due to its developer-friendliness, much like the widespread adoption of the account-based model in the blockchain space.

Just as Scala and Rust harness the strength of both functional and object-oriented paradigms, sUTXO model represents a similar evolutionary step in blockchain programming model that preserves the robust security and clarity of immutable UTXO model, while incorporating the expressiveness and flexibility of account-based model. This hybrid design empowers developers to build sophisticated dApps that benefit from the security of the UTXO model and the flexibility of the account-based model.

## The Ralph Language

Ralph is the smart contract programming language specifically designed for the Alephium blockchain, with a focus on security, simplicity, and efficiency. The design of Ralph follows the following principles:

- Keep the smart contract DSL as simple as possible
- Ensure there is one, and preferably only one, obvious way to accomplish tasks
- Incorporate good practices, especially security practices, as built-in features rather than optional patterns

This design philosophy is reflected in Ralph's key features. The language makes variables immutable by default to reduce mutation-related bugs and unintended state changes. It implements automatic safety checks for public contract calls, protecting against unexpected external interactions that could compromise security. Asset movements between functions must be explicitly approved and verified, eliminating unauthorized transfers. Ralph's specialized data structures like sub contracts and maps are optimized to minimize state bloat, improving the sustainability of the blockchain. These carefully designed features create a language that balances robust security with developer productivity, making Ralph both powerful and approachable for developers of all experience levels.

### Hello Web3

Let's kick things off with a simple example before we dive into all the nitty-gritty details of syntax and features. Here's a basic `HelloWeb3` contract that just prints a message, great for getting our feet wet with Ralph.

```rust
// This is a comment
// This is a simple Hello Web3 program

Contract HelloWeb3 {
    pub fn main() -> () {
        emit Debug(`Hello Web3!`)
    }
}
```

To test this contract, we'll start by creating a new project and adding the `HelloWeb3` contract to it. The [Alephium CLI](https://docs.alephium.org/sdk/cli) allows us to quickly scaffold a new project.

```bash
$ npx @alephium/cli init hello-web3
...
✅ Done.
✨ Project is initialized!
```

Next, we'll create a file named `hello-web3.ral` inside the `contracts` directory and add the `HelloWeb3` contract into it:

```bash
> cd hello-web3
> cat contracts/hello-web3.ral
Contract HelloWeb3() {
    pub fn main() -> () {
        emit Debug(`Hello Web3!`)
    }
}
```

To compile and test the contract, we also need to start the local Alephium devnet:

```bash
> git clone git@github.com:alephium/alephium-stack.git
> cd alephium-stack/devnet
> docker-compose up -d
[+] Running 5/5
 ✔ Container devnet-alephium-1           Healthy
 ✔ Container devnet-postgres-1           Healthy
 ✔ Container devnet-explorer-backend-1   Running
 ✔ Container devnet-pgadmin-1            Running
 ✔ Container devnet-explorer-frontend-1  Running
```

Once the local devnet is up and running, compile the `HelloWeb3` contract like this:

```bash
$ npm install
$ npx @alephium/cli compile
Loading alephium config file: .../hello-web3/alephium.config.ts
Full node version: v3.11.2
✅ Compilation completed!
Generating code for contract HelloWeb3
Generating code for contract TokenFaucet
Generating code for script Withdraw
✅ Codegen completed!
```

The console output shows that the `HelloWeb3` contract was successfully compiled, with its companion TypeScript class generated in the `artifacts/ts` directory. The `TokenFaucet` contract and `Withdraw` script are part of the default project template and will be covered later, so please ignore them for now.

To test the `HelloWeb3` contract, let's create a file called `src/hello-web3.ts` and add the following code to it:

```ts
import { web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { HelloWeb3 } from '../artifacts/ts'

async function run() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const signer = await getSigner()
  const helloWeb3 = await HelloWeb3.deploy(signer, { initialFields: {} })
  await helloWeb3.contractInstance.view.main()
}

run()
```

In the example above, we deployed the `HelloWeb3` contract and invoked its `main` function using the `view` method using its TypeScript companion class. The `view` method is a read-only operation, meaning that it does not modify the contract's state.

The line `web3.setCurrentNodeProvider('http://127.0.0.1:22973')` sets the current node provider to the local devnet. To deploy a contract, we also need a signer to cover the transaction fee. The Alephium Web3 SDK simplifies this by providing a convenient `getSigner()` function, which returns a fresh pre-funded devnet signer ready for use.

To execute the test, run:

```bash
$ npx ts-node src/hello-web3.ts
Testing HelloWeb3.main:
> Contract @ 2BucyFRRMPLEPyhnvZBNV5W1Luei5gkt6dGFQCCM9fhYj - Hello Web3!
```

`2BucyFRRMPLEPyhnvZBNV5W1Luei5gkt6dGFQCCM9fhYj` is the address of the deployed `HelloWeb3` contract. Your address will likely be different. The "Hello Web3!" message confirms that the contract's `main` function executed successfully.

### Types

Ralph is a statically typed language with type inference, eliminating the need for explicit type declarations for local variables and constants. All types in Ralph are value types, which are always copied when passed as function arguments or assigned to variables.

#### Primitive Types

Ralph supports the following primitive types: `Bool`, `I256`, `U256`, `ByteVec` and `Address`. Let's create some contracts to explore these types.

##### Bool

```rust
Contract Bool () {
    pub fn test() -> () {
      let a = true
      let b = false

      // Logical operators
      assert!((a && b) == false, 0)
      assert!((a || b) == true, 1)
      assert!(!a == false, 2)

      // Combining logical operators
      assert!(((a || b) && !b) == true, 3)
      assert!((!(a && b) || (a || b)) == true, 4)

      // With comparisons
      assert!(((5 > 3) && (2 < 4)) == true, 5)
      assert!(((10 >= 10) || (5 <= 3)) == true, 6)

      emit Debug(`Test successful for Bool`)
    }
}
```

Ralph's boolean type works as you would expect from other programming languages. It supports the standard comparison operators (`==`, `!=`) for all primitive types and inequality operators (`<`, `>`, `<=`, `>=`) for numeric types. These can be combined with logical operators (`&&`, `||`, `!`) to create complex conditions.

In the contract, `assert!` is a built-in function that checks the condition, aborts the execution and returns a numerical error code if the condition is false.

To test the `Bool` contract, we'll create a test file named `bool.ts`. The test code follows the same pattern we used for the `HelloWeb3` contract, using the Web3 SDK:

```typescript
import { web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Bool } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const signer = await getSigner()
  const bool = await Bool.deploy(signer, { initialFields: {} })
  await bool.contractInstance.view.test()
}

test()
```

To run the test:

```bash
$ npx ts-node src/bool.ts
Testing Bool.test:
> Contract @ vR49p2i2SrKkcyhwu6TQV7hg2ebSeDsToFLxfFMCvwR1 - Test successful for Bool
```

For the remaining types, we'll focus on the contract code and test outputs, skipping the TypeScript test code unless necessary.

##### I256 and U256

Ralph supports 256-bit signed and unsigned integers. These are represented by the `I256` and `U256` types respectively. The `U256` type can represent values from 0 to 2^256-1, while the `I256` type can represent values from -2^255 to 2^255-1. By default, integer literals without a suffix are interpreted as `U256`, while literals with a negative sign or an `i` suffix are interpreted as `I256`.

```rust
Contract Integer () {
    pub fn test() -> () {
      // The type of `a` ... `e` is U256.
      let a = 10
      let b = 10u
      let c = 1_000_000_000
      let d = 1e18
      let e = 0xff

      // The type of `f` ... `h` is I256.
      let f = -10
      let g = 10i
      let h = -1e18

      // Basic arithmetic
      assert!(a + b == 20, 0)
      assert!(f - g == -20, 1)
      assert!(c * 2 == 2000000000, 2)
      assert!(h / 1000i == -1e15, 3)
      assert!(2 ** 8 == 256, 4)
      assert!(10 % 3 == 1, 5)

      assert!(10 / 3 == 3, 6)       // round down
      assert!(10 \ 3 == 4, 7)       // round up
      assert!(-10i / 3i == -4i, 8)  // round down
      assert!(-10i \ 3i == -3i, 9)  // round up

      // More complex expressions
      assert!((a * b + c) / d == 0, 10)

      // Overflow examples:
      // let h = u256Max!() + 1
      // let i = 0 - 1
      // let j = i256Max!() + 1i
      // let k = i256Min!() - 1i

      // Modulo 2^256 operators for U256 type
      assert!(u256Max!() |+| 1 == 0, 11) // Addition modulo 2^256
      assert!(0 |-| 1 == u256Max!(), 12) // Subtraction modulo 2^256
      assert!(u256Max!() |*| 2 == u256Max!() - 1, 13) // Multiplication modulo 2^256
      assert!((1 << 128) |**| 2 == 0, 14) // Power modulo 2^256

      // Modulo N operators for U256 type
      assert!(mulModN!(2, 3, 4) == 2, 15) // (2 * 3) % 4
      assert!(mulModN!(1 << 128, 1 << 128, u256Max!() - 1) == 2, 16)
      assert!(mulModN!(u256Max!(), u256Max!(), u256Max!()) == 0, 17)
      assert!(addModN!(2, 3, 4) == 1, 18) // (2 + 3) % 4
      assert!(addModN!(1 << 128, 1 << 128, u256Max!()) == 1 << 129, 19)
      assert!(addModN!(u256Max!(), u256Max!(), u256Max!()) == 0, 20)

      // Bitwise Operators for U256 type
      assert!(e & 0xf0 == 0xf0, 21)
      assert!(e | 0xf0 == 0xff, 22)
      assert!(e ^ 0xf0 == 0x0f, 23)
      assert!(e << 8 == 0xff00, 24)
      assert!(e >> 4 == 0x0f, 25)

      emit Debug(`Test successful for Integer`)
    }
}
```

Ralph supports standard arithmetic operators that you would expect in most programming languages: `+` (addition), `-` (subtraction), `*` (multiplication), `/` (division), `**` (exponentiation), and `%` (modulo). These operators work with both `I256` and `U256` types. Ralph performs automatic overflow checking at runtime to prevent silent arithmetic errors that could lead to security vulnerabilities.

Ralph offers two division modes: round up (`/`) and round down (`\`). This is especially useful in DeFi applications where unintended rounding errors is a key exploitation vector.

```rust
assert!(10 / 3 == 3, 6)       // round down
assert!(10 \ 3 == 4, 7)       // round up
assert!(-10i / 3i == -4i, 8)  // round down
assert!(-10i \ 3i == -3i, 9)  // round up
```

For the `U256` type, Ralph provides specialized arithmetic operators that perform calculations modulo `2^256`. These operators (`|+|`, `|-|`, `|*|`, and `|**|`) allow for efficient overflow-safe arithmetic operations without runtime checks, as they naturally wrap around when exceeding the maximum value, as shown in the `Integer` contract:

```rust
assert!(u256Max!() |+| 1 == 0, 7) // Addition modulo 2^256
assert!(0 |-| 1 == u256Max!(), 8) // Subtraction modulo 2^256
assert!(u256Max!() |*| 2 == u256Max!() - 1, 9) // Multiplication modulo 2^256
assert!((1 << 128) |**| 2 == 0, 10) // Power modulo 2^256
```

Ralph also provides specialized modulo functions for the `U256` type: `addModN!` and `mulModN!`, which compute addition and multiplication modulo a specified value:

```rust
assert!(mulModN!(2, 3, 4) == 2, 11) // (2 * 3) % 4
assert!(mulModN!(1 << 128, 1 << 128, u256Max!() - 1) == 2, 12)
assert!(mulModN!(u256Max!(), u256Max!(), u256Max!()) == 0, 13)

assert!(addModN!(2, 3, 4) == 1, 14) // (2 + 3) % 4
assert!(addModN!(1 << 128, 1 << 128, u256Max!()) == 1 << 129, 15)
assert!(addModN!(u256Max!(), u256Max!(), u256Max!()) == 0, 16)
```

Additionally, Ralph supports bitwise operators for the `U256` type, allowing for low-level bit manipulation operations that are essential for cryptographic algorithms and efficient data processing. Here are examples demonstrating these operators:

```rust
assert!(0xff & 0xf0 == 0xf0, 17)  // Bitwise AND
assert!(0xff | 0xf0 == 0xff, 18)  // Bitwise OR
assert!(0xff ^ 0xf0 == 0x0f, 19)  // Bitwise XOR
assert!(0xff << 8 == 0xff00, 20)  // Left shift
assert!(u256Max!() << 2 == u256Max!() - 3, 21)  // Left shift
assert!(0xff >> 4 == 0x0f, 22)    // Right shift
```

##### ByteVec

The `ByteVec` type represents a sequence of bytes (8-bit unsigned integers). It's a versatile data type used for handling binary data, encoding strings, or storing cryptographic values like hashes and signatures. ByteVec literals are denoted by starting with `#` followed by a hexadecimal string.

```rust
Contract ByteVec () {
    pub fn test() -> ()  {
      // ByteVec literals must start with `#` followed by a hex string.
      let a = #00112233
      let b = #  // Empty ByteVec

      // ByteVec concatenation
      assert!(#0011 ++ #2233 == a, 0)
      assert!(a ++ b == a, 1)

      // String literals starts with `b`.
      let c = b`Hello`
      let d = b`World`
      assert!(c ++ b` ` ++ d == b`Hello World`, 2)

      // Convert other types to ByteVec
      assert!(toByteVec!(true) == #01, 3)
      assert!(toByteVec!(false) == #00, 4)
      assert!(toByteVec!(100) == #4064, 5)
      assert!(toByteVec!(-100i) == #7f9c, 6)

      assert!(size!(b`Hello World`) == 11, 7)
      assert!(byteVecSlice!(b`Hello World`, 0, 5) == b`Hello`, 8)

      emit Debug(`Test successful for ByteVec`)
   }
}
```

Ralph doesn't have a native string type, but supports string literals that are encoded as `ByteVec` values:

```rust
// String literals starts with `b`.
let a = b`Hello`
let b = b`World`
let c = a ++ b` ` ++ b
```

ByteVec values can be concatenated using the `++` operator, and other types can be converted to ByteVec using the `toByteVec!` built-in function. There are also built-in functions to get the size of a ByteVec and to slice a ByteVec.

##### Address

An address on Alephium is a unique identifier that represents an account or a contract. All networks (i.e. mainnet, testnet, devnet) share the same address format.

There are currently 6 different address types on Alephium, each represented by a unique byte prefix:

- `0x00` - Pay to public key hash (`P2PKH`)
- `0x01` - Pay to multiple public key Hash (`P2MPKH`)
- `0x02` - Pay to script hash (`P2SH`)
- `0x03` - Pay to contract (`P2C`)
- `0x04` - Pay to public key (`P2PK`)
- `0x05` - Pay to hash of mutiple public keys (`P2HMPK`)

Each address type is followed by a specific content bytes format:

- `P2PKH` - serialized public key hash
- `P2MPKH` - serialized public key hashes and multisig threshold
- `P2SH` - serialized script hash
- `P2C` - serialized contract ID
- `P2PK` - serialized public key with checksum + group info
- `P2HMPK` - serialized hash of key type, multisig threshold and all public keys with check sum + group info

The complete address in bytes is constructed by concatenating the address type and the content bytes:

```
address = address type || content bytes
```

The string representation of an address is the base58 encoding of its byte representation. At the protocol level, each address on Alephium belongs to a group, which can be derived deterministically from the address. In Ralph, address literals must start with `@` followed by a valid base58-encoded Alephium address.

```rust
Contract AddressTest () {
    fn prefix(address: Address) -> ByteVec {
       return byteVecSlice!(toByteVec!(address), 0, 1)
    }

    pub fn test() -> ()  {
      // Address literals must start with `@`
      let p2pkh = @1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH
      let p2mpkh = @2jW1n2icPtc55Cdm8TF9FjGH681cWthsaZW3gaUFekFZepJoeyY3ZbY7y5SCtAjyCjLL24c4L2Vnfv3KDdAypCddfAY
      let p2sh = @ibsc1yJLJxxVcsPfSDJoR3mzrasrZq2Rn63dFQGcDAYE
      let p2c = @26j4viXkBzJd5SaDtQzyGM6joqoECmajncT4QS3tmT9hb
      let p2pk = @3cUqhqEgt8qFAokkD7qRsy9Q2Q9S1LEiSdogbBmaq7CnshB8BdjfK:1
      let p2hmpk = @CSYxX7pdWvrbqAQFfHaUsrL4xpgXKktsQF2yJ8P53AmCyGiNbU:0

      assert!(prefix(p2pkh) == #00, 0)
      assert!(prefix(p2mpkh) == #01, 1)
      assert!(prefix(p2sh) == #02, 2)
      assert!(prefix(p2c) == #03, 3)
      assert!(prefix(p2pk) == #04, 4)
      assert!(prefix(p2hmpk) == #05, 5)

      assert!(groupOfAddress!(p2pkh) == 0, 4)
      assert!(groupOfAddress!(p2mpkh) == 0, 5)
      assert!(groupOfAddress!(p2sh) == 0, 6)
      assert!(groupOfAddress!(p2c) == 2, 7)
      assert!(groupOfAddress!(p2pk) == 1, 8)
      assert!(groupOfAddress!(p2hmpk) == 3, 9)

      emit Debug(`Test successful for Address`)
   }
}
```

The `prefix` function is a helper function that extracts the address type from an address. The `groupOfAddress!` function is a built-in function that returns the group of an address.

###### Groupless Address

Before the Danube upgrade, Alephium addresses included group information at both the protocol and application level. The Danube upgrade introduced groupless address types, which abstract away the complexity of groups at the application level. This enables wallets and dApps to offer a significantly smoother and more intuitive user experience.

Note that group information is still required at the protocol level, for example in the Ralph code. Currently, the supported groupless address types include both `P2PK` and `P2HMPK`.

```rust
let p2pk = @3cUqhqEgt8qFAokkD7qRsy9Q2Q9S1LEiSdogbBmaq7CnshB8BdjfK:1  // explicit group required
let p2hmpk = @CSYxX7pdWvrbqAQFfHaUsrL4xpgXKktsQF2yJ8P53AmCyGiNbU:0   // explicit group required

assert!(prefix(p2pk) == #04, 4)
assert!(prefix(p2hmpk) == #05, 5)

assert!(groupOfAddress!(p2pk) == 1, 8)
assert!(groupOfAddress!(p2hmpk) == 3, 9)
```

At the application level, `3cUqhqEgt8qFAokkD7qRsy9Q2Q9S1LEiSdogbBmaq7CnshB8BdjfK` is a valid `P2PK` groupless address. This is what user would normally see and use. Under the hood, it contains the following grouped addresses:

```
3cUqhqEgt8qFAokkD7qRsy9Q2Q9S1LEiSdogbBmaq7CnshB8BdjfK:0
3cUqhqEgt8qFAokkD7qRsy9Q2Q9S1LEiSdogbBmaq7CnshB8BdjfK:1
3cUqhqEgt8qFAokkD7qRsy9Q2Q9S1LEiSdogbBmaq7CnshB8BdjfK:2
3cUqhqEgt8qFAokkD7qRsy9Q2Q9S1LEiSdogbBmaq7CnshB8BdjfK:3
```

When user checks the balance of `3cUqhqEgt8qFAokkD7qRsy9Q2Q9S1LEiSdogbBmaq7CnshB8BdjfK`, it returns the combined balance of all the underlying grouped addresses. When the user uses this address to transfer assets or interact with dApps, the system automatically picks the appropriate underlying grouped address and performs any neccessary internal transfers to complete the transaction seamlessly. The same logic applies to the `P2HMPK` addresses as well.

For `P2PK` address, the content bytes of the address consist of the following components:

```fundamental
content bytes = public key type || public key || checksum || group
```

Unlike `P2PKH` which only supports the `SecP256K1` public keys, `P2PK` also supports the following public key types to enable more use cases such as `PassKey`:

- `0x00` - SecP256K1
- `0x01` - SecP256R1
- `0x02` - ED25519
- `0x03` - WebAuthn

The checksum is a 4-byte `djb2` hash of the public key, the purpose is to provide simple integrity check for the public key. Group information is also included.

For `P2HMPK` address, the address content bytes are composed of the following components:

```fundamental
content bytes = blake2b(address type || public keys || multisig threshold) | checksum | group
```

The content of the `P2HMPK` address is constructed by first computing a `Blake2b` hash over the concatenation of the address type (`06`), all public keys and the multisig threshold. This hash is then followed by a 4-byte `djb2` checksum of the hash and finally a single byte indicating the group.

#### Composite Types

Ralph supports five composite types: `Tuple`, `Struct`, `Array`, `Enum`, and `Map`.

##### Tuple

Ralph supports `tuple`, a product type containing an ordered, fixed-size collection of values of potentially different types. Elements are accessed by their position in the tuple.

```rust
Contract TupleExample() {
    fn createTuple() -> (U256, ByteVec, Bool) {
        return 100, b`tuple example`, false
    }

    pub fn test() -> () {
        // A tuple with different types
        let (mut first, second, third) = createTuple()
        first = first + 1

        assert!(first == 101, 0)
        assert!(second == b`tuple example`, 1)
        assert!(third == false, 2)
        emit Debug(`Tuple test successful`)
    }
}
```

In the example above, `createTuple()` returns a tuple with three elements, which are destructured into `first`, `second`, and `third` in the `test()` function. The `first` element is explicitly declared as mutable with `mut` keyword, allowing us to modify its value. Other elements are immutable by default.

##### Struct

Ralph supports `struct`, a product type defined globally with fields that can be mutable or immutable. Unlike tuples where elements are accessed by position, struct elements are referred to by their field names using dot notation (e.g. `myStruct.fieldName`). To modify a nested field (e.g. `foo.x.y.z = 123`), all selectors in the chain (`foo`, `x`, `y`, and `z`) must be declared as mutable.

```rust
// Structs have to be defined globally
struct Foo { x: U256, mut y: U256 }
struct Bar { z: U256, mut foo: Foo }

Contract Struct() {
   pub fn test() -> () {
       let f0 = Foo { x: 1, y: 2 }
       // f0.y = 3 won't work as f0 is immutable despite the field y being mutable

       let mut f1 = Foo { x: 1, y: 2 }
       f1.y = 3 // This works as both f1 and y are mutable
       assert!(f1.y == 3, 0)

       // let b0 = Bar { z: 4, foo: f0 }
       // b0.foo.y = 5 won't work as b0 is immutable

       let mut b1 = Bar { z: 5, foo: f0 }
       b1.foo.y = 6
       assert!(b1.foo.y == 6, 1)

       emit Debug(`Test successful for Struct`)
  }
}
```

Structs are value types that are copied when assigned to new variables, rather than being passed by reference:

```rust
struct Foo { x: U256, mut y: U256 }

Contract Struct() {
    pub fn test() -> () {
        let foo0 = Foo { x: 0, y: 1 }
        let mut foo1 = foo0

        // Modifying foo1.y will not change foo0.y
        foo1.y = 2
        assert!(foo0.y == 1, 0)
        assert!(foo1.y == 2, 1)

        emit Debug(`Test successful for Struct`)
    }
}
```

Ralph also supports struct destructuring with syntax similar to TypeScript:

```rust
struct Foo { x: U256, y: U256 }

Contract Struct() {
  pub fn test() -> () {
    let foo = Foo { x: 0, y: 1 }

    let Foo { mut x, y } = foo
    assert!(x == 0, 0)
    assert!(y == 1, 1)
    x = 1

    // Variables `x` and `y` already exist, create two new variables `x1` and `y1`
    let Foo { x: x1, y: y1 } = foo
    assert!(x1 == 0, 2)
    assert!(y1 == 1, 3)

    emit Debug(`Test successful for Struct`)
  }
}
```

##### Fixed Size Array

Fixed size arrays are product types, similar to tuples and structs, but with a key difference: they contain elements of the same type, and the size is part of the type signature. This means the array's length must be known at compile time and cannot be changed during execution.

```rust
struct Foo { x: U256, y: U256 }

Contract Array() {
    pub fn test() -> () {

        let a0 = [0, 1, 2, 3]  // [U256; 4]
        assert!(a0[2] == 2, 0)

        let a1 = [[0, 1], [2, 3]] // [[U256, 2]; 2]
        assert!(a1[0][1] == 1, 1)

        let a2 = [0i; 3]  // [I256; 3]
        assert!(a2[2] == 0i, 2)

        let a3 = [#00, #11, #22, #33]  // [ByteVec; 4]
        assert!(a3[2] == #22, 3)

        let a4 = [Foo{ x: 1, y: 2 }, Foo{ x: 3, y: 4 }] // [Foo; 2]
        assert!(a4[0].x == 1, 4)
        assert!(a4[1].y == 4, 5)

        emit Debug(`Test successful for Array`)
  }
}
```

Fixed size arrays can be initialized in two ways: by providing a list of elements within square brackets, like `[0, 1, 2, 3]` as shown in `a0`, or by specifying a single element followed by a semicolon and the size of the array, like `[0i; 3]` as shown in `a2`. This second syntax creates an array with all elements initialized to the same value.

The elements of a fixed size array can be either primitive types (e.g. `U256`, `I256`, `ByteVec`) or composite types such as `Tuple`, `Struct`. It can also be other fixed sized arrays which would make it multi-dimensional arrays.

##### Map

In Ralph, `Map` is a key-value data structure defined as global contract attributes, eliminating the need for explicit initialization. Maps are declared using the syntax `mapping[KeyType, ValueType] mapName` where:

- `KeyType` can be any primitive type (`Bool`, `U256`, `I256`, `Address`, `ByteVec`)
- `ValueType` can be any valid Ralph type except another `Map`

Maps provide efficient storage and retrieval of values based on unique keys, making them ideal for maintaining state in smart contracts.

Under the hood, each Map entry is constructed as a subcontract of the current contract. Unlike other blockchain implementations where maps can cause state bloat with unlimited entries, Alephium's approach prevents this by requiring a small deposit for each map entry. While the deposit amount could potentially be updated in the future upgrades, using the `mapEntryDeposit!()` built-in function in Ralph ensures your code remains future-proof by always returning the correct required amount. The deposit is automatically returned to a specified recipient when the map entry is removed.

Maps provide three essential built-in methods: `insert!` for creating entries, `remove!` for deleting entries, and `contains!` for checking existence. Values can be accessed and updated using bracket syntax `map[key] = newValue`. The example below demonstrates these operations.

```rust
Contract Counters() {
  // All maps must be defined at the contract level
  mapping[Address, U256] counters

  @using(preapprovedAssets = true, checkExternalCaller = false)
  pub fn create() -> () {
    let key = callerAddress!()
    let depositor = key
    // The depositor will deposit a minimal ALPH deposit for the new map entry
    counters.insert!(depositor, key, 1)
  }

  @using(checkExternalCaller = false)
  pub fn increase() -> () {
    let key = callerAddress!()
    let value = counters[key]
    // Update the map entry value
    counters[key] = value + 1
  }

  pub fn currentCount(key: Address) -> U256 {
    if (counters.contains!(key)) {
      return counters[key]
    } else {
      return 0
    }
  }

  @using(checkExternalCaller = false)
  pub fn clear() -> U256 {
    let key = callerAddress!()
    let depositRecipient = key
    let value = counters[key]
    // Each map entry removal redeems the map entry deposit
    counters.remove!(depositRecipient, key)
    return value
  }
}
```


The `Counters` contract demonstrates maps in Ralph by implementing a simple personal counter. Users can create a counter tied to their address (with a map entry deposit), increment it, check its value, and eventually clear it (recovering their deposit).

Function annotations play a crucial role in Ralph smart contracts, and we'll explore them in more details in the [Function Annotations](#function-annotations) section. For now, let's briefly examine the annotations used in the `Counters` contract to understand their purpose:

- `@using(preapprovedAssets = true)`: This annotation requires the caller to approve assets before calling the function. In this case, the caller needs to approve enough ALPH to cover the map entry deposit.
- `@using(checkExternalCaller = false)`: By default, Ralph requires public functions that can potentially update blockchain state to check the caller, otherwise it won't compile. This annotation allows any caller to call the function.

Let's test the `Counters` contract using the TypeScript code below:

```typescript
import { MAP_ENTRY_DEPOSIT, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Counters } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const signer = await getSigner()
  const { contractInstance: counters } = await Counters.deploy(
    signer, { initialFields: {} }
  )

  async function getCurrentCount() {
    const { returns } = await counters.view.currentCount(
      { args: { key: signer.address } }
    )
    return returns
  }

  console.assert(await getCurrentCount() === 0n);
  await counters.transact.create({ signer, attoAlphAmount: MAP_ENTRY_DEPOSIT })
  console.assert(await getCurrentCount() === 1n)
  await counters.transact.increase({ signer })
  console.assert(await getCurrentCount() === 2n)
  await counters.transact.clear({ signer })
  console.assert(await getCurrentCount() === 0n);
}

test()
```

`getCurrentCount` is a helper function that calls the `currentCount` view function of the `Counters` contract to get the current count of the counter for the signer's address. After deploying the `Counters` contract, the current count for signer address is 0.

After calling the `create` function, the counter for the signer's address is initialized to 1. We use the `transact` method since this function modifies blockchain state, and we provide the required `MAP_ENTRY_DEPOSIT` amount of ALPH to cover the map entry cost.

Next, we call the `increase` function to increment the counter to 2. Finally, we call the `clear` function which resets the counter to 0 and returns the map entry deposit to the signer's address.

##### Enum

Ralph supports `enum` types, which let you define a type with several possible variants. Enums can be defined either globally (outside any contract) for use across multiple contracts, or locally within a specific contract. They're especially useful for representing a fixed set of related values, such as error codes or status indicators.

```rust
enum GlobalErrorCode {
  INVALID_CALLER_CONTRACT = 0
}

Contract Foo(owner: Address, parentId: ByteVec) {
  enum LocalErrorCode {
    INVALID_OWNER = 1
  }

  pub fn foo(caller: Address) -> () {
    assert!(callerContractId!() == parentId, GlobalErrorCode.INVALID_CALLER_CONTRACT)
    assert!(caller == owner, LocalErrorCode.INVALID_OWNER)
  }
}
```

The value for enum fields can only be constant value of primitive types such as `U256`, `I256`, `Bool`, `Address` and `ByteVec`.

### Functions

Functions are the executable units of code in Ralph and can be defined within either a contract or a transaction script.

#### Function Signature

```rust
// Public function, which can be called by anyone
pub fn foo() -> ()

// Private function, which can only be called inside the contract
fn foo() -> ()

// Function takes 1 parameter and has no return values
fn foo(a: U256) -> ()

// Function takes 2 parameters and returns 1 value
fn foo(a: U256, b: Boolean) -> U256

// Function takes 2 parameters and returns multiple values
fn foo(a: U256, b: Boolean) -> (U256, ByteVec, Address)

// Function takes a struct as parameter and returns another struct
fn foo(foo: Foo) -> Bar
```

Functions in Ralph are defined with an optional visibility modifier (`pub` for public or no modifier for private), followed by the `fn` keyword, the function name, parameters in parentheses, a return type after an arrow (`->`), and the function body enclosed in curly braces. Public functions can be called from outside the contract, while private functions are only accessible within the contract. Functions can accept multiple parameters and return multiple values, supporting both primitive and composite types.


#### Function Annotations

Ralph functions support annotations to specify behavior and permissions. Currently, the following annotations are supported:

| Annotation Field       | Description                                                 | Default Value |
|------------------------|-------------------------------------------------------------|---------------|
| `preapprovedAssets`    | Whether the function uses user-approved assets              | `false`       |
| `assetsInContract`     | Whether the function uses contract assets                   | `false`       |
| `payToContractOnly`    | Whether the function only receives assets into the contract | `false`       |
| `checkExternalCaller`  | Whether the function is required to check the caller        | `true`        |
| `updateFields`         | Whether the function updates the contract fields            | `false`       |

We will discuss each of these annotations in detail in the rest of this section, including how they affect function behavior and when they should be used.

##### Using Approved Assets

In Ralph, functions that use assets require explicit approval from the caller. This is a security feature that ensures assets are only spent with proper authorization. When a function needs to use approved assets:

1. The function must be annotated with `@using(preapprovedAssets = true)`
2. All functions in the call stack that pass these assets must also have this annotation
3. The caller must explicitly specify which assets and amounts are being approved

This creates a clear chain of asset approval throughout the entire call stack.

```rust
Contract Burn() {
  // Requires asset approval to call `burn` since it burns assets
  @using(preapprovedAssets = true)
  fn burn(caller: Address, tokenId: ByteVec) -> () {
    burnToken!(caller, tokenId, 1)
  }

  @using(preapprovedAssets = true, checkExternalCaller = false)
  pub fn main(tokenId: ByteVec) -> () {
    let caller = callerAddress!()
    // Approves 1 token from caller to call `burn`
    burn{caller -> tokenId: 1}(caller, tokenId)
  }
}
```

In the example above, the `burn` function requires asset approval from the caller before it can be called because it uses the `burnToken!` built-in function to burn 1 token. The `main` function explicitly approves exactly 1 token from the caller for the `burn` function using the braces syntax.

We can test the `Burn` contract using the TypeScript code below:

```typescript
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
```

`mintToken` is a helper function from the Web3 SDK to mint a token and transfer to a specific address. In the example above, we minted a token with ID `tokenId` and transferred `10` of it to `signer.address`.

When calling the `main` function in the `Burn` contract, we pass in the `tokenId` as argument and approve 1 token from the signer. After calling the `main` function, the token balance of the signer's address goes from `10` to `9`.

This approach of explicitly approving assets for function calls is required by Alephium's asset permission system. It makes sure that functions can only use assets that you've specifically allowed them to use, similar to authorizing a specific payment amount for a merchant rather than giving them unlimited access to your bank account. We'll dive deeper into this system later.

##### Using Contract Assets

Under Alephium's sUTXO model, a contract has exactly one UTXO that manages all of its assets. When a function needs to access the contract's assets, it must explicitly enable it by using the `assetsInContract = true` annotation. This design choice provides several important benefits:

- It makes the code easier to reason about
- It prevents unintended access of contract assets
- It creates a lock on the function to prevent re-entrancy attacks

```rust
Contract WithdrawToken() {
    @using(assetsInContract = true, checkExternalCaller = false)
    pub fn withdraw() -> () {
      let caller = callerAddress!()
      transferTokenFromSelf!(caller, selfTokenId!(), 1)
      transferTokenFromSelf!(caller, ALPH, dustAmount!())
    }
}
```

In the example above, the `withdraw` function uses the contract's assets, and it transfers 1 token and dust amount of ALPH to the caller. Dust amount is the minimal amount of ALPH required for each UTXO to prevent the bloating of UTXO set, it is currently set to `0.001` ALPH.

We can test the `Withdraw` contract using the TypeScript code below:

```typescript
import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { WithdrawToken } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const nodeProvider = web3.getCurrentNodeProvider()

  const signer = await getSigner()
  const { contractInstance: withdrawToken } = await WithdrawToken.deploy(signer, {
    initialFields: {},
    initialAttoAlphAmount: ONE_ALPH,
    issueTokenAmount: 10n
  })

  await withdrawToken.transact.withdraw({ signer })

  async function getBalance(address: string) {
    return await nodeProvider.addresses.getAddressesAddressBalance(address)
  }
  const signerBalance = await getBalance(signer.address)
  console.assert(signerBalance.tokenBalances![0].amount === "1")
  const contractBalance = await getBalance(withdrawToken.address)
  console.assert(contractBalance.tokenBalances![0].amount === "9")
}

test()
```

In the example above, we deploy the `WithdrawToken` contract with 1 ALPH and 10 tokens. After calling the `withdraw` function, the token balance of the contract goes from `10` to `9` and the token balance of the signer address goes from `0` to `1`.

During compilation, the compiler will throw errors if:

- A function is annotated with `assetsInContract = false` but uses contract assets
- A function is annotated with `assetsInContract = true` but does not use contract assets

Note that because of the `assetsInContract = true` annotation, the `withdraw` function can only be called once in the same transaction. If you try to call it again, the compiler will report an error. This prevents the re-entrancy attacks.

##### Pay To Contract Only

Functions that only receive assets into the contract rather than spending them are not vulnerable to re-entrancy attacks. For such functions, you can use the `payToContractOnly = true` annotation instead of `assetsInContract = true` to load the contract assets, as shown in the example below:

```rust
Contract Deposit() {
  @using(
      preapprovedAssets = true,
      payToContractOnly = true,
      checkExternalCaller = false
  )
  pub fn deposit(caller: Address) -> () {
    transferTokenToSelf!(caller, ALPH, 1 alph)
  }
}

TxScript DepositTwice(contract: Deposit) {
  let caller = callerAddress!()
  contract.deposit{caller -> ALPH: 1 alph}(caller)
  contract.deposit{caller -> ALPH: 1 alph}(caller)
}
```

In the example above, the `deposit` function is annotated with `payToContractOnly = true`, which means that the function only receives assets into the contract. This allows the `DepositTwice` transaction script to call the `deposit` function more than once in the same transaction. `TxScript` (Transaction Script) is a unique feature in Alephium for initiating transactions, which we'll cover in more detail later. Web3 SDK provides an easy way to execute the `TxScript` as shown below:

```typescript
import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner, mintToken } from '@alephium/web3-test'
import { Deposit, DepositTwice } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const nodeProvider = web3.getCurrentNodeProvider()

  const signer = await getSigner()
  const { contractInstance: deposit } = await Deposit.deploy(signer, {
    initialFields: {},
    initialAttoAlphAmount: ONE_ALPH,
  })

  await DepositTwice.execute(signer, {
    initialFields: {
      contract: deposit.contractId
    },
    attoAlphAmount: ONE_ALPH * 2n
  })

  const contractBalance = await nodeProvider.addresses.getAddressesAddressBalance(
    deposit.address
  )
  console.assert(BigInt(contractBalance.balance) === ONE_ALPH * 3n)
}

test()
```

After we execute the `DepositTwice` transaction script, the contract balance increases from `1` ALPH to `3` ALPH. This happens because the script calls the `deposit` function twice, transferring `1` ALPH each time to the contract that already had an initial balance of `1` ALPH.

##### Update Fields

Functions that update contract fields must be explicitly annotated with `@using(updateFields = true)`. The Ralph compiler enforces this through warnings in two scenarios: when a function modifies contract fields without this annotation, or when a function is annotated with `@using(updateFields = true)` but doesn't actually modify any fields. This design ensures that developers are always explicit about which functions can update the contract's state, improving code clarity and reducing potential bugs.

```rust
Contract Counter(mut counter: U256) {
  @using(updateFields = true, checkExternalCaller = false)
  pub fn increase() -> () {
    counter += 1
  }
}
```

In the example above, the `increase` function is annotated with `@using(updateFields = true)`, which means that the function updates the contract fields. We can test the `Counter` contract using the TypeScript code below:

```typescript
import { web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Counter } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const signer = await getSigner()
  const { contractInstance: counter } = await Counter.deploy(signer, {
    initialFields: { counter: 0n },
  })

  console.assert((await counter.fetchState()).fields.counter === 0n)
  await counter.transact.increase({ signer })
  console.assert((await counter.fetchState()).fields.counter === 1n)
}

test()
```

We deploy the `Counter` contract with an initial counter value of `0`. After calling the `increase` function, the counter value is incremented to `1`.

##### Check External Caller

Security is extremely important in smart contracts, and one critical aspect is checking the identity of function callers. To prevent unauthorized access, Ralph's compiler automatically generates warnings for public functions that don't implement external caller check. This check can be suppressed with the annotation `@using(checkExternalCaller = false)`, but it should be done cautiously and only when unrestricted access poses no security risk to your contract.

The compiler will skip the external caller check for `view` functions. A `view` function must satisfy all of the following conditions:

- It cannot change the contract fields
- It cannot transfer any assets
- All functions called in a `view` function must also be `view` functions as well

To check the identity of a function caller, Ralph provides the built-in function `checkCaller!`. This function takes two parameters: a boolean condition that should evaluate to `true` for authorized callers, and an error code to return if the caller is not authorized.

There are also a few built-in functions that can be used to get the caller's information:

- `callerAddress!()`: Returns caller's address. When called from a `TxScript`, it returns the address of the user who initiated the transaction. When called by another contract, it returns the address of that contract.
- `callerContractId!()`: Returns caller's contract ID. This function can only be used when the caller is a contract. If called from a `TxScript` it will fail the transaction with the `NoCaller` error.

```rust
Contract CheckExternal(owner: Address, mut value: U256) {
    pub fn getValue() -> U256 {
        return getValuePrivate()
    }

    @using(updateFields = true)
    pub fn setValue(v: U256) -> () {
        checkCaller!(callerAddress!() == owner, 0)
        value = v
    }

    @using(updateFields = true, checkExternalCaller = false)
    pub fn setValueUnsafe(v: U256) -> () {
        value = v
    }

    fn getValuePrivate() -> U256 {
        return value
    }
}
```

In the `CheckExternal` contract, `getValue` is a `view` function, so no external caller checks are needed. The `setValue` function updates contract fields and properly checks the caller using `checkCaller!`. Meanwhile, `setValueUnsafe` also updates fields but deliberately bypasses the external caller check with the `@using(checkExternalCaller = false)` annotation.

We can test the `CheckExternal` contract using the TypeScript code below:

```typescript
import { web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { CheckExternal } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const authorizedSigner = await getSigner()
  const unauthorizedSigner = await getSigner()
  const { contractInstance: checkExternal } = await CheckExternal.deploy(authorizedSigner, {
    initialFields: { owner: authorizedSigner.address, value: 0n },
  })
  console.assert((await checkExternal.view.getValue()).returns === 0n)

  // Updating value with authorized signer
  await checkExternal.transact.setValue({ signer: authorizedSigner, args: { v: 1n } })
  console.assert((await checkExternal.view.getValue()).returns === 1n)

  // Trying to update value with unauthorized signer
  try {
    await checkExternal.transact.setValue({ signer: unauthorizedSigner, args: { v: 2n } })
  } catch {
    console.log('Could not update value with unauthorized signer.')
  }
  console.assert((await checkExternal.view.getValue()).returns === 1n)

  // Updating value with unauthorized signer using unsafe function
  await checkExternal.transact.setValueUnsafe({ signer: unauthorizedSigner, args: { v: 2n } })
  console.assert((await checkExternal.view.getValue()).returns === 2n)
}

test()
```

In test code above, we deploy the `CheckExternal` contract and set the initial owner to `authorizedSigner.address` and initial value to `0`. We then call the `setValue` and `setValueUnsafe` functions to update the value to `1` and `2` respectively. Note that if `setValue` is not called using `authorizedSigner`, transaction will abort with error code `0`.

#### Function Calls

Functions can be called in two ways: directly by name when they belong to the current contract (internal calls), or using the `contractInstance.functionName()` notation when calling functions from other contracts (external calls).

```rust
Contract FunctionCalls(fib: Fib, mut result: U256) {
  @using(checkExternalCaller = false)
  pub fn runFib(n: U256) -> () {
    let res = fib.cal(n)
    updateResult(res)
  }

  @using(updateFields = true)
  fn updateResult(res: U256) -> () {
    result = res
  }
}

Contract Fib() {
  @using(checkExternalCaller = false)
  pub fn cal(n: U256) -> U256 {
    if (n <= 1) {
      return n
    }
    // Recursive function calls to calculate Fibonacci number
    return cal(n - 1) + cal(n - 2)
  }
}
```

In the example above, `FunctionCalls` is a contract that contains a function `runFib` that calls the `cal` function of the `Fib` contract. The `cal` function is a recursive function that calculates the Fibonacci number.

We can test the `FunctionCalls` contract using the TypeScript code below:

```typescript
import { web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { FunctionCalls, Fib } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const signer = await getSigner()
  const { contractInstance: fib } = await Fib.deploy(signer, { initialFields: {} })
  const { contractInstance: functionCalls } = await FunctionCalls.deploy(
     signer,
     { initialFields: { fib: fib.contractId, result: 0n } }
  )
  await functionCalls.transact.runFib({ signer, args: { n: 10n } })

  const state = await functionCalls.fetchState()
  console.assert(state.fields.result === 55n)
}

test()
```

Note that we deployed the `Fib` contract first and then passed its contract ID to the `FunctionCalls` contract. The result of running the `runFib` function with `n = 10` is `55`.

##### Asset Approval

When calling a function, you can specify the assets that the function is authorized to use with braces syntax. This is part of Alephium's Asset Permission System (APS), which ensures explicit asset flow for each function call. For example, in the [Using Approved Assets](#using-approved-assets) section, we approved `1` token for the `burn` function, restricting its access to only `1` token regardless of the caller's total balance:

```rust
burn{caller -> tokenId: 1}(caller, tokenId)
```

You can also approve multiple assets from multiple users using the braces syntax:

```rust
// Approve a certain amount of token1 for swapping
tokenPair.swap{caller -> token1Id: amount1In}(
  caller, to, amount0In, amount1In, amount0Out, amount1Out
)

// Approve a certain amount of ALPH for buying an NFT
nftMarketplace.buyNFT{caller -> ALPH: totalPayment}(tokenId)

// Approve multiple assets from multiple users
otc.exchange {
  user0 -> ALPH: amount00, tokenId: amount01;
  user1 -> ALPH: amount10, tokenId: amount11
}(user0, amount00, amount01, user1, amount10, amount11)
```

#### Control Structure
Ralph provides several control structures for managing program flow, including conditional statements, loops, and error handling mechanisms.

##### Conditional Statement

Ralph supports conditional statements with `if`, `else if`, and `else` clauses. Conditional statements can be used as expressions that return a value or as statements that control program flow:

```rust
Contract Conditional() {
    pub fn ifExpr(a: U256) -> ByteVec {
       return if (a == 0) #00 else if (a == 1) #01 else #02
    }

    pub fn ifStmt(a: U256) -> ByteVec {
        if (a == 0) {
            return #00
        } else if (a == 1) {
            return #01
        } else {
            return #02
        }
    }
}
```

##### Loops

Ralph supports both `while` loops and `for` loops for iterative operations:

```rust
Contract Loop() {
    pub fn whileStmt() -> U256 {
        let mut index = 0
        let mut sum = 0
        while (index <= 4) {
          sum += index
          index += 1
        }
        return sum
    }

    pub fn forStmt() -> U256 {
        let array = [1, 2, 3, 4, 5]
        let mut sum = 0
        for (let mut i = 0; i <= 5; i += 1) {
            sum += array[i]
        }
        return sum
    }
}
```

Ralph doesn't support `break` and `continue` statements. This intentional design choice encourages developers to write loop structures that is easier to reason about and less prone to complex control flow issues that can arise from mid-loop jumps. It's recommended to replace them with early `return` or `assert` function.

##### Error Handling

Ralph provides two builtin assertion functions for error handling: `assert!` and `panic!`. Assertion failure will revert all changes made to the world state by the transaction and stop the execution of the transaction immediately. Unlike many other languages, Ralph doesn't support try-catch error handling since it complicates control flow and makes code harder to reason about.

```rust
Contract ErrorHandling() {
    enum ErrorCodes {
        InvalidContractState = 0
    }

    pub fn assert(cond: Bool) -> () {
      assert!(cond, ErrorCodes.InvalidContractState)
    }

    pub fn panicWithErrorCode(cond: Bool) -> U256 {
      if (!cond) {
        panic!(ErrorCodes.InvalidContractState)
      }
      return 0
    }

    pub fn panicWithoutErrorCode(cond: Bool) -> U256 {
      if (!cond) {
        panic!()
      }
      return 0
    }
}
```

Both `assert!` and `panic!` abort transactions immediately. `assert!` verifies a condition is true with a mandatory error code, while `panic!` signals an unrecoverable error with an optional error code.

#### Built-in Functions

Ralph includes a set of built-in functions that enable developers to leverage VM-specific features, and build secure and efficient smart contracts. These functions are organized into the following categories: `Contract Functions`, `Sub Contract Functions`, `Asset Functions`, `Chain Functions`, `Utils Functions`, and `Cryptography Functions`. In Ralph, built-in functions are easily identifiable by their naming convention: they always end with an exclamation mark (`!`).

This section will not attempt to cover the [complete list](https://docs.alephium.org/ralph/built-in-functions) of built-in functions. Instead, we will focus on explaining the most commonly used built-in functions using examples.

###### Contract Functions

Ralph provides built-in functions for contract creation, migration, and destruction. In Alephium, tokens are also issued through contract creation.

```rust
Contract CarFactory(mut carAddress: Address) {
    @using(preapprovedAssets = true, checkExternalCaller = false, updateFields = true)
    pub fn createCar(
        carByteCode: ByteVec,
        model: ByteVec,
        year: U256,
        price: U256
    ) -> Car {
        let (immFields, mutFields) = Car.encodeFields!(model, year, price)
        let carId = createContract!{callerAddress!() -> ALPH: minimalContractDeposit!()}(
            carByteCode, immFields, mutFields
        )
        carAddress = contractIdToAddress!(carId)
        return Car(carId)
    }

    @using(preapprovedAssets = true, checkExternalCaller = false, updateFields = true)
    pub fn copyCreateCar(
        carContractId: ByteVec,
        model: ByteVec,
        year: U256,
        price: U256
    ) -> Car {
        let (immFields, mutFields) = Car.encodeFields!(model, year, price)
        let carId = copyCreateContract!{callerAddress!() -> ALPH: minimalContractDeposit!()}(
            carContractId, immFields, mutFields
        )
        carAddress = contractIdToAddress!(carId)
        return Car(carId)
    }

    @using(preapprovedAssets = true, checkExternalCaller = false, updateFields = true)
    pub fn copyCreateCarWithToken(
        carContractId: ByteVec,
        model: ByteVec,
        year: U256,
        price: U256,
        tokenAmount: U256
    ) -> Car {
        let (immFields, mutFields) = Car.encodeFields!(model, year, price)
        let carId = copyCreateContractWithToken!{callerAddress!() -> ALPH: minimalContractDeposit!()}(
            carContractId, immFields, mutFields, tokenAmount
        )
        carAddress = contractIdToAddress!(carId)
        return Car(carId)
    }
}

Contract Car(model: ByteVec, year: U256, mut price: U256) {
    @using(checkExternalCaller = false, updateFields = true)
    pub fn updatePrice(newPrice: U256) -> () {
        price = newPrice
    }

    pub fn getCarInfo() -> (ByteVec, U256, U256) {
        return model, year, price
    }
}
```

In the example above, `createCar` and `copyCreateCar` use the `createContract!` and `copyCreateContract!` built-in functions, respectively, to create a new contract. The difference between the two is that `createContract!` creates a new contract using the contract's bytecode, while `copyCreateContract!` creates a new contract by copying the bytecode from an existing contract, which is a lot more gas efficient. If the goal is to create many instance of the same contract, `copyCreateContract!` is recommended.

Contracts in Alephium have both immutable and mutable fields, which are stored and handled differently in the VM for security and efficiency reasons. When creating a contract, you must provide encoded versions of both the immutable and mutable fields. The `encodeFields!` built-in function handles this encoding for you. In the example above, `Car.encodeFields!` encodes the `model`, `year`, and `price` fields and returns a tuple containing both the encoded immutable and mutable fields, which can be passed to the `createContract!` and `copyCreateContract!` built-in functions.

`copyCreateCarWithToken` is similar to `copyCreateCar`, but it also allows you to issue a specific amount of tokens for the newly created contract using the `copyCreateContractWithToken!` built-in function.

In Alephium, tokens are issued through contract creation, and the token ID is exactly the same as the contract ID. By default, the issued tokens will be owned by the contract itself. However, `copyCreateContractWithToken!` allows you to specify a recipient for the issued tokens.

Let's test the `Car` and `CarFactory` contracts using the TypeScript code below:

```typescript
import {
  binToHex, stringToHex, tokenIdFromAddress, web3,
  MINIMAL_CONTRACT_DEPOSIT, NULL_CONTRACT_ADDRESS, NodeProvider,
} from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Car, CarFactory } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const nodeProvider = web3.getCurrentNodeProvider()

  const signer = await getSigner()
  const carInfos = { model: stringToHex('Toyota'), year: 2020n, price: 10000n }

  const { contractInstance: carTemplate } = await Car.deploy(signer, {
     initialFields: carInfos
  })
  const { contractInstance: carFactory } = await CarFactory.deploy(signer, {
     initialFields: { carAddress: NULL_CONTRACT_ADDRESS }
  })

  await carFactory.transact.createCar({
    signer,
    args: { carByteCode: Car.contract.bytecode, ...carInfos },
    attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT
  })

  await carFactory.transact.copyCreateCar({
    signer,
    args: { carContractId: carTemplate.contractId, ...carInfos },
    attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT
  })

  await carFactory.transact.copyCreateCarWithToken({
    signer,
    args: {
      carContractId: carTemplate.contractId,
      tokenAmount: 10000n,
      ...carInfos,
    },
    attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT
  })

  const carAddress = (await carFactory.fetchState()).fields.carAddress
  const carTokenId = binToHex(tokenIdFromAddress(carAddress))
  const balance = await nodeProvider.addresses.getAddressesAddressBalance(carAddress)
  console.assert(
    balance.tokenBalances?.length === 1 &&
      balance.tokenBalances?.[0]?.id === carTokenId &&
      BigInt(balance.tokenBalances?.[0]?.amount) === 10000n
  )
}

test()
```

In the example above, we first deployed the `Car` contract as a template. Then we deployed the `CarFactory` contract and created three different `Car` contract instances:

1. Using the `createCar` method, which takes the bytecode of the `Car` contract as an argument
2. Using the `copyCreateCar` method, which takes the contract ID of the `Car` template contract as the argument, which is more gas efficient
3. Using the `copyCreateCarWithToken` method, which not only creates a new `Car` contract instance but also issues 10000 tokens

In the end, we verify that the tokens were correctly issued and owned by the last `Car` contract instance.

Ralph provides built-in ways to migrate contract code with the `migrate!()` and `migrateWithFields!()` built-in functions. This is more secure and straightforward than the traditional proxy contract pattern, as demonstrated in the example below:

```rust
Contract OldCode(owner: Address, n: U256) {
    pub fn get() -> U256 {
        return n
    }

    pub fn migrate(newCode: ByteVec) -> () {
        checkCaller!(callerAddress!() == owner, 0)
        migrate!(newCode)
    }

    @using(updateFields = true)
    pub fn migrateWithFields(
        newCode: ByteVec,
        immFields: ByteVec,
        mutFields: ByteVec
    ) -> () {
        checkCaller!(callerAddress!() == owner, 0)
        migrateWithFields!(newCode, immFields, mutFields)
    }
}

Contract NewCode(owner: Address, mut n: U256) {
    pub fn get() -> U256 {
        return n
    }

    @using(updateFields = true)
    pub fn set(m: U256) -> U256 {
        checkCaller!(callerAddress!() == owner, 0)
        n = m
        return n
    }

    @using(assetsInContract = true)
    pub fn destroy() -> () {
        checkCaller!(callerAddress!() == owner, 0)
        destroySelf!(owner)
    }
}
```

`migrate!()` function can be used if the new contract has exactly the same mutable and immutable fields as the old contract. Otherwise, `migrateWithFields!()` should be used to migrate the contract fields as well. Let's test this out in the TypeScript code below:

```typescript
import { binToHex } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { OldCode, NewCode } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const { contractInstance: oldContract } = await OldCode.deploy(signer, {
    initialFields: { owner: signer.address, n: 100n }
  })

  const {encodedImmFields, encodedMutFields} = NewCode.encodeFields({
    owner: signer.address, n: 200n
  })
  const immFields = binToHex(encodedImmFields)
  const mutFields = binToHex(encodedMutFields)
  await oldContract.transact.migrateWithFields({
    signer,
    args: { newCode: NewCode.contract.bytecode, immFields, mutFields }
  })

  const newContract = NewCode.at(oldContract.address)
  let newN = (await newContract.view.get()).returns
  console.assert(newN === 200n)

  await newContract.transact.set({ signer, args: { m: 300n } })
  newN = (await newContract.view.get()).returns
  console.assert(newN === 300n)

  newN = (await oldContract.view.get()).returns
  console.assert(newN === 300n)

  await newContract.transact.destroy({signer})
}

test()
```

The contract using `OldCode` is successfully migrated to the `NewCode` with the a new value for `n` after `migrateWithFields` function is called. `n` is also updated from an immutable field to a mutable field. We can continue to use the address of the old contract to interact with the new contract. New contract can also destroy itself and return the contract's deposit back to the owner using the `destroySelf!()` built-in function.

###### Sub Contract Functions

Alephium supports a unique and powerful feature called sub contracts. This feature enables developers to construct tree-like structures across a group of related contracts that can be traversed similar to navigating through domain names. Compared to regular maps or tree data structures, sub contracts offer more expressivity. Each node in the tree is a fully functional contract that can issue tokens, execute complex business logic, provide fine-grained access control to its internal state, and offer sophisticated permission management for its assets.

Sub contracts system also contributes to the long-term health of the Alephium blockchain by incentivizing users to recycle them when not needed. It also keeps things simple and elegant at the VM level since everything is a contract. Maps in Alephium is implemented on top of the sub contracts system.

Alephium supports a set of built-in functions to create sub contracts and calculate sub contract ID. Since sub contracts are also contracts, all other contract built-in functions can be used on them as well.

```rust
Contract Domain(url: ByteVec, subDomainTemplateId: ByteVec) {
    @using(preapprovedAssets = true, checkExternalCaller = false)
    pub fn createSubDomain(
        subDomainUrl: ByteVec
    ) -> Address {
        let (immFields, mutFields) = SubDomain.encodeFields!(url ++ b`/` ++ subDomainUrl)
        let subDomainId = copyCreateSubContract!{callerAddress!() -> ALPH: minimalContractDeposit!()}(
            subDomainUrl, subDomainTemplateId, immFields, mutFields
        )
        return contractIdToAddress!(subDomainId)
    }

    pub fn getSubDomain(subDomainUrl: ByteVec) -> Address {
        return contractIdToAddress!(subContractId!(subDomainUrl))
    }
}

Contract SubDomain(url: ByteVec) {
    pub fn getUrl() -> ByteVec {
        return url
    }
}
```

In the example above, `Domain` is a contract initialized with a `SubDomain` template ID. The `createSubDomain` method creates a new `SubDomain` sub contract using the `copyCreateSubContract!` built-in function, with `subDomainUrl` as the sub contract path. Sub contracts can also be created with `createSubContract!` and `copyCreateSubContractWithToken!` functions, similar to the `createContract!` and `copyCreateContractWithToken!` built-in functions for regular contracts.

From the parent contract, the `subContractId!` built-in function allows us to deterministically compute a sub contract's ID from its sub contract path. In our example, the `getSubDomain` method uses this function to retrieve the address of a `SubDomain` contract by its URL.

```typescript
import {
   addressFromContractId, stringToHex, subContractId,
   MINIMAL_CONTRACT_DEPOSIT
} from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Domain, SubDomain } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const { contractInstance: subDomainTemplate } = await SubDomain.deploy(signer, {
     initialFields: { url: stringToHex('') }
  })

  const { contractInstance: domain } = await Domain.deploy(signer, {
     initialFields: {
        url: stringToHex('x.com'),
        subDomainTemplateId: subDomainTemplate.contractId
     }
  })

  await domain.transact.createSubDomain({
    signer,
    args: { subDomainUrl: stringToHex('home') },
    attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT
  })

  const {returns: subDomainContractAddress} = await domain.view.getSubDomain({
    args: { subDomainUrl: stringToHex('home') }
  })
  const subDomainInstance = SubDomain.at(subDomainContractAddress)
  console.assert((await subDomainInstance.view.getUrl()).returns === stringToHex('x.com/home'))

  const subDomainContractId = subContractId(domain.contractId, stringToHex('home'), 0)
  console.assert(subDomainContractAddress === addressFromContractId(subDomainContractId))
}

test()
```

In the test code above, we first deploy a `SubDomain` template contract. Then, we deploy the `Domain` contract with the URL `x.com` and the ID of the `SubDomain` template contract. Next, we call the `createSubDomain` method to create a `SubDomain` sub contract with the URL `home`. The code then retrieves the address of the newly created `SubDomain` sub contract using the `getSubDomain` method and verifies that its URL is correctly set to `x.com/home`. Finally, it demonstrates how to compute the sub contract's ID directly using the `subContractId` function in the Web3 SDK and confirms that this matches the address returned by the contract method.

###### Asset Functions

Ralph provides a set of built-in functions to approve, transfer, lock or even burn assets within the smart contracts.

```rust
Contract AssetFunctions() {
    @using(preapprovedAssets = true, checkExternalCaller = false)
    pub fn burn() -> () {
      burnToken!(callerAddress!(), selfTokenId!(), 1)
    }

    @using(preapprovedAssets = true, checkExternalCaller = false)
    pub fn lock(amount: U256) -> () {
        let caller = callerAddress!()
        lockApprovedAssets!{caller -> ALPH: dustAmount!(), selfTokenId!(): amount}(
            caller, blockTimeStamp!() + 86400000  // 1 day
        )
    }

    @using(preapprovedAssets = true, checkExternalCaller = false, assetsInContract = true)
    pub fn withdraw(amount: U256) -> () {
        transferTokenFromSelf!(callerAddress!(), selfTokenId!(), amount)
    }

    @using(preapprovedAssets = true, checkExternalCaller = false, assetsInContract = true)
    pub fn deposit(amount: U256) -> () {
        transferTokenToSelf!(callerAddress!(), selfTokenId!(), amount)
    }
}
```

The `burnToken!()` built-in function allows the contract to burn a specific amount of a token, note that burning `ALPH` is not allowed. The `lockApprovedAssets!()` built-in function allows the contract to lock a specific amount of assets for a specific period of time. The `transferTokenFromSelf!()` built-in function allows the contract to transfer a specific amount of assets from itself to an address. The `transferTokenToSelf!()` built-in function allows an address to transfer a specific amount of tokens to the contract.

`selfTokenId!()` built-in function returns the ID of the token issued by the contract, its value is the same as the contract ID. Let's test the `AssetFunctions` contract in the example below:

```typescript
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
```

In this example, we deployed the `AssetFunctions` contract with 100 tokens issued to the signer, then demonstrated the effect of burning, locking and transferring assets.

###### Utils Functions

Ralph provides various built-in utility functions that simplify common operations and provide access to important system values when developing smart contracts.

```rust
Contract UtilsFunctions() {
    pub fn test() -> () {
        assert!(zeros!(2) == #0000, 1)
        assert!(groupOfAddress!(@1H5irSsGHAZSQKcetPPtTDXmS4tZVcM9bEi57jSWhY4CZ) == 3, 2)
        assert!(isAssetAddress!(@1H5irSsGHAZSQKcetPPtTDXmS4tZVcM9bEi57jSWhY4CZ) == true, 3)
        assert!(isContractAddress!(@1H5irSsGHAZSQKcetPPtTDXmS4tZVcM9bEi57jSWhY4CZ) == false, 4)
        assert!(isContractAddress!(@weQT3a8gsdGoZSEFeXsCVJqGQ9fWdufE2nNsDysdojBf) == true, 5)
        assert!(len!([1,2,3,4]) == 4, 6)
        assert!(nullContractAddress!() == @tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq, 7)
        assert!(minimalContractDeposit!() == 0.1 alph, 8)
        assert!(mapEntryDeposit!() == 0.1 alph, 9)
    }
}
```

The `UtilsFunctions` contract demonstrates several utility functions available in Ralph:

- `zeros!(n)`: Creates a ByteVec filled with n zeros
- `groupOfAddress!(address)`: Returns the group number of an address. Alephium is a sharded blockchain with multiple groups where each address belongs to one group.
- `isAssetAddress!(address)`: Checks if an address is a user address
- `isContractAddress!(address)`: Checks if an address is a contract address
- `len!(array)`: Returns the length of an fixed-sized array
- `nullContractAddress!()`: Returns the null contract address which is useful to set a default value for a contract field. Its corresponding contract ID is `#0000000000000000000000000000000000000000000000000000000000000000`
- `minimalContractDeposit!()`: Returns the minimum deposit required to create a contract
- `mapEntryDeposit!()`: Returns the deposit required for each new map entry

###### Chain Functions

Ralph provides a set of built-in functions that allow the contract to get the chain and transaction information, such as the current block timestamp, block target, transaction ID, transaction inputs, gas info, and more.

```rust
TxScript Chain {
    emit Debug(`Network id: ${networkId!()}`)
    emit Debug(`Block timestamp: ${blockTimeStamp!()}`)
    emit Debug(`Block target: ${blockTarget!()}`)
    emit Debug(`Transaction id: ${txId!()}`)
    emit Debug(`Transaction input size: ${txInputsSize!()}`)
    emit Debug(`First transaction input address: ${txInputAddress!(0)}`)
    emit Debug(`Gas fee: ${txGasFee!()}`)
    emit Debug(`Gas amount: ${txGasAmount!()}`)
    assert!(dustAmount!() == 0.001 alph, 0)
    verifyAbsoluteLocktime!(blockTimeStamp!() - 1)
}
```

As we can see in the example above, the `Chain` transaction script uses the built-in functions to emit the current block timestamp, block target, transaction ID, transaction inputs, gas fee and amount, and more.

`dustAmount!()` returns the minimal amount of ALPH required per UTXO (currently 0.001 ALPH). This prevents the creation of tiny UTXOs that would increase blockchain storage and processing overhead.

Ralph provides two built-in functions to verify time constraints: `verifyAbsoluteLocktime!()` checks if the current block timestamp has reached or exceeded a specified time point, while `verifyRelativeLocktime!()` ensures a certain amount of time has passed since the UTXO was created. Both of these time-locking mechanisms are useful for implementing secure financial applications like token vesting schedules, time-locked wallets, and governance proposals with mandatory waiting periods.

###### Cryptography Functions

Ralph provides a set of built-in functions to compute cryptographic hashes and verify signatures. It also provides the `ethEcRecover!()` built-in function to recover the signer's address from a message and a signature.

```rust
Contract CryptographyFunctions() {
    pub fn verifyHash() -> () {
        let input = b`Hello World1`
        assert!(blake2b!(input) == #8947bee8a082f643a8ceab187d866e8ec0be8c2d7d84ffa8922a6db77644b37a, 0)
        assert!(keccak256!(input) == #2744686CE50A2A5AE2A94D18A3A51149E2F21F7EEB4178DE954A2DFCADC21E3C, 0)
        assert!(sha256!(input) == #6D1103674F29502C873DE14E48E9E432EC6CF6DB76272C7B0DAD186BB92C9A9A, 0)
        assert!(sha3!(input) == #f5ad69e6b85ae4a51264df200c2bd19fbc337e4160c77dfaa1ea98cbae8ed743, 0)
    }

    pub fn verifySignature() -> () {
        let message = #0000000000000000000000000000000000000000000000000000000000000000
        let p256PubKey = #0326e4868d3fc321680ccbecd6d12cfb75640f229515c674e84a43d7585c9c69a5
        let p256Sig = #2a970fde2bdf8ad911787aeca7efceddba5927696c15a9c56cec78fe2a16a9d50d883e519733370a4baa7d0c8b15cdf10d7cfca19b84fea44d9827474516cfee
        verifySecP256K1!(message, p256PubKey, p256Sig)

        let ed25519PubKey = #64bfbce13535b2ab9fa15d5dc73788ebf9552dd05aed5952d208712f653f87cd
        let ed25519Sig = #77006f93e346282b18753b563f5bf4b47a879659b25aa0766bcff215691cdb5fa547616ac43ad71b3cb65b58c9ab9653fd0016efed1415c5cfac2e6bb944fe03
        verifyED25519!(message, ed25519PubKey, ed25519Sig)

        let bip340PubKey = #b72540c454b7ee2e92b062cdcc6cb8bb2774c2e0dc8d8d5274e9c641b38a284a
        let bip340Sig = #48d18651d3399889acc4813b517c39fe88463796a5d6e6c154cdc05d3caf0fa1dff1f08561617679f6a5a9e1a05c8f2c46bc329b633080a31c7816a964134e8e
        verifyBIP340Schnorr!(message, bip340PubKey, bip340Sig)
    }

    pub fn verifyEthEcRecover() -> () {
        let messageHash = #d058b58f0b2cd0612f1619f3936dd1012cbc1a1616e02d1d83d43ea0129cb650
        let signature = #2c6401216c9031b9a6fb8cbfccab4fcec6c951cdf40e2320108d1856eb532250576865fbcd452bcdc4c57321b619ed7a9cfd38bd973c3e1e0243ac2777fe9d5b1b
        let address = ethEcRecover!(messageHash, signature)
        assert!(address == #31b26e43651e9371c88af3d36c14cfd938baf4fd, 0)
    }
}
```

The supported hash algorithms are `blake2b`, `keccak256`, `sha256` and `sha3`. The supported signature algorithms are `secp256k1`, `ed25519` and `bip340`.

### Contracts

Contracts in Ralph serve as the fundamental building blocks for smart contract development. Similar to classes in object-oriented programming, contracts encapsulate state and logic in a single unit. Each contract can contain several types of declarations:

- **Contract fields**: Both immutable and mutable contract state variables
- **Events**: For emitting on-chain notifications, allowing off-chain applications to track and respond to on-chain activities
- **Constants**: Immutable values available throughout the contract
- **Enums**: User defined data type consisting of a fixed set of named constants
- **Functions**: Defines executable logic and behavior of the contract

Contracts are identified by their unique contract IDs, which can be converted 1-to-1 to contract addresses. In Alephium, tokens are issued through contract creation, and the token ID is identical to the ID of the contract that issued it.

```rust
Contract MyToken(name: ByteVec, mut owner: Address) {
    event Transfer(to: Address, amount: U256, version: U256)
    const VERSION = 0
    enum ErrorCodes {
      INVALID_CALLER = 0
    }

    @using(assetsInContract = true)
    pub fn withdraw() -> () {
      checkCaller!(callerAddress!() == owner, ErrorCodes.INVALID_CALLER)
      transferTokenFromSelf!(owner, selfTokenId!(), 100)
      emit Transfer(owner, 100, VERSION)
    }

    @using(updateFields = true)
    pub fn updateOwner(newOwner: Address) -> () {
      checkCaller!(callerAddress!() == owner, ErrorCodes.INVALID_CALLER)
      owner = newOwner
    }

    pub fn getName() -> ByteVec {
      return name
    }
}
```

In the `MyToken` contract, we define an immutable field `name`, a mutable field `owner`, an event `Transfer`, a constant `VERSION`, and an enum `ErrorCodes`.

The `withdraw` function allows the owner to withdraw tokens from the contract. It makes sure that the caller is the owner, otherwise fails with `INVALID_CALLER` error. It then transfers 100 tokens from the contract to the owner and emits a `Transfer` event.

In the following example, we demonstrate how to deploy and interact with `MyToken` contract:

```typescript
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
```

In the example above, first we deployed the `MyToken` contract and issued `1000` tokens to itself. We then used the `addressFromContractId` and `contractIdFromAddress` functions from the Web3 SDK to verify that the contract address and contract ID is 1-to-1 convertible, and the issued token ID is the same as the contract ID.

To call a read-only function, we use the `view` property of the contract instance, as shown by `myToken.view.getName()`. View functions query contract data without requiring gas fees.

To call a function that updates the contract fields or transfer assets, we need to start a transaction by using the `transact` property of the contract instance, as shown by `myToken.transact.withdraw()`. This will require the caller to pay gas fees. After the transaction is submitted, we verify that the token balance for the owner and the contract are updated as expected.

Finally, we demonstrate event handling capabilities. Since the `withdraw` function emits a `Transfer` event, we can subscribe to it and verify these events. The Web3 SDK automatically generates event-specific subscription methods, in this case `subscribeTransferEvent`, for each event type defined in the contract. After waiting briefly to allow block confirmation, we verify that the emitted event contains the expected data by checking the event fields like contract address, transfer amount, recipient address and version number. This shows how on-chain events can be tracked and handled in off-chain applications.

There are several built-in functions that can be used to create contracts in Ralph. For more details please refer to the bulit-in [Contract Functions](#contract-functions) section.

#### Sub Contracts

As we explored in the [Sub Contract Functions](#sub-contract-functions) section, sub contracts on Alephium provide a simple yet powerful mechanism for organizing related contracts. They enable developers to construct tree-like structures of contracts that can be traversed similar to navigating through domain names. Each sub contract is a fully functional contract that can maintain its own state, issue tokens, and implement complex business logic, which makes it more powerful than traditional tree or map data structures.

Like regular contracts, sub contracts require a deposit that gets returned when destroyed. This incentivizes recycling unused sub contracts to prevent state bloat. Alephium's maps leverage this same sub contract system and inherit these properties.

The key to understand the sub contracts system lies in how contract IDs are constructed. For regular contracts, the contract ID is derived by combining the transaction ID that created the contract, the index of the contract creation output within that transaction, and the contract's group number using the following formula:

```
contractId = dropRight(blake2b(txId || output index), 1) || group number
```

The transaction ID and the output index are concatenated and hashed using the `Blake2b` hash function. The last byte of the hash is then replaced with the group number to get the final contract ID.

For sub contracts, the contract ID is derived by the parent contract's ID and a unique `ByteVec` path value that identifies the sub contract under its parent. This ensures that each sub contract has a globally unique identifier as well.

```
subContractId = dropRight(blake2b(blake2b(parentContractId || subContractPath)), 1) || group number
```

The parent contract's ID and the sub contract's path value are concatenated and double hashed using the `Blake2b` hash function. The last byte of the hash is also replaced with the group number to get the final sub contract ID. This embedded group number for both regular and sub contracts makes it possible for the `groupOfAddress` function in Ralph and Web3 SDK to determine a contract's group number from its address.

The way that the sub contract ID is constructed allows easy navigation from parent to child contracts. Both Ralph and the Web3 SDK provide functions like `subContractId` and `subContractIdOf` to derive sub contract IDs from parent contract IDs and path values.

Sub contracts provide a powerful abstraction for building complex smart contract systems. For example, an NFT collection can be implemented as a parent contract with individual NFTs as sub contracts using the NFT's index as the path value. This design enables easy navigation between collection and specific NFTs, and allows each NFT to manage its state and asset independently. Similarly, a DEX can organize token pools as sub contracts with token IDs from the token pair as path values, this approach allows each pool to maintain its own state and assets while remaining discoverable through the main DEX contract. Well-designed smart contracts using sub contracts create modular, maintainable systems with clear responsibilities.

Please refer to the built-in [Sub-contracts Functions](#sub-contract-functions) section for a concrete example of how to create and interact with sub contracts.

#### Contract Inheritance

Ralph supports multiple inheritance, allowing contracts to inherit from multiple abstract contracts and implement multiple interfaces. This enables Ralph contracts to combine logic and state from different sources in a hierarchical way, similar to object-oriented programming.

```rust
Interface Payable {
   @using(preapprovedAssets = true)
   pub fn pay(amount: U256) -> U256
}

Interface WorkStatus {
    pub fn status() -> ByteVec
}

Abstract Contract Employee(name: ByteVec, id: U256) {
    pub fn getName() -> ByteVec {
        return name
    }
    pub fn getId() -> U256 {
        return id
    }
}

Abstract Contract TechnicalStaff(name: ByteVec, id: U256) {
    pub fn getSpecialization() -> ByteVec
    pub fn getStandardWorkingHours() -> U256 {
        return 40
    }
}

Abstract Contract ManagementStaff(name: ByteVec, id: U256) {
    pub fn getManagementLevel() -> ByteVec
}


Contract SoftwareEngineer(name: ByteVec, id: U256)
  extends Employee(name, id), TechnicalStaff(name, id) implements Payable, WorkStatus {
    @using(preapprovedAssets = true, assetsInContract = true, checkExternalCaller = false)
    pub fn pay(amount: U256) -> U256 {
        transferTokenToSelf!(callerAddress!(), ALPH, amount)
        return amount
    }

    pub fn status() -> ByteVec {
        return b`Coding...`
    }

    pub fn getSpecialization() -> ByteVec {
        return b`Software`
    }
}

Contract Director(name: ByteVec, id: U256)
  extends Employee(name, id), ManagementStaff(name, id) implements Payable, WorkStatus {
    @using(preapprovedAssets = true, assetsInContract = true, checkExternalCaller = false)
    pub fn pay(amount: U256) -> U256 {
        let finalAmount = amount * 12 / 10
        transferTokenToSelf!(callerAddress!(), ALPH, finalAmount)
        return finalAmount
    }

    pub fn status() -> ByteVec {
        return b`Managing...`
    }

    pub fn getManagementLevel() -> ByteVec {
        return b`Executive`
    }
}
```

In the example above, we defined two interfaces `Payable` and `WorkStatus`, and three abstract contracts `Employee` and `TechnicalStaff` and `ManagementStaff`. `SoftwareEngineer` contract extends `Employee` and `TechnicalStaff`, and implements `Payable` and `WorkStatus` interfaces. `Director` contract extends `Employee` and `ManagementStaff`, and implements `Payable` and `WorkStatus` interfaces.


There are couple of restrictions for interfaces:

- Interfaces can only have function and event declarations, but no function implementations
- Interfaces can not have any contract fields, constants, enums or mappings
- Interfaces can only inherit from other interfaces, not from abstract or concrete contracts

Abstract contract has less restrictions compared to interfaces:

- Abstract contracts can have both function declarations and function implementations
- Abstract contracts can have contract fields, constants, enums and mappings
- Abstract contracts can inherit from multiple abstract contracts and implement multiple interfaces

Concrete contracts are at the bottom of the inheritance hierarchy:

- Concrete contracts can only have implemented functions
- Concrete contracts can have contract fields, constants, enums and mappings
- Concrete contracts can inherit from multiple abstract contracts and implement multiple interfaces, but concrete contracts can not be inherited by other contracts

There is no override mechanism in Ralph. If a concrete contract implements a function that is already implemented by one of the abstract contracts it inherits from, the compiler will report an error.

You may ask why do we need interfaces if abstract contracts have less restrictions. The answer is that we can instantiate a contract using interface and concrete contract, but not with abstract contracts, as illustrated in the example below:

```rust
Contract Company() {
    @using(checkExternalCaller = false)
    pub fn getStatus(contractId: ByteVec) -> ByteVec {
        return WorkStatus(contractId).status()  // OK
    }

    //@using(checkExternalCaller = false)
    //pub fn getName(contractId: ByteVec) -> ByteVec {
    //    return Employee(contractId).getName()  // Compiler reports "Employee" is not instantiable
    //}

    @using(checkExternalCaller = false)
    pub fn getName(contractId: ByteVec) -> ByteVec {
        return SoftwareEngineer(contractId).getName()  // OK
    }
}
```

##### Standard Interfaces

Standard interfaces play an important role in the Alephium ecosystem by establishing common patterns that enable interoperability between different smart contracts, wallets, block explorers, and other applications. When contracts implement well-known standard interfaces, other contracts and applications can interact with them without needing to know their specific implementation details.

For example, the fungible token standard and non-fungible token standard ensure that any wallet or marketplace can work with any token that implements these standards. A wallet only needs to understand the standard interface to be able to display token logo and balances. Similarly, a NFT marketplace contract can support trading of any NFT that follows the non-fungible token standard interface.

These standard interfaces can also improve composability between contracts. For example, a lending protocol can integrate with any oracle that implements the standard oracle interface, without requiring custom code for each oracle implementation.

Standard interfaces in Alephium are defined in the Web3 SDK. They are all annotated using `@std` with a unique ID, which is compiled as an implicit field for the inheriting contracts. This annotation enables wallets and dApps to automatically detect standard compliant contracts. Alephium currently supports two primary categories of standards: fungible token standard and non-fungible token standard.

###### Fungible Token Standard

Fungible tokens represent interchangeable units of value, where each token is identical and holds the same properties. The fungible token standard defines a common interface that token contracts must implement, including `getName`, `getSymbol`, `getDecimals`, and `getTotalSupply`.

```typescript
@std(id = #0001)
@using(methodSelector = false)
Interface IFungibleToken {
  pub fn getSymbol() -> ByteVec
  pub fn getName() -> ByteVec
  pub fn getDecimals() -> U256
  pub fn getTotalSupply() -> U256
}
```

The `@std(id = #0001)` annotation indicates that the fungible token standard ID is `0001`. The `@using(methodSelector = false)` annotation is used to disable method selector as the mechanism of calling the interface functions in preference to method indexes. We will cover this with more details later.

Here is a concrete example of a contract that implements the fungible token standard:

```rust
import "std/fungible_token_interface"

Contract ShinyToken() implements IFungibleToken {
  pub fn getTotalSupply() -> U256 {
      return 10000
  }

  pub fn getSymbol() -> ByteVec {
      return b`Stk`
  }

  pub fn getName() -> ByteVec {
      return b`ShinyToken`
  }

  pub fn getDecimals() -> U256 {
      return 0
  }
}
```

To implement the `IFungibleToken` interface, we need to import it from the Web3 SDK using the `import` statement. Here is how we can interact with the `ShinyToken` contract in TypeScript:

```typescript
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
```

In the example above, we deployed the `ShinyToken` contract and issued `10000` tokens to the signer's address. The `NodeProvider` class from the Web3 SDK offers utility functions like `guessStdInterfaceId` and `guessStdTokenType` that help identify a contract's implemented interfaces and token type. This helps wallets and other applications to detect that the `ShinyToken` contract is a fungible token contract, and allows them to use the `fetchFungibleTokenMetaData` function to fetch all of its metadata.

###### Non-Fungible Token Standard

Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of a specific piece of content. Unlike fungible tokens which are identical and interchangeable, each NFT has distinct properties that make it one-of-a-kind.

In Alephium, NFT contracts are typically modeled as sub contracts of NFT collection contracts. Alephium provides standard interfaces for both NFT and NFT collection contracts, making them easily discoverable and interoperable across wallets, marketplaces, and various decentralized applications.

For NFT collections, the standard interface is `INFTCollection` with `@std` ID `0002` associated with it. The `INFTCollection` interface defines the standard methods that all NFT collection contracts should implement:

```rust
import "std/nft_interface"

@std(id = #0002)
@using(methodSelector = false)
Interface INFTCollection {
   pub fn getCollectionUri() -> ByteVec
   pub fn totalSupply() -> U256
   pub fn nftByIndex(index: U256) -> INFT
   pub fn validateNFT(nftId: ByteVec, nftIndex: U256) -> ()
}
```

The `getCollectionUri` function returns a URI that points to a JSON file containing metadata for the NFT collection. The JSON file should conform to the following schema:

```typescript
{
    "title": "NFT Collection Metadata",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Name of the NFT collection"
        },
        "description": {
            "type": "string",
            "description": "General description of the NFT collection"
        },
        "image": {
            "type": "string",
            "description": "A URI to the image that represents the NFT collection"
        }
    }
}
```

`totalSupply` function returns the total number of NFTs in the collection. `nftByIndex` function returns the NFT at the given index. `validateNFT` function validates that the given NFT is part of the collection, otherwise it should fail with an error.

To support royalties for a NFT collection, a standard interface called `INFTCollectionWithRoyalty` was introduced with `@std` ID `000201`.

```rust
import "std/nft_collection_interface"

@std(id = #000201)
@using(methodSelector = false)
Interface INFTCollectionWithRoyalty extends INFTCollection {
    pub fn royaltyAmount(tokenId: ByteVec, salePrice: U256) -> (U256)

    @using(preapprovedAssets = true)
    pub fn payRoyalty(payer: Address, amount: U256) -> ()

    pub fn withdrawRoyalty(to: Address, amount: U256) -> ()
}
```

`INFTCollectionWithRoyalty` extends `INFTCollection` with three additional functions:

- `royaltyAmount`: Returns the royalty amount for a given NFT and its sale price.
- `payRoyalty`: Pays the royalty amount from the `payer`
- `withdrawRoyalty`: Withdraws the royalty amount to the `to` address

Note that the `std` ID `000201` for `INFTCollectionWithRoyalty` uses `0002` as prefix to indicate that it is an extension of `INFTCollection`.

For NFT contracts, the standard interface is `INFT` with `@std` ID `0003`. It defines the standard methods that all NFT contracts should implement:

```rust
@std(id = #0003)
@using(methodSelector = false)
Interface INFT {
   pub fn getTokenUri() -> ByteVec
   pub fn getCollectionIndex() -> (ByteVec, U256)
}
```

`getTokenUri` function returns a URI that points to a JSON file containing metadata for the NFT. The JSON file should conform to the following schema:

```typescript
{
    "title": "NFT Metadata",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Name of the NFT"
        },
        "description": {
            "type": "string",
            "description": "General description of the NFT",
            "nullable": true
        },
        "image": {
            "type": "string",
            "description": "A URI to the image that represents the NFT"
        },
        "attributes": {
          "type": "array",
          "description": "An array of attributes for the NFT",
          "items": {
            "type": "object",
            "properties": {
              "trait_type": {
                "type": "string",
                "description": "The type of trait"
              },
              "value": {
                "type": ["string", "number", "boolean"],
                "description": "The value of the trait"
              }
            }
          },
          "nullable": true
        }
    }
}
```

`getCollectionIndex` function returns the collection ID and the index of the NFT in the collection.

In the following example, `AwesomeNFTCollection` is an NFT collection contract and `AwesomeNFT` is an NFT contract. Both of them conform to the standard interfaces:

```rust
import "std/nft_collection_interface"
import "std/nft_interface"

Contract AwesomeNFTCollection(
  nftTemplateId: ByteVec,
  collectionUri: ByteVec,
  mut totalSupply: U256
) implements INFTCollection {
  enum ErrorCodes {
    IncorrectTokenIndex = 0
    NFTNotFound = 1
    NFTNotPartOfCollection = 2
  }

  pub fn getCollectionUri() -> ByteVec {
    return collectionUri
  }

  pub fn totalSupply() -> U256 {
    return totalSupply
  }

  pub fn nftByIndex(index: U256) -> INFT {
    checkCaller!(index < totalSupply(), ErrorCodes.IncorrectTokenIndex)

    let nftTokenId = subContractId!(toByteVec!(index))
    assert!(contractExists!(nftTokenId), ErrorCodes.NFTNotFound)

    return INFT(nftTokenId)
  }

  pub fn validateNFT(nftId: ByteVec, nftIndex: U256) -> () {
      let expectedTokenContract = nftByIndex(nftIndex)
      assert!(nftId == contractId!(expectedTokenContract), ErrorCodes.NFTNotPartOfCollection)
  }

  @using(preapprovedAssets = true, updateFields = true, checkExternalCaller = false)
  pub fn mint(nftUri: ByteVec) -> (ByteVec) {
    let minter = callerAddress!()

    let (initialImmState, initialMutState) = AwesomeNFT.encodeFields!(
      selfContractId!(), totalSupply, nftUri
    )

    let contractId = copyCreateSubContractWithToken!{minter -> ALPH: minimalContractDeposit!()}(
        toByteVec!(totalSupply),
        nftTemplateId,
        initialImmState,
        initialMutState,
        1,
        minter
    )

    totalSupply = totalSupply + 1
    return contractId
  }
}

Contract AwesomeNFT(
  collectionId: ByteVec,
  nftIndex: U256,
  uri: ByteVec
) implements INFT {
  pub fn getTokenUri() -> ByteVec {
    return uri
  }

  pub fn getCollectionIndex() -> (ByteVec, U256) {
    return collectionId, nftIndex
  }
}
```

The `AwesomeNFTCollection` contract implements the standard NFT collection interface. It stores collection metadata through a URI and tracks the total supply of NFTs in the collection. The contract uses a template contract ID for `AwesomeNFT` to mint individual NFTs as sub contracts, with each NFT having its index as sub contract path. The sub contract system maintains the relationship between the collection and its NFTs, allowing `AwesomeNFTCollection` contract to properly validate and retrieve NFTs within the collection using the `validateNFT` and `nftByIndex` functions.

The `AwesomeNFT` contract implements the standard NFT interface. It stores NFT metadata through a URI and returns the collection ID and the index of the NFT in the collection.

Now let's see how to deploy and interact with the `AwesomeNFTCollection` and `AwesomeNFT` contracts using the Web3 SDK:

```typescript
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
```

In this example, we deploy an `AwesomeNFT` template contract, then use its ID to deploy the `AwesomeNFTCollection` contract. We verify it implements the standard NFT collection interface (id `0002`) using `guessStdInterfaceId`, and confirm its metadata is correctly initialized with `fetchNFTCollectionMetaData`.

Next, we mint an NFT to the collection and derive its contract ID using `subContractId`. We verify it implements the standard NFT interface (id `0003`), confirm its token type is `non-fungible`, and validate its metadata with `fetchNFTMetaData`.


#### Interact with Contracts

Interactions with deployed contracts can be divided into two categories based on their effects and execution model:

**Views** are read-only operations that query contract state. They:

   - Execute immediately when called
   - Don't require gas fees
   - Return results directly to the caller
   - Never modify blockchain state or transfer assets

**Transactions** are operations that modify contract state, transfer assets, or both. They:

   - Require gas fees for execution
   - Are executed only when transactions are mined on the blockchain
   - Return only the transaction ID to the caller

Interacting with contracts directly through the full node API can be tedious and error-prone. The Web3 SDK simplifies this process by automatically generating wrapper code for contracts and transaction scripts. This generated code provides intellisense support in modern IDEs, handles parameter encoding/decoding, and manages the complexities of contract interactions, allowing developers to focus on building their applications rather than dealing with low-level implementation details.

Let's demonstrate the usefulness of the Web3 SDK by interacting with the `MyToken` contract:

```rust
Contract MyToken(name: ByteVec, owner: Address) {
    enum ErrorCodes {
      INVALID_CALLER = 0
    }

    @using(assetsInContract = true)
    pub fn withdraw() -> () {
      checkCaller!(callerAddress!() == owner, ErrorCodes.INVALID_CALLER)
      transferTokenFromSelf!(owner, selfTokenId!(), 100)
    }

    pub fn getName() -> ByteVec {
      return name
    }

    pub fn getOwner() -> Address {
      return owner
    }
}
```

Assuming that we have deployed the `MyToken` contract and issued 100 tokens to the contract:

```typescript
import { stringToHex, NodeProvider, DUST_AMOUNT } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { MyToken } from '../artifacts/ts'

async function test() {
  const nodeProvider = new NodeProvider("http://localhost:22973")
  const signer = await getSigner()

  const { contractInstance: myToken } = await MyToken.deploy(
    signer, {
     initialFields: { name: stringToHex("MyToken"), owner: signer.address },
     issueTokenAmount: 1000n
  })
}

test()
```

##### View Functions

Web3 SDK generates the read-only `view` methods for all functions in the `MyToken` contract. We can call the `getName` function to get the name of the token and it would return the name to the caller directly:

```typescript
const { returns: name } = await myToken.view.getName()
console.assert(name === stringToHex("MyToken"))

const { returns: owner } = await myToken.view.getOwner()
console.assert(owner === signer.address)
```

Web3 SDK also generates code for calling multiple view functions at the same time, reducing the number of network requests:

```typescript
const results = await myToken.multicall({
  getName: {},
  getOwner: {}
})

console.assert(results.getName.returns === stringToHex("MyToken"))
console.assert(results.getOwner.returns === signer.address)
```

##### Transact Functions

Web3 SDK also generates the `transact` methods for all functions in the `MyToken` contract. We can call the `withdraw` function to withdraw `100` tokens using the `signer` account:

```typescript
async function getTokenBalance(address: string) {
  const balance = await nodeProvider.addresses.getAddressesAddressBalance(address)
  console.assert(balance.tokenBalances?.[0].id === myTokenId)
  return balance.tokenBalances?.[0].amount
}

console.assert(await getTokenBalance(myToken.address) === "1000")
const result = await myToken.transact.withdraw({ signer, attoAlphAmount: DUST_AMOUNT })
console.log('transaction ID', result.txId)

console.assert(await getTokenBalance(myToken.address) === "900")
console.assert(await getTokenBalance(signer.address) === "100")
```

We define a helper function `getTokenBalance` to get the balance of `MyToken` for a given address. Then we call the `myToken.transact.withdraw` function to withdraw `100` of `MyToken` for the signer. After the transaction is executed, we verify the balance of `MyToken` for the token contract and the `signer` address are updated correctly.

Note that the `myToken.transact.withdraw` function doesn't return the result immediately, instead it returns the transaction information such as transaction ID, gas used, unsigned transaction, and signature, etc. The execution only takes effect after the transaction is successfully mined on the blockchain.

##### Transaction Scripts

Stateful UTXO model enables two types of transactions on Alephium:

- Asset transfer from senders to the recipients where only UTXOs are involved.
- Smart contract interactions

Transaction with smart contract interactions needs to be initiated by transaction script (`TxScript`), which is a unique and powerful feature on Alephium. `TxScript` allows developers to write re-usable or one-off logic that can compose multiple contract calls into a single transaction, without the overhead and cost of deploying new aggregation contracts. `TxScript` is also expressive and secure because it can leverage the full power of Ralph language and Alphred VM.

As an example, following is the pseudo code of a `TxScript` that uses two DEXes to (naively) figure out the average exchange rate of USD to ALPH, and then donate $100 worth of ALPH to a charity:

```rust
TxScript Donate(dex1: Dex, dex2: Dex, charity: Charity) {
  let rate1  = dex1.exchangeRateOfUSDToALPH()
  let rate2  = dex2.exchangeRateOfUSDToALPH()
  let amount = 100 / ((rate1 + rate2) / 2)
  charity.donate{donor -> ALPH: amount}(amount)
}
```

To call the `withdraw` function of the `MyToken` contract, we can also create a `TxScript` for it:

```rust
TxScript Withdraw(myToken: MyToken) {
  @using(preapprovedAssets = true)
  pub fn main() -> () {
    myToken.withdraw()
  }
}
```

After compilation, Web3 SDK will generate a corresponding `Withdraw` TxScript class for this `TxScript`, which can be executed by calling its `execute` function:

```typescript
const withdrawResult = await Withdraw.execute(signer, {
  initialFields: {
    myToken: myToken.contractId
  },
  attoAlphAmount: DUST_AMOUNT
})
console.log('withdraw script', withdrawResult.txId)
console.assert(await getTokenBalance(myToken.address) === "800")
console.assert(await getTokenBalance(signer.address) === "200")
```

The `main` function can become implicit if it has no return value and special annotations. So the `Withdraw` `TxScript` can be simplified as:

```rust
TxScript Withdraw(myToken: MyToken) {
  myToken.withdraw()
}
```

For simple `TxScript` that only calls a single contract function, Web3 SDK provides a convenient shortcut through the `transact` method. This method automatically generates the necessary `TxScript` bytecode behind the scenes, eliminating the need to manually create and execute transaction scripts for basic contract interactions. So executing the `Withdraw` `TxScript` is equivalent to calling `myToken.transact.withdraw(...)`.

#### Events

Events are immutable, verifiable objects emitted by the smart contracts, stored and served by the full node. They have many practical use cases in the blockchain ecosystem: DEXes use events to maintain records of token swaps within specific trading pairs. NFT marketplaces leverage events to efficiently index listing information. Oracles utilize events as communication channels, allowing smart contracts to signal requests for specific off-chain data. Cross-chain bridges use events to capture actions that require consensus from bridge operators, etc. Events play a critical role in facilitating efficient and transparent communication between smart contracts and off-chain applications.

##### Event Object
An event object in Alephium consists of the following attributes:

| Field            | Description                                                                           |
|------------------|---------------------------------------------------------------------------------------|
| txId             | transaction ID                                                                        |
| blockHash        | block hash                                                                            |
| contractAddress  | address of the emitting contract / special address for system events|
| eventIndex       | index of the event in the emitting contract / special index for system events        |
| fields           | custom information contained in the event                                                         |

Alephium supports two types of events: contract events and system events. Contract events are explicitly emitted by smart contracts to communicate important actions or state changes, while system events are automatically generated by the Alphred VM to signal low level blockchain operations such as contract creation and destruction.

##### Contract Events

Contract events are custom events defined and emitted by smart contracts to signal actions or state changes to off-chain applications.

```rust
Contract Admin(mut admin: Address) {
    event AdminUpdated(previous: Address, new: Address)

    @using(updateFields = true)
    pub fn updateAdmin(newAdmin: Address) -> () {
        checkCaller!(callerAddress!() == admin, 0)
        emit AdminUpdated(admin, newAdmin)
        admin = newAdmin
    }
}
```

In this example, the `AdminUpdated` event is emitted whenever the admin changes, allowing off-chain applications to track these changes for UI updates or audit purposes.

We can subscribe to the `AdminUpdated` event using the generated `admin.subscribeAdminUpdatedEvent` function by the Web3 SDK:

```typescript
import { getSigner } from '@alephium/web3-test'
import { Admin, AdminTypes } from '../artifacts/ts'
import { sleep } from '@alephium/web3'

async function test() {
  const signer1 = await getSigner()
  const signer2 = await getSigner()
  const { contractInstance: admin } = await Admin.deploy(
    signer1, {
    initialFields: { admin: signer1.address }
  })

  let adminUpdatedEvent: AdminTypes.AdminUpdatedEvent | undefined
  admin.subscribeAdminUpdatedEvent({
    pollingInterval: 500,
    messageCallback: (event: AdminTypes.AdminUpdatedEvent): Promise<void> => {
      adminUpdatedEvent = event
      return Promise.resolve()
    },
    errorCallback: (error: any, subscription): Promise<void> => {
      console.log(error)
      subscription.unsubscribe()
      return Promise.resolve()
    }
  })

  await admin.transact.updateAdmin({ signer: signer1, args: { newAdmin: signer2.address } })
  await sleep(1000)

  console.assert(adminUpdatedEvent?.eventIndex === 0)
  console.assert(adminUpdatedEvent?.contractAddress === admin.address)
  console.assert(adminUpdatedEvent?.fields.previous === signer1.address)
  console.assert(adminUpdatedEvent?.fields.new === signer2.address)
  process.exit(0)
}

test()
```

In this example, we subscribe to the `AdminUpdated` event with a 500ms polling interval. When `updateAdmin` function is called to update the admin from `signer1` to `signer2`, the subscription captures the emitted event through the `messageCallback` function.

In the captured `AdminUpdated` event object, `contractAddress` is the address of the `admin` contract instance, `eventIndex` is `0` since `AdminUpdated` is the first event defined in the `Admin` contract (0-based index). `fields` contains two addresses: `previous` for the previous admin, and `new` for the new admin, exactly as defined in the `AdminUpdated` event.

##### System Events

Compared to the contract events, which are defined and emitted explicitly from the contracts, system events are emitted automatically by the Alphred VM. Alephium currently supports two types of system events: `ContractCreatedEvent` and `ContractDestroyedEvent`.

###### ContractCreatedEvent

`ContractCreatedEvent` is emitted when a new contract is created:

```rust
TxScript Deploy(fooByteCode: ByteVec) {
  let _ = createContract!{callerAddress!() -> ALPH: minimalContractDeposit!()}(fooByteCode, #00, #00)
}
```

In the example above, the `Deploy` transaction script creates an instance of `Foo` contract from its bytecode without any initial contract fields. A `ContractCreatedEvent` system event is emitted after the `Foo` contract is created.

Web3 SDK provides a helper function to subscribe to the `ContractCreatedEvent` event:

```typescript
import { subscribeContractCreatedEvent, ContractCreatedEvent } from '@alephium/web3'

subscribeContractCreatedEvent({
  pollingInterval: 500,
  messageCallback: (event: ContractCreatedEvent): Promise<void> => {
    console.log('got contract created event:', event)
    return Promise.resolve()
  },
  errorCallback: (error: any, subscription): Promise<void> => {
    console.log(error)
    subscription.unsubscribe()
    return Promise.resolve()
  }
}, 0)
```

In the `ContractCreatedEvent` event object, `eventIndex` is set to `-1` (a special reserved value for this system event), `contractAddress` is a unique and deterministic value calculated from the contract group and event index, and `fields` contains both the address of the newly created contract and its parent contract ID (when applicable). This information is useful for indexers and other off-chain applications to track new contract deployments and their relationships to existing contracts.

###### ContractDestroyedEvent

`ContractDestroyedEvent` is emitted when a contract is destroyed:

```rust
Contract Foo(owner: Address) {
  @using(assetsInContract = true)
  pub fn destroy() -> () {
    checkCaller!(callerAddress!() == owner, 0)
    destroySelf!(callerAddress!())
  }
}
```

In the example above, after the `destroy` function is called, `Foo` contract will be destroyed and a `ContractDestroyedEvent` system event will be emitted.

Web3 SDK provides a helper function to subscribe to the `ContractDestroyedEvent` event:

```typescript
import { subscribeContractDestroyedEvent, ContractDestroyedEvent } from '@alephium/web3'

subscribeContractDestroyedEvent({
  pollingInterval: 500,
  messageCallback: (event: ContractDestroyedEvent): Promise<void> => {
    console.log('got contract destroyed event:', event)
    return Promise.resolve()
  },
  errorCallback: (error: any, subscription): Promise<void> => {
    console.log(error)
    subscription.unsubscribe()
    return Promise.resolve()
  }
}, 0)
```

In the `ContractDestroyedEvent` event object, `eventIndex` is set to `-2` (a special reserved value for this system event), `contractAddress` is a unique and deterministic value calculated from the contract group and event index, and `fields` contains the address of the destroyed contract.

## Asset Management

Alephium's stateful UTXO model combines the advantages of the UTXO and account models. It supports the Ethereum style mutable states for smart contracts, while leveraging the security benefits of the immutable UTXO model for assets, like those found in Bitcoin.

This hybrid approach has several important implications. For simple transactions that only involve asset transfers, they are handled by the UTXO model, which is battle tested for its security in managing assets. For smart contract transactions that involve asset transfers, Alephium's Asset Permission System (APS) is invented to ensure that all movements of assets within smart contracts are explicit, intentional, and secure.

### Tokens

Tokens are first class citizens in Alephium. Just like the native token ALPH, all tokens on Alephium are managed by UTXOs, which is battle tested for its security in managing assets.

This design has many advantages compared to other blockchains:

- **True Ownership**: Tokens are securely managed by UTXOs, which are directly owned by addresses. Since UTXOs are protected by users' private keys, even if there are bugs in the token contract, users' assets remain safe.
- **Discoverability**: Tokens are native assets on Alephium, therefore both fungible and non-fungible tokens can be easily discovered and displayed by wallets, explorers, and dApps without relying on third-party services.
- **Better UX and Security**: When smart contracts need to transfer tokens, no extra approval transactions are required since the approval is implicit in the UTXO model.
- **Scalable**: Token transfer is very scalable because they can take full advantage of Alephium's sharding design, which means higher throughput and cheaper transaction fees
- **Efficient Batching**: Multiple fungible and non-fungible tokens can be transferred in a single transaction.

There are also several advantages specifically to non-fungible tokens (NFTs):

- **Scarcity**: Each NFT requires the deployment of its own individual contract, which in turn requires a deposit of ALPH. This unique structure imposes a upper limit on the production of NFTs on Alephium.
- **Semi-fungible Tokens**: Each NFT has a corresponding issuing contract with the associated metadata. Usually the contract issues one token which makes the NFT unique. But it can also issue multiple tokens to make the token semi-fungible.

To enhance the interoperability of tokens within the Alephium ecosystem, we have established standards for both fungible and non-fungible tokens. For more information on these standards and how to work with fungible and non-fungible tokens using the Web3 SDK, please refer to the [Fungible Token Standard](#fungible-token-standard) and [Non-Fungible Token Standard](#non-fungible-token-standard).

There's a community-maintained [token list](https://github.com/alephium/token-list) where token issuers can submit their token details for proper display in wallets, explorers, and other ecosystem tools. The entries are checked only for the required metadata formats. No background checks or verifications are done on the token issuers or their projects. It's really important to do your own research before dealing with any token. Being on this list doesn't mean Alephium's core contributors endorse, audit, or verify the tokens.

### Asset Permission System

Asset Permission System (APS) is one of Alephium's unique features. It explicitly  defines asset flow within the code, ensuring all transfers are intentional and secure. By combining the UTXO model with APS, Alephium enhances user experience by eliminating the risks associated with token approvals in systems like EVM, while maintaining robust security.

Alephium uses the stateful UTXO model where assets, including the native ALPH and other tokens are managed by UTXOs. This means that simple asset transfer between users only involves UTXOs, which is battle tested for its security in managing assets. No smart contract is involved here.

For dApp transactions, if smart contracts transfer assets on behalf of the caller, no separate approval transactions are required because the approval is implicit in the UTXO model: If an input that contains a certain amount of token is included in the transaction, its owner has already given consent to the usage of that token in the context of this transaction, allowing the smart contract code within the transaction to potentially access and utilize the token.

So, how do we ensure that assets implicitly approved by the UTXO model, along with the contract assets involved in the transaction, can be handled securely by the smart contracts? The answer is Asset Permission System (APS).

#### Flow of Assets

In Alephium, a dApp transaction involves executing a `TxScript`. For more information, refer to the [Transaction Script](#transaction-scripts) section. Below is an example of a transaction that runs a `TxScript` with two inputs, one fixed output, and some generated outputs.

```text
                  ----------------
                  |              |
                  |              |
   1 Token A      |              |   1 ALPH (fixed output)
================> |              | ========================>
   6.1 ALPHs      |  <TxScript>  |   ??? (generated output)
================> |              | ========================>
                  |              |
                  |              |
                  |              |
                  ----------------
```

Three things are worth noting here:

- The generated outputs are the result of the `TxScript` execution. They won't be available until the transaction is successfully executed and included in a block. The complete transaction outputs include both the fixed outputs and generated outputs
- The total assets available for `TxScript` are at least `1` Token A and `5.1` ALPHs, because we need to substract the `1` ALPH from the fixed output. For simplicity, we are ignoring the gas fee in this discussion
- Additionally, `TxScript` can potentially access more assets from the contracts involved in the transaction

Let's say the `TxScript` looks something like this:

```rust
TxScript ListNFT(
    tokenAId: ByteVec,
    price: U256,
    marketPlace: NFTMarketPlace
) {
    let listingFee = marketPlace.getListingFee()
    let approvedAlphAmount = listingFee + minimalContractDeposit!()

    marketPlace.listNFT{callerAddress!() -> ALPH: approvedAlphAmount, tokenAId: 1}(tokenAId, price)
}
```

Token `A` represents an NFT, and the purpose of this `TxScript` is to list this NFT on a marketplace contract. This line of code in `TxScript` is particularly interesting:

```rust
marketPlace.listNFT{callerAddress!() -> ALPH: approvedAlphAmount, tokenAId: 1}(tokenAId, price)
```

The code inside the curly braces approves that only `approvedAlphAmount` of ALPH and `1` unit of token `A` from the caller can be used in the `marketPlace.listNFT` function. This is true even though the caller has a total of `5.1` ALPH and `1` unit of token `A` accessible in the `TxScript`.

The following scenarios could happen depending on the value of `approvedAlphAmount`:

- If `approvedAlphAmount` is more than `5.1` ALPH, the transaction fails with `NotEnoughBalance` error
- If `approvedAlphAmount` is less than `5.1` ALPH, say `1.1` ALPH, then `marketPlace.listNFT` can only access `1.1` ALPHs and `1` unit of token `A`. It does not have access to the rest of the `4` ALPHs
- If `marketPlace.listNFT` has not spent the entirety of the approved assets, the remaining assets will be returned back, and continue be accessible by the `TxScript`

Let's dive deeper into the `marketPlace.listNFT` function:

```rust
Contract NFTMarketPlace(
    nftListingTemplateId: ByteVec
) {
    // Other code are omitted for brevity

    pub fn getListingFee() -> U256 {
        return 1 alph
    }

    @using(preapprovedAssets = true, assetsInContract = true)
    pub fn listNFT(
        tokenId: ByteVec,
        price: U256
    ) -> (Address) {
        assert!(price > 0, ErrorCodes.NFTPriceIsZero)

        // Only owner can list the NFT
        let tokenOwner = callerAddress!()

        let (encodeImmutableFields, encodeMutableFields) = NFTListing.encodeFields!(
          tokenId, tokenOwner, selfAddress!(), commissionRate, price
        )

        // Charge the listing fee
        transferTokenToSelf!(tokenOwner, ALPH, listingFee)

        // Create the listing contract
        let nftListingContractId = copyCreateSubContract!{
          tokenOwner -> ALPH: minimalContractDeposit!(),
          tokenId: 1
        }(tokenId, nftListingTemplateId, encodeImmutableFields, encodeMutableFields)

        return contractIdToAddress!(nftListingContractId)
    }
}
```

First thing to notice is the annotation for the `listNFT` method:

```rust
@using(preapprovedAssets = true, assetsInContract = true)
```

The `preapprovedAssets = true` annotation indicates that the `listNFT` function requires the caller to approve certain assets before the function can be executed, otherwise a compilation error will occur. The `assetsInContract = true` annotation suggests that the `listNFT` function will utilize assets from the `NFTMarketPlace` contract itself. For more detailed information on these annotations, refer to the [Function Annotations](#function-annotations) section.

There are two places where assets are transferred in the `listNFT` function. First, it transfers the listing fee to the `NFTMarketPlace` contract, which is `1` ALPH:

```rust
// Charge the listing fee
transferTokenToSelf!(tokenOwner, ALPH, listingFee)
```

Second, it creates a NFT listing sub contract by calling the `copyCreateSubContract!` built-in function:

```rust
let nftListingContractId = copyCreateSubContract!{
  tokenOwner -> ALPH: minimalContractDeposit!(),
  tokenId: 1
}(tokenId, nftListingTemplateId, encodeImmutableFields, encodeMutableFields)
```

This consumes `0.1` ALPH from the caller as the minimal deposit for the NFT listing contract. It also transfers `1` token from the caller to the newly created contract. Note that the `copyCreateSubContract!` built-in function also uses the curly braces syntax to specify the assets that are allowed to be spent in the function.

When `marketPlace.listNFT` is executed by in the `TxScript`, it is authorized to spend `1.1` ALPH and `1` unit of token `A`. `marketPlace.listNFT` in turn call another method, and approves a subset of these approved assets to that method as well, as shown by the `copyCreateSubContract!` function. The flow of assets from the `TxScript` can be illustrated below:

```text
  Caller of the TxScript
  (6.1 ALPH; 1 Token A)
           ||
           ||
           || Subtract assets in
           || Fixed outputs
           ||
           ||              Approves                         Approves
           \/         (1.1 ALPH; 1 TokenA)            (0.1 ALPH; 1 TokenA)
(5.1 ALPH; 1 TokenA) ======================> listNFT =====================> NFTListing
                                               ||                      (+0.1 ALPH; +1 TokenA)
                                               ||
                                               ||
                                               ||
                                               ||
                                               ||
                                               \/
                                          NFTMarketplace
                                             (+1 ALPH)
```

After executing the `TxScript`, the final transaction will produce the following outputs:

```text
                        ----------------
                        |              |
                        |              |   1 ALPH (fixed output)
  1 Token A             |              | =========================================>
======================> |              |   0.1 ALPH, 1 Token A (NFTListing contract)
  6.1 ALPHs             |  <TxScript>  | =========================================>
======================> |              |   1 ALPH (NFTMarketPlace contract)
                        |              | =========================================>
                        |              |   4 ALPH - gas (change output)
                        |              | =========================================>
                        |              |
                        ----------------
```

In a sophisticated dApp transaction, Asset Permission System ensures that the flow of assets within the complex method call graph is explicit and controlled. It enforces constraints on each method regarding which tokens and how much of them can be accessed. Together with the UTXO model, it offers an asset management solution that is simple, flexible and secure.

## Testing and Debugging

Testing is essential to ensure the functionality, quality and security of any software products. This is especially true when it comes to smart contracts development because once deployed, smart contracts are much more difficult, if possible, to update compared to traditional software, and bugs in them can potentially lead to significant financial losses.

Testing smart contracts can be challenging. Alephium's Web3 SDK makes the following opinionated design decisions when it comes to its testing framework:

- Both unit tests and integration tests are important. Although the distinction between them can be blurry, the test framework defines integration tests as the tests that require smart contracts under test to be deployed, whereas unit tests do not
- Test code should be clean and maintainable, just like any other code. The Web3 SDK automatically generates testing boilerplates to simplify the process of writing and maintaining test cases
- Tests are executed against the Alephium full node in devnet, which shares the same codebase as the Alephium mainnet. This ensures that the tests are mostly run under realistic conditions

Ralph also allows developers to emit debug statements within smart contracts, which is very useful to diagnose issues during development.

### Unit Test

A unit test tests a specific function of a contract, without requiring the contract to be deployed. Let's use the following contract as an example:

```rust
Contract ALPHFaucet(mut withdrawAmount: U256, mut alphRemaining: U256) {
    event WithdrawAmountUpdated(previous: U256, new: U256)
    event Withdraw(amount: U256, by: Address)

    @using(checkExternalCaller = false)
    pub fn increaseWithdrawAmount(value: U256) -> U256 {
        return updateWithdrawAmount(withdrawAmount + value)
    }

    @using(checkExternalCaller = false)
    pub fn decreaseWithdrawAmount(value: U256) -> U256 {
        return updateWithdrawAmount(withdrawAmount - value)
    }

    @using(updateFields = true)
    fn updateWithdrawAmount(value: U256) -> U256 {
        emit WithdrawAmountUpdated(withdrawAmount, value)
        withdrawAmount = value
        return value
    }

    @using(checkExternalCaller = false, assetsInContract = true, updateFields = true)
    pub fn withdraw() -> () {
        transferTokenFromSelf!(callerAddress!(), ALPH, withdrawAmount)
        alphRemaining = alphRemaining - withdrawAmount
        emit Withdraw(withdrawAmount, callerAddress!())
    }
}
```

The `ALPHFaucet` contract allows caller to withdraw `withdrawAmount` amount of ALPHs. `withdrawAmount` can be adjusted by calling the `increaseWithdrawAmount` and `decreaseWithdrawAmount` functions.

We can write the following code to unit test the `increaseWithdrawAmount` function:

```typescript
const result = await ALPHFaucet.tests.increaseWithdrawAmount({
  initialFields: { withdrawAmount: 10n, alphRemaining: 100n },
  testArgs: { value: 10n }
})
expect(result.returns).toBe(20n)
expect(result.events[0].name).toEqual('WithdrawAmountUpdated')
expect(result.events[0].fields).toEqual({previous: 10n, new: 20n})
expect(result.contracts[0].fields.withdrawAmount).toEqual(20n)
expect(result.contracts[0].fields.alphRemaining).toEqual(100n)
```

To test the `increaseWithdrawAmount` function, we need to set up the initial fields for the `ALPHFaucet` contract. In this case, `withdrawAmount` is set to `10n` and `alphRemaining` is set to `100n`. The `testArgs` field is used to pass in the `value` argument for the `increaseWithdrawAmount` function (`10n`). After executing the function, we can verify that `increaseWithdrawAmount` function returns the correct value, `withdrawAmount` field is updated properly, and `WithdrawAmountUpdated` event is emitted with the right fields as well.

Next, let's test the `withdraw` function:

```typescript
const result = await ALPHFaucet.tests.withdraw({
  initialFields: { withdrawAmount: ONE_ALPH, alphRemaining: ONE_ALPH * 100n },
  initialAsset: { alphAmount: ONE_ALPH * 100n },
  inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH / 2n } }]
})

expect(result.returns).toBe(null)
expect(result.events[0].name).toEqual('Withdraw')
expect(result.events[0].fields).toEqual({amount: ONE_ALPH, by: testAddress})
expect(result.txOutputs[0].address).toEqual(testAddress)
expect(result.txOutputs[0].alphAmount).toEqual(ONE_ALPH)
expect(result.contracts[0].fields.withdrawAmount).toEqual(ONE_ALPH)
expect(result.contracts[0].fields.alphRemaining).toEqual(ONE_ALPH * 99n)
```

We set up the initial fields for the `ALPHFaucet` contract using the `initialFields` field and assign it an initial asset of `100` ALPH using the `initialAsset` field. Additionally, we configure the transaction inputs with the `inputAssets` field, where the first input asset always belongs to the caller's address. After executing the function, we can verify that the `withdraw` function returns the correct value (`null`), contract fields for `ALPHFaucet` are updated properly, `Withdraw` event is emitted with the right fields, and the caller's address receives the correct amount of ALPH.

The unit test framework in Web3 SDK also supports the scenario where the function under test calls an external contract function. Let's modify the `ALPHFaucet` contract to have `withdrawAmount` stored in another contract:

```rust
Contract ALPHFaucet(withdrawAmount: WithdrawAmount, mut alphRemaining: U256) {
    event Withdraw(amount: U256, by: Address)

    @using(checkExternalCaller = false)
    pub fn increaseWithdrawAmount(value: U256) -> U256 {
        return withdrawAmount.update(withdrawAmount.get() + value)
    }

    @using(checkExternalCaller = false)
    pub fn decreaseWithdrawAmount(value: U256) -> U256 {
        return withdrawAmount.update(withdrawAmount.get() - value)
    }

    @using(checkExternalCaller = false, assetsInContract = true, updateFields = true)
    pub fn withdraw() -> () {
        let amount = withdrawAmount.get()
        transferTokenFromSelf!(callerAddress!(), ALPH, amount)
        alphRemaining = alphRemaining - amount
        emit Withdraw(amount, callerAddress!())
    }
}

Contract WithdrawAmount(mut value: U256) {
    event WithdrawAmountUpdated(previous: U256, new: U256)

    @using(updateFields = true, checkExternalCaller = false)
    pub fn update(newValue: U256) -> U256 {
        emit WithdrawAmountUpdated(value, newValue)
        value = newValue
        return value
    }

    pub fn get() -> U256 {
        return value
    }
}
```

To test the `increaseWithdrawAmount` function in the `ALPHFaucet` contract, we begin by creating the initial state for `WithdrawAmount` contract using the `stateForTest` method and set it up as a dependency for the test using the `existingContracts` field. We also use the contract ID for `WithdrawAmount` to initialize the fields for the `ALPHFaucet` contract.

```typescript
const withdrawAmount = WithdrawAmount.stateForTest({value: ONE_ALPH})
const result = await ALPHFaucet.tests.increaseWithdrawAmount({
  initialFields: { withdrawAmount: withdrawAmount.contractId, alphRemaining: ONE_ALPH * 100n },
  testArgs: { value: ONE_ALPH },
  existingContracts: [withdrawAmount]
})
expect(result.returns).toBe(ONE_ALPH * 2n)
expect(result.events[0].name).toEqual('WithdrawAmountUpdated')
expect(result.events[0].fields).toEqual({previous: ONE_ALPH, new: ONE_ALPH * 2n})
expect(result.contracts[0].fields.value).toEqual(ONE_ALPH * 2n)
expect(result.contracts[1].fields.withdrawAmount).toEqual(withdrawAmount.contractId)
expect(result.contracts[1].fields.alphRemaining).toEqual(ONE_ALPH * 100n)
```

After executing the `increaseWithdrawAmount` function, we can verify that the fields in both the `ALPHFaucet` and `WithdrawAmount` contracts are updated properly.

The Web3 SDK also supports testing functions that use maps. Let's update the `ALPHFaucet` contract to include a map, ensuring that each caller can only withdraw once:

```rust
Contract ALPHFaucet(withdrawAmount: U256, mut alphRemaining: U256) {
    mapping[Address, U256] alreadyWithdrawn
    event Withdraw(amount: U256, by: Address)
    enum ErrorCodes {
        AlreadyWithdrawn = 0
    }

    @using(
        preapprovedAssets = true,
        checkExternalCaller = false,
        assetsInContract = true,
        updateFields = true
    )
    pub fn withdraw() -> () {
        let caller = callerAddress!()
        assert!(!alreadyWithdrawn.contains!(caller), ErrorCodes.AlreadyWithdrawn)

        alreadyWithdrawn.insert!(caller, caller, withdrawAmount)
        transferTokenFromSelf!(caller, ALPH, withdrawAmount)

        alphRemaining = alphRemaining - withdrawAmount
        emit Withdraw(withdrawAmount, caller)
    }
}
```

As we can see from the code, the `withdraw` function now uses the `alreadyWithdrawn` map to ensure that each caller can only withdraw once, otherwise the transaction will fail with the `AlreadyWithdrawn` error code.

To test the `withdraw` function, we can write the following code:

```typescript
const result = await ALPHFaucet.tests.withdraw({
  initialMaps: { alreadyWithdrawn: new Map([]) },
  initialFields: { withdrawAmount: ONE_ALPH, alphRemaining: ONE_ALPH * 100n },
  initialAsset: { alphAmount: ONE_ALPH * 100n },
  inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 2n } }]
})
expect(result.returns).toBe(null)
expect(result.events[0].name).toEqual('ContractCreated')
expect(result.events[1].name).toEqual('Withdraw')
expect(result.events[1].fields).toEqual({amount: ONE_ALPH, by: testAddress})
expect(result.contracts[0].fields.withdrawAmount).toEqual(ONE_ALPH)
expect(result.contracts[0].fields.alphRemaining).toEqual(ONE_ALPH * 99n)
```

Note that we use the `initialMaps` field to set up an empty value for the `alreadyWithdrawn` map. We also get an extra `ContractCreated` event because each map entry is created as a sub contract under the hood.

We can also use the `expectAssertionError` method to verify that the `withdraw` function fails when the caller has already withdrawn:

```typescript
const contractAddress = randomContractAddress()
expectAssertionError(
  ALPHFaucet.tests.withdraw({
    address: contractAddress,
    initialMaps: { alreadyWithdrawn: new Map([[testAddress, ONE_ALPH]]) },
    initialFields: { withdrawAmount: ONE_ALPH, alphRemaining: ONE_ALPH * 100n },
    initialAsset: { alphAmount: ONE_ALPH * 100n },
    inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 2n } }]
  }),
  contractAddress,
  0
)
```

`expectAssertionError` function takes three arguments: the execution promise, the address of the contract where the error is expected to be thrown, and the error code.

### Integration Test

An integration test tests a feature of a set of deployed contracts. Let's try to test the `ALPHFaucet` contract from the [Unit Test](#unit-test) section:

```rust
Contract ALPHFaucet(withdrawAmount: WithdrawAmount, mut alphRemaining: U256) {
    event Withdraw(amount: U256, by: Address)

    @using(checkExternalCaller = false)
    pub fn increaseWithdrawAmount(value: U256) -> U256 {
        return withdrawAmount.update(withdrawAmount.get() + value)
    }

    @using(checkExternalCaller = false)
    pub fn decreaseWithdrawAmount(value: U256) -> U256 {
        return withdrawAmount.update(withdrawAmount.get() - value)
    }

    @using(checkExternalCaller = false, assetsInContract = true, updateFields = true)
    pub fn withdraw() -> () {
        let amount = withdrawAmount.get()
        transferTokenFromSelf!(callerAddress!(), ALPH, amount)
        alphRemaining = alphRemaining - amount
        emit Withdraw(amount, callerAddress!())
    }
}

Contract WithdrawAmount(mut value: U256) {
    event WithdrawAmountUpdated(previous: U256, new: U256)

    @using(updateFields = true, checkExternalCaller = false)
    pub fn update(newValue: U256) -> U256 {
        emit WithdrawAmountUpdated(value, newValue)
        value = newValue
        return value
    }

    pub fn get() -> U256 {
        return value
    }
}
```

`ALPHFaucet` contract uses the `WithdrawAmount` contract to store withdraw amount, so we need to deploy both of them first in the integration tests, and then verify the contract functions work as intended.

```typescript
// Helper function to get the ALPH balance of an address
async function getAlphBalance(address: string) {
  const result = await nodeProvider.addresses.getAddressesAddressBalance(address)
  return BigInt(result.balance)
}

// Helper function to calculate the gas fee
function getGasFee({gasAmount, gasPrice}: {gasAmount: number, gasPrice: Number256}) {
  return BigInt(gasAmount) * BigInt(gasPrice)
}

const signer = await getSigner(ONE_ALPH * 1000n, 0)

const {contractInstance: withdrawAmount} = await WithdrawAmount.deploy(signer, {
  initialFields: {value: ONE_ALPH}
})
const {contractInstance: alphFaucet} = await ALPHFaucet.deploy(signer, {
  initialFields: {
     withdrawAmount: withdrawAmount.contractId,
     alphRemaining: ONE_ALPH * 100n
  },
  initialAttoAlphAmount: ONE_ALPH * 100n + MINIMAL_CONTRACT_DEPOSIT
})

const initialSignerBalance = await getAlphBalance(signer.address)

const tx1 = await alphFaucet.transact.withdraw({ signer })
let expectedSignerBalance = initialSignerBalance + ONE_ALPH - getGasFee(tx1)
expect(await getAlphBalance(signer.address)).toBe(expectedSignerBalance)

const tx2 = await alphFaucet.transact.increaseWithdrawAmount({
   signer, args: { value: ONE_ALPH * 10n } }
)
const tx3 = await alphFaucet.transact.withdraw({ signer })
expectedSignerBalance = expectedSignerBalance + ONE_ALPH * 11n - getGasFee(tx2) - getGasFee(tx3)
expect(await getAlphBalance(signer.address)).toBe(expectedSignerBalance)
```

After deploying the `ALPHFaucet` and `WithdrawAmount` contracts, we test the `withdraw` function by calling it with the signer and verifying that the signer's ALPH balance updates correctly. We then update the `withdrawAmount` and test the `withdraw` function again to ensure the new withdraw amount is applied. Note that when calculating the expected signer's ALPH balance, we account for the gas fee by subtracting it from the expected balance.

### Debugging

Ralph supports debug statements in smart contracts. Printing debug messages has the same syntax as emitting [contract events](#contract-events). Debug messages are back-quoted, and support string interpolation for easier inspection:

```rust
Contract Math() {
    pub fn add(x: U256, y: U256) -> U256 {
        emit Debug(`In the add function:`)
        emit Debug(`${x} + ${y} = ${x + y}`)
        return x + y
    }
}
```

In the example above, the `add` function in the `Math` contract is a [view function](#view-functions). When we call the `add` function in a unit test or integration test, a debug message will be printed in both the terminal console and the full node log in the following format:

```bash
# Your contract address should be different
> Contract @ vrcKqNuMrGpA32eUgUvAB3HBfkN4eycM5uvXukwn5SxP - In the add function:
> Contract @ vrcKqNuMrGpA32eUgUvAB3HBfkN4eycM5uvXukwn5SxP - 1 + 2 = 3
```

If the `add` function is a [transact function](#transact-functions) which requires a transaction to be executed, the debug message will only appear in the full node log during integration tests, as the execution is asynchronous and cannot return results to the terminal console immediately. However, in unit tests, debug messages will still be printed in both the terminal console and the full node log.

## Putting it all together

Now that we have covered the basics of building smart contracts in Ralph, let's put all the concepts together and walk through a complete example from project creation to deployment. After that, we will explore a few more advanced examples and provide references for further learning.

### Token Faucet

When we scaffold a new project using the [Alephium CLI](https://docs.alephium.org/sdk/cli/), it automatically generates a `TokenFaucet` contract along with unit and integration tests for it.

```bash
$ npx @alephium/cli init token-faucet
...
✅ Done.
✨ Project is initialized!
```

Let's take a look at the `token-faucet` project directory. The Ralph source code is found in the `contracts` directory. The unit and integration tests are located in the `test` directory, and the contract deployment script is under the `scripts` directory.

```bash
$ tree
.
├── alephium.config.ts
├── contracts
│   ├── token.ral
│   └── withdraw.ral
├── jest-config.json
├── package.json
├── package-lock.json
├── README.md
├── scripts
│   └── 0_deploy_faucet.ts
├── src
│   └── token.ts
├── test
│   └── token.test.ts
└── tsconfig.json

5 directories, 11 files
```

Here is the source code for the `TokenFaucet` contract defined in the `token.ral` file:

```rust
import "std/fungible_token_interface"

// Defines a contract named `TokenFaucet`.
// A contract is a collection of fields (its state) and functions.
// Once deployed, a contract resides at a specific address on the Alephium blockchain.
// Contract fields are permanently stored in contract storage.
// A contract can issue an initial amount of token at its deployment.
Contract TokenFaucet(
    symbol: ByteVec,
    name: ByteVec,
    decimals: U256,
    supply: U256,
    mut balance: U256
) implements IFungibleToken {

    // Events allow for logging of activities on the blockchain.
    // Alephium clients can listen to events in order to react to contract state changes.
    event Withdraw(to: Address, amount: U256)

    enum ErrorCodes {
        InvalidWithdrawAmount = 0
    }

    // A public function that returns the initial supply of the contract's token.
    // Note that the field must be initialized as the amount of the issued token.
    pub fn getTotalSupply() -> U256 {
        return supply
    }

    // A public function that returns the symbol of the token.
    pub fn getSymbol() -> ByteVec {
        return symbol
    }

    // A public function that returns the name of the token.
    pub fn getName() -> ByteVec {
        return name
    }

    // A public function that returns the decimals of the token.
    pub fn getDecimals() -> U256 {
        return decimals
    }

    // A public function that returns the current balance of the contract.
    pub fn balance() -> U256 {
        return balance
    }

    // A public function that transfers tokens to anyone who calls it.
    // The function is annotated with `updateFields = true` as it changes the contract fields.
    // The function is annotated as using contract assets as it does.
    // The function is annotated with `checkExternalCaller = false` as there is no need to
    // check the external caller.
    @using(assetsInContract = true, updateFields = true, checkExternalCaller = false)
    pub fn withdraw(amount: U256) -> () {
        // Debug events can be helpful for error analysis
        emit Debug(`The current balance is ${balance}`)

        // Make sure the amount is valid
        assert!(amount <= 2, ErrorCodes.InvalidWithdrawAmount)
        // Functions postfixed with `!` are built-in functions.
        transferTokenFromSelf!(callerAddress!(), selfTokenId!(), amount)
        // Ralph does not allow underflow.
        balance = balance - amount

        // Emit the event defined earlier.
        emit Withdraw(callerAddress!(), amount)
    }
}
```

The `TokenFaucet` contract implements the `IFungibleToken` interface defined in the [Fungible Token Standard](#fungible-token-standard). Other than the functions required by the interface, the contract also maintains a mutable `balance` field to keep track of its token balance.

The `withdraw` function is a [transact function](#transact-functions) that allows anyone to withdraw up to 2 tokens from the contract. The function is annotated with `assetsInContract = true` as it uses the contract's assets. It is also annotated with `updateFields = true` because it updates the `balance` contract fields. Since anyone can call the function, the `checkExternalCaller` annotation is set to `false`. For a detailed explanation of the `@using` annotation, refer to the [Function Annotations](#function-annotations) section.

The `Withdraw` [transaction script](#transaction-scripts) is defined in the `withdraw.ral` file. The logic is straightforward: it simply calls the `withdraw` function of the `TokenFaucet` contract with the specified amount.

```rust
// Defines a transaction script.
// A transaction script is a piece of code to interact with contracts on the blockchain.
// Transaction scripts can use the input assets of transactions in general.
// A script is disposable and will only be executed once along with the holder transaction.
TxScript Withdraw(token: TokenFaucet, amount: U256) {
    // Call token contract's withdraw function.
    token.withdraw(amount)
}
```

We can run the following commands to compile the project:

```bash
$ npm i  # install dependencies
$ npx @alephium/cli compile
...
Full node version: v3.12.2
Compiling contracts in folder "contracts"
✅ Compilation completed!
Generating code for contract TokenFaucet
Generating code for script Withdraw
✅ Codegen completed!
```

After running the compile command, an `artifacts` directory will be created in the project root directory. This directory not only contains the compiled contract and transaction script in JSON format, but also the generated TypeScript classes for each contract and transaction script. These TypeScript classes make it significantly easier to test and interact with the contracts, as demonstrated throughout this chapter.

```bash
$ tree artifacts
artifacts
├── TokenFaucet.ral.json
├── ts
│   ├── contracts.ts
│   ├── index.ts
│   ├── scripts.ts
│   └── TokenFaucet.ts
└── Withdraw.ral.json
```

Both the integration test and unit test are located in the `token.test.ts` under the `test` directory. Unit tests are written for the `withdraw` function in the `TokenFaucet` contract:

```typescript
// Code excerpt from token.test.ts
beforeAll(async () => {
  // ... Skip set up code for brevity
  testParamsFixture = {
    // a random address that the test contract resides in the tests
    address: testContractAddress,
    // assets owned by the test contract before a test
    initialAsset: { alphAmount: 10n ** 18n, tokens: [{ id: testTokenId, amount: 10n }] },
    // initial state of the test contract
    initialFields: {
      symbol: Buffer.from('TF', 'utf8').toString('hex'),
      name: Buffer.from('TokenFaucet', 'utf8').toString('hex'),
      decimals: 18n,
      supply: 10n ** 18n,
      balance: 10n
    },
    // arguments to test the target function of the test contract
    testArgs: { amount: 1n },
    // assets owned by the caller of the function
    inputAssets: [{ address: testAddress, asset: { alphAmount: 10n ** 18n } }]
  }
})

it('test withdraw', async () => {
  const testParams = testParamsFixture
  const testResult = await TokenFaucet.tests.withdraw(testParams)
  // only one contract involved in the test
  const contractState = testResult.contracts[0] as TokenFaucetTypes.State
  expect(contractState.address).toEqual(testContractAddress)
  expect(contractState.fields.supply).toEqual(10n ** 18n)
  // ... Skip more verification for brevity
})
```

The test sets up the initial asset and state of the `TokenFaucet` contract using the `initialAsset` and `initialFields` fields respectively. It also uses the `inputAsset` field to set up caller's assets for the test before calling the `withdraw` function with the specified amount (`1n`) in `testArgs`. After getting the test result, it continues to verify the correctness of the contract state, balance and events.

In the integration test, the `TokenFaucet` contract is deployed to the devnet and the `withdraw` function is tested by different signers for 10 times. After each call, the test verifies the balance of the contract.

```typescript
describe('integration tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  })

  it('should withdraw on devnet', async () => {
    const signer = await testNodeWallet()
    const deployments = await deployToDevnet()

    // Test with all of the addresses of the wallet
    for (const account of await signer.getAccounts()) {
      const testAddress = account.address
      await signer.setSelectedAccount(testAddress)
      const testGroup = account.group

      const faucet = deployments.getInstance(TokenFaucet, testGroup)
      if (faucet === undefined) {
        console.log(`The contract is not deployed on group ${account.group}`)
        continue
      }

      expect(faucet.groupIndex).toEqual(testGroup)
      const initialState = await faucet.fetchState()
      const initialBalance = initialState.fields.balance

      // Call `withdraw` function 10 times
      for (let i = 0; i < 10; i++) {
        await faucet.transact.withdraw({
          signer: signer,
          attoAlphAmount: DUST_AMOUNT * 3n,
          args: { amount: 1n }
        })

        const newState = await faucet.fetchState()
        const newBalance = newState.fields.balance
        expect(newBalance).toEqual(initialBalance - BigInt(i) - 1n)
      }
    }
  }, 20000)
})
```

Unit tests and integration tests can be run together using the following command:

```bash
$ npm run test
...
PASS  test/token.test.ts
  unit tests
    ✓ test withdraw (299 ms)
    ✓ test withdraw (236 ms)
  integration tests
    ✓ should withdraw on devnet (1626 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        5.045 s
Ran all test suites.
```

For more details on how to write unit and integration tests, refer to the [Unit Test](#unit-test) and [Integration Test](#integration-test) sections.

Now that all the tests are passed, we are finally ready to deploy the `TokenFaucet` contract. The deployment command looks for the deployment scripts under the `scripts` directory and executes them in the order of the file names. For `TokenFaucet`, the deployment script is `0_deploy_faucet.ts`:

```typescript
import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { TokenFaucet } from '../artifacts/ts'
import { stringToHex } from '@alephium/web3'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployFaucet: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const issueTokenAmount = network.settings.issueTokenAmount
  const result = await deployer.deployContract(TokenFaucet, {
    // The amount of token to be issued
    issueTokenAmount: issueTokenAmount,
    // The initial states of the faucet contract
    initialFields: {
      symbol: stringToHex('TF'),
      name: stringToHex('TokenFaucet'),
      decimals: 18n,
      supply: issueTokenAmount,
      balance: issueTokenAmount
    }
  })
  console.log('Token faucet contract id: ' + result.contractInstance.contractId)
  console.log('Token faucet contract address: ' + result.contractInstance.address)
}

export default deployFaucet
```

The `deployFaucet` function sets up the initial fields for the `TokenFaucet` contract, including the token's symbol, name, decimals, supply, and balance. It then uses the `deployer` to deploy the contract. This deployment script can be used to deploy the `TokenFaucet` contract to any network, with network specific settings (e.g. `issueTokenAmount`) provided by the `network` argument.

The `network` argument is set up in the `alephium.config.ts` file under the project root directory:

```typescript
import { Configuration } from '@alephium/cli'
import { Number256 } from '@alephium/web3'

// Settings are usually for configuring
export type Settings = {
  issueTokenAmount: Number256
}

const defaultSettings: Settings = {
  issueTokenAmount: 100n
}

const configuration: Configuration<Settings> = {
  networks: {
    devnet: {
      nodeUrl: 'http://127.0.0.1:22973',
      // here we could configure which address groups to deploy the contract
      privateKeys: ['a642942e67258589cd2b1822c631506632db5a12aabcf413604e785300d762a5'],
      settings: defaultSettings
    },

    testnet: {
      nodeUrl: process.env.NODE_URL as string,
      privateKeys: process.env.PRIVATE_KEYS === undefined
                   ? [] : process.env.PRIVATE_KEYS.split(','),
      settings: defaultSettings
    },

    mainnet: {
      nodeUrl: process.env.NODE_URL as string,
      privateKeys: process.env.PRIVATE_KEYS === undefined
                   ? [] : process.env.PRIVATE_KEYS.split(','),
      settings: defaultSettings
    }
  }
}

export default configuration
```

For each of the networks, we can specify the following parameters: The `nodeUrl` is the URL of the node that will be used to deploy the contract. The `privateKeys` are the private keys of the accounts that will be used to deploy the contract. If the contract needs to be deployed to multiple groups, we need to specify multiple private keys here. The `settings` contains the parameters that will be used to configure the contract deployment, such as the amount of token to be issued.

To deploy the contract to devnet, we can run the following command:

```bash
# Your contract address and contract ID will be different
$ npx @alephium/cli deploy
...
Deploying contract TokenFaucet
Token faucet contract id: 81a65645213b76aa9d5308d7f0822177bbaf59050617285b21e546885026f200
Token faucet contract address: 23R3pDsYs14BQScNDBQ2JGAV4zvhLnHWoJs8E8YngMD2f
✅ Scripts deployment executed!
```

To deploy the contract to testnet (same for mainnet), we can run the following command:

```bash
$ export NODE_URL=https://node.testnet.alephium.org
$ export PRIVATE_KEYS="..." # Your private keys
$ npx @alephium/cli deploy --network testnet
Deploying contract TokenFaucet
Token faucet contract id: c014afbc57d2769368d89d3ea26c84d121585e35f5f5d25d711bc6641e460e00
Token faucet contract address: 27ckgjZvFfjWdBZyK5bHtJr5EDMY7BVXrR9SRhwuGTk5D
✅ Scripts deployment executed!
```

Congratulations! You have successfully deployed the `TokenFaucet` contract to testnet!

### Dynamic Arrays

In Ralph, arrays are not supported as a built-in data structure. However, you can simulate dynamic arrays using `ByteVec`, which can be used to store and manipulate arbitrary data. The following is an example of a contract that simulates a dynamic array for `U256` type:

```rust
Contract DynamicArrayForInt() {
    pub fn get(array: ByteVec, index: U256) -> U256 {
        assert!(size!(array) % 4 == 0, 0)

        let offset = index * 4
        let bytes = byteVecSlice!(array, offset, offset + 4)
        return u256From4Byte!(bytes)
    }

    // Avoid this function because it costs more gas and creates new ByteVec.
    pub fn update(array: ByteVec, index: U256, value: U256) -> ByteVec {
        assert!(size!(array) % 4 == 0, 0)

        let offset = index * 4
        return byteVecSlice!(array, 0, offset) ++
               u256To4Byte!(value) ++
               byteVecSlice!(array, offset + 4, size!(array))
    }

    pub fn push(array: ByteVec, value: U256) -> ByteVec {
        assert!(size!(array) % 4 == 0, 0)

        return array ++ u256To4Byte!(value)
    }

    pub fn pop(array: ByteVec) -> (ByteVec, U256) {
        assert!(size!(array) % 4 == 0, 0)

        let offset = size!(array) - 4
        let value = u256From4Byte!(byteVecSlice!(array, offset, offset + 4))
        return byteVecSlice!(array, 0, offset), value
    }

    pub fn sum(array: ByteVec) -> U256 {
        assert!(size!(array) % 4 == 0, 0)
        assert!(size!(array) > 0, 1)

        let mut sum = 0
        for(let mut offset = 0; offset < size!(array); offset = offset + 4) {
            let bytes = byteVecSlice!(array, offset, offset + 4)
            let value = u256From4Byte!(bytes)
            sum = sum + value
        }
        return sum
    }
}
```

The `DynamicArrayForInt` contract manages a dynamic array of integers stored in a `ByteVec`, with each integer occupying 4 bytes. It includes public functions to `get`, `update`, `push` and `pop` integer from the array.

The key insight here is that given an index, we can determine the offset of a `U256` integer within the `ByteVec` because each of them occupies exactly 4 bytes. By leveraging the `byteVecSlice!` built-in functions, we can accurately retrieve or replace the `ByteVec` version of the `U256` integer at the correct offset from the array based on its index.

`DynamicArrayForInt` also includes a `sum` function, which iterates through the entire `ByteVec` value, converting each 4-byte segment back into a `U256` integer and accumulating the total sum.

The following transaction script illustrates how to use the `DynamicArrayForInt` contract:

```rust
TxScript TestDynamicArrayForInt(contract: DynamicArrayForInt) {
    let mut array = #
    array = contract.push(array, 5)
    array = contract.push(array, 10)
    array = contract.push(array, 15)
    assert!(contract.sum(array) == 30, 1)

    array = contract.update(array, 1, 20)
    assert!(contract.sum(array) == 40, 2)

    let (newArray, value) = contract.pop(array)
    assert!(value == 15, 4)
    assert!(contract.sum(newArray) == 25, 3)
    assert!(contract.get(newArray, 0) == 5, 5)
}
```

For more details on the `DynamicArrayForInt` contract and its test cases, refer to the [dynamic array](https://github.com/alephium/ralph-example/tree/master/dynamic-array) contracts in the [Ralph Example](https://github.com/alephium/ralph-example) repository.

### Gasless Transactions

In Ralph, we can use the `payGasFee` built-in function to allow a different user or contract to pay either part or all of the gas fees on behalf of the caller. The business logic of who should pay the gas fee is completely programmable.

```rust
Contract Gasless() {
    @using(checkExternalCaller = false)
    pub fn payGas() -> () {
       return
    }

    @using(assetsInContract = true, checkExternalCaller = false)
    pub fn payNoGas() -> () {
       payGasFee!(selfAddress!(), txGasFee!())
       return
    }
}
```

The `payGasFee!` built-in function takes two parameters. The first one is the gas payer address. The second one is the gas fee to be paid. If the gas payer intends to pay the entire gas fee, the gas fee should be set to `txGasFee!()`.

In the `Gasless` contract, when `payGas` function is called in a transaction, the gas fees will be paid by the caller. When `payNoGas` function is called in a transaction, all the gas fees will be paid by the contract itself.

For more details on the `Gasless` contract and its test cases, refer to the [gasless](https://github.com/alephium/ralph-example/tree/master/gasless) contracts in the [Ralph Example](https://github.com/alephium/ralph-example) repository.

### Calling DIA Oracle

Oracles play an important role in the blockchain ecosystem by providing smart contracts with access to real world data. For example, price oracles can provide up-to-date asset prices, which are essential for DeFi applications like lending platforms, derivatives, and stablecoins. Randomness oracles can supply unpredictable values needed for gaming, lotteries, and randomized voting, etc.

Alephium integrates with [DIA](https://www.diadata.org/) to support both price and randomness oracles. This section will demonstrate how to use these oracles in the Ralph smart contracts.

#### Price Oracle

To interact with the DIA price oracle, define an `IDIAPriceOracle` interface with the `getValue` function. This function accepts an `${Asset}/USD` query symbol (e.g., `BTC/USD`) as input and returns a data structure that contains the price with 8 decimal precision and the timestamp of the last update:

```rust
struct DIAOracleValue {
    mut value: U256,
    mut timestamp: U256
  }

Interface IDIAPriceOracle {
  pub fn getValue(key: ByteVec) -> DIAOracleValue
}

Contract PriceFetcher(
  oracle: IDIAPriceOracle,
  mut btcPrice: U256,
  mut ethPrice: U256,
  mut usdcPrice: U256,
  mut alphPrice: U256,
  mut ayinPrice: U256
) {
  @using(updateFields = true, checkExternalCaller = false)
  pub fn update() -> () {
    btcPrice = oracle.getValue(b`BTC/USD`).value
    ethPrice = oracle.getValue(b`ETH/USD`).value
    usdcPrice = oracle.getValue(b`USDC/USD`).value
    alphPrice = oracle.getValue(b`ALPH/USD`).value
    ayinPrice = oracle.getValue(b`AYIN/USD`).value
  }
}
```

In the example above, the `update` function in the `PriceFetcher` contract retrieves and updates the asset prices by calling the `getValue` function from the `IDIAPriceOracle` interface. The following TypeScript code demonstrates how to test the `PriceFetcher` contract on the `testnet`:

```typescript
import { web3, waitForTxConfirmation, contractIdFromAddress, binToHex } from '@alephium/web3'
import { PriceFetcher } from '../artifacts/ts'
import { PrivateKeyWallet } from '@alephium/web3-wallet'

async function test() {
  web3.setCurrentNodeProvider('https://node.testnet.alephium.org')

  const privateKey = process.env.PRIVATE_KEY || (
    () => { throw new Error("PRIVATE_KEY environment variable is not set") }
  )()
  const wallet = new PrivateKeyWallet({ privateKey })

  const oracleContractAddress = '216wgM3Xi5uBFYwwiw2T7iZoCy9vozPJ4XjToW74nQjbV'
  const oracleContractId = binToHex(contractIdFromAddress(oracleContractAddress))
  const deployResult = await PriceFetcher.deploy(wallet, {
     initialFields: {
        oracle: oracleContractId,
        btcPrice: 0n,
        ethPrice: 0n,
        usdcPrice: 0n,
        alphPrice: 0n,
        ayinPrice: 0n
     }
  })
  const priceFetcher = deployResult.contractInstance
  await waitForTxConfirmation(deployResult.txId, 1, 1000)

  const updateResult = await priceFetcher.transact.update({ signer: wallet })
  await waitForTxConfirmation(updateResult.txId, 1, 1000)

  const state = await priceFetcher.fetchState()
  console.log('BTC Price:', state.fields.btcPrice)
  console.log('ETH Price:', state.fields.ethPrice)
  console.log('USDC Price:', state.fields.usdcPrice)
  console.log('ALPH Price:', state.fields.alphPrice)
  console.log('AYIN Price:', state.fields.ayinPrice)
}

test()
```

If we set the `PRIVATE_KEY` environment variable with your testnet wallet's private key, the `test` function will deploy the `PriceFetcher` contract and update the asset prices. The following is an example output of the `test` function:

```typescript
BTC Price: 8425960054567n
ETH Price: 194063943017n
USDC Price: 99992084n
ALPH Price: 33374551n
AYIN Price: 48406126n
```

`216wgM3Xi5uBFYwwiw2T7iZoCy9vozPJ4XjToW74nQjbV` is the address of the DIA price oracle on the `testnet`. Its `mainnet` address is `285zrkZTPpUCpjKg9E3z238VmpUBQEAbESGsJT6yX7Rod`. For more details about the DIA price oracle, including the supported price feeds, please refer to the [DIA price oracle](https://docs.alephium.org/infrastructure/Oracles/#price-oracles) documentation.


#### Randomness Oracle

To interact with the DIA randomness oracle, define an `IDIARandomOracle` interface with the `getLastRound` and `getRandomValue` functions. Round is a unique identifier for a set of published random values managed by the DIA randomness oracle. The `getLastRound` function returns the last round number, and the `getRandomValue` function returns a data structure that contains the randomness value, the BLS signature, and the round number:

```rust
struct DIARandomValue {
    mut randomness: ByteVec,
    mut signature: ByteVec,
    mut round: U256
}

Interface IDIARandomOracle {
    pub fn getLastRound() -> U256
    pub fn getRandomValue(round: U256) -> DIARandomValue
}

Contract RandomnessFetcher(
  oracle: IDIARandomOracle,
  mut randomValue: DIARandomValue
) {
  @using(updateFields = true, checkExternalCaller = false)
  pub fn update() -> () {
    let lastRound = oracle.getLastRound()
    let value = oracle.getRandomValue(lastRound)
    randomValue = value
  }
}
```

In the example above, the `update` function in the `RandomnessFetcher` contract retrieves and updates the randomness value by calling the `getLastRound` and `getRandomValue` functions from the `IDIARandomOracle` interface. The following TypeScript code demonstrates how to test the `RandomnessFetcher` contract on the `testnet`:

```typescript
import { web3, waitForTxConfirmation, contractIdFromAddress, binToHex } from '@alephium/web3'
import { RandomnessFetcher } from '../artifacts/ts'
import { PrivateKeyWallet } from '@alephium/web3-wallet'

async function test() {
  web3.setCurrentNodeProvider('https://node.testnet.alephium.org')

  const privateKey = process.env.PRIVATE_KEY || (
    () => { throw new Error("PRIVATE_KEY environment variable is not set") }
  )()
  const wallet = new PrivateKeyWallet({ privateKey })

  const oracleContractAddress = '217k7FMPgahEQWCfSA1BN5TaxPsFovjPagpujkyxKDvS3'
  const oracleContractId = binToHex(contractIdFromAddress(oracleContractAddress))
  const deployResult = await RandomnessFetcher.deploy(wallet, {
     initialFields: {
        oracle: oracleContractId,
        randomValue: { randomness: "", signature: "", round: 0n }
     }
  })
  const randomnessFetcher = deployResult.contractInstance
  await waitForTxConfirmation(deployResult.txId, 1, 1000)

  const updateResult = await randomnessFetcher.transact.update({ signer: wallet })
  await waitForTxConfirmation(updateResult.txId, 1, 1000)

  const state = await randomnessFetcher.fetchState()
  console.log('randomValue:', state.fields.randomValue)
}

test()
```

If we set the `PRIVATE_KEY` environment variable with your testnet wallet's private key, the test code above will deploy the `RandomnessFetcher` contract and update the randomness value. The following is an example output of the `test` function:

```typescript
randomValue: {
  randomness: 'fc629838e6e727e770f98d2d319fa3abd4c529c948aac579f08b48f57355e9af',
  signature: 'a0b12f0dbc86da43b92e3a44557a3687b88e6087c7dc3ffc5f627b0e7191b8addd15fa919882e29257b06dc5111e1c44176a44ecb39c36fc0c6d4e29cf22604ecc7c873d63c487992f4d82de7478ac34c211a1001ad9eb399d9fe39f24c1df21',
  round: 4888094n
}
```

`217k7FMPgahEQWCfSA1BN5TaxPsFovjPagpujkyxKDvS3` is the address of the DIA randomness oracle on the `testnet`. Its `mainnet` address is `v1v4cBXP9L7M9ryZZCx7tuXuNb9pnDLGb3JJkPBpbR1Z`. For more details about the DIA randomness oracle, please refer to the [DIA randomness oracle](https://docs.alephium.org/infrastructure/Oracles/#randomness-oracles) documentation.

### More Resources

If you want to learn more about smart contract development in Ralph through examples, you might find the following projects helpful:

- [Alephium NFT](https://github.com/alephium/alephium-nft)
- [Alephium DEX](https://github.com/alephium/alephium-dex)
- [Ralph Examples](https://github.com/alephium/ralph-example)
- [Alephium Bridge](https://github.com/alephium/wormhole-fork/tree/add-alephium-to-wormhole/alephium)

