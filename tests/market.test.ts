import { project, accounts } from "./clarigen-types"; // where your [types.output] was specified
import { projectFactory } from "@clarigen/core";
import { rov, txOk } from "@clarigen/test";
import { boolCV, uintCV } from "@stacks/transactions";
import { test, expect } from "vitest";

const deployer = accounts.deployer.address;
const alice = accounts.wallet_1.address;
const bob = accounts.wallet_2.address;
const { monsters, market } = projectFactory(project, "simnet");

test("Basic test", async () => {
  let receipt = txOk(monsters.createMonster("Black Dragon", 1), alice);
  expect(receipt.result).toBeOk(uintCV(1)); // first nft

  receipt = txOk(
    market.bid(deployer + "." + monsters.contractName, 1, 100000),
    bob
  );
  expect(receipt.result).toBeOk(boolCV(true));

  receipt = txOk(
    market.accept(deployer + "." + monsters.contractName, 1, bob),
    alice
  );
  expect(receipt.result).toBeOk(boolCV(true));
});
