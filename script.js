const SELLER_PHONE = "60128655181";

const menuTracks = [
  {
    id: 1,
    title: "Pedas Giler Ayam Bakar",
    playlist: "midnight",
    playlistName: "Lofi Midnight Munchies",
    price: 3.00,
    prepTime: "3 min",
    desc: "Mi goreng pedas berapi aroma ayam bakar, teman setia midnight study.",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Tom Yummz Beat Drop",
    playlist: "midnight",
    playlistName: "Lofi Midnight Munchies",
    price: 3.00,
    prepTime: "3 min",
    desc: "Rasa masam pedas Tom Yam yang padu dan menyegarkan mata mengantuk.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Iced Caramel Macchiato",
    playlist: "caffeine",
    playlistName: "Morning Caffeine Rush",
    price: 7.50,
    prepTime: "5 min",
    desc: "Espresso pekat bersama susu segar dan sos karamel berkrim.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Matcha Oat Latte Chill",
    playlist: "caffeine",
    playlistName: "Morning Caffeine Rush",
    price: 8.00,
    prepTime: "5 min",
    desc: "Serbuk Uji Matcha gred premium dibancuh bersama susu oat berlemak.",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "All-Nighter Trio Pack",
    playlist: "combo",
    playlistName: "Top Hits Combo",
    price: 8.50,
    prepTime: "Ready",
    desc: "Kombo 3 pek mi pedas pilihan untuk stok seminggu.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Study Session Duet",
    playlist: "combo",
    playlistName: "Top Hits Combo",
    price: 10.00,
    prepTime: "5 min",
    desc: "1 Mi Pedas Giler + 1 Iced Caramel Macchiato pada harga kombo jimat.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const playlistBtns = document.querySelectorAll(".playlist-btn");
const playlistTitle = document.getElementById("playlistTitle");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const bottomCartBtn = document.getElementById("bottomCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const bottomTotal = document.getElementById("bottomTotal");
const deliveryType = document.getElementById("deliveryType");
const checkoutBtn = document.getElementById("checkoutBtn");

const bgAudio = document.getElementById("bgAudio");
const playPauseBtn = document.getElementById("playPauseBtn");
const visualizer = document.getElementById("visualizer");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");

function renderTracks(playlistFilter = "all") {
  productGrid.innerHTML = "";
  const filtered = playlistFilter === "all"
    ? menuTracks
    : menuTracks.filter(item => item.playlist === playlistFilter);

  filtered.forEach(track => {
    const card = document.createElement("div");
    card.className = "album-card";
    card.innerHTML = `
      <div class="cover-wrapper">
        <img src="${track.image}" alt="${track.title}" class="cover-img" />
        <button class="play-add-btn" onclick="addToCart(${track.id})" title="Tambah ke Pesanan">+</button>
      </div>
      <h4 class="album-title">${track.title}</h4>
      <p class="album-desc">${track.desc}</p>
      <div class="album-footer">
        <span class="price-tag">RM ${track.price.toFixed(2)}</span>
        <span class="duration-tag">⏱ ${track.prepTime}</span>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

playlistBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".playlist-btn.active").classList.remove("active");
    btn.classList.add("active");
    const selected = btn.dataset.playlist;
    playlistTitle.textContent = btn.textContent.trim();
    renderTracks(selected);
  });
});

// Tambah ke Troli (Senyap, tak buka drawer sendiri)
function addToCart(id) {
  const track = menuTracks.find(t => t.id === id);
  if (!track) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...track, qty: 1 });
  }

  nowPlayingTitle.textContent = `Added: ${track.title}`;
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
}

function updateCartUI() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalQty;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="color:#b3b3b3; text-align:center; margin-top:40px;">Queue kosong. Pilih menu dari playlist dahulu.</p>`;
    cartTotal.textContent = "RM 0.00";
    bottomTotal.textContent = "RM 0.00";
    return;
  }

  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>RM ${item.price.toFixed(2)} x ${item.qty}</p>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(row);
  });

  const isCOD = deliveryType.value.includes("COD");
  const grandTotal = subtotal + (isCOD ? 1.00 : 0.00);
  const formattedTotal = `RM ${grandTotal.toFixed(2)}`;

  cartTotal.textContent = formattedTotal;
  bottomTotal.textContent = formattedTotal;
}

deliveryType.addEventListener("change", updateCartUI);

let isPlaying = false;
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    bgAudio.pause();
    playPauseBtn.textContent = "▶";
    visualizer.classList.remove("playing");
  } else {
    bgAudio.play().catch(() => {});
    playPauseBtn.textContent = "❚❚";
    visualizer.classList.add("playing");
  }
  isPlaying = !isPlaying;
});

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
}

openCartBtn.addEventListener("click", openCart);
bottomCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Sila pilih sekurang-kurangnya satu item daripada playlist.");
    return;
  }

  const name = document.getElementById("custName").value.trim();
  if (!name) {
    alert("Sila masukkan nama anda.");
    document.getElementById("custName").focus();
    return;
  }

  const method = deliveryType.value;
  const note = document.getElementById("custNote").value.trim();

  const orderLines = cart.map((item, i) => {
    return `${i + 1}. ${item.title} (x${item.qty}) - RM ${(item.price * item.qty).toFixed(2)}`;
  }).join("\n");

  let message = `*NEW ORDER - CRAVEBEATS MENU*\n\n`;
  message += `*Nama:* ${name}\n`;
  message += `*Kaedah:* ${method}\n`;
  if (note) message += `*Catatan:* ${note}\n`;
  message += `\n*Senarai Pesanan:*\n${orderLines}\n\n`;
  message += `*Jumlah Bayaran:* ${cartTotal.textContent}`;

  const url = `https://wa.me/${SELLER_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

renderTracks();
updateCartUI();
