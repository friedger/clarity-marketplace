import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
  Transaction,
} from "@blockstack/clarity";
import { providerWithInitialAllocations } from "./providerWithInitialAllocations";

const addresses = [
  "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
  "S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE",
  "SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR",
];
const alice = addresses[0];
const bob = addresses[1];
const zoe = addresses[2];

class MonsterClient extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.monsters",
      "contracts-simple/monsters.clar",
      provider
    );
  }

  async createMonster(
    name: string,
    image: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "create-monster",
        args: [`"${name}"`, `u${image}`],
      },
    });
    await tx.sign(params.sender);
    const receipt = await this.submitTransaction(tx);
    return receipt;
  }
}

class MarketClient extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.market",
      "contracts-simple/market.clar",
      provider
    );
  }

  async bid(
    id: number,
    price: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "bid",
        args: [`u${id}`, `u${price}`],
      },
    });
    await tx.sign(params.sender);
    const receipt = await this.submitTransaction(tx);
    return receipt;
  }

  async accept(
    id: number,
    bidOwner: string,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "accept",
        args: [`u${id}`, `'${bidOwner}`],
      },
    });
    await tx.sign(params.sender);
    const receipt = await this.submitTransaction(tx);
    return receipt;
  }

  async pay(id: number, params: { sender: string }): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "pay",
        args: [`u${id}`],
      },
    });
    await tx.sign(params.sender);
    const receipt = await this.submitTransaction(tx);
    return receipt;
  }
}

describe("simple monster contract test suite", () => {
  let provider: Provider;
  let monsterClient: MonsterClient;
  let marketClient: MarketClient;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      monsterClient = new MonsterClient(provider);
      marketClient = new MarketClient(provider);
    });

    it("should have a valid syntax", async () => {
      await monsterClient.checkContract();
      await monsterClient.deployContract();
      await marketClient.checkContract();
      await marketClient.deployContract();
    });

    after(async () => {
      await provider.close();
    });
  });

  describe("basic tests", () => {
    beforeEach(async () => {
      ProviderRegistry.registerProvider(
        providerWithInitialAllocations([
          { principal: alice, amount: 10000 },
          { principal: bob, amount: 10000 },
        ])
      );
      provider = await ProviderRegistry.createProvider();
      monsterClient = new MonsterClient(provider);
      marketClient = new MarketClient(provider);
      await monsterClient.deployContract();
      await marketClient.deployContract();

      // create a monster
      // fails due to https://github.com/blockstack/clarity-js-sdk/issues/78
      const result = await monsterClient.createMonster("Black Tiger", 1, {
        sender: alice,
      });
      assert.equal(true, result.success);
    });

    it("should bid, accept successfully but pay for a monster fails", async () => {
      let receipt = await marketClient.bid(1, 100, {
        sender: bob,
      });
      console.log(receipt);
      assert.equal(receipt.success, true);

      receipt = await marketClient.accept(1, bob, {
        sender: alice,
      });
      console.log(receipt);
      assert.equal(receipt.success, true);

      receipt = await marketClient.pay(1, {
        sender: bob,
      });
      console.log(receipt);
      assert.equal(receipt.success, true);
      assert.match(
        receipt.result as any,
        /^Transaction executed and committed. Returned: true/
      );
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
