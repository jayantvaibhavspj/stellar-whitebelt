# Stellar White Belt Submission 🌟

This project is a complete Stellar Testnet dApp built for the White Belt challenge. It lets users connect a Freighter wallet, view their XLM balance, and send XLM transactions with clear success or failure feedback.

## Overview

Level 1 – White Belt focuses on the fundamentals of Stellar development:

- Wallet setup and connection
- Displaying wallet balances
- Sending a real XLM transaction on Stellar Testnet
- Showing transaction feedback to the user

This repository is prepared as a submission-ready project with a polished UI, working wallet integration, and clear local setup instructions.

## Features

- Connect and disconnect a Freighter wallet
- Fetch and display the connected wallet’s native XLM balance
- Send XLM to any Stellar Testnet address
- Show transaction success/failure state and transaction hash
- Provide a direct link to inspect the transaction on Stellar Expert

## Tech Stack

- React + Vite
- @stellar/stellar-sdk
- @stellar/freighter-api
- Stellar Testnet (Horizon)

## Requirements Covered

- Wallet Setup: Uses the Freighter wallet on Stellar Testnet
- Wallet Connection: Supports connect and disconnect actions
- Balance Handling: Displays the connected wallet’s XLM balance clearly
- Transaction Flow: Sends a real testnet transaction and shows feedback
- Development Standards: Includes UI, wallet integration, balance fetch, transaction logic, and error handling

## Setup Instructions

### Prerequisites

- Node.js 18+
- Freighter Wallet browser extension
- Git

### Installation

```bash
git clone https://github.com/apnavlogzone-prog/White-Belt-Submission.git
cd White-Belt-Submission
npm install
npm run dev
```

Open your browser at http://localhost:5173

### Freighter Wallet Setup

1. Install Freighter from https://freighter.app
2. Create or import a wallet
3. Switch the wallet network to Testnet
4. Fund your wallet using the Stellar Testnet Friendbot or faucet

## How to Use

1. Connect your Freighter wallet
2. Confirm the wallet is on Testnet
3. View the XLM balance in the UI
4. Enter a recipient address and amount
5. Submit the transaction and review the result

## Screenshots

### Wallet Connected + Balance Displayed
![Wallet connected state](./screenshots/wallet-connected.png)

### Successful Transaction
![Successful transaction](./screenshots/transaction-success.png)

## Submission Notes

Repository for submission:
https://github.com/apnavlogzone-prog/White-Belt-Submission

Built for the Stellar White Belt challenge.
