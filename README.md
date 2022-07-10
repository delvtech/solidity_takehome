# Element Takehome Solidity Test

This trial project is designed to test basic and intermediate solidity knowledge. In this folder we have pre-initialized a development and testing environment called [hardhat](https://hardhat.org/) and created an example test. Please fork this repo, download a local copy, and develop a set of solutions to the problems. Please do not make your forked repo or solutions public. We look forward to learning more about your skills!

## Tasks

The following tasks test solidity fluency and fluency with the solidity testing. They do not need to be completed in order and it is possible to be a successful candidate without completing all of them, please address them in whatever way you think demonstrates your best work.

### Beginner Tasks

The following are designed to be solvable by all candidates.

1) We have created a basic ERC20 contract (contracts/ERC20.sol) and a partially complete test file for it (tests/ERC20.ts) which currently only tests the `transfer` functionality. Please add more tests to this file to increase the coverage level. Some examples of functions which may need more testing are `transferFrom` and `approve`.
2) Please create a grant funding contract which allows the account which deployed it to: <- Added Grant.sol for grant file (eucliss)
    1) Create new grants which transfer a variable amount of ERC20 tokens into the contract and store the amount and recipient with an unlock timestamp.
    2) Allows the funder to remove a grant before it unlocks for collection by the recipient. 
    3) Allows the recipient to claim a grant after the unlock timestamp and transfer the funds out of the contract.
3) Please create a testing file and test the smart contract you wrote. <- Added tests to grant.ts (eucliss)
    * Hint - we have added a convenience method `increaseBlockTimestamp` which fast forwards the block timestamp for the locally deployed test ethereum network.

### Intermediate tasks

The following are intermediate tasks and are optional for candidates for Junior roles.

1) Please review ‘contracts/Market.sol’ for security vulnerabilities and write a small amount of text explaining any you find.  <- Adding comments in sol file (eucliss)
2) Please design a new feature or set of features for the grant contract which extend on the functionality of the contract. This is intentionally open ended, creative and ux improving features will be highly appreciated. <- Added lucky swap feature, swaps grant with last person to approve a grant swap (eucliss)


## Build and Testing

Please note that we want to see your coding ability, and not your ability to solve weird deployment installation or environment configuration problems for this reason if you encounter any problems unrelated to your code please reach out to your point of contact for support.

### 1. Getting Started (Prerequisites)

- [Install npm](https://nodejs.org/en/download/)

### 2. Setup

```
git clone https://github.com/element-fi/solidity_takehome.git
```

```
cd solidity_takehome
npm install
```

### 3. Build

```
npm run build
```

### 4. Test

```
npm run test
```
