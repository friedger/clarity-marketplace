
import type { TypedAbiArg, TypedAbiFunction, TypedAbiMap, TypedAbiVariable, Response } from '@clarigen/core';

export const contracts = {
  constantTradables: {
  "functions": {
    transfer: {"name":"transfer","access":"public","args":[{"name":"tradable-id","type":"uint128"},{"name":"sender","type":"principal"},{"name":"recipient","type":"principal"}],"outputs":{"type":{"response":{"ok":"bool","error":"none"}}}} as TypedAbiFunction<[tradableId: TypedAbiArg<number | bigint, "tradableId">, sender: TypedAbiArg<string, "sender">, recipient: TypedAbiArg<string, "recipient">], Response<boolean, null>>,
    getOwner: {"name":"get-owner","access":"read_only","args":[{"name":"tradable-id","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"optional":"principal"},"error":"none"}}}} as TypedAbiFunction<[tradableId: TypedAbiArg<number | bigint, "tradableId">], Response<string | null, null>>
  },
  "maps": {
    
  },
  "variables": {
    
  },
  constants: {},
  "non_fungible_tokens": [
    
  ],
  "fungible_tokens":[],"epoch":"Epoch21","clarity_version":"Clarity1",
  contractName: 'constant-tradables',
  },
market: {
  "functions": {
    getOwner: {"name":"get-owner","access":"private","args":[{"name":"tradables","type":"trait_reference"},{"name":"tradable-id","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"optional":"principal"},"error":"uint128"}}}} as TypedAbiFunction<[tradables: TypedAbiArg<string, "tradables">, tradableId: TypedAbiArg<number | bigint, "tradableId">], Response<string | null, bigint>>,
    transferTradableFromEscrow: {"name":"transfer-tradable-from-escrow","access":"private","args":[{"name":"tradables","type":"trait_reference"},{"name":"tradable-id","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[tradables: TypedAbiArg<string, "tradables">, tradableId: TypedAbiArg<number | bigint, "tradableId">], Response<boolean, bigint>>,
    transferTradableToEscrow: {"name":"transfer-tradable-to-escrow","access":"private","args":[{"name":"tradables","type":"trait_reference"},{"name":"tradable-id","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[tradables: TypedAbiArg<string, "tradables">, tradableId: TypedAbiArg<number | bigint, "tradableId">], Response<boolean, bigint>>,
    accept: {"name":"accept","access":"public","args":[{"name":"tradables","type":"trait_reference"},{"name":"tradable-id","type":"uint128"},{"name":"bid-owner","type":"principal"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[tradables: TypedAbiArg<string, "tradables">, tradableId: TypedAbiArg<number | bigint, "tradableId">, bidOwner: TypedAbiArg<string, "bidOwner">], Response<boolean, bigint>>,
    bid: {"name":"bid","access":"public","args":[{"name":"tradables","type":"trait_reference"},{"name":"tradable-id","type":"uint128"},{"name":"price","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[tradables: TypedAbiArg<string, "tradables">, tradableId: TypedAbiArg<number | bigint, "tradableId">, price: TypedAbiArg<number | bigint, "price">], Response<boolean, bigint>>,
    cancel: {"name":"cancel","access":"public","args":[{"name":"tradables","type":"trait_reference"},{"name":"tradable-id","type":"uint128"},{"name":"bid-owner","type":"principal"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[tradables: TypedAbiArg<string, "tradables">, tradableId: TypedAbiArg<number | bigint, "tradableId">, bidOwner: TypedAbiArg<string, "bidOwner">], Response<boolean, bigint>>,
    offerTradable: {"name":"offer-tradable","access":"public","args":[{"name":"tradables","type":"trait_reference"},{"name":"tradable-id","type":"uint128"},{"name":"price","type":"uint128"},{"name":"duration","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[tradables: TypedAbiArg<string, "tradables">, tradableId: TypedAbiArg<number | bigint, "tradableId">, price: TypedAbiArg<number | bigint, "price">, duration: TypedAbiArg<number | bigint, "duration">], Response<boolean, bigint>>,
    pay: {"name":"pay","access":"public","args":[{"name":"tradables","type":"trait_reference"},{"name":"tradable-id","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[tradables: TypedAbiArg<string, "tradables">, tradableId: TypedAbiArg<number | bigint, "tradableId">], Response<boolean, bigint>>
  },
  "maps": {
    acceptingOwners: {"name":"accepting-owners","key":{"tuple":[{"name":"tradable-id","type":"uint128"},{"name":"tradables","type":"principal"}]},"value":{"tuple":[{"name":"owner","type":"principal"}]}} as TypedAbiMap<{
  "tradableId": number | bigint;
  "tradables": string;
}, {
  "owner": string;
}>,
    offers: {"name":"offers","key":{"tuple":[{"name":"bid-owner","type":"principal"},{"name":"owner","type":"principal"},{"name":"tradable-id","type":"uint128"},{"name":"tradables","type":"principal"}]},"value":{"tuple":[{"name":"price","type":"uint128"}]}} as TypedAbiMap<{
  "bidOwner": string;
  "owner": string;
  "tradableId": number | bigint;
  "tradables": string;
}, {
  "price": bigint;
}>,
    onSale: {"name":"on-sale","key":{"tuple":[{"name":"owner","type":"principal"},{"name":"tradable-id","type":"uint128"},{"name":"tradables","type":"principal"}]},"value":{"tuple":[{"name":"duration","type":"uint128"},{"name":"price","type":"uint128"}]}} as TypedAbiMap<{
  "owner": string;
  "tradableId": number | bigint;
  "tradables": string;
}, {
  "duration": bigint;
  "price": bigint;
}>
  },
  "variables": {
    errDuplicateEntry: {
  name: 'err-duplicate-entry',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    errInvalidOfferKey: {
  name: 'err-invalid-offer-key',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    errNotAllowed: {
  name: 'err-not-allowed',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    errPaymentFailed: {
  name: 'err-payment-failed',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    errTradableNotFound: {
  name: 'err-tradable-not-found',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    errTransferFailed: {
  name: 'err-transfer-failed',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>
  },
  constants: {
  errDuplicateEntry: 5n,
  errInvalidOfferKey: 1n,
  errNotAllowed: 4n,
  errPaymentFailed: 2n,
  errTradableNotFound: 6n,
  errTransferFailed: 3n
},
  "non_fungible_tokens": [
    
  ],
  "fungible_tokens":[],"epoch":"Epoch21","clarity_version":"Clarity1",
  contractName: 'market',
  },
monsters: {
  "functions": {
    errNftMint: {"name":"err-nft-mint","access":"private","args":[{"name":"code","type":"uint128"}],"outputs":{"type":{"response":{"ok":"none","error":"uint128"}}}} as TypedAbiFunction<[code: TypedAbiArg<number | bigint, "code">], Response<null, bigint>>,
    errNftTransfer: {"name":"err-nft-transfer","access":"private","args":[{"name":"code","type":"uint128"}],"outputs":{"type":{"response":{"ok":"none","error":"uint128"}}}} as TypedAbiFunction<[code: TypedAbiArg<number | bigint, "code">], Response<null, bigint>>,
    getTime: {"name":"get-time","access":"private","args":[],"outputs":{"type":"uint128"}} as TypedAbiFunction<[], bigint>,
    isLastMealYoung: {"name":"is-last-meal-young","access":"private","args":[{"name":"last-meal","type":"uint128"}],"outputs":{"type":"bool"}} as TypedAbiFunction<[lastMeal: TypedAbiArg<number | bigint, "lastMeal">], boolean>,
    createMonster: {"name":"create-monster","access":"public","args":[{"name":"name","type":{"string-ascii":{"length":20}}},{"name":"image","type":"uint128"}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[name: TypedAbiArg<string, "name">, image: TypedAbiArg<number | bigint, "image">], Response<bigint, bigint>>,
    distributePrize: {"name":"distribute-prize","access":"public","args":[{"name":"tenure","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[tenure: TypedAbiArg<number | bigint, "tenure">], Response<boolean, bigint>>,
    distributePrizes: {"name":"distribute-prizes","access":"public","args":[{"name":"tenures","type":{"list":{"type":"uint128","length":200}}}],"outputs":{"type":{"response":{"ok":{"list":{"type":{"response":{"ok":"bool","error":"uint128"}},"length":200}},"error":"none"}}}} as TypedAbiFunction<[tenures: TypedAbiArg<number | bigint[], "tenures">], Response<Response<boolean, bigint>[], null>>,
    feedMonster: {"name":"feed-monster","access":"public","args":[{"name":"monster-id","type":"uint128"}],"outputs":{"type":{"response":{"ok":"uint128","error":"uint128"}}}} as TypedAbiFunction<[monsterId: TypedAbiArg<number | bigint, "monsterId">], Response<bigint, bigint>>,
    transfer: {"name":"transfer","access":"public","args":[{"name":"monster-id","type":"uint128"},{"name":"sender","type":"principal"},{"name":"recipient","type":"principal"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[monsterId: TypedAbiArg<number | bigint, "monsterId">, sender: TypedAbiArg<string, "sender">, recipient: TypedAbiArg<string, "recipient">], Response<boolean, bigint>>,
    use: {"name":"use","access":"public","args":[{"name":"monster-id","type":"uint128"},{"name":"tool","type":{"optional":"trait_reference"}}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[monsterId: TypedAbiArg<number | bigint, "monsterId">, tool: TypedAbiArg<string | null, "tool">], Response<boolean, bigint>>,
    getLastTokenId: {"name":"get-last-token-id","access":"read_only","args":[],"outputs":{"type":{"response":{"ok":"uint128","error":"none"}}}} as TypedAbiFunction<[], Response<bigint, null>>,
    getMetaData: {"name":"get-meta-data","access":"read_only","args":[{"name":"monster-id","type":"uint128"}],"outputs":{"type":{"optional":{"tuple":[{"name":"date-of-birth","type":"uint128"},{"name":"image","type":"uint128"},{"name":"last-meal","type":"uint128"},{"name":"name","type":{"string-ascii":{"length":20}}}]}}}} as TypedAbiFunction<[monsterId: TypedAbiArg<number | bigint, "monsterId">], {
  "dateOfBirth": bigint;
  "image": bigint;
  "lastMeal": bigint;
  "name": string;
} | null>,
    getOwner: {"name":"get-owner","access":"read_only","args":[{"name":"monster-id","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"optional":"principal"},"error":"none"}}}} as TypedAbiFunction<[monsterId: TypedAbiArg<number | bigint, "monsterId">], Response<string | null, null>>,
    getTokenUri: {"name":"get-token-uri","access":"read_only","args":[{"name":"monster-id","type":"uint128"}],"outputs":{"type":{"response":{"ok":{"optional":"none"},"error":"none"}}}} as TypedAbiFunction<[monsterId: TypedAbiArg<number | bigint, "monsterId">], Response<null | null, null>>,
    getWinner: {"name":"get-winner","access":"read_only","args":[{"name":"tenure","type":"uint128"}],"outputs":{"type":{"optional":{"tuple":[{"name":"count","type":"uint128"},{"name":"monster-id","type":"uint128"}]}}}} as TypedAbiFunction<[tenure: TypedAbiArg<number | bigint, "tenure">], {
  "count": bigint;
  "monsterId": bigint;
} | null>,
    isAlive: {"name":"is-alive","access":"read_only","args":[{"name":"monster-id","type":"uint128"}],"outputs":{"type":{"response":{"ok":"bool","error":"uint128"}}}} as TypedAbiFunction<[monsterId: TypedAbiArg<number | bigint, "monsterId">], Response<boolean, bigint>>
  },
  "maps": {
    monsterActions: {"name":"monster-actions","key":{"tuple":[{"name":"monster-id","type":"uint128"},{"name":"tenure","type":"uint128"}]},"value":{"list":{"type":{"tuple":[{"name":"block","type":"uint128"},{"name":"tool","type":"principal"}]},"length":200}}} as TypedAbiMap<{
  "monsterId": number | bigint;
  "tenure": number | bigint;
}, {
  "block": bigint;
  "tool": string;
}[]>,
    monsters: {"name":"monsters","key":"uint128","value":{"tuple":[{"name":"date-of-birth","type":"uint128"},{"name":"image","type":"uint128"},{"name":"last-meal","type":"uint128"},{"name":"name","type":{"string-ascii":{"length":20}}}]}} as TypedAbiMap<number | bigint, {
  "dateOfBirth": bigint;
  "image": bigint;
  "lastMeal": bigint;
  "name": string;
}>,
    secondBests: {"name":"second-bests","key":"uint128","value":{"tuple":[{"name":"count","type":"uint128"},{"name":"monster-id","type":"uint128"}]}} as TypedAbiMap<number | bigint, {
  "count": bigint;
  "monsterId": bigint;
}>,
    winners: {"name":"winners","key":"uint128","value":{"tuple":[{"name":"count","type":"uint128"},{"name":"monster-id","type":"uint128"}]}} as TypedAbiMap<number | bigint, {
  "count": bigint;
  "monsterId": bigint;
}>
  },
  "variables": {
    errMonsterDied: {
  name: 'err-monster-died',
  type: {
    response: {
      ok: 'none',
      error: 'uint128'
    }
  },
  access: 'constant'
} as TypedAbiVariable<Response<null, bigint>>,
    errMonsterExists: {
  name: 'err-monster-exists',
  type: {
    response: {
      ok: 'none',
      error: 'uint128'
    }
  },
  access: 'constant'
} as TypedAbiVariable<Response<null, bigint>>,
    errMonsterUnborn: {
  name: 'err-monster-unborn',
  type: {
    response: {
      ok: 'none',
      error: 'uint128'
    }
  },
  access: 'constant'
} as TypedAbiVariable<Response<null, bigint>>,
    errNoPrize: {
  name: 'err-no-prize',
  type: {
    response: {
      ok: 'none',
      error: 'uint128'
    }
  },
  access: 'constant'
} as TypedAbiVariable<Response<null, bigint>>,
    errNotOwner: {
  name: 'err-not-owner',
  type: {
    response: {
      ok: 'none',
      error: 'uint128'
    }
  },
  access: 'constant'
} as TypedAbiVariable<Response<null, bigint>>,
    errSenderEqualsRecipient: {
  name: 'err-sender-equals-recipient',
  type: {
    response: {
      ok: 'none',
      error: 'uint128'
    }
  },
  access: 'constant'
} as TypedAbiVariable<Response<null, bigint>>,
    errTooEarly: {
  name: 'err-too-early',
  type: {
    response: {
      ok: 'none',
      error: 'uint128'
    }
  },
  access: 'constant'
} as TypedAbiVariable<Response<null, bigint>>,
    errTooManyTools: {
  name: 'err-too-many-tools',
  type: {
    response: {
      ok: 'none',
      error: 'uint128'
    }
  },
  access: 'constant'
} as TypedAbiVariable<Response<null, bigint>>,
    errTransferNotAllowed: {
  name: 'err-transfer-not-allowed',
  type: {
    response: {
      ok: 'none',
      error: 'uint128'
    }
  },
  access: 'constant'
} as TypedAbiVariable<Response<null, bigint>>,
    hungerTolerance: {
  name: 'hunger-tolerance',
  type: 'uint128',
  access: 'constant'
} as TypedAbiVariable<bigint>,
    noMonster: {
  name: 'no-monster',
  type: {
    tuple: [
      {
        name: 'count',
        type: 'uint128'
      },
      {
        name: 'monster-id',
        type: 'uint128'
      }
    ]
  },
  access: 'constant'
} as TypedAbiVariable<{
  "count": bigint;
  "monsterId": bigint;
}>,
    nextId: {
  name: 'next-id',
  type: 'uint128',
  access: 'variable'
} as TypedAbiVariable<bigint>
  },
  constants: {
  errMonsterDied: {
    isOk: false,
    value: 501n
  },
  errMonsterExists: {
    isOk: false,
    value: 409n
  },
  errMonsterUnborn: {
    isOk: false,
    value: 404n
  },
  errNoPrize: {
    isOk: false,
    value: 504n
  },
  errNotOwner: {
    isOk: false,
    value: 503n
  },
  errSenderEqualsRecipient: {
    isOk: false,
    value: 405n
  },
  errTooEarly: {
    isOk: false,
    value: 505n
  },
  errTooManyTools: {
    isOk: false,
    value: 502n
  },
  errTransferNotAllowed: {
    isOk: false,
    value: 401n
  },
  hungerTolerance: 86_400n,
  nextId: 1n,
  noMonster: {
    count: 0n,
    monsterId: 0n
  }
},
  "non_fungible_tokens": [
    {"name":"nft-monsters","type":"uint128"}
  ],
  "fungible_tokens":[],"epoch":"Epoch30","clarity_version":"Clarity3",
  contractName: 'monsters',
  },
tradablesTrait: {
  "functions": {
    
  },
  "maps": {
    
  },
  "variables": {
    
  },
  constants: {},
  "non_fungible_tokens": [
    
  ],
  "fungible_tokens":[],"epoch":"Epoch21","clarity_version":"Clarity1",
  contractName: 'tradables-trait',
  }
} as const;

export const accounts = {"deployer":{"address":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM","balance":"100000000000000"},"faucet":{"address":"STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6","balance":"100000000000000"},"wallet_1":{"address":"ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5","balance":"100000000000000"},"wallet_2":{"address":"ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG","balance":"100000000000000"},"wallet_3":{"address":"ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC","balance":"100000000000000"},"wallet_4":{"address":"ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND","balance":"100000000000000"},"wallet_5":{"address":"ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB","balance":"100000000000000"},"wallet_6":{"address":"ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0","balance":"100000000000000"},"wallet_7":{"address":"ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ","balance":"100000000000000"},"wallet_8":{"address":"ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP","balance":"100000000000000"}} as const;

export const identifiers = {"constantTradables":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.constant-tradables","market":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.market","monsters":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.monsters","tradablesTrait":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tradables-trait"} as const

export const simnet = {
  accounts,
  contracts,
  identifiers,
} as const;


export const deployments = {"constantTradables":{"devnet":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.constant-tradables","simnet":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.constant-tradables","testnet":"ST3FFRX7C911PZP5RHE148YDVDD9JWVS6FZRA60VS.constant-tradables","mainnet":null},"market":{"devnet":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.market","simnet":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.market","testnet":"ST3FFRX7C911PZP5RHE148YDVDD9JWVS6FZRA60VS.market","mainnet":null},"monsters":{"devnet":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.monsters","simnet":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.monsters","testnet":"ST3FFRX7C911PZP5RHE148YDVDD9JWVS6FZRA60VS.monsters","mainnet":null},"tradablesTrait":{"devnet":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tradables-trait","simnet":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tradables-trait","testnet":"ST3FFRX7C911PZP5RHE148YDVDD9JWVS6FZRA60VS.tradables-trait","mainnet":null}} as const;

export const project = {
  contracts,
  deployments,
} as const;
  