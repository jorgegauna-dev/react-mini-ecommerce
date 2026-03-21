import { useEffect, useMemo, useState } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "Minimal Sneakers",
    category: "Shoes",
    price: 79.99,
    oldPrice: 99.99,
    rating: 4.8,
    badge: "Best Seller",
    icon: "👟",
    description: "Clean everyday sneakers with a modern look and comfortable fit.",
  },
  {
    id: 2,
    name: "Urban Hoodie",
    category: "Clothing",
    price: 54.99,
    oldPrice: 69.99,
    rating: 4.7,
    badge: "Trending",
    icon: "🧥",
    description: "Soft premium hoodie designed for comfort, style, and daily wear.",
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    category: "Accessories",
    price: 129.99,
    oldPrice: 159.99,
    rating: 4.9,
    badge: "Top Rated",
    icon: "⌚",
    description: "Track your day with a sleek smartwatch built for productivity.",
  },
  {
    id: 4,
    name: "Classic Backpack",
    category: "Bags",
    price: 64.99,
    oldPrice: 84.99,
    rating: 4.6,
    badge: "New",
    icon: "🎒",
    description: "Spacious backpack with minimalist design for work, study, or travel.",
  },
  {
    id: 5,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    oldPrice: 119.99,
    rating: 4.8,
    badge: "Popular",
    icon: "🎧",
    description: "Immersive sound, long battery life, and a lightweight premium feel.",
  },
  {
    id: 6,
    name: "Sport T-Shirt",
    category: "Clothing",
    price: 29.99,
    oldPrice: 39.99,
    rating: 4.5,
    badge: "Sale",
    icon: "👕",
    description: "Breathable athletic t-shirt ideal for training and casual outfits.",
  },
  {
    id: 7,
    name: "Leather Wallet",
    category: "Accessories",
    price: 39.99,
    oldPrice: 49.99,
    rating: 4.7,
    badge: "Limited",
    icon: "👛",
    description: "Slim wallet with a refined design and practical everyday storage.",
  },
  {
    id: 8,
    name: "Desk Lamp",
    category: "Home",
    price: 44.99,
    oldPrice: 59.99,
    rating: 4.6,
    badge: "Modern",
    icon: "💡",
    description: "Minimal LED desk lamp that upgrades any workspace instantly.",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const getSavedCart = () => {
  try {
    const savedCart = localStorage.getItem("mini-commerce-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [cart, setCart] = useState(getSavedCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("mini-commerce-cart", JSON.stringify(cart));
  }, [cart]);

  const categories = useMemo(
    () => ["All", ...new Set(PRODUCTS.map((product) => product.category))],
    []
  );

  const filteredProducts = useMemo(() => {
    let items = [...PRODUCTS];

    if (selectedCategory !== "All") {
      items = items.filter((product) => product.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }

    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        items.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        items.sort((a, b) => {
          const scoreA = a.rating + (a.badge === "Best Seller" || a.badge === "Top Rated" ? 0.2 : 0);
          const scoreB = b.rating + (b.badge === "Best Seller" || b.badge === "Top Rated" ? 0.2 : 0);
          return scoreB - scoreA;
        });
        break;
    }

    return items;
  }, [searchTerm, selectedCategory, sortBy]);

  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const showCollection = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setSortBy("featured");
    scrollToCatalog();
  };

  const showFeatured = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setSortBy("rating");
    scrollToCatalog();
  };

  const getItemQuantity = (productId) => {
    const item = cart.find((cartItem) => cartItem.id === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { id: productId, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItems = cart
    .map((item) => {
      const product = PRODUCTS.find((product) => product.id === item.id);
      if (!product) return null;

      return {
        ...product,
        quantity: item.quantity,
        total: product.price * item.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 120 ? 0 : 9.99;
  const total = subtotal + shipping;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-shell">
      <div
        className={`overlay ${isCartOpen ? "show" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      <header className="topbar">
        <div className="brand">
          <div className="brand-badge">RG</div>
          <div>
            <p className="brand-label">React Store</p>
            <h1>Mini E-commerce</h1>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="ghost-btn" onClick={showCollection}>
            Collection
          </button>
          <button className="ghost-btn" onClick={showFeatured}>
            Featured
          </button>
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            Cart
            <span>{totalItems}</span>
          </button>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">Modern shopping experience</span>
            <h2>Build a clean, fast and portfolio-ready React store.</h2>
            <p>
              Product listing, category filters, search, sorting, shopping cart,
              quantity controls and localStorage persistence in one polished
              project.
            </p>

            <div className="hero-actions">
              <button className="primary-btn" onClick={scrollToCatalog}>
                Explore Products
              </button>
              <button className="secondary-btn" onClick={() => setIsCartOpen(true)}>
                View Cart
              </button>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <strong>8</strong>
              <span>Products</span>
            </div>
            <div className="stat-card">
              <strong>6</strong>
              <span>Categories</span>
            </div>
            <div className="stat-card">
              <strong>100%</strong>
              <span>Responsive</span>
            </div>
            <div className="stat-card">
              <strong>Cart</strong>
              <span>Saved locally</span>
            </div>
          </div>
        </section>

        <section className="controls">
          <div className="control-group search-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="control-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </section>

        <section className="catalog-section" id="catalog">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Catalog</span>
              <h3>Featured Products</h3>
            </div>
            <p>{filteredProducts.length} products found</p>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => {
              const quantity = getItemQuantity(product.id);

              return (
                <article className="product-card" key={product.id}>
                  <div className={`product-visual visual-${product.id % 4}`}>
                    <span className="product-badge">{product.badge}</span>
                    <div className="product-icon">{product.icon}</div>
                  </div>

                  <div className="product-body">
                    <div className="product-topline">
                      <span>{product.category}</span>
                      <span>★ {product.rating}</span>
                    </div>

                    <h4>{product.name}</h4>
                    <p>{product.description}</p>

                    <div className="price-row">
                      <strong>{formatCurrency(product.price)}</strong>
                      <span>{formatCurrency(product.oldPrice)}</span>
                    </div>

                    <div className="product-actions">
                      {quantity > 0 && (
                        <div className="qty-box">
                          <button type="button" onClick={() => updateQuantity(product.id, -1)}>
                            -
                          </button>
                          <span>{quantity}</span>
                          <button type="button" onClick={() => updateQuantity(product.id, 1)}>
                            +
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        className="primary-btn add-btn"
                        onClick={() => addToCart(product.id)}
                      >
                        {quantity > 0 ? "Add one more" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <aside className={`cart-panel ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <div>
            <p className="eyebrow">Shopping Cart</p>
            <h3>{totalItems} item(s)</h3>
          </div>
          <button className="close-btn" type="button" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h4>Your cart is empty</h4>
            <p>Add some products to see them here.</p>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-icon">{item.icon}</div>

                  <div className="cart-item-info">
                    <div className="cart-item-head">
                      <div>
                        <h4>{item.name}</h4>
                        <span>{item.category}</span>
                      </div>
                      <strong>{formatCurrency(item.total)}</strong>
                    </div>

                    <div className="cart-item-actions">
                      <div className="qty-box">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <strong>{shipping === 0 ? "Free" : formatCurrency(shipping)}</strong>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              <p className="shipping-note">
                {subtotal >= 120
                  ? "You unlocked free shipping."
                  : "Free shipping on orders over $120."}
              </p>

              <button type="button" className="primary-btn checkout-btn">
                Proceed to Checkout
              </button>
              <button
                type="button"
                className="secondary-btn clear-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}