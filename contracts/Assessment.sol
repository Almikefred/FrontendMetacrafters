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
