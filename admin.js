/* --- TACTICAL OPS : ADMIN COMMAND SYSTEM --- */

const KEYS = {
    PRODUCTS: 'tactical_products',
    ORDERS: 'tactical_orders',
    USERS: 'tactical_users'
};

// --- INITIALIZATION ---
function initAdmin() {
    // 1. Check Login
    if (!sessionStorage.getItem('tactical_admin_role')) {
        window.location.href = 'admin-login.html';
        return;
    }

    // 2. SMART DATA LOADER (แก้ใหม่: โหลดของเดิมก่อน ถ้าไม่มีค่อยดึงจาก Code)
    const storedProducts = localStorage.getItem(KEYS.PRODUCTS);
    
    if (!storedProducts) {
        // ถ้าไม่มีข้อมูลเลย ให้โหลดจาก data.js
        if (typeof SYSTEM_DATA !== 'undefined') {
            console.log("Initializing System Data...");
            saveData(KEYS.PRODUCTS, SYSTEM_DATA);
        }
    } else {
        // ถ้ามีข้อมูลอยู่แล้ว ให้ใช้ข้อมูลเดิม (ที่แอดมินอาจจะแก้ไปแล้ว)
        console.log("Loaded existing database.");
    }

    // 3. Load Dashboard Data
    renderDashboard();
    renderProducts();
    renderOrders();
    renderUsers();
}

function logout() {
    sessionStorage.removeItem('tactical_admin_role');
    window.location.href = 'admin-login.html';
}

function switchTab(tabId, btn) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.add('d-none'));
    document.getElementById('tab-' + tabId).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
}

// ฟังก์ชันล้างข้อมูลกลับไปเป็นค่าเริ่มต้น (จาก data.js)
function resetSystemData() {
    Swal.fire({
        title: 'FACTORY RESET?',
        text: "ข้อมูลสินค้าที่แก้ไขจะหายไปทั้งหมด และกลับไปเป็นค่าเริ่มต้น 15 ชิ้น",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'YES, RESET',
        background: '#1c1c1c', color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            if (typeof SYSTEM_DATA !== 'undefined') {
                saveData(KEYS.PRODUCTS, SYSTEM_DATA);
                location.reload();
            }
        }
    });
}

// --- DATA HELPERS ---
function getData(key) { return JSON.parse(localStorage.getItem(key)) || []; }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// --- DASHBOARD METRICS ---
function renderDashboard() {
    const products = getData(KEYS.PRODUCTS);
    const orders = getData(KEYS.ORDERS);
    const users = getData(KEYS.USERS);

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    document.getElementById('totalSales').innerText = totalSales.toLocaleString();
    document.getElementById('totalOrders').innerText = orders.length;
    document.getElementById('totalProducts').innerText = products.length;
    document.getElementById('totalUsers').innerText = users.length;

    renderChart(orders);
}

function renderChart(orders) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    const dataPoints = [0, 0, 0, 0, 0, orders.length]; 
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Today'],
            datasets: [{
                label: 'Orders',
                data: dataPoints,
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#333' }, ticks: { color: '#888' } },
                x: { grid: { display: false }, ticks: { color: '#888' } }
            }
        }
    });
}

// --- PRODUCT MANAGEMENT ---
function renderProducts() {
    const products = getData(KEYS.PRODUCTS);
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image}" class="rounded border border-secondary" style="width:50px; height:50px; object-fit:cover;"></td>
            <td class="fw-bold text-white">${p.name}</td>
            <td><span class="badge bg-dark border border-warning text-warning">${p.category}</span></td>
            <td class="text-gold font-monospace">${p.price.toLocaleString()}</td>
            <td>
                <button class="btn btn-sm btn-outline-warning" onclick="editProduct('${p.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger ms-1" onclick="deleteProduct('${p.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openProductModal() {
    document.getElementById('modalTitle').innerText = 'ADD NEW ITEM';
    document.getElementById('pId').value = '';
    document.getElementById('pName').value = '';
    document.getElementById('pCat').value = 'WEAPONS';
    document.getElementById('pPrice').value = '';
    document.getElementById('pImg').value = '';
    document.getElementById('pImgFile').value = '';
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

function editProduct(id) {
    const products = getData(KEYS.PRODUCTS);
    const p = products.find(x => x.id === id);
    if(p) {
        document.getElementById('modalTitle').innerText = 'EDIT ITEM';
        document.getElementById('pId').value = p.id;
        document.getElementById('pName').value = p.name;
        document.getElementById('pCat').value = p.category;
        document.getElementById('pPrice').value = p.price;
        document.getElementById('pImg').value = p.image;
        document.getElementById('pImgFile').value = '';
        new bootstrap.Modal(document.getElementById('productModal')).show();
    }
}

function saveProduct() {
    const id = document.getElementById('pId').value;
    const name = document.getElementById('pName').value;
    const cat = document.getElementById('pCat').value;
    const price = Number(document.getElementById('pPrice').value);
    
    const urlInput = document.getElementById('pImg');
    const fileInput = document.getElementById('pImgFile');

    if (!name || !price) return Swal.fire('Error', 'Please fill required fields', 'error');

    const commitSave = (finalImage) => {
        let products = getData(KEYS.PRODUCTS);
        
        if (id) {
            // EDIT EXISTING
            const idx = products.findIndex(x => x.id === id);
            if (idx !== -1) {
                products[idx] = { 
                    ...products[idx], 
                    name, 
                    category: cat, 
                    price, 
                    image: finalImage || products[idx].image 
                };
            }
        } else {
            // ADD NEW
            const newId = 'P' + Date.now().toString().slice(-5);
            const fallbackImg = 'https://via.placeholder.com/400x400?text=TACTICAL';
            products.push({ 
                id: newId, 
                name, 
                category: cat, 
                price, 
                image: finalImage || fallbackImg 
            });
        }
        
        saveData(KEYS.PRODUCTS, products);
        renderProducts();
        renderDashboard();
        
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        
        Swal.fire({ 
            icon: 'success', 
            title: 'DATABASE UPDATED', 
            text: 'หน้าร้านค้าจะแสดงข้อมูลใหม่ทันที',
            toast: true, 
            position: 'top-end', 
            timer: 2000, 
            background: '#1c1c1c', 
            color: '#ffc107' 
        });
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { commitSave(e.target.result); };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        commitSave(urlInput.value);
    }
}

function deleteProduct(id) {
    Swal.fire({
        title: 'DELETE ITEM?',
        text: "สินค้านี้จะถูกลบออกจากหน้าร้านทันที",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        background: '#1c1c1c', color: '#fff',
        confirmButtonText: 'YES, DELETE'
    }).then((result) => {
        if (result.isConfirmed) {
            let products = getData(KEYS.PRODUCTS);
            products = products.filter(x => x.id !== id);
            saveData(KEYS.PRODUCTS, products);
            renderProducts();
            renderDashboard();
        }
    });
}

// --- ORDER MANAGEMENT ---
let currentOrderId = null;

function renderOrders() {
    const orders = getData(KEYS.ORDERS);
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = orders.map(o => `
        <tr>
            <td class="text-gold font-monospace">#${o.id}</td>
            <td>${o.customerName}</td>
            <td class="fw-bold">${o.total.toLocaleString()}</td>
            <td>${o.paymentMethod}</td>
            <td><span class="badge ${o.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark'}">${o.status}</span></td>
            <td><button class="btn btn-sm btn-light" onclick="viewOrder('${o.id}')">DETAILS</button></td>
        </tr>
    `).join('');
}

function viewOrder(id) {
    currentOrderId = id;
    const orders = getData(KEYS.ORDERS);
    const order = orders.find(x => x.id === id);
    if(!order) return;

    const itemsHtml = order.items.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2 border-bottom border-secondary pb-2">
            <div class="d-flex align-items-center">
                <img src="${item.image}" style="width:40px; height:40px; object-fit:cover;" class="rounded me-2">
                <div>
                    <div class="text-white small">${item.name}</div>
                    <div class="text-muted small">x${item.quantity}</div>
                </div>
            </div>
            <div class="text-gold">${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');

    const content = `
        <div class="row mb-3">
            <div class="col-6"><small class="text-muted">ORDER ID:</small><br><span class="text-gold font-monospace">#${order.id}</span></div>
            <div class="col-6 text-end"><small class="text-muted">DATE:</small><br><span>${new Date(order.date).toLocaleDateString()}</span></div>
        </div>
        <div class="bg-black p-3 rounded mb-3 border border-secondary">
            <h6 class="text-white border-bottom border-secondary pb-2 mb-2">CUSTOMER INFO</h6>
            <div class="small">NAME: ${order.customerName}</div>
            <div class="small">PHONE: ${order.customerPhone}</div>
            <div class="small">ADDRESS: ${order.customerAddress}</div>
        </div>
        <div class="mb-3">
            <h6 class="text-white mb-3">ITEMS</h6>
            ${itemsHtml}
        </div>
        <div class="d-flex justify-content-between h5 text-gold border-top border-secondary pt-3">
            <span>TOTAL AMOUNT</span>
            <span>฿${order.total.toLocaleString()}</span>
        </div>
        ${order.paymentMethod === 'QR' ? '<div class="alert alert-info bg-dark border-info text-info mt-2"><i class="fas fa-info-circle me-2"></i>User selected QR Payment.</div>' : ''}
    `;
    
    document.getElementById('orderDetailContent').innerHTML = content;
    new bootstrap.Modal(document.getElementById('orderModal')).show();
}

function updateOrderStatus(status) {
    if(!currentOrderId) return;
    let orders = getData(KEYS.ORDERS);
    const idx = orders.findIndex(o => o.id === currentOrderId);
    if(idx !== -1) {
        orders[idx].status = status;
        saveData(KEYS.ORDERS, orders);
        renderOrders();
        bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide();
        renderDashboard(); 
        Swal.fire({icon:'success', title:'UPDATED', toast:true, position:'top', timer:1000, background:'#1c1c1c', color:'#fff'});
    }
}

// --- USER MANAGEMENT ---
function renderUsers() {
    const users = getData(KEYS.USERS);
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = users.map(u => `
        <tr>
            <td class="text-primary font-monospace">${u.username}</td>
            <td class="text-white">${u.name || '-'}</td>
            <td class="text-muted">${u.phone || '-'}</td>
            <td class="text-muted small text-truncate" style="max-width: 150px;">${u.address || '-'}</td>
        </tr>
    `).join('');
}