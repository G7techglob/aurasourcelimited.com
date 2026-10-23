
"use strict";

/*
 * AURA SOURCE COMPANY WALLET
 *
 * TRANSITION MODE
 *
 * This file intentionally does not create simulated transactions,
 * change balances, or initiate bank transfers.
 *
 * Real financial records must be loaded from a secure backend.
 * Existing browser records are not deleted.
 */

const walletBalance = document.getElementById("walletBalance");
const totalDeposits = document.getElementById("totalDeposits");
const totalWithdrawals = document.getElementById("totalWithdrawals");
const transactionList = document.getElementById("transactionList");
const transactionFilter = document.getElementById("transactionFilter");

const depositForm = document.getElementById("depositForm");
const withdrawForm = document.getElementById("withdrawForm");

const depositMessage = document.getElementById("depositMessage");
const withdrawMessage = document.getElementById("withdrawMessage");
const receiveMessage = document.getElementById("receiveMessage");

function showMessage(element, message, type = "") {
    if (!element) return;

    element.textContent = message;
    element.className = "form-message";

    if (type) {
        element.classList.add(type);
    }
}

function setText(element, message) {
    if (element) {
        element.textContent = message;
    }
}

/* =========================================
   SHOW VERIFIED-DATA STATUS
========================================= */

function renderWallet() {
    setText(walletBalance, "Not connected");
    setText(totalDeposits, "Not connected");
    setText(totalWithdrawals, "Not connected");

    if (!transactionList) return;

    transactionList.replaceChildren();

    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.className = "empty-state";
    cell.textContent =
        "Company financial records will appear here after the secure database is connected.";

    row.appendChild(cell);
    transactionList.appendChild(row);
}

/* =========================================
   PAGE NAVIGATION
========================================= */

document.querySelectorAll("[data-open]").forEach(button => {
    button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.open);

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

/* =========================================
   QUICK AMOUNT BUTTONS
========================================= */

document.querySelectorAll("[data-amount]").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById("depositAmount");

        if (input) {
            input.value = button.dataset.amount;
        }
    });
});

/* =========================================
   DEPOSITS — NOT CONNECTED YET
========================================= */

if (depositForm) {
    depositForm.addEventListener("submit", event => {
        event.preventDefault();

        showMessage(
            depositMessage,
            "Deposits are not connected yet. No money has been received or added to the wallet.",
            "error"
        );
    });
}

/* =========================================
   BANK WITHDRAWALS — NOT CONNECTED YET
========================================= */

if (withdrawForm) {
    withdrawForm.addEventListener("submit", event => {
        event.preventDefault();

        showMessage(
            withdrawMessage,
            "Bank withdrawals are not connected yet. No withdrawal was processed and your balance was not changed.",
            "error"
        );
    });
}

/* =========================================
   BANK ACCOUNT SETUP STATUS
========================================= */

const refreshAccountButton = document.getElementById("refreshAccount");

if (refreshAccountButton) {
    refreshAccountButton.addEventListener("click", () => {
        showMessage(
            receiveMessage,
            "Bank account integration is not configured yet. No account details have been created or verified.",
            "error"
        );
    });
}

/* =========================================
   TRANSACTION FILTER
========================================= */

if (transactionFilter) {
    transactionFilter.addEventListener("change", renderWallet);
}

/* =========================================
   INITIAL DISPLAY
========================================= */

renderWallet();
