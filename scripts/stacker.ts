import {
  addressFromPublicKeys,
  broadcastTransaction,
  bufferCV,
  callReadOnlyFunction,
  createStacksPublicKey,
  cvToJSON,
  getAddressFromPrivateKey,
  makeContractCall,
  pubKeyfromPrivKey,
  publicKeyToAddress,
  publicKeyToString,
  TransactionVersion,
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import {
  AccountsApi,
  Configuration,
  InfoApi,
  TransactionsApi,
} from "@stacks/blockchain-api-client";
import { network, STACKS_API_URL, secretKey } from "./deploy";
import { fetch } from "cross-fetch";
import { c32addressDecode } from "c32check";
import * as fs from "fs";

const apiConfig = new Configuration({
  basePath: STACKS_API_URL,
  fetchApi: fetch,
});

const transactionsApi = new TransactionsApi(apiConfig);
const infoApi = new InfoApi(apiConfig);
const accountsApi = new AccountsApi(apiConfig);

const senderKey = JSON.parse(
  fs.readFileSync("../../blockstack/stacks-blockchain/keychain.json").toString()
).privateKey;

const minerStxAddress = getAddressFromPrivateKey(
  senderKey,
  TransactionVersion.Testnet
);
// derive bitcoin address from Stacks account and convert into required format
const hashbytes = bufferCV(
  Buffer.from(c32addressDecode(minerStxAddress)[1], "hex")
);
const version = bufferCV(Buffer.from("00", "hex"));

async function stack() {
  const poxInfo = await infoApi.getPoxInfo();
  const info = await infoApi.getCoreApiInfo();
  const [contractAddress, contractName] = poxInfo.contract_id.split(".");
  const balance = await accountsApi.getAccountStxBalance({
    principal: minerStxAddress,
  });

  console.log({ balance });

  const txOptions = {
    contractAddress,
    contractName,
    functionName: "stack-stx",
    functionArgs: [
      uintCV(93000000000000),
      tupleCV({
        hashbytes,
        version,
      }),
      uintCV(info.burn_block_height + 1),
      uintCV(10),
    ],
    senderKey,
    validateWithAbi: true,
    network,
  };

  const transaction = await makeContractCall(txOptions);
  const contractCall = await broadcastTransaction(transaction, network);

  // this will return a new transaction ID
  console.log(contractCall);
}

async function stackInfo() {
  const poxInfo = await infoApi.getPoxInfo();
  const [contractAddress, contractName] = poxInfo.contract_id.split(".");

  const result = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: "is-pox-active",
    functionArgs: [uintCV(111)],
    senderAddress: contractAddress,
    network,
  });
  console.log(cvToJSON(result));
  return result;
}
(async () =>
  //await stack()
  await stackInfo())();
