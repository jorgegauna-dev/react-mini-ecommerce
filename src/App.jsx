import { useEffect, useMemo, useState } from "react";

const productsData = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Audio",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Premium wireless sound with modern design and all-day comfort.",
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Wearables",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "Track activity, notifications and performance in one device.",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
    description: "Responsive typing experience with a clean modern setup.",
  },
  {
    id: 4,
    name: "Gaming Mouse",
    category: "Accessories",
    price: 59,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    description: "Smooth precision and ergonomic design for everyday use.",
  },
  {
    id: 5,
    name: "Portable Speaker",
    category: "Audio",
    price: 75,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",
    description: "Compact speaker with powerful sound and modern portability.",
  },
  {
    id: 6,
    name: "4K Monitor",
    category: "Display",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    description: "Sharp display quality for creative work and productivity.",
  },
  {
    id: 7,
    name: "Laptop Stand",
    category: "Accessories",
    price: 39,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    description: "Minimal desk accessory for a cleaner and more ergonomic setup.",
  },
  {
    id: 8,
    name: "Tablet Pro",
    category: "Display",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    description: "Portable screen experience ideal for work and entertainment.",
  },
];

const categories = ["All", ...new Set(productsData.map((product) => product.category))];

export default function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("nova-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    localStorage.setItem("nova-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Nova Store</h1>
            <p className="text-sm text-slate-400">React E-commerce Demo</p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold">
            Cart: {totalItems}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm font-semibold text-cyan-300">
              Functional React Project
            </span>

            <h2 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Modern e-commerce store with a real working cart.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              This portfolio project was built with React and Tailwind CSS to
              showcase product listing, category filters, search, shopping cart
              logic and persistent cart data with localStorage.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Shop Now
              </a>

              <a
                href="#cart"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                View Cart
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Products</p>
                <p className="mt-2 text-3xl font-bold">{productsData.length}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Cart Items</p>
                <p className="mt-2 text-3xl font-bold">{totalItems}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Total</p>
                <p className="mt-2 text-3xl font-bold">${totalPrice}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Features Included</p>
              <ul className="mt-4 space-y-2 text-slate-200">
                <li>• Product cards with images</li>
                <li>• Search by product name</li>
                <li>• Filter by category</li>
                <li>• Add to cart functionality</li>
                <li>• Increase / decrease quantity</li>
                <li>• Remove items and clear cart</li>
                <li>• localStorage cart persistence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 lg:grid-cols-[2fr_1fr]">
        {/* Products */}
        <section id="products">
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Products
                </p>
                <h3 className="mt-2 text-3xl font-bold">Featured Collection</h3>
              </div>

              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none sm:max-w-xs"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "bg-cyan-400 text-slate-950"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {product.category}
                  </span>

                  <h4 className="mt-4 text-xl font-bold">{product.name}</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {product.description}
                  </p>
                  <p className="mt-4 text-2xl font-bold">${product.price}</p>

                  <button
                    onClick={() => addToCart(product)}
                    className="mt-5 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
              No products found for that search or category.
            </div>
          )}
        </section>

        {/* Cart */}
        <aside
          id="cart"
          className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6 lg:sticky lg:top-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Shopping Cart
              </p>
              <h3 className="mt-2 text-2xl font-bold">Your Order</h3>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm font-semibold text-red-400 hover:text-red-300"
              >
                Clear
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="mt-6 text-slate-400">
              Your cart is empty. Add some products to see them here.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="mt-1 text-sm text-slate-400">
                        ${item.price} each
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-semibold text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg"
                      >
                        -
                      </button>

                      <span className="min-w-[24px] text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold">${item.price * item.quantity}</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">${totalPrice}</span>
                </div>

                <button className="mt-5 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                  Checkout
                </button>
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-slate-400">
        <p>© {new Date().getFullYear()} Nova Store. React portfolio project.</p>
      </footer>
    </div>
  );
}