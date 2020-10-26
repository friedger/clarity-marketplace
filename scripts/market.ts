import {
  makeContractCall,
  uintCV,
  contractPrincipalCV,
  bufferCVFromString,
  makeSTXTokenTransfer,
} from "@blockstack/stacks-transactions";
import {
  contractAddress,
  secretKey,
  network,
  handleTransaction,
  secretKey2,
  deployContract,
} from "./deploy";
import { ADDR1, ADDR2, ADDR3, ADDR4, testnetKeyMap } from "./mocknet";
const BigNum = require("bn.js");

//
/// Contract calls
//
async function createMonster(monsterName: string) {
  console.log("create monster");

  const transaction = await makeContractCall({
    contractAddress,
    contractName: "monsters",
    functionName: "create-monster",
    functionArgs: [bufferCVFromString(monsterName)],
    senderKey: secretKey,
    network,
  });

  return handleTransaction(transaction);
}

async function feedMonster(monsterId: number) {
  console.log("feed monster");
  const transaction = await makeContractCall({
    contractAddress,
    contractName: "monsters",
    functionName: "feed-monster",
    functionArgs: [uintCV(monsterId)],
    senderKey: secretKey2,
    network,
  });

  return handleTransaction(transaction);
}

async function bid(trait: string, monsterId: number, price: number) {
  console.log("bid for tradable");
  const transaction = await makeContractCall({
    contractAddress,
    contractName: "market",
    functionName: "bid",
    functionArgs: [
      contractPrincipalCV(contractAddress, trait),
      uintCV(monsterId),
      uintCV(price),
    ],
    senderKey: secretKey2,
    network,
  });

  return handleTransaction(transaction);
}

async function faucetCall(recipient: string) {
  console.log("init wallet");
  const transaction = await makeSTXTokenTransfer({
    recipient,
    amount: new BigNum(93333903125000),
    senderKey: testnetKeyMap[ADDR4].secretKey,
    network,
  });

  return handleTransaction(transaction);
}

(async (action: number = 0) => {
  switch (action) {
    case 1:
      faucetCall("ST3K71ZXNT2J3YBY6CTW01VVY1PZ1EDB3G1KBW314");
      break;
    default:
      await deployContract("tradables");
      await deployContract("market");
      await deployContract("monsters");
      await deployContract("constant-tradables");

      /*
      await deployContract("monsters");
      await deployContract("market");
      */

      // uncomment once #92 is fixed
      // await bid("constant-tradables", 1, 100);

      //await createMonster("Black Tiger");
      //await feedMonster(1);
      // await bid("monsters", 1, 100);
      break;
  }
})(0);
