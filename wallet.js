
"use strict";

/*
 * AURA SOURCE BUSINESS WALLET
 *
 * TEST MODE ONLY.
 * Deposits and withdrawals are simulated in this browser.
 * No real money is received, stored, or transferred.
 *
 * Real financial records must eventually come from a secure
 * Supabase backend and verified payment-provider transactions.
 */

const STORAGE_KEY = "auraSourceWalletDemoRequests";

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

const naira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function formatMoney(amount) {
    return naira.format(amount);
}

function showMessage(element, message, type = "") {
    if (!element) return;

    element.textContent = message;
    element.className = "form-message";

    if (type) {
        element.classList.add(type);
    }
}

function getDemoRequests() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const requests = JSON.parse(stored);
        if (!Array.isArray(requests)) return [];

        return requests.filter(item =>
            item &&
            typeof item.id === "string" &&
            ["deposit", "withdrawal"].includes(item.type) &&
            Number.isSafeInteger(item.amount) &&
            item.amount > 0 &&
            typeof item.date === "string"
        );
    } catch (error) {
        console.error("Could not read test records:", error);
        return [];
    }
}

function saveDemoRequest(request) {
    const requests = getDemoRequests();
    requests.unshift(request);

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(requests.slice(0, 100))
        );
        return true;
    } catch (error) {
        console.error("Could not save test record:", error);
        return false;
    }
}

function createReference() {
    return "AS-TEST-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random().toString(36).slice(2, 7).toUpperCase();
}

function createDemoRequest(type, amount, description) {
    return {
        id: createReference(),
        type,
        amount,
        description,
        status: " test",
        date: new Date().toISOString()
    };
}

/* =========================================
   CALCULATE TEST BALANCE
========================================= */

function renderWallet() {
    const requests = getDemoRequests();

    const deposits = requests
        .filter(request => request.type === "deposit")
        .reduce((sum, request) => sum + request.amount, 0);

    const withdrawals = requests
        .filter(request => request.type === "withdrawal")
        .reduce((sum, request) => sum + request.amount, 0);

    const balance = deposits - withdrawals;

    if (walletBalance) {
        walletBalance.textContent =
            "TEST ONLY — " + formatMoney(balance);
    }

    if (totalDeposits) {
        totalDeposits.textContent =
            "TEST ONLY — " + formatMoney(deposits);
    }

    if (totalWithdrawals) {
        totalWithdrawals.textContent =
            "TEST ONLY — " + formatMoney(withdrawals);
    }

    renderTransactions(requests);
}

/* =========================================
   TRANSACTION HISTORY
========================================= */

function renderTransactions(requests) {
    if (!transactionList) return;

    const filter = transactionFilter
        ? transactionFilter.value
        : "all";

    const filtered = requests.filter(request =>
        filter === "all" || request.type === filter
    );

    transactionList.replaceChildren();

    if (filtered.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "empty-state";
        cell.textContent = "No test transactions to display.";

        row.appendChild(cell);
        transactionList.appendChild(row);
        return;
    }

    filtered.forEach(request => {
        const row = document.createElement("tr");

        const typeCell = document.createElement("td");
        typeCell.textContent =
            request.type === "deposit"
                ? "Test deposit"
                : "Test withdrawal";

        const referenceCell = document.createElement("td");
        referenceCell.textContent = request.id;

        const amountCell = document.createElement("td");
        amountCell.textContent = formatMoney(request.amount);

        const statusCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = "status";
        badge.textContent = "TEST ONLY";
        statusCell.appendChild(badge);

        const dateCell = document.createElement("td");
        const date = new Date(request.date);

        dateCell.textContent = Number.isNaN(date.getTime())
            ? "Unknown"
            : date.toLocaleString("en-NG", {
                dateStyle: "medium",
                timeStyle: "short"
            });

        row.append(
            typeCell,
            referenceCell,
            amountCell,
            statusCell,
            dateCell
        );

        transactionList.appendChild(row);
    });
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
   QUICK DEPOSIT AMOUNTS
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
   SIMULATED DEPOSIT
========================================= */

if (depositForm) {
    depositForm.addEventListener("submit", event => {
        event.preventDefault();

        const amountInput = document.getElementById("depositAmount");
        const amount = Number(amountInput?.value);

       if (!Number.isSafeInteger(amount) || amount <= 0) {
    showMessage(
        withdrawMessage,
        "Enter a valid withdrawal amount greater than zero.",
        "error"
    );
    return;
}

        if (amount > 100000000000) {
            showMessage(
                depositMessage,
                "The test deposit limit is ₦100,000,000,000,000.",
                "error"
            );
            return;
        }

        const request = createDemoRequest(
            "deposit",
            amount,
            "Simulated test deposit"
        );

        if (!saveDemoRequest(request)) {
            showMessage(
                depositMessage,
                "Could not save the test deposit in this browser.",
                "error"
            );
            return;
        }

        showMessage(
            depositMessage,
            "TEST DEPOSIT SUCCESSFUL: " + formatMoney(amount) +
            " has been added to the simulated balance. No real money was received.",
            "success"
        );

        depositForm.reset();
        renderWallet();
    });
}

/* =========================================
   SIMULATED WITHDRAWAL
========================================= */

if (withdrawForm) {
    withdrawForm.addEventListener("submit", event => {
        event.preventDefault();

        const amount = Number(
            document.getElementById("withdrawAmount")?.value
        );

        const bank = document.getElementById("bankName")?.value;
        const accountName = document
            .getElementById("accountName")?.value.trim();
        const accountNumber = document
            .getElementById("accountNumber")?.value.trim();

        if (!Number.isSafeInteger(amount) || amount < 100) {
            showMessage(
                withdrawMessage,
                "Enter a test withdrawal of at least ₦100.",
                "error"
            );
            return;
        }

        if (
            !bank ||
            !accountName ||
            !/^\d{10}$/.test(accountNumber || "")
        ) {
            showMessage(
                withdrawMessage,
                "Enter the bank, account holder name and a valid 10-digit account number.",
                "error"
            );
            return;
        }

        const requests = getDemoRequests();

        const deposits = requests
            .filter(request => request.type === "deposit")
            .reduce((sum, request) => sum + request.amount, 0);

        const withdrawals = requests
            .filter(request => request.type === "withdrawal")
            .reduce((sum, request) => sum + request.amount, 0);

        const balance = deposits - withdrawals;

        if (amount > balance) {
            showMessage(
                withdrawMessage,
                "Insufficient test balance. Your simulated balance is " +
                formatMoney(Math.max(0, balance)) + ".",
                "error"
            );
            return;
        }

        const confirmed = window.confirm(
            "TEST ONLY: Record a simulated withdrawal of " +
            formatMoney(amount) +
            "? No money will be transferred."
        );

        if (!confirmed) return;

        const request = createDemoRequest(
            "withdrawal",
            amount,
            "Simulated test withdrawal"
        );

        if (!saveDemoRequest(request)) {
            showMessage(
                withdrawMessage,
                "Could not save the test withdrawal in this browser.",
                "error"
            );
            return;
        }

        showMessage(
            withdrawMessage,
            "TEST WITHDRAWAL RECORDED: " + formatMoney(amount) +
            " deducted from the simulated balance. No bank transfer occurred.",
            "success"
        );

        withdrawForm.reset();
        renderWallet();
    });
}

/* =========================================
   BANK TRANSFER SETUP
========================================= */

const refreshAccountButton = document.getElementById("refreshAccount");

if (refreshAccountButton) {
    refreshAccountButton.addEventListener("click", () => {
        showMessage(
            receiveMessage,
            "Bank-transfer receiving details are not connected. No real account has been created.",
            "error"
        );
    });
}

/* =========================================
   TRANSACTION FILTER
========================================= */

if (transactionFilter) {
    transactionFilter.addEventListener("change", () => {
        renderTransactions(getDemoRequests());
    });
}

/* =========================================
   INITIAL DISPLAY
========================================= */

renderWallet();
