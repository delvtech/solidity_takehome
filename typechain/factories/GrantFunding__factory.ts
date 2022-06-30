/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { GrantFunding } from "../GrantFunding";

export class GrantFunding__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _tokenAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<GrantFunding> {
    return super.deploy(
      _tokenAddress,
      overrides || {}
    ) as Promise<GrantFunding>;
  }
  getDeployTransaction(
    _tokenAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_tokenAddress, overrides || {});
  }
  attach(address: string): GrantFunding {
    return super.attach(address) as GrantFunding;
  }
  connect(signer: Signer): GrantFunding__factory {
    return super.connect(signer) as GrantFunding__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GrantFunding {
    return new Contract(address, _abi, signerOrProvider) as GrantFunding;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receipent",
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
        name: "timeClaimed",
        type: "uint256",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receipent",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timeLock",
        type: "uint256",
      },
    ],
    name: "GrantFunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receipent",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "GrantRemoved",
    type: "event",
  },
  {
    inputs: [],
    name: "claimGrant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_unlockTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_receipent",
        type: "address",
      },
    ],
    name: "createNewGrant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receipient",
        type: "address",
      },
    ],
    name: "removeGrant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "showGrant",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "fundWithdrawn",
            type: "bool",
          },
        ],
        internalType: "struct GrantFunding.Grant",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610f36380380610f36833981810160405281019061003291906100d7565b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160008190555050610149565b6000815190506100d181610132565b92915050565b6000602082840312156100e957600080fd5b60006100f7848285016100c2565b91505092915050565b600061010b82610112565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b61013b81610100565b811461014657600080fd5b50565b610dde806101586000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063267406cb14610051578063472bf5721461006d5780635d22e77c14610089578063966d238e14610093575b600080fd5b61006b600480360381019061006691906108c7565b6100c3565b005b61008760048036038101906100829190610919565b61024a565b005b61009161048e565b005b6100ad60048036038101906100a891906108c7565b6107dd565b6040516100ba9190610c26565b60405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461011d57600080fd5b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090504281600101541180156101885750600015158160020160009054906101000a900460ff161515145b1561024657600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008082016000905560018201600090556002820160006101000a81549060ff021916905550508173ffffffffffffffffffffffffffffffffffffffff167fc4b39d18939287d676fb4c3dcb2b62612ab38a518eaea1d858b3b237bf2bee93826000015460405161023d9190610c41565b60405180910390a25b5050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102a457600080fd5b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330876040518463ffffffff1660e01b815260040161030593929190610b26565b602060405180830381600087803b15801561031f57600080fd5b505af1158015610333573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061035791906108f0565b905080610399576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161039090610be6565b60405180910390fd5b604051806060016040528085815260200142856103b69190610c96565b815260200160001515815250600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082015181600001556020820151816001015560408201518160020160006101000a81548160ff0219169083151502179055509050508173ffffffffffffffffffffffffffffffffffffffff167fbc4989bcd46803ad72d5672d4c28d5d4b9a73ebb418251d8d266b5eece4087348585604051610480929190610c5c565b60405180910390a250505050565b600260005414156104d4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104cb90610c06565b60405180910390fd5b60026000819055506000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900460ff161515151581525050905060008160000151116105a0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161059790610ba6565b60405180910390fd5b806020015142116105e6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105dd90610bc6565b60405180910390fd5b80604001511561062b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161062290610b86565b60405180910390fd5b6001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160006101000a81548160ff0219169083151502179055506000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb3384600001516040518363ffffffff1660e01b81526004016106e9929190610b5d565b602060405180830381600087803b15801561070357600080fd5b505af1158015610717573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061073b91906108f0565b90508061077d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161077490610be6565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff167f9e51079e6127c518bb0ff506bad3c402e184f363f50a0cac61d05e186738f13a8360000151426040516107c9929190610c5c565b60405180910390a250506001600081905550565b6107e5610865565b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900460ff1615151515815250509050919050565b604051806060016040528060008152602001600081526020016000151581525090565b60008135905061089781610d63565b92915050565b6000815190506108ac81610d7a565b92915050565b6000813590506108c181610d91565b92915050565b6000602082840312156108d957600080fd5b60006108e784828501610888565b91505092915050565b60006020828403121561090257600080fd5b60006109108482850161089d565b91505092915050565b60008060006060848603121561092e57600080fd5b600061093c868287016108b2565b935050602061094d868287016108b2565b925050604061095e86828701610888565b9150509250925092565b61097181610cec565b82525050565b61098081610cfe565b82525050565b6000610993601c83610c85565b91507f4772616e742068617320616c726561647920626520636c61696d6564000000006000830152602082019050919050565b60006109d3601a83610c85565b91507f596f752068617665206e6f206772616e7420746f20636c61696d0000000000006000830152602082019050919050565b6000610a13601583610c85565b91507f54696d65206c6f636b206e6f74206578706972656400000000000000000000006000830152602082019050919050565b6000610a53600f83610c85565b91507f7472616e73666572206661696c656400000000000000000000000000000000006000830152602082019050919050565b6000610a93601f83610c85565b91507f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006000830152602082019050919050565b606082016000820151610adc6000850182610b08565b506020820151610aef6020850182610b08565b506040820151610b026040850182610977565b50505050565b610b1181610d2a565b82525050565b610b2081610d2a565b82525050565b6000606082019050610b3b6000830186610968565b610b486020830185610968565b610b556040830184610b17565b949350505050565b6000604082019050610b726000830185610968565b610b7f6020830184610b17565b9392505050565b60006020820190508181036000830152610b9f81610986565b9050919050565b60006020820190508181036000830152610bbf816109c6565b9050919050565b60006020820190508181036000830152610bdf81610a06565b9050919050565b60006020820190508181036000830152610bff81610a46565b9050919050565b60006020820190508181036000830152610c1f81610a86565b9050919050565b6000606082019050610c3b6000830184610ac6565b92915050565b6000602082019050610c566000830184610b17565b92915050565b6000604082019050610c716000830185610b17565b610c7e6020830184610b17565b9392505050565b600082825260208201905092915050565b6000610ca182610d2a565b9150610cac83610d2a565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610ce157610ce0610d34565b5b828201905092915050565b6000610cf782610d0a565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b610d6c81610cec565b8114610d7757600080fd5b50565b610d8381610cfe565b8114610d8e57600080fd5b50565b610d9a81610d2a565b8114610da557600080fd5b5056fea2646970667358221220db36614c1d7416e7cfba8b1bce9d84be6cd776db1a04070958bd02c81932bf5364736f6c63430008000033";