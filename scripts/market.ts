import {
  makeContractDeploy,
  makeContractCall,
  TransactionVersion,
  bufferCV,
  ChainID,
  StacksTestnet,
  broadcastTransaction,
  uintCV,
  contractPrincipalCV,
} from "@blockstack/stacks-transactions";
const BigNum = require("bn.js");
import * as fs from "fs";

const STACKS_API_URL = "http://localhost:20443";

const keys = JSON.parse(
  fs.readFileSync("../clarity-smart-contracts/keys.json").toString()
);
const keys2 = JSON.parse(
  fs.readFileSync("../clarity-smart-contracts/keys2.json").toString()
);
const secretKey = keys.secretKey;
const secretKey2 = keys2.secretKey;
const contractAddress = keys.stacksAddress;

const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

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
  console.log("deploy contract");
  var result = await broadcastTransaction(transaction, network);
  console.log(result);

  await new Promise((r) => setTimeout(r, 10000));
}

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
  var result = await broadcastTransaction(transaction, network);
  console.log(result);
  await new Promise((r) => setTimeout(r, 10000));
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

  var result = await broadcastTransaction(transaction, network);
  console.log(result);
  await new Promise((r) => setTimeout(r, 10000));
}

async function bid(trait: string, monsterId: number, price: number) {
  console.log("bid for tradable");
  const transaction = await makeContractCall({
    contractAddress,
    contractName: "market",
    functionName: "bid",
    functionArgs: [
      contractPrincipalCV(contractAddress, trait), // should be something like traitCV(...)
      uintCV(monsterId),
      uintCV(price),
    ],
    senderKey: secretKey2,
    network,
  });

  var result = await broadcastTransaction(transaction, network);
  console.log(result);
  await new Promise((r) => setTimeout(r, 10000));
}

(async () => {
  await deployContract("tradables");
  await deployContract("market");
  await deployContract("monsters");
  await deployContract("constant-tradables");

  await bid("constant-tradables", 1, 100);

  await createMonster("Black Tiger");
  await feedMonster(1);
  await bid("monsters", 1, 100);
})();