/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Grant, GrantInterface } from "../Grant";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ERC20TransferFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "unlockTime",
        type: "uint256",
      },
    ],
    name: "GrantRevokeWindowMissed",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimedOrRevoked",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Grant.GrantStruct",
        name: "grant",
        type: "tuple",
      },
    ],
    name: "GrantRevokedOrClaimed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "NoGrant",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimedOrRevoked",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Grant.GrantStruct",
        name: "grant",
        type: "tuple",
      },
    ],
    name: "RecipientHasOpenGrant",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimedOrRevoked",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Grant.GrantStruct",
        name: "grant",
        type: "tuple",
      },
    ],
    name: "GrantClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unlockTime",
        type: "uint256",
      },
    ],
    name: "GrantDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimedOrRevoked",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Grant.GrantStruct",
        name: "grant",
        type: "tuple",
      },
    ],
    name: "GrantRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "checkGrantAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "checkGrantClaimedOrRevoked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "checkGrantUnlockTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "unlockTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "grants",
    outputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "unlockTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "claimedOrRevoked",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506113b7806100606000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c806366e6af341161005b57806366e6af34146100c857806374a8f103146100e657806390d2507414610102578063b869cea31461011e5761007d565b8063325ec42714610082578063369755a8146100a05780634e71d92d146100be575b600080fd5b61008a610151565b6040516100979190610e85565b60405180910390f35b6100a86101a8565b6040516100b59190610eb9565b60405180910390f35b6100c66101f2565b005b6100d0610653565b6040516100dd9190610eb9565b60405180910390f35b61010060048036038101906100fb9190610f37565b61069d565b005b61011c60048036038101906101179190610f90565b610a58565b005b61013860048036038101906101339190610f37565b610e0d565b6040516101489493929190611006565b60405180910390f35b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160009054906101000a900460ff16905090565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010154905090565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001015442811115610278576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161026f906110a8565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff16600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff160361034b57336040517f2ea9439b00000000000000000000000000000000000000000000000000000000815260040161034291906110c8565b60405180910390fd5b60011515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160009054906101000a900460ff1615150361042157600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040517f5ab6fe870000000000000000000000000000000000000000000000000000000081526004016104189190611225565b60405180910390fd5b60018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160006101000a81548160ff0219169083151502179055506000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3033600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301546040518463ffffffff1660e01b815260040161055e93929190611240565b6020604051808303816000875af115801561057d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105a191906112a3565b9050806105da576040517ff27f64e400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f139910bf3a9f1eae08ef214c818f8045f511540fe77d950590fefe53a6e4bec5600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040516106479190611225565b60405180910390a15050565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060030154905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461072b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107229061131c565b60405180910390fd5b42600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010154116107f357600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101546040517f54f54a1f0000000000000000000000000000000000000000000000000000000081526004016107ea9190610eb9565b60405180910390fd5b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3033600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600301546040518463ffffffff1660e01b81526004016108d693929190611240565b6020604051808303816000875af11580156108f5573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061091991906112a3565b905080610952576040517ff27f64e400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201600090556002820160006101000a81549060ff0219169055600382016000905550507f18120b83faa6be79a9b6bba6b85497068599603449ca92f802e6e65f975e2ffe600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020604051610a4c9190611225565b60405180910390a15050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610ae6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610add9061131c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff16600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610bf757600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040517f1381baca000000000000000000000000000000000000000000000000000000008152600401610bee9190611225565b60405180910390fd5b60008473ffffffffffffffffffffffffffffffffffffffff166323b872dd60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1630856040518463ffffffff1660e01b8152600401610c5693929190611240565b6020604051808303816000875af1158015610c75573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c9991906112a3565b905080610cd2576040517ff27f64e400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405180608001604052808673ffffffffffffffffffffffffffffffffffffffff16815260200185815260200160001515815260200183815250600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020160006101000a81548160ff021916908315150217905550606082015181600301559050507fa6546870cb3b076483069eacdc3bbcc16360712a0c055605d56d998c974db12885848487604051610dfe949392919061133c565b60405180910390a15050505050565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020160009054906101000a900460ff16908060030154905084565b60008115159050919050565b610e7f81610e6a565b82525050565b6000602082019050610e9a6000830184610e76565b92915050565b6000819050919050565b610eb381610ea0565b82525050565b6000602082019050610ece6000830184610eaa565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610f0482610ed9565b9050919050565b610f1481610ef9565b8114610f1f57600080fd5b50565b600081359050610f3181610f0b565b92915050565b600060208284031215610f4d57610f4c610ed4565b5b6000610f5b84828501610f22565b91505092915050565b610f6d81610ea0565b8114610f7857600080fd5b50565b600081359050610f8a81610f64565b92915050565b60008060008060808587031215610faa57610fa9610ed4565b5b6000610fb887828801610f22565b9450506020610fc987828801610f7b565b9350506040610fda87828801610f22565b9250506060610feb87828801610f7b565b91505092959194509250565b61100081610ef9565b82525050565b600060808201905061101b6000830187610ff7565b6110286020830186610eaa565b6110356040830185610e76565b6110426060830184610eaa565b95945050505050565b600082825260208201905092915050565b7f53686f707320636c6f7365642c20636f6d65206261636b20736f6f6e202e2e2e600082015250565b600061109260208361104b565b915061109d8261105c565b602082019050919050565b600060208201905081810360008301526110c181611085565b9050919050565b60006020820190506110dd6000830184610ff7565b92915050565b60008160001c9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061112361111e836110e3565b6110f0565b9050919050565b61113381610ef9565b82525050565b6000819050919050565b6000611156611151836110e3565b611139565b9050919050565b61116681610ea0565b82525050565b600060ff82169050919050565b600061118c611187836110e3565b61116c565b9050919050565b61119c81610e6a565b82525050565b6080820160008083015490506111b781611110565b6111c4600086018261112a565b50600183015490506111d581611143565b6111e2602086018261115d565b50600283015490506111f381611179565b6112006040860182611193565b506003830154905061121181611143565b61121e606086018261115d565b5050505050565b600060808201905061123a60008301846111a2565b92915050565b60006060820190506112556000830186610ff7565b6112626020830185610ff7565b61126f6040830184610eaa565b949350505050565b61128081610e6a565b811461128b57600080fd5b50565b60008151905061129d81611277565b92915050565b6000602082840312156112b9576112b8610ed4565b5b60006112c78482850161128e565b91505092915050565b7f596f7520646f6e74206f776e206d652e00000000000000000000000000000000600082015250565b600061130660108361104b565b9150611311826112d0565b602082019050919050565b60006020820190508181036000830152611335816112f9565b9050919050565b60006080820190506113516000830187610ff7565b61135e6020830186610ff7565b61136b6040830185610eaa565b6113786060830184610eaa565b9594505050505056fea2646970667358221220ddb38308449f81504102cb58e75230bac7aafd0c4cdaf65fbd4b3c605397fa8f64736f6c634300080e0033";

type GrantConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GrantConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Grant__factory extends ContractFactory {
  constructor(...args: GrantConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Grant> {
    return super.deploy(overrides || {}) as Promise<Grant>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Grant {
    return super.attach(address) as Grant;
  }
  override connect(signer: Signer): Grant__factory {
    return super.connect(signer) as Grant__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GrantInterface {
    return new utils.Interface(_abi) as GrantInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Grant {
    return new Contract(address, _abi, signerOrProvider) as Grant;
  }
}
