import { project, accounts } from "./clarigen-types"; // where your [types.output] was specified
import { projectFactory } from "@clarigen/core";
import { rov, txOk, filterEvents } from "@clarigen/test";
import { boolCV, cvToString, uintCV } from "@stacks/transactions";
import { test, expect } from "vitest";
import { CoreNodeEventType, cvToValue } from "@clarigen/core";

const deployer = accounts.deployer.address;
const alice = accounts.wallet_1.address;
const bob = accounts.wallet_2.address;
const { monsters, market } = projectFactory(project, "simnet");

test("Basic competition", async () => {
  let receipt: any = txOk(monsters.createMonster("Black Dragon", 1), alice);
  expect(receipt.result).toBeOk(uintCV(1)); // first nft

  receipt = txOk(monsters.createMonster("Glowing Worm", 1), bob);
  expect(receipt.result).toBeOk(uintCV(2)); // first nft

  receipt = txOk(monsters.use(1, null), alice);
  expect(receipt.result).toBeOk(boolCV(true));

  receipt = txOk(monsters.use(2, null), bob);
  expect(receipt.result).toBeOk(boolCV(true));

  // do 1 tenure change
  simnet.mineEmptyBurnBlock();
  // transfer bob's monster to alice
  receipt = txOk(monsters.distributePrize(simnet.burnBlockHeight - 1), alice);
  expect(receipt.result).toBeOk(boolCV(true));
  expect(
    filterEvents(receipt.events, CoreNodeEventType.NftTransferEvent)[0].data
      .value
  ).toBeUint(2);
});

test("Verify prize", async () => {
  let receipt: any = txOk(monsters.createMonster("Black Dragon", 1), alice);
  expect(receipt.result).toBeOk(uintCV(1)); // first nft

  receipt = txOk(monsters.createMonster("Glowing Worm", 1), bob);
  expect(receipt.result).toBeOk(uintCV(2)); // first nft

  receipt = txOk(monsters.use(1, null), alice);
  expect(receipt.result).toBeOk(boolCV(true));

  receipt = txOk(monsters.use(1, null), alice);
  expect(receipt.result).toBeOk(boolCV(true));

  receipt = txOk(monsters.use(2, null), bob);
  expect(receipt.result).toBeOk(boolCV(true));

  // do 1 tenure change
  simnet.mineEmptyBurnBlock();
  // transfer bob's monster to alice
  receipt = txOk(monsters.distributePrize(simnet.burnBlockHeight - 1), alice);
  expect(receipt.result).toBeOk(boolCV(true));
  expect(
    filterEvents(receipt.events, CoreNodeEventType.NftTransferEvent)[0].data
      .value
  ).toBeUint(2);
});

test("Verify prize after overtaking", async () => {
  let receipt: any = txOk(monsters.createMonster("Black Dragon", 1), alice);
  expect(receipt.result).toBeOk(uintCV(1)); // first nft

  receipt = txOk(monsters.createMonster("Glowing Worm", 1), bob);
  expect(receipt.result).toBeOk(uintCV(2)); // first nft

  receipt = txOk(monsters.use(1, null), alice);
  expect(receipt.result).toBeOk(boolCV(true));

  receipt = txOk(monsters.use(1, null), alice);
  expect(receipt.result).toBeOk(boolCV(true));

  receipt = txOk(monsters.use(2, null), bob);
  expect(receipt.result).toBeOk(boolCV(true));

  receipt = txOk(monsters.use(2, null), bob);
  expect(receipt.result).toBeOk(boolCV(true));

  receipt = txOk(monsters.use(2, null), bob);
  expect(receipt.result).toBeOk(boolCV(true));

  // do 1 tenure change
  simnet.mineEmptyBurnBlock();
  // transfer alice's monster to bob
  receipt = txOk(monsters.distributePrize(simnet.burnBlockHeight - 1), alice);
  expect(receipt.result).toBeOk(boolCV(true));
  expect(
    filterEvents(receipt.events, CoreNodeEventType.NftTransferEvent)[0].data
      .value
  ).toBeUint(1);
});
