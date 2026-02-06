const App = {
    // --- DATABASE ---
    db: {
        getProducts: () => JSON.parse(localStorage.getItem('products')) || window.PRODUCTS,
        saveProducts: (d) => localStorage.setItem('products', JSON.stringify(d)),
        getUser: () => JSON.parse(localStorage.getItem('current_user')),
        getUsersDB: () => JSON.parse(localStorage.getItem('users_db') || '[]'),
        saveUsersDB: (d) => localStorage.setItem('users_db', JSON.stringify(d)),
        getCart: () => JSON.parse(localStorage.getItem('cart') || '[]'),
        saveCart: (d) => localStorage.setItem('cart', JSON.stringify(d)),
        getOrders: () => JSON.parse(localStorage.getItem('orders') || '[]'),
        saveOrders: (d) => localStorage.setItem('orders', JSON.stringify(d))
    },

    // --- AUTHENTICATION ---
    auth: {
        login: (u, p, isAdminPage = false) => {
            // Admin Hardcode
            if (u === 'admin' && p === '1234') {
                const admin = { username: 'admin', name: 'Super Admin', role: 'admin' };
                localStorage.setItem('current_user', JSON.stringify(admin));
                return { success: true, role: 'admin' };
            }
            
            if (isAdminPage) return { success: false, msg: 'หน้านี้สำหรับ Admin เท่านั้น' };

            // User Login
            const users = App.db.getUsersDB();
            const user = users.find(x => x.username === u && x.password === p);
            if (user) {
                localStorage.setItem('current_user', JSON.stringify(user));
                return { success: true, role: 'user' };
            }
            return { success: false, msg: 'ข้อมูลไม่ถูกต้อง' };
        },
        register: (data) => {
            const users = App.db.getUsersDB();
            if (users.find(x => x.username === data.username)) return { success: false, msg: 'มีผู้ใช้นี้แล้ว' };
            users.push({ ...data, role: 'user', joined: new Date().toLocaleDateString() });
            App.db.saveUsersDB(users);
            return { success: true };
        },
        logout: () => {
            localStorage.removeItem('current_user');
            window.location.href = 'index.html';
        },
        check: () => {
            const user = App.db.getUser();
            const navAuth = document.getElementById('nav-auth');
            if (!navAuth) return;
            if (user) {
                navAuth.innerHTML = `
                    <span class="text-xs font-bold text-red-500 mr-2">${user.name}</span>
                    <button onclick="App.auth.logout()" class="text-gray-400 hover:text-white"><span class="material-symbols-outlined">logout</span></button>
                `;
            } else {
                navAuth.innerHTML = `
                    <a href="login.html" class="text-sm font-bold hover:text-red-500">Login</a>
                    <a href="register.html" class="bg-primary text-white px-3 py-1 rounded text-xs ml-2">Register</a>
                `;
            }
        }
    },

    // --- CART ---
    cart: {
        add: (id) => {
            const product = App.db.getProducts().find(p => p.id == id);
            let cart = App.db.getCart();
            const exist = cart.find(x => x.id == id);
            if (exist) exist.qty++; else cart.push({ ...product, qty: 1 });
            App.db.saveCart(cart);
            App.ui.toast(`เพิ่ม ${product.name} แล้ว`);
            App.ui.updateCartCount();
        },
        clear: () => { localStorage.removeItem('cart'); window.location.reload(); }
    },

    // --- UI HELPERS ---
    ui: {
        toast: (msg) => alert(msg), // ใช้ง่ายๆ ไปก่อน
        updateCartCount: () => {
            const cart = App.db.getCart();
            const el = document.getElementById('cart-count');
            if (el) el.innerText = cart.reduce((a, b) => a + b.qty, 0);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.auth.check();
    App.ui.updateCartCount();
});