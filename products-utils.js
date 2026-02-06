// นำเข้าข้อมูลสินค้าจากไฟล์ data
import { DEFAULT_PRODUCTS } from './products-data.js';

const COLLECTION_NAME = 'products';
const STORAGE_KEYS = {
    PRODUCTS_DB: 'db_products',
    CART: 'cart'
};

let productListeners = [];

// ฟังก์ชันดึงข้อมูลสินค้า (ถ้าไม่มี ให้เอา Default มาใส่)
export function getProductsDB() {
    const productsRaw = localStorage.getItem(STORAGE_KEYS.PRODUCTS_DB);
    let products = productsRaw ? JSON.parse(productsRaw) : [];

    // เช็คว่ามีข้อมูลไหม หรือข้อมูลเก่าน้อยกว่า 15 ชิ้น (เผื่ออัปเดต)
    if (products.length === 0 || (products.length < DEFAULT_PRODUCTS.length && !localStorage.getItem('admin_modified'))) {
        console.log("Seeding default products...");
        products = DEFAULT_PRODUCTS;
        saveProductsDB(products);
    }
    return products;
}

export function saveProductsDB(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS_DB, JSON.stringify(products));
    // mark ว่ามีการแก้ไขโดยระบบ/แอดมิน เพื่อไม่ให้ reset กลับไปค่าเดิมง่ายๆ
    localStorage.setItem('admin_modified', 'true'); 
    notifyProductListeners();
}

function notifyProductListeners() {
    const products = getProductsDB();
    productListeners.forEach(listener => listener(products));
}

// ฟังก์ชันสำหรับหน้าเว็บเรียกใช้ เพื่อรอรับข้อมูลสินค้า
export function initProductListener(onUpdate) {
    // 1. ดึงข้อมูลล่าสุด
    let products = getProductsDB();

    // 2. ส่งข้อมูลกลับไปแสดงผลทันที
    onUpdate(products);

    // 3. รอรับการอัปเดตในอนาคต
    productListeners.push(onUpdate);
}

// ฟังก์ชันอัปเดตเลขตะกร้า
export function updateBadge() {
    const cartRaw = localStorage.getItem(STORAGE_KEYS.CART);
    const cart = cartRaw ? JSON.parse(cartRaw) : [];
    
    // หา Element ที่มี ID cart-badge ในหน้า HTML
    const badges = document.querySelectorAll('#cart-badge');
    badges.forEach(badge => {
        const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
        if (count > 0) {
            badge.innerText = count;
            badge.classList.remove('hidden');
            badge.style.display = 'flex'; // บังคับแสดง
        } else {
            badge.classList.add('hidden');
            badge.style.display = 'none';
        }
    });
}