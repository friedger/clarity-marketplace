import { projectFactory } from "@clarigen/core";
import { rov, txOk } from "@clarigen/test";
import { uintCV } from "@stacks/transactions";
import { expect, test } from "vitest";
import { accounts, project } from "./clarigen-types"; // where your [types.output] was specified

const alice = accounts.wallet_1.address;
const { monsters } = projectFactory(project, "simnet");

test("Not feeding", async () => {
  let receipt: any = txOk(monsters.createMonster("Black Dragon", 1), alice);
  expect(receipt.result).toBeOk(uintCV(1)); // first nft

  receipt = rov(monsters.isAlive(1), alice);
  expect(receipt.value).toEqual(true);

  // do 1440 tenure change
  simnet.mineEmptyBurnBlocks(1440);

  receipt = rov(monsters.isAlive(1), alice);
  expect(receipt.value).toEqual(501n); // monster died
});

test("Basic feeding", async () => {
  let receipt: any = txOk(monsters.createMonster("Black Dragon", 1), alice);
  expect(receipt.result).toBeOk(uintCV(1)); // first nft

  receipt = rov(monsters.isAlive(1), alice);
  expect(receipt.value).toEqual(true);

  const metaData = rov(monsters.getMetaData(1))!!;
  expect(metaData.dateOfBirth).toEqual(metaData.lastMeal);
  // do 100 tenure change
  simnet.mineEmptyBurnBlocks(100);

  receipt = txOk(monsters.feedMonster(1), alice);

  const newMetaData = rov(monsters.getMetaData(1))!!;
  expect(newMetaData.dateOfBirth).toEqual(metaData.dateOfBirth);
  expect(newMetaData.dateOfBirth).toBeLessThan(newMetaData.lastMeal);
});
