# Clarity Marketplace

![marketplace](marketplace.jpg)

Clarity smart contract for a marketplace of tradable assets (some kind of basic NFTs)

(Inspired by the marketplace of monstereos.io)

This is a submission to the CLARITY HACK of the Stacks 2.0 Hackathon Series.

## Smart Contracts

The main contract `market.clar` describes the marketplaces. `tradables.clar` defines the interface (`trait`) of tradable assets. There are two examples of tradable assets:

- `monsters.clar`: a simple tamagoshi like monster that needs to be fed every 6 blocks
- `constant-tradables.clar`: a dump asset that always belongs to the contract and transferring assets won't change ownership.

The marketplace supports all assets that have are NFTs with uint keys.

### Public functions of the marketplace

The marketplace provides two functions for a bidder for a token:

- `bid`: allows to publish a price for a tradable asset that is defined by a contract implementating the `tradables-trait` and by an unsigned integer.
- `pay`: after the bid was accepted by the current owner, the bidder can pay for the asset using this function and the asset will be transferred to the bidder.

The owner of a tradable asset can choose to accept a bid from all current bids:

- `accept`: allows to accept a bid for the tradable asset. The asset will be transferred to the marketplace until the bidder has paid the price.
- `cancel`: allows to cancel an accepted bid that was not yet paid, e.g. because the bidder disappeared

### Used features of Clarity

The marketplace contract uses

- a map to store offers.
- the contract as an escrow for transferring assets.
- `traits` to handle any kind of tradables assets. It makes use of `contract-of` to store the contract of the assets.
- stx transfers and nft transfers within contract calls that benefit from the post condition feature of the stacks chain.

## Notes

- Testing using the clarity-js-sdk is currently not possible as the latest SDK (0.2.0) does not support `contract-of` function. (Workaround: copy the most recent binary `clarity-cli` to the `node_modules/@blockstack/clarity-native-bin/.native-bin` folder of this project)
- Deploying to testnet works (run `npx ts-node scripts/market.ts`), however, due to issue [#92](https://github.com/blockstack/stacks-transactions-js/issues/92) it is not possible to call functions with traits as arguments.

### Simplified Marketplace

As a consequence, a simplified marketplace is defined in folder `contract-simple`. The marketplace can only
trade monsters (defined in `monsters.clar`). The functions are the same, the difference is that traits are not used.

To test the simple contract, run `yarn mocha test/market-simple.ts`.
While it is possible to initialize the VM with accounts with set amounts of STX, the current SDK does not support this feature. Therefore, the test does not include sucessful calls to the `pay` function.

## Deployment

There is a script in folder `scripts` called `market.ts` that can be used to deploy the contracts to the testnet. Replace the location of the keychain.json file ontop of the script. Then run

```
npx ts-node scripts/market.ts
```

## Future Work

After the issues mentioned in Notes have been solved the following tasks should be done:

- build a web ui for making and accepting bids
- run a server that maintains the list of current bids for assets. The list is not maintained on-chain because the list can be easily recreated from the history of relevant transactions.
