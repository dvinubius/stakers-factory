# Project for Ethereum Speed Run Challenge 1

## ๐คฉ [Try on Rinkeby](https://dvinubius-stakers-factory.surge.sh/)

![stakers_factory](https://user-images.githubusercontent.com/32189942/156658272-074e43f5-86f4-4de3-baf9-4fecf7d5304e.png)


## scaffold-eth
- Unlike the starter code in the scaffold-eth-challenges repo, this one is based on a recent **Scaffold Eth master** (10 dec 2021)
## factory
- this app offers more than the core staker contract functionality
- users can **create custom staker contracts** and interact with them
## core staking functionality
- It is possible to withdraw for others because the challenge required it, but I personally wouldn't allow it in production (see contract comments for why). 
- There is a countdown timer which only updates on new blocks. Time left until deadline is only read from contract and depends on current block. UX not optimal this way.
  - => if you try this locally keep in mind that new blocks are only mined if necessary. You can use the faucet to produce new blocks.

---

# ๐ Scaffold-ETH

> everything you need to build on Ethereum! ๐

๐งช Quickly experiment with Solidity using a frontend that adapts to your smart contract:

![image](https://user-images.githubusercontent.com/2653167/124158108-c14ca380-da56-11eb-967e-69cde37ca8eb.png)


# ๐โโ๏ธ Quick Start

### Manual setup

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork ๐ scaffold-eth:

```bash
git clone https://github.com/scaffold-eth/scaffold-eth.git
```

> install and start your ๐ทโ Hardhat chain:

```bash
cd scaffold-eth
yarn install
yarn chain
```

> in a second terminal window, start your ๐ฑ frontend:

```bash
cd scaffold-eth
yarn start
```

> in a third terminal window, ๐ฐ deploy your contract:

```bash
cd scaffold-eth
yarn deploy
```

๐ You need an RPC key for production deployments/Apps, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js`

๐ Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

๐ Edit your frontend `App.jsx` in `packages/react-app/src`

๐ผ Edit your deployment scripts in `packages/hardhat/deploy`

๐ฑ Open http://localhost:3000 to see the app

### Automated with Gitpod

To deploy this project to Gitpod, click this button:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#github.com/scaffold-eth/scaffold-eth)

# ๐ Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# ๐ญ Learning Solidity

๐ Read the docs: https://docs.soliditylang.org

๐ Go through each topic from [solidity by example](https://solidity-by-example.org) editing `YourContract.sol` in **๐ scaffold-eth**

- [Primitive Data Types](https://solidity-by-example.org/primitives/)
- [Mappings](https://solidity-by-example.org/mapping/)
- [Structs](https://solidity-by-example.org/structs/)
- [Modifiers](https://solidity-by-example.org/function-modifier/)
- [Events](https://solidity-by-example.org/events/)
- [Inheritance](https://solidity-by-example.org/inheritance/)
- [Payable](https://solidity-by-example.org/payable/)
- [Fallback](https://solidity-by-example.org/fallback/)

๐ง Learn the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)

# ๐? Buidl

Check out all the [active branches](https://github.com/austintgriffith/scaffold-eth/branches/active), [open issues](https://github.com/austintgriffith/scaffold-eth/issues), and join/fund the ๐ฐ [BuidlGuidl](https://BuidlGuidl.com)!

  
 - ๐ค  [Follow the full Ethereum Speed Run](https://medium.com/@austin_48503/%EF%B8%8Fethereum-dev-speed-run-bd72bcba6a4c)


 - ๐  [Create your first NFT](https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example)
 - ๐ฅฉ  [Build a staking smart contract](https://github.com/austintgriffith/scaffold-eth/tree/challenge-1-decentralized-staking)
 - ๐ต  [Deploy a token and vendor](https://github.com/austintgriffith/scaffold-eth/tree/challenge-2-token-vendor)
 - ๐ซ  [Extend the NFT example to make a "buyer mints" marketplace](https://github.com/austintgriffith/scaffold-eth/tree/buyer-mints-nft)
 - ๐ฒ  [Learn about commit/reveal](https://github.com/austintgriffith/scaffold-eth/tree/commit-reveal-with-frontend)
 - โ๏ธ  [Learn how ecrecover works](https://github.com/austintgriffith/scaffold-eth/tree/signature-recover)
 - ๐ฉโ๐ฉโ๐งโ๐ง  [Build a multi-sig that uses off-chain signatures](https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig)
 - โณ  [Extend the multi-sig to stream ETH](https://github.com/austintgriffith/scaffold-eth/tree/streaming-meta-multi-sig)
 - โ๏ธ  [Learn how a simple DEX works](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90)
 - ๐ฆ  [Ape into learning!](https://github.com/austintgriffith/scaffold-eth/tree/aave-ape)

# ๐ฌ Support Chat

Join the telegram [support chat ๐ฌ](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with ๐ scaffold-eth!

---

๐ Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
