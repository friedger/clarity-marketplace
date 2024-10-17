import { project, accounts } from "./clarigen-types"; // where your [types.output] was specified
import { projectFactory } from "@clarigen/core";
import { rov, txOk } from "@clarigen/test";
import { boolCV, cvToString, uintCV } from "@stacks/transactions";
import { test, expect } from "vitest";

const deployer = accounts.deployer.address;
const alice = accounts.wallet_1.address;
const bob = accounts.wallet_2.address;
const { monsters, market } = projectFactory(project, "simnet");

test("Basic feeding", async () => {
  let receipt: any = txOk(monsters.createMonster("Black Dragon", 1), alice);
  expect(receipt.result).toBeOk(uintCV(1)); // first nft

  receipt = rov(monsters.isAlive(1), alice);
  expect(receipt.value).toEqual(true);

  // do 144 tenure change
  simnet.mineEmptyBurnBlocks(1440);

  receipt = rov(monsters.isAlive(1), alice);
  expect(receipt.value).toEqual(501n); // monster died
});
