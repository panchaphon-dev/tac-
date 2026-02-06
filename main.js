/**
 * BLACKOPS BB - CORE ENGINE
 * ระบบจัดการร้านค้าแบบครบวงจร
 */

const App = {
    // --- 1. จัดการข้อมูล ---
    db: {
        products: () => {
            const local = localStorage.getItem('bb_products');
            // ถ้ามีข้อมูลในเครื่องให้ใช้ ถ้าไม่มีให้ใช้จาก data.js
            return local ? JSON.parse(local) : (typeof productsDB !== 'undefined' ? productsDB : []);
        },
        saveProducts: (data) => localStorage.setItem('bb_products', JSON.stringify(data)),
        cart: () => JSON.parse(localStorage.getItem('bb_cart') || '[]'),
        saveCart: (data) => {
            localStorage.setItem('bb_cart', JSON.stringify(data));
            App.ui.updateBadge();
        },
        user: () => JSON.parse(localStorage.getItem('bb_user')),
        orders: () => JSON.parse(localStorage.getItem('bb_orders') || '[]'),
        saveOrders: (data) => localStorage.setItem('bb_orders', JSON.stringify(data))
    },

    // --- 2. ระบบตะกร้า ---
    cart: {
        add: (id) => {
            const products = App.db.products();
            const product = products.find(p => p.id == id);
            if (!product) return alert('ไม่พบสินค้า');

            let cart = App.db.cart();
            const existing = cart.find(item => item.id == id);

            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            App.db.saveCart(cart);
            App.ui.toast(`เพิ่ม ${product.name} แล้ว`);
        },
        remove: (id) => {
            let cart = App.db.cart();
            cart = cart.filter(item => item.id != id);
            App.db.saveCart(cart);
            location.reload(); // รีเฟรชหน้าตะกร้า
        },
        clear: () => {
            localStorage.removeItem('bb_cart');
            App.ui.updateBadge();
        }
    },

    // --- 3. ระบบสมาชิก ---
    auth: {
        login: (u, p) => {
            if (u === 'admin' && p === '123') {
                const user = { username: 'admin', name: 'Administrator', role: 'admin' };
                localStorage.setItem('bb_user', JSON.stringify(user));
                return { success: true, user };
            }
            let users = JSON.parse(localStorage.getItem('bb_users_db') || '[]');
            const user = users.find(x => x.username === u && x.password === p);
            if (user) {
                localStorage.setItem('bb_user', JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false };
        },
        register: (data) => {
            let users = JSON.parse(localStorage.getItem('bb_users_db') || '[]');
            if (users.find(x => x.username === data.username)) return false;
            users.push({ ...data, role: 'user' });
            localStorage.setItem('bb_users_db', JSON.stringify(users));
            return true;
        },
        logout: () => {
            localStorage.removeItem('bb_user');
            window.location.href = 'index.html';
        },
        check: () => {
            const user = App.db.user();
            const el = document.getElementById('auth-section');
            if (!el) return;

            if (user) {
                el.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-bold hidden md:inline">สวัสดี, ${user.name}</span>
                        ${user.role === 'admin' ? '<a href="admin.html" class="bg-red-600 text-white px-2 py-1 rounded text-xs">Admin</a>' : ''}
                        <button onclick="App.auth.logout()" class="text-gray-500 hover:text-red-500"><span class="material-symbols-outlined">logout</span></button>
                    </div>`;
            } else {
                el.innerHTML = `
                    <a href="login.html" class="text-sm font-bold hover:text-gray-600">เข้าสู่ระบบ</a>
                    <a href="register.html" class="bg-black text-white px-4 py-2 rounded text-sm font-bold">สมัคร</a>`;
            }
        }
    },

    // --- 4. ระบบคำสั่งซื้อ ---
    order: {
        create: (info) => {
            const cart = App.db.cart();
            const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
            const user = App.db.user();
            
            const order = {
                id: 'ORD-' + Date.now().toString().slice(-6),
                date: new Date().toLocaleString(),
                user: user ? user.username : 'Guest',
                items: cart,
                total: total,
                info: info,
                status: 'รอตรวจสอบ'
            };

            const orders = App.db.orders();
            orders.push(order);
            App.db.saveOrders(orders);
            App.cart.clear();
            return order;
        }
    },

    // --- 5. UI Helpers ---
    ui: {
        formatMoney: (n) => '฿' + (n || 0).toLocaleString(),
        updateBadge: () => {
            const cart = App.db.cart();
            const el = document.getElementById('cart-badge');
            if (el) {
                const count = cart.reduce((sum, i) => sum + i.quantity, 0);
                el.innerText = count;
                el.style.display = count > 0 ? 'flex' : 'none';
            }
        },
        toast: (msg) => {
            const el = document.getElementById('toast');
            if(el) {
                el.innerText = msg;
                el.className = 'show';
                setTimeout(() => el.className = el.className.replace('show', ''), 3000);
            } else {
                alert(msg);
            }
        }
    }
};

// เริ่มทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    App.auth.check();
    App.ui.updateBadge();
    
    // Toggle Mobile Menu
    const btn = document.getElementById('menu-btn');
    if(btn) btn.onclick = () => document.getElementById('mobile-menu').classList.toggle('hidden');
});