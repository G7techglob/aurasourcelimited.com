
const SUPABASE_URL = "https://xmojdravrfrztusukjpg.supabase.co";

// Use the same public publishable key from your existing admin.html.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_5qOMDwlNKI2E9F8vKSLT2Q_VdCyyWBE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#b42318" : "#725626";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Please enter your email and password.", true);
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "SIGNING IN...";
  showMessage("Verifying your administrator account...");

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      showMessage(
        "Login failed. Check your email and password, then try again.",
        true
      );
      return;
    }

    if (!data.session) {
      showMessage("No active session was created. Please try again.", true);
      return;
    }

    showMessage("Login successful. Opening your dashboard...");

    window.location.replace("dashboard.html");
  } catch (error) {
    console.error("Admin login error:", error);
    showMessage("A connection error occurred. Please try again.", true);
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "SIGN IN";
  }
});
