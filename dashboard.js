
const SUPABASE_URL =
  "https://xmojdravrfrztusukjpg.supabase.co";

// Replace this placeholder with your existing public key.
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_5qOMDwlNKI2E9F8vKSLT2Q_VdCyyWBE";

const accountStatus = document.getElementById("accountStatus");
const message = document.getElementById("message");
const productList = document.getElementById("productList");
const logoutButton = document.getElementById("logoutButton");

function showMessage(text) {
  message.textContent = text;
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN"
  }).format(Number(value) || 0);
}

async function startDashboard() {
  if (
    !window.supabase ||
    SUPABASE_PUBLISHABLE_KEY ===
      "PASTE_YOUR_EXISTING_PUBLISHABLE_KEY_HERE"
  ) {
    showMessage("Supabase setup is incomplete. Check dashboard.js.");
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

  accountStatus.textContent =
    "Signed in as " + data.session.user.email;

  const { data: products, error: productError } = await client
    .from("products")
    .select("id, name, description, price, image_url, is_published")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (productError) {
    console.error("Product loading error:", productError);
    showMessage(
      "Unable to load products. Please check the browser console."
    );
    return;
  }

  productList.replaceChildren();

  if (!products || products.length === 0) {
    showMessage("No published products have been added yet.");
    return;
  }

  showMessage("");

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    if (product.image_url) {
      const image = document.createElement("img");
      image.src = product.image_url;
      image.alt = product.name || "Product image";
      image.loading = "lazy";
      card.appendChild(image);
    }

    const name = document.createElement("h3");
    name.textContent = product.name || "Unnamed product";
    card.appendChild(name);

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(product.price);
    card.appendChild(price);

    const description = document.createElement("p");
    description.textContent = product.description || "";
    card.appendChild(description);

    productList.appendChild(card);
  });
}

async function signOut() {
  logoutButton.disabled = true;

  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  const { error } = await client.auth.signOut();

  if (error) {
    accountStatus.textContent = "Sign-out failed. Please try again.";
    logoutButton.disabled = false;
    return;
  }

  window.location.replace("admin.html");
}

logoutButton.addEventListener("click", signOut);
startDashboard();
