
"use strict";

// Aura Source Wallet
// This file displays wallet information from Supabase.
// Real deposits must be recorded by a secure, verified backend.

const SUPABASE_URL =
  "https://xmojdravrfrztusukjpg.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_5qOMDwlNKI2E9F8vKSLT2Q_VdCyyWBE";

// These names must match the secure database functions/tables
// we will create and configure in the next setup steps.
const BALANCE_FUNCTION = "get-wallet-balance";
const TRANSACTIONS_TABLE = "wallet_transactions";

const balanceElement = document.getElementById("walletBalance");
const withdrawalForm = document.getElementById("withdrawalForm");
const withdrawalButton = document.getElementById("withdrawalButton");
const withdrawalMessage = document.getElementById("withdrawalMessage");
const withdrawalList = document.getElementById("withdrawalList");
const historyMessage = document.getElementById("historyMessage");

let supabaseClient = null;

function formatNaira(amountInKoboOrNaira) {
  // The database should store NGN amounts as decimal naira,
  // not kobo. For example, 1500.00 means ₦1,500.00.
  const amount = Number(amountInKoboOrNaira);

  if (!Number.isFinite(amount)) {
    return "Balance unavailable";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function showMessage(element, message) {
  if (element) {
    element.textContent = message;
  }
}

function showTransactions(transactions) {
  if (!withdrawalList) return;

  withdrawalList.replaceChildren();

  if (!Array.isArray(transactions) || transactions.length === 0) {
    showMessage(historyMessage, "No wallet transactions recorded yet.");
    return;
  }

  for (const transaction of transactions) {
    const item = document.createElement("article");
    item.className = "wallet-transaction";

    const heading = document.createElement("h3");
    heading.textContent = String(
      transaction.description || transaction.type || "Wallet transaction"
    );

    const amount = document.createElement("p");
    const numericAmount = Number(transaction.amount);

    amount.textContent =
      (numericAmount >= 0 ? "+" : "") + formatNaira(numericAmount);

    const status = document.createElement("p");
    status.textContent =
      "Status: " + String(transaction.status || "recorded");

    const date = document.createElement("p");
    date.textContent = transaction.created_at
      ? new Date(transaction.created_at).toLocaleString("en-NG")
      : "Date unavailable";

    item.append(heading, amount, status, date);
    withdrawalList.appendChild(item);
  }

  showMessage(historyMessage, "Wallet transaction history.");
}

async function loadWalletBalance() {
  balanceElement.textContent = "Loading balance…";

  // This secure function must be created and protected in Supabase
  // before it can return a real wallet balance.
  const { data, error } = await supabaseClient.functions.invoke(
    BALANCE_FUNCTION
  );

  if (error || !data || typeof data.balance !== "number") {
    balanceElement.textContent = formatNaira(0);
    showMessage(
      historyMessage,
      "The secure wallet balance service is not configured yet. " +
      "The displayed zero is a fallback, not a verified account balance."
    );
    return;
  }

  balanceElement.textContent = formatNaira(data.balance);
}

async function loadTransactionHistory() {
  // The wallet_transactions table must be created with suitable
  // row-level security policies before this query will work.
  const { data, error } = await supabaseClient
    .from(TRANSACTIONS_TABLE)
    .select("id, description, type, amount, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    showMessage(
      historyMessage,
      "Transaction history is not connected yet. " +
      "The secure database setup is still required."
    );
    return;
  }

  showTransactions(data || []);
}

async function startWallet() {
  if (!balanceElement || !withdrawalForm) {
    console.error("Wallet page elements are missing.");
    return;
  }

  if (!window.supabase) {
    balanceElement.textContent = "Connection unavailable";
    showMessage(historyMessage, "Supabase could not load. Refresh the page.");
    withdrawalForm.hidden = true;
    return;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session) {
    window.location.replace("admin.html");
    return;
  }

  // Never create deposits or change balances in browser code.
  await loadWalletBalance();
  await loadTransactionHistory();

  // Real withdrawals require a secure server-side workflow.
  withdrawalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    showMessage(
      withdrawalMessage,
      "Withdrawals are not enabled yet. No money has been transferred."
    );
  });

  if (withdrawalButton) {
    withdrawalButton.disabled = false;
  }
}

startWallet().catch((error) => {
  console.error("Aura Source Wallet error:", error);

  if (balanceElement) {
    balanceElement.textContent = "Balance unavailable";
  }

  showMessage(
    historyMessage,
    "The wallet could not load. Please refresh and try again."
  );
});
