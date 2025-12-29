# tCroilet Token (tTP)

This project contains the smart contract for tCroilet (tTP), a test token for the Cronos network.

## Overview

tCroilet (tTP) is an ERC20 token with a total supply of 330,000 tokens and 18 decimals. It is designed for testing purposes on the Cronos testnet before deploying to mainnet.

## Features

- Standard ERC20 functionality
- Minting capability (owner only)
- Burning capability (any token holder)
- BurnFrom capability (with approval)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your private key and Cronoscan API key

## Deployment

### Testnet

```
npm run deploy:testnet
```

### Mainnet

```
npm run deploy:mainnet
```

## Verification

After deployment, you can verify the contract on Cronoscan:

```
npm run verify:testnet -- <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

For example:

```
npm run verify:testnet -- 0x1234567890123456789012345678901234567890 "0xYourDeployerAddress"
```

## Testing

Run the test suite:

```
npm test
```

## License

MIT