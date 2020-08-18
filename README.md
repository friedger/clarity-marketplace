# Clarity Marketplace

![marketplace](marketplace.jpg)

Clarity smart contract for a marketplace of tradable assets (some kind of basic NFTs)

(Inspired by the marketplace of monstereos.io)

## Smart Contracts

The main contract `market.clar` describes the marketplaces. `tradables.clar` defines the interface (trait) of a tradable asset. There are two examples of tradable assets:

- `monsters.clar`: a simple tamagoshi like monster that needs to be fed every 6 blocks
- `constant-tradables.clar`: a dump asset that always belongs to the contract and transferring assets won't change ownership.

### Public functions of the marketplace

The marketplace provides two functions for a bidder for a token:

- `bid`: allows to publish a price for a tradable asset that is defined by a contract implementating the `.market.tradables-trait` and by an unsigned integer.
- `pay`: after the bid was accepted by the current owner, the bidder can pay for the asset using this function and the asset will be transferred to the bidder.

The owner of a tradable asset can choose from all current bids:

- `accept`: allows to accept a bid for the tradable asset. The asset will be transferred to the marketplace until the bidder has paid the price.

## Notes

- Testing using the clarity-js-sdk is currently not possible as the latest SDK does not support `contract-of` function.
- Deploying to testnet works (run `npx ts-node scripts/market.ts`), however, due to issue [#92](https://github.com/blockstack/stacks-transactions-js/issues/92) it is not possible to call functions with traits as arguments.
