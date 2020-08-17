import {
  makeContractDeploy,
  makeContractCall,
  TransactionVersion,
  bufferCV,
  ChainID,
  StacksTestnet,
  broadcastTransaction,
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
const network = new StacksTestnet();
network.coreApiUrl = STACKS_API_URL;

(async () => {
  const contractAddress = keys.stacksAddress;
  const monstersContractName = "monsters";
  const marketContractName = "market";

  const codeBody = fs.readFileSync("./contracts/market.clar").toString();

  const secretKey = keys.secretKey;
  const secretKey2 = keys2.secretKey;

  var transaction = await makeContractDeploy({
    contractName: marketContractName,
    codeBody,
    senderKey: secretKey,
    network,
  });
  console.log("deploy contract");
  var result = await broadcastTransaction(transaction, network);
  console.log(result);

  /*
  const monstersCodeBody = fs
    .readFileSync("./contracts/monsters.clar")
    .toString();
  var transaction = await makeContractDeploy({
    contractName: monstersContractName,
    codeBody: monstersCodeBody,
    senderKey: secretKey,
    network,
  });
  console.log("deploy contract");
  var result = await broadcastTransaction(transaction, network);
  console.log(result);

  await new Promise((r) => setTimeout(r, 10000));

  console.log("create");

  transaction = await makeContractCall({
    contractAddress,
    contractName: monstersContractName,
    functionName: "create",
    functionArgs: [bufferCV(new Buffer("Black Tiger"))],
    senderKey: secretKey,
    network,
  });
  var result = await broadcastTransaction(transaction, network);
  console.log(result);

  console.log("feed monster");
  transaction = await makeContractCall({
    contractAddress,
    contractName: monstersContractName,
    functionName: "feed-monster",
    functionArgs: [],
    senderKey: secretKey2,
    network,
  });

  var result = await broadcastTransaction(transaction, network);
  console.log(result);
  await new Promise((r) => setTimeout(r, 10000));

  var result = await broadcastTransaction(transaction, network);
  console.log(result);
  */
})();
