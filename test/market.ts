import { assert } from "chai";
import {
  Provider,
  ProviderRegistry,
  Client,
  Receipt,
  Transaction,
} from "@blockstack/clarity";

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
      "S1G2081040G2081040G2081040G208105NK8PE5.monster",
      "contracts/monsters.clar",
      provider
    );
  }

  async createMonster(
    name: string,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: {
        name: "create-monster",
        args: [`"${name}"`],
      },
    });
    await tx.sign(params.sender);
    const receipt = await this.submitTransaction(tx);
    return receipt;
  }
}

class TradablesClient extends Client {
  constructor(provider: Provider) {
    super(
      "S1G2081040G2081040G2081040G208105NK8PE5.tradables",
      "contracts/tradables.clar",
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
}

describe("monster contract test suite", () => {
  let provider: Provider;
  let monsterClient: MonsterClient;
  let marketClient: MarketClient;
  let constTradableClient: ConstantTradableClient;
  let tradablesClient: TradablesClient;

  describe("syntax tests", () => {
    before(async () => {
      provider = await ProviderRegistry.createProvider();
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
      provider = await ProviderRegistry.createProvider();
      tradablesClient = new TradablesClient(provider);
      monsterClient = new MonsterClient(provider);
      marketClient = new MarketClient(provider);
      constTradableClient = new ConstantTradableClient(provider);
      await tradablesClient.deployContract();
      await marketClient.deployContract();
      await monsterClient.deployContract();
      await constTradableClient.deployContract();
    });

    it("should bid for a tradable", async () => {
      const receipt = await marketClient.bid(constTradableClient.name, 1, 100, {
        sender: alice,
      });
      console.log(receipt);
      assert.equal(receipt.success, true);
    });

    afterEach(async () => {
      await provider.close();
    });
  });
});
