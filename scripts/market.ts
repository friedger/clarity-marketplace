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
} from "@blockstack/stacks-transactions";
const fetch = require("node-fetch");
const BigNum = require("bn.js");
import * as fs from "fs";

const STACKS_API_URL = "http://localhost:20443"; // "http://testnet-master.blockstack.org:20443";
const SIDECAR_API_URL = "https://sidecar.staging.blockstack.xyz";
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

/* Replace with your private key for testnet deployment
const keys = JSON.parse(
  fs.readFileSync("../../blockstack/stacks-blockchain/keychain.json").toString()
).paymentKeyInfo;

const secretKey = keys.privateKey;
const contractAddress = keys.address.STACKS;
*/

const keys1 = JSON.parse(fs.readFileSync("keys.json").toString());
const keys2 = JSON.parse(fs.readFileSync("keys2.json").toString());

// private keys of contract deployer
const secretKey = keys1.secretKey;
const contractAddress = keys1.stacksAddress;

// private keys of users
const secretKey1 = keys1.secretKey;
const secretKey2 = keys2.secretKey;

//
// utils functions
//
async function handleTransaction(transaction: StacksTransaction) {
  const result = await broadcastTransaction(transaction, network);
  if ((result as TxBroadcastResultRejected).error) {
    if (
      (result as TxBroadcastResultRejected).reason === "ContractAlreadyExists"
    ) {
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
  return processingWithoutSidecar(tx, count);
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
  var result = await fetch(
    `${SIDECAR_API_URL}/sidecar/v1/tx/${tx.substr(1, tx.length - 2)}`
  );
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

  await timeout(50000);
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
    functionArgs: [bufferCV(new Buffer(monsterName))],
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

(async () => {
  await deployContract("tradables");
  await deployContract("market");
  await deployContract("monsters");
  await deployContract("constant-tradables");

  // uncomment once #92 is fixed
  // await bid("constant-tradables", 1, 100);

  await createMonster("Black Tiger");
  await feedMonster(1);
  // await bid("monsters", 1, 100);
})();
