import { StacksTestnet } from "@stacks/network";
import {
  sponsorTransaction,
  BufferReader,
  deserializeTransaction,
  broadcastTransaction,
  StacksPrivateKey,
  makeRandomPrivKey,
  getAddressFromPrivateKey,
  TransactionVersion,
  callReadOnlyFunction,
  intCV,
  cvToString,
} from "@stacks/transactions";
import { network } from "./deploy";

(async () => {
  const result = await callReadOnlyFunction({
    contractAddress: "ST1G5PB3RC00XB96J3WD343E85ZGT8KF2NPEB6XEX",
    contractName: "hello-world",
    functionName: "echo-number",
    functionArgs: [intCV("42")],
    network: network,
    senderAddress: "ST9SW39M98MZXBGWSDVN228NW1NWENWCF321GWMK",
  });
  console.log(cvToString(result));
})();

/*
const users = [];
let privateKey: StacksPrivateKey;
let address: string;
for (let index = 0; index < 5000; index++) {
  privateKey = makeRandomPrivKey();
  address = getAddressFromPrivateKey(
    privateKey.data,
    TransactionVersion.Testnet
  );
  if (index % 100 === 0) {
  }
  users.push(address);
}
console.log(`(list '${users.join(" '")})`);
*/
