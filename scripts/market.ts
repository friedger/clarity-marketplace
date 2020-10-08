import {
  makeContractDeploy,
  makeContractCall,
  bufferCV,
  StacksTestnet,
  broadcastTransaction,
  uintCV,
  contractPrincipalCV,
  TxBroadcastResultRejected,
  TxBroadcastResultOk,
  StacksTransaction,
  bufferCVFromString,
  makeSTXTokenTransfer,
} from "@blockstack/stacks-transactions";
const fetch = require("node-fetch");
const BigNum = require("bn.js");
import * as fs from "fs";
import { ADDR1, ADDR2, testnetKeyMap } from "./mocknet";

const local = true;
const mocknet = true;
const noSidecar = false;

const STACKS_CORE_API_URL = local
  ? "http://localhost:3999"
  : "http://testnet-master.blockstack.org:20443";
const STACKS_API_URL = local
  ? "http://localhost:3999"
  : "https://stacks-node-api.blockstack.org";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_CORE_API_URL;

const keys1 = JSON.parse(fs.readFileSync("keys.json").toString());
const keys2 = JSON.parse(fs.readFileSync("keys2.json").toString());

// private keys of users
const secretKey1 = keys1.secretKey;
const secretKey2 = keys2.secretKey;

/* Replace with your private key for testnet deployment */

const keys = mocknet
  ? testnetKeyMap[ADDR1]
  : JSON.parse(
      fs
        .readFileSync("../../blockstack/stacks-blockchain/keychain.json")
        .toString()
    ).paymentKeyInfo;

const secretKey = mocknet ? keys.secretKey : keys.privateKey;
const contractAddress = mocknet ? keys.address : keys.address.STACKS;

//
// utils functions
//
async function handleTransaction(transaction: StacksTransaction) {
  const result = await broadcastTransaction(transaction, network);
  console.log(result);
  if ((result as TxBroadcastResultRejected).error) {
    if (
      (result as TxBroadcastResultRejected).reason === "ContractAlreadyExists"
    ) {
      console.log("already deployed");
      return "" as TxBroadcastResultOk;
    } else {
      throw new Error(
        `failed to handle transaction ${transaction.txid()}: ${JSON.stringify(
          result
        )}`
      );
    }
  }
  const processed = await processing(result as TxBroadcastResultOk);
  if (!processed) {
    throw new Error(
      `failed to process transaction ${transaction.txid}: transaction not found`
    );
  }
  console.log(processed, result);
  return result as TxBroadcastResultOk;
}

async function deployContract(contractName: string) {
  const codeBody = fs
    .readFileSync(`./contracts/${contractName}.clar`)
    .toString();
  var transaction = await makeContractDeploy({
    contractName,
    codeBody: codeBody,
    senderKey: secretKey,
    network,
  });
  console.log(`deploy contract ${contractName}`);
  return handleTransaction(transaction);
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processing(tx: String, count: number = 0): Promise<boolean> {
  return noSidecar
    ? processingWithoutSidecar(tx, count)
    : processingWithSidecar(tx, count);
}

async function processingWithoutSidecar(
  tx: String,
  count: number = 0
): Promise<boolean> {
  await timeout(10000);
  return true;
}

async function processingWithSidecar(
  tx: String,
  count: number = 0
): Promise<boolean> {
  const url = `${STACKS_API_URL}/extended/v1/tx/${tx}`;
  var result = await fetch(url);
  var value = await result.json();
  console.log(count);
  if (value.tx_status === "success") {
    console.log(`transaction ${tx} processed`);
    console.log(value);
    return true;
  }
  if (value.tx_status === "pending") {
    console.log(value);
  } else if (count === 10) {
    console.log(value);
  }

  if (count > 30) {
    console.log("failed after 30 trials");
    console.log(value);
    return false;
  }

  if (mocknet) {
    await timeout(5000);
  } else {
    await timeout(50000);
  }
  return processing(tx, count + 1);
}

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

async function sendSTXTokens() {
  console.log("init wallet");
  const transaction = await makeSTXTokenTransfer({
    recipient: "ST25GX7MJA4FGEYYH5E7EBW30BYA4VG4VC1XETXXZ",
    amount: new BigNum(1000000),
    senderKey: testnetKeyMap[ADDR2].secretKey,
    network,
  });

  return handleTransaction(transaction);
}

(async () => {
  /*
  if (!mocknet) {
    await sendSTXTokens();
  }
*/

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
})();
