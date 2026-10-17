
"use strict";

// Aura Source Product Admin Dashboard
// Uses Supabase Auth and Row Level Security.

const SUPABASE_URL =
  "https://xmojdravrfrztusukjpg.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_5qOMDwlNKI2E9F8vKSLT2Q_VdCyyWBE";

const accountStatus = document.getElementById("accountStatus");
const message = document.getElementById("message");
const productList = document.getElementById("productList");
const logoutButton = document.getElementById("logoutButton");

let client = null;
let products = [];

function showMessage(text) {
  if (message) message.textContent = text;
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}

function makeElement(tag, text, className) {
  const element = document.createElement(tag);

  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;

  return element;
}

function makeButton(text, className, onClick) {
  const button = makeElement("button", text, className);
  button.type = "button";
  button.addEventListener("click", onClick);
  return button;
}

function addProductForm() {
  const panel = makeElement("section", undefined, "panel");
  panel.appendChild(makeElement("h2", "Add a new product"));

  const form = document.createElement("form");
  form.className = "product-form";

  const nameInput = document.createElement("input");
  nameInput.name = "name";
  nameInput.placeholder = "Product name";
  nameInput.required = true;
  nameInput.maxLength = 150;

  const descriptionInput = document.createElement("textarea");
  descriptionInput.name = "description";
  descriptionInput.placeholder = "Product description";
  descriptionInput.rows = 4;
  descriptionInput.required = true;

  const priceInput = document.createElement("input");
  priceInput.name = "price";
  priceInput.type = "number";
  priceInput.placeholder = "Price in NGN";
  priceInput.min = "0.01";
  priceInput.step = "0.01";
  priceInput.required = true;

  const imageInput = document.createElement("input");
  imageInput.name = "image_url";
  imageInput.type = "url";
  imageInput.placeholder = "Product image URL (optional)");

  const publishedLabel = document.createElement("label");
  const publishedInput = document.createElement("input");
  publishedInput.name = "is_published";
  publishedInput.type = "checkbox";
  publishedLabel.append(
    publishedInput,
    document.createTextNode(" Publish product on the website")
  );

  const submit = makeElement("button", "Add product");
  submit.type = "submit";

  form.append(
    nameInput,
    descriptionInput,
    priceInput,
    imageInput,
    publishedLabel,
    submit
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submit.disabled = true;
    showMessage("Adding product…");

    const formData = new FormData(form);
    const price = Number(formData.get("price"));

    if (!Number.isFinite(price) || price <= 0) {
      showMessage("Enter a valid price greater than zero.");
      submit.disabled = false;
      return;
    }

    const newProduct = {
      name: String(formData.get("name")).trim(),
      description: String(formData.get("description")).trim(),
      price,
      image_url: String(formData.get("image_url")).trim() || null,
      is_published: publishedInput.checked
    };

    const { error } = await client
      .from("products")
      .insert(newProduct);

    submit.disabled = false;

    if (error) {
      console.error("Add product failed:", error);
      showMessage(
        "Could not add product. Check administrator permissions and database policies."
      );
      return;
    }

    form.reset();
    showMessage("Product added successfully.");
    await loadProducts();
  });

  panel.appendChild(form);

  const main = document.querySelector("main");
  const catalogue = main?.querySelector(".panel");

  if (catalogue) {
    main.insertBefore(panel, catalogue);
  } else if (main) {
    main.prepend(panel);
  }
}

async function updateProduct(product, changes) {
  const { error } = await client
    .from("products")
    .update(changes)
    .eq("id", product.id);

  if (error) {
    console.error("Update product failed:", error);
    showMessage(
      "Could not update product. Check administrator permissions."
    );
    return false;
  }

  showMessage("Product updated successfully.");
  await loadProducts();
  return true;
}

async function editProduct(product) {
  const name = prompt("Product name:", product.name || "");
  if (name === null) return;

  const description = prompt(
    "Product description:",
    product.description || ""
  );
  if (description === null) return;

  const priceText = prompt(
    "Price in NGN:",
    String(product.price ?? "")
  );
  if (priceText === null) return;

  const price = Number(priceText);

  if (!name.trim() || !description.trim() ||
      !Number.isFinite(price) || price <= 0) {
    showMessage("Enter a name, description, and valid positive price.");
    return;
  }

  const imageUrl = prompt(
    "Product image URL (leave blank for no image):",
    product.image_url || ""
  );
  if (imageUrl === null) return;

  const cleanImageUrl = imageUrl.trim();

  if (cleanImageUrl) {
    try {
      const parsedUrl = new URL(cleanImageUrl);

      if (parsedUrl.protocol !== "https:") {
        showMessage("Product image URLs must use HTTPS.");
        return;
      }
    } catch {
      showMessage("Enter a valid image URL.");
      return;
    }
  }

  await updateProduct(product, {
    name: name.trim(),
    description: description.trim(),
    price,
    image_url: cleanImageUrl || null
  });
}

async function togglePublished(product) {
  await updateProduct(product, {
    is_published: !product.is_published
  });
}

async function deleteProduct(product) {
  const confirmed = confirm(
    'Permanently delete "' + product.name + '"? This cannot be undone.'
  );

  if (!confirmed) return;

  const { error } = await client
    .from("products")
    .delete()
    .eq("id", product.id);

  if (error) {
    console.error("Delete product failed:", error);
    showMessage(
      "Could not delete product. Check administrator permissions."
    );
    return;
  }

  showMessage("Product deleted.");
  await loadProducts();
}

function renderProducts() {
  productList.replaceChildren();

  if (products.length === 0) {
    showMessage("No products found. Use Add a new product to get started.");
    return;
  }

  showMessage("Products found: " + products.length);

  for (const product of products) {
    const card = makeElement("article", undefined, "product-card");

    if (product.image_url) {
      const image = document.createElement("img");
      image.src = product.image_url;
      image.alt = product.name || "Product image";
      image.loading = "lazy";
      image.referrerPolicy = "no-referrer";
      image.onerror = () => image.remove();
      card.appendChild(image);
    }

    card.appendChild(makeElement("h3", product.name || "Unnamed product"));
    card.appendChild(makeElement("p", formatPrice(product.price), "price"));
    card.appendChild(
      makeElement("p", product.description || "No description provided.")
    );

    card.appendChild(
      makeElement(
        "p",
        product.is_published ? "Status: Published" : "Status: Unpublished",
        "status"
      )
    );

    const actions = makeElement("div", undefined, "product-actions");

    actions.append(
      makeButton("Edit", "link-button", () => editProduct(product)),
      makeButton(
        product.is_published ? "Unpublish" : "Publish",
        "link-button",
        () => togglePublished(product)
      ),
      makeButton("Delete", "link-button", () => deleteProduct(product))
    );

    card.appendChild(actions);
    productList.appendChild(card);
  }
}

async function loadProducts() {
  showMessage("Loading products…");

  const { data, error } = await client
    .from("products")
    .select(
      "id, name, description, price, image_url, is_published, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Product loading failed:", error);
    showMessage(
      "Could not load products. Your Supabase read policies may need updating."
    );
    return;
  }

  products = data || [];
  renderProducts();
}

async function signOut() {
  if (!client || !logoutButton) return;

  logoutButton.disabled = true;

  const { error } = await client.auth.signOut();

  if (error) {
    console.error("Sign-out failed:", error);
    accountStatus.textContent = "Sign-out failed. Please try again.";
    logoutButton.disabled = false;
    return;
  }

  window.location.replace("admin.html");
}

async function startDashboard() {
  if (!accountStatus || !message || !productList || !logoutButton) {
    console.error("Dashboard HTML elements are missing.");
    return;
  }

  if (!window.supabase) {
    showMessage("Supabase could not load. Refresh the page.");
    return;
  }

  client = window.supabase.createClient(
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

  logoutButton.addEventListener("click", signOut);

  addProductForm();
  await loadProducts();
}

startDashboard().catch((error) => {
  console.error("Dashboard startup failed:", error);
  showMessage("The dashboard could not start. Please refresh and try again.");
});
