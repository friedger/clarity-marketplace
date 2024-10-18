import { projectFactory } from "@clarigen/core";
import { txOk } from "@clarigen/test";
import { boolCV, uintCV } from "@stacks/transactions";
import { expect, test } from "vitest";
import { accounts, project } from "./clarigen-types"; // where your [types.output] was specified

const deployer = accounts.deployer.address;
const alice = accounts.wallet_1.address;
const { monsters } = projectFactory(project, "simnet");

test("test mega tool", async () => {
  let receipt: any = txOk(monsters.createMonster("Black Dragon", 1), alice);
  expect(receipt.result).toBeOk(uintCV(1)); // first nft

  receipt = txOk(monsters.use(1, `${deployer}.tool-read-100`), alice);
  expect(receipt.result).toBeOk(boolCV(true));
});
