# Payment Manager Dapp

## Overview

The Payment Manager Dapp is a decentralized application designed to manage and process restaurant bills using Ethereum smart contracts. This React-based application interacts with an Ethereum smart contract to allow users to generate, pay, and check the status of bills.

## Features

- **Connect MetaMask Wallet**: Connects to the Ethereum wallet to interact with the smart contract.
- **Generate Bill**: Allows users to generate a bill with a specified amount and tip.
- **Pay Bill**: Enables users to pay a specific bill by providing the bill ID and amount.
- **Check Bill Status**: Provides the current status of a bill (paid or pending).

## Setup

### Prerequisites

- **MetaMask**: Ensure MetaMask is installed in your browser.
- **Node.js**: Ensure you have Node.js installed.

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
Install Dependencies

bash
Copy code
npm install
Start the Application

bash
Copy code
npm start
Configuration
Contract Address: Update the contractAddress variable in the HomePage component with the deployed contract address.
Contract ABI: Ensure the ABI file (PaymentManager.json) is correctly placed in the artifacts/contracts/Assessment.sol directory.
Usage
Connect Wallet
Click the "Connect MetaMask Wallet" button to connect your Ethereum wallet.
Generate Bill
Enter the bill amount and tip.
Click the "Generate" button to create a new bill. The resulting bill amount and ID will be displayed.
Pay Bill
Enter the bill ID and the amount to pay.
Click the "Pay" button to complete the payment. The payment status will be shown.
Check Bill Status
Enter the bill ID.
Click the "Get Bill Status" button to check if the bill has been paid or is still pending.
Code Overview
HomePage Component: Handles wallet connection, contract interaction, and state management for bill generation, payment, and status checking.
getWallet: Retrieves the MetaMask wallet.
connectAccount: Connects to MetaMask and initializes the smart contract.
handleGenerateBill: Generates a new bill with the specified amount and tip.
handlePayBill: Pays a specified bill and updates the payment status.
gettingBillStats: Retrieves the status of a specific bill.
Styling
The application uses inline CSS styles for layout and design, including button styles, input fields, and message displays.

Error Handling
Errors during contract interaction are logged to the console and displayed in the user interface as messages.
