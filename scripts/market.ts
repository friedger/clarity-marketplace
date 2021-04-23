import {
  makeContractCall,
  uintCV,
  contractPrincipalCV,
  bufferCVFromString,
  makeSTXTokenTransfer,
  standardPrincipalCV,
  stringUtf8CV,
  listCV,
  noneCV,
  tupleCV,
  stringAsciiCV,
  PostConditionMode,
} from "@stacks/transactions";
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
    amount: new BigNum(440000000000000),
    senderKey: testnetKeyMap[ADDR4].secretKey,
    network,
  });

  return handleTransaction(transaction);
}

async function mintNFTs() {
  console.log("mint nfts");
  const boomAddress = "ST314JC8J24YWNVAEJJHQXS5Q4S9DX1FW5Z9DK9NT";
  const boomName = "boom-nfts-v5";
  const transaction = await makeContractCall({
    contractAddress: boomAddress,
    contractName: boomName,
    functionName: "mint-series",
    functionArgs: [
      standardPrincipalCV(contractAddress),
      noneCV(),
      noneCV(),
      stringUtf8CV("OpenIntents"),
      stringAsciiCV("https://avatars.githubusercontent.com/u/311533"),
      stringAsciiCV("image/png"),
      listCV([
        tupleCV({
          name: stringUtf8CV("OpenIntents"),
          number: uintCV(1),
          uri: stringAsciiCV("https://avatars.githubusercontent.com/u/311533"),
          "mime-type": stringAsciiCV("image/png"),
          hash: bufferCVFromString("invalidhash"),
        }),
        tupleCV({
          name: stringUtf8CV("OpenIntents"),
          number: uintCV(2),
          uri: stringAsciiCV("https://avatars.githubusercontent.com/u/311533"),
          "mime-type": stringAsciiCV("image/png"),
          hash: bufferCVFromString("invalidhash"),
        }),
        tupleCV({
          name: stringUtf8CV("OpenIntents"),
          number: uintCV(3),
          uri: stringAsciiCV("https://avatars.githubusercontent.com/u/311533"),
          "mime-type": stringAsciiCV("image/png"),
          hash: bufferCVFromString("invalidhash"),
        }),
      ]),
    ],
    senderKey: secretKey,
    network,
  });

  //const result = await handleTransaction(transaction);
  //console.log(result);
  const transaction2 = await makeContractCall({
    contractAddress: boomAddress,
    contractName: boomName,
    functionName: "transfer",
    functionArgs: [
      uintCV(17),
      standardPrincipalCV(contractAddress),
      standardPrincipalCV("ST314JC8J24YWNVAEJJHQXS5Q4S9DX1FW5Z9DK9NT"),
    ],
    postConditionMode: PostConditionMode.Allow,
    senderKey: secretKey,
    network,
  });
  const result2 = await handleTransaction(transaction2);
  console.log(result2);
}

(async (action: number = 0) => {
  switch (action) {
    case 3:
      await mintNFTs();
      break;
    case 2:
      //await deployContract("nft-trait", "../clarity-smart-contracts/contracts/sips/nft-trait.clar");
      //await deployContract("tradables-trait-ext");
      /*
      await deployContract("boom-nfts-v5", {
        path: "../../../gitlab/riot.ai/boom.money/contracts/boom-nfts.clar",
      });
      */
      break;
    case 1:
      //await faucetCall("ST3SCYQ5V9EFAFNYMZ4WCAK9F1J2SKYD9H9K5SZVT"); // mo
      //await faucetCall("ST383QW2EEKNX2KREZ4YGNZPEZ3BPXJ9RWH8037B"); // blockpac / Peter
      //await faucetCall("ST314JC8J24YWNVAEJJHQXS5Q4S9DX1FW5Z9DK9NT")
      await faucetCall("ST33GW755MQQP6FZ58S423JJ23GBKK5ZKH3MGR55N");
      //await faucetCall("ST2MY1BVKR8W8NF58N2GX6JDZDRT5CXP6RVZ097M4");
      //await faucetCall("ST9SW39M98MZXBGWSDVN228NW1NWENWCF321GWMK");
      //await faucetCall("ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV");
      //await faucetCall("ST1CV2J4FK96CQM2TNMABV5YBF620R175GCVHM192");
      //await faucetCall("ST2NM3E9MAWWRNGFEKW75QR4XXVA856N4MHNMYA3T");
      break;
    default:
      await deployContract("tradables-trait", { suffix: "-v1" });
      await deployContract("tradables-trait-ext");
      await deployContract("market", {
        suffix: "-v1",
        replaceFn: (s) =>
          s.replace(/\.tradables-trait\./g, ".tradables-trait-v1."),
      });
      await deployContract("market", {
        suffix: "ext-v1",
        replaceFn: (s) =>
          s.replace(/\.tradables-trait\./g, ".tradables-trait-ext."),
      });
      await deployContract("monsters", { suffix: "-v1" });
      await deployContract("constant-tradables", {
        suffix: "-v1",
        replaceFn: (s) =>
          s.replace(/\.tradables-trait\./g, ".tradables-trait-v1."),
      });
      break;
  }
})(0);
