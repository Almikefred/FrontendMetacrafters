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
   ```
**Install Dependencies**

```javascript
npm install
```
**Start the Application**

```javascript
npm start
```
**Configuration**

**Contract Address:**
Update the contractAddress variable in the HomePage component with the deployed contract address.

**Contract ABI:**
Ensure the ABI file (PaymentManager.json) is correctly placed in the artifacts/contracts/Assessment.sol directory.

### Executing program

To run this program, you can use Remix, an online Solidity IDE. To get started, go to the Remix website at https://remix.ethereum.org/.

Once you are on the Remix website, create a new file by clicking on the "+" icon in the left-hand sidebar. Save the file with a .sol extension (e.g., DrivingSchool.sol). Copy and paste the following code into the file:

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PaymentManager {
    uint public billCounter;
    uint public tips;
    address public owner;

    struct Payment {
        uint id;
        uint amount;
        address client;
        uint tip;
        uint billDue;
        bool isPaid;
    }

    mapping(address => mapping(uint => Payment)) payments;

    mapping(uint => bool) billstats;

    event BillPaid(address indexed client, uint indexed billId, uint amount);

    constructor() {
        owner = msg.sender;
    }

    function generateBill(uint _amount, uint _tip) public returns (uint) {
        billCounter++;
        Payment storage newBill = payments[msg.sender][billCounter];

        newBill.id = billCounter;
        newBill.amount = _amount;
        newBill.client = msg.sender;
        newBill.tip = _tip;
        newBill.isPaid = false;

        newBill.billDue = newBill.amount + newBill.tip;
        tips += _tip;
        billstats[billCounter] = newBill.isPaid;
        return newBill.billDue;
    }

    function payBill(uint id) public payable returns (bool) {
        Payment storage bill = payments[msg.sender][id];
        require(!bill.isPaid, "Bill has already been paid");
        require(msg.value == bill.billDue, "Incorrect payment amount");

        // Mark the bill as paid
        bill.isPaid = true;

        billstats[id] = bill.isPaid;

        // Emit an event for the payment
        emit BillPaid(msg.sender, id, msg.value);

        return true;
    }

    function getBillStatus(uint id) public view returns (bool) {
        return billstats[id];
    }

    function getContractBalance() public view returns (uint) {
        require(msg.sender == owner, "only owner can call");
        return address(this).balance;
    }

    function drainContract() public {
        require(msg.sender == owner, "only owner can call");
        payable(msg.sender).transfer(address(this).balance);
    }

    function billAmount() public view returns (uint) {
        Payment storage bill = payments[msg.sender][billCounter];
        return bill.billDue;
    }

    function getBillDetails(
        uint id,
        address client
    ) public view returns (Payment memory) {
        Payment storage bill = payments[client][id];
        return bill;
    }
}
```

**Usage**

**Connect Wallet**

Click the "Connect MetaMask Wallet" button to connect your Ethereum wallet.

**Generate Bill**
Enter the bill amount and tip.

Click the "Generate" button to create a new bill. The resulting bill amount and ID will be displayed.

**Pay Bill**
Enter the bill ID and the amount to pay.

Click the "Pay" button to complete the payment. The payment status will be shown.

**Check Bill Status**

Enter the bill ID.

Click the "Get Bill Status" button to check if the bill has been paid or is still pending.

**Code Overview**

**HomePage Component:**

Handles wallet connection, contract interaction, and state management for bill generation, payment, and status checking.
getWallet: Retrieves the MetaMask wallet.

**connectAccount:**
Connects to MetaMask and initializes the smart contract.

**handleGenerateBill:**

Generates a new bill with the specified amount and tip.

**handlePayBill:**
Pays a specified bill and updates the payment status.

**gettingBillStats:**
Retrieves the status of a specific bill.

**Styling**
The application uses inline CSS styles for layout and design, including button styles, input fields, and message displays.

**Error Handling**

Errors during contract interaction are logged to the console and displayed in the user interface as messages.

**Author**

Alfred Michael

**License**

This project is licensed under the MIT License.
