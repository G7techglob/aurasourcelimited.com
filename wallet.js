
"use strict";

/*
 * AURA SOURCE WALLET
 *
 * FRONTEND DEMONSTRATION ONLY.
 *
 * Real deposits, bank transfers and withdrawals must be processed
 * by authenticated Supabase Edge Functions and a payment provider.
 *
 * Never put a payment provider secret key in this file.
 */

const STORAGE_KEY = "auraSourceWalletDemoRequests";

const walletBalance = document.getElementById("walletBalance");
const totalDeposits = document.getElementById("totalDeposits");
const totalWithdrawals = document.getElementById("totalWithdrawals");
const pendingCount = document.getElementById("pendingCount");
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
    element.textContent = message;
    element.className = "form-message";

    if (type) {
        element.classList.add(type);
    }
}

function getDemoRequests() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const requests = JSON.parse(stored);

        if (!Array.isArray(requests)) {
            return [];
        }

        return requests.filter(item =>
            item &&
            typeof item.id === "string" &&
            ["deposit", "withdrawal"].includes(item.type) &&
            Number.isFinite(item.amount) &&
            item.amount > 0 &&
            typeof item.date === "string"
        );
    } catch (error) {
        console.error("Could not read demo transactions:", error);
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
        console.error("Could not save demo request:", error);
        return false;
    }
}

function createReference() {
    return "AS-" +
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
        status: "Demo only",
        date: new Date().toISOString()
    };
}

function renderWallet() {
    const requests = getDemoRequests();

    /*
     * The real balance deliberately remains zero.
     * Demo requests are not proof of payment and cannot add funds.
     */
    walletBalance.textContent = formatMoney(0);

    totalDeposits.textContent = formatMoney(0);
    totalWithdrawals.textContent = formatMoney(0);

    pendingCount.textContent = String(requests.length);

    renderTransactions(requests);
}

function renderTransactions(requests) {
    const filter = transactionFilter.value;

    const filtered = requests.filter(request => {
        return filter === "all" || request.type === filter;
    });

    transactionList.replaceChildren();

    if (filtered.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "empty-state";
        cell.textContent = "No transactions to display.";

        row.appendChild(cell);
        transactionList.appendChild(row);

        return;
    }

    filtered.forEach(request => {
        const row = document.createElement("tr");

        const typeCell = document.createElement("td");
        typeCell.textContent =
            request.type === "deposit" ? "Deposit request" : "Withdrawal request";

        const referenceCell = document.createElement("td");
        referenceCell.textContent = request.id;

        const amountCell = document.createElement("td");
        amountCell.textContent = formatMoney(request.amount);

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className = "status";
        statusBadge.textContent = request.status;
        statusCell.appendChild(statusBadge);

        const dateCell = document.createElement("td");
        const parsedDate = new Date(request.date);

        dateCell.textContent = Number.isNaN(parsedDate.getTime())
            ? "Unknown"
            : parsedDate.toLocaleString("en-NG", {
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

/*
 * Jump to deposit or withdrawal sections.
 */
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

/*
 * Quick deposit amount buttons.
 */
document.querySelectorAll("[data-amount]").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById("depositAmount").value =
            button.dataset.amount;
    });
});

/*
 * Deposit request.
 *
 * This does not charge a card, initiate a bank transfer,
 * or credit the wallet. It only records a demo request.
 */
depositForm.addEventListener("submit", event => {
    event.preventDefault();

    const amount = Number(
        document.getElementById("depositAmount").value
    );

    const method = document.getElementById("depositMethod").value;

    if (!Number.isSafeInteger(amount) || amount < 100) {
        showMessage(
            depositMessage,
            "Enter a valid deposit amount of at least ₦100.",
            "error"
        );
        return;
    }

    if (amount > 10000000) {
        showMessage(
            depositMessage,
            "The demo limit is ₦10,000,000 per request.",
            "error"
        );
        return;
    }

    const request = createDemoRequest(
        "deposit",
        amount,
        method
    );

    if (!saveDemoRequest(request)) {
        showMessage(
            depositMessage,
            "Could not save the demo request in this browser.",
            "error"
        );
        return;
    }

    showMessage(
        depositMessage,
        "Demo request recorded. No payment was taken and your balance has not changed. A payment provider must be connected to continue.",
        "success"
    );

    depositForm.reset();
    renderWallet();
});

/*
 * Withdrawal request.
 *
 * Bank account details are validated but never saved.
 * No payout is initiated by this frontend.
 */
withdrawForm.addEventListener("submit", event => {
    event.preventDefault();

    const amount = Number(
        document.getElementById("withdrawAmount").value
    );

    const bank = document.getElementById("bankName").value;

    const accountName = document.getElementById("accountName")
        .value.trim();

    const accountNumber = document.getElementById("accountNumber")
        .value.trim();

    if (!Number.isSafeInteger(amount) || amount < 100) {
        showMessage(
            withdrawMessage,
            "Enter a valid withdrawal amount of at least ₦100.",
            "error"
        );
        return;
    }

    if (amount > 10000000) {
        showMessage(
            withdrawMessage,
            "The demo limit is ₦10,000,000 per request.",
            "error"
        );
        return;
    }

    if (!bank || !accountName || !/^\d{10}$/.test(accountNumber)) {
        showMessage(
            withdrawMessage,
            "Enter the bank, account holder name and a valid 10-digit account number.",
            "error"
        );
        return;
    }

    const confirmed = window.confirm(
        "This is a demonstration only. No bank payout will occur. Record a demo withdrawal request?"
    );

    if (!confirmed) {
        return;
    }

    const request = createDemoRequest(
        "withdrawal",
        amount,
        "Bank withdrawal request"
    );

    if (!saveDemoRequest(request)) {
        showMessage(
            withdrawMessage,
            "Could not save the demo request in this browser.",
            "error"
        );
        return;
    }

    showMessage(
        withdrawMessage,
        "Demo request recorded only. No money was sent and no balance was deducted. Secure withdrawal processing is not connected yet.",
        "success"
    );

    /*
     * Clear the form to avoid leaving bank details on screen.
     * The account number and account holder name are not stored.
     */
    withdrawForm.reset();

    renderWallet();
});

/*
 * Incoming bank transfer setup.
 *
 * Real account details must come from a verified backend response.
 */
document.getElementById("refreshAccount").addEventListener("click", () => {
    showMessage(
        receiveMessage,
        "No bank account provider is connected yet. No transfer account is available. We will connect this section after the backend is configured.",
        "error"
    );
});

/*
 * Filter transaction history.
 */
transactionFilter.addEventListener("change", () => {
    renderTransactions(getDemoRequests());
});

/*
 * Initial display.
 */
renderWallet();
