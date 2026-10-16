
const SUPABASE_URL =
  "https://xmojdravrfrztusukjpg.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_5qOMDwlNKI2E9F8vKSLT2Q_VdCyyWBE";

const balanceElement = document.getElementById("walletBalance");
const withdrawalForm = document.getElementById("withdrawalForm");
const withdrawalAmount = document.getElementById("withdrawalAmount");
const withdrawalButton = document.getElementById("withdrawalButton");
const withdrawalMessage = document.getElementById("withdrawalMessage");
const withdrawalList = document.getElementById("withdrawalList");
const historyMessage = document.getElementById("historyMessage");

function showWithdrawalMessage(text) {
  withdrawalMessage.textContent = text;
}

async function startWallet() {
  if (!window.supabase) {
    balanceElement.textContent = "Not connected";
    historyMessage.textContent =
      "Supabase could not load. Please refresh the page.";
    withdrawalForm.hidden = true;
    return;
  }

  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  const { data, error } = await client.auth.getSession();

  if (error || !data.session) {
    window.location.replace("admin.html");
    return;
  }

  // No real wallet balance is connected yet.
  balanceElement.textContent = "Not connected yet";

  // Withdrawal requests will be connected after secure
  // balance and bank-transfer handling are implemented.
  withdrawalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    showWithdrawalMessage(
      "Withdrawals are not enabled yet. No money has been moved."
    );
  });

  withdrawalButton.disabled = false;
  historyMessage.textContent =
    "Withdrawal history will appear here after the secure backend is connected.";
  withdrawalList.replaceChildren();
}

startWallet();
