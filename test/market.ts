import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
  Result,
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
      "contracts/monsters.clar",
      provider
    );
  }

  async createMonster(
    name: string,
    image: string,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "create-monster",
        args: [`"${name}"`, `u102`],
      },
    });
    await tx.sign(params.sender);
    const receipt = await this.submitTransaction(tx);
    return receipt;
  }
}

class TradablesExtClient extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.tradables-trait-ext",
      "contracts/tradables-trait-ext.clar",
      provider
    );
  }
}

class TradablesClient extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.tradables-trait",
      "contracts/tradables-trait.clar",
      provider
    );
  }
}
class ConstantTradableClient extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.constant-tradables",
      "contracts/constant-tradables.clar",
      provider
    );
  }
}

class MarketClient extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.market",
      "contracts/market.clar",
      provider
    );
  }

  async bid(
    contractName: string,
    id: number,
    price: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "bid",
        args: [`'${contractName}`, `u${id}`, `u${price}`],
      },
    });
    await tx.sign(params.sender);
    const receipt = await this.submitTransaction(tx);
    return receipt;
  }

  async accept(
    contractName: string,
    id: number,
    bidOwner: string,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "accept",
        args: [`'${contractName}`, `u${id}`, `'${bidOwner}`],
      },
    });
    await tx.sign(params.sender);
    const receipt = await this.submitTransaction(tx);
    return receipt;
  }

  async pay(
    contractName: string,
    id: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "pay",
        args: [`'${contractName}`, `u${id}`],
      },
    });
    await tx.sign(params.sender);
    const receipt = await this.submitTransaction(tx);
    return receipt;
  }
}

describe("market contract test suite", () => {
  let provider: Provider;
  let monsterClient: MonsterClient;
  let marketClient: MarketClient;
  let constTradableClient: ConstantTradableClient;
  let tradablesClient: TradablesClient;
  let TradablesExtClient: TradablesExtClient;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
      await new Client(
        "ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.nft-trait",
        "../../clarity-smart-contracts/contracts/sips/nft-trait.clar",
        provider
      ).deployContract();

      tradablesClient = new TradablesClient(provider);
      monsterClient = new MonsterClient(provider);
      marketClient = new MarketClient(provider);
      constTradableClient = new ConstantTradableClient(provider);
    });

    it("should have a valid syntax", async () => {
      await tradablesClient.checkContract();
      await tradablesClient.deployContract();
      await marketClient.checkContract();
      await marketClient.deployContract();
      await monsterClient.checkContract();
      await monsterClient.deployContract();
      await constTradableClient.checkContract();
      await constTradableClient.deployContract();
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
      await new Client(
        "ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.nft-trait",
        "../../clarity-smart-contracts/contracts/sips/nft-trait.clar",
        provider
      ).deployContract();

      tradablesClient = new TradablesClient(provider);
      monsterClient = new MonsterClient(provider);
      marketClient = new MarketClient(provider);
      constTradableClient = new ConstantTradableClient(provider);
      await tradablesClient.deployContract();
      await marketClient.deployContract();
      await monsterClient.deployContract();
      await constTradableClient.deployContract();
      const result = await monsterClient.createMonster("Black Tiger", "1", {
        sender: alice,
      }); // monster with id == 1
      console.log(result);
      assert.equal(result.success, true);
    });

    it("should bid, accept successfully but pay for a monster fails", async () => {
      let receipt = await marketClient.bid(monsterClient.name, 1, 100, {
        sender: bob,
      });
      console.log(receipt);
      assert.equal(receipt.success, true);

      receipt = await marketClient.accept(monsterClient.name, 1, bob, {
        sender: alice,
      });
      console.log(receipt);
      assert.equal(receipt.success, true);

      receipt = await marketClient.pay(monsterClient.name, 1, {
        sender: bob,
      });
      console.log(receipt);
      assert.equal(receipt.success, true);
      assert.match(
        Result.unwrap(receipt),
        /^Transaction executed and committed. Returned: true/
      );
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
