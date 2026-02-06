// ข้อมูลสินค้าต้นฉบับ (เพิ่มเป็น 15 ชิ้น ตามโจทย์)
export const DEFAULT_PRODUCTS = [
    // --- หมวด 1: RIFLE (ปืนยาว) ---
    {
        id: 1,
        name: "M4A1 Carbine Custom",
        category: "rifle",
        price: 12500,
        brand: "Tokyo Marui",
        model: "M4-C01",
        image: "assets/images/1.jpg", // ตรวจสอบว่ามีรูปชื่อนี้ใน folder
        desc: "M4A1 รุ่นแต่งเต็ม ระบบ Gas Blowback แรงถีบสมจริง บอดี้โลหะ Full Metal แม่นยำสูง"
    },
    {
        id: 2,
        name: "AK-47 PMC Style",
        category: "rifle",
        price: 9800,
        brand: "CYMA",
        model: "AK-74U",
        image: "assets/images/2.jpg",
        desc: "AK-47 ทรงทันสมัย พานท้ายยืดหดได้ พร้อมรางติดอุปกรณ์ แม็กกาซีนโค้งอันเป็นเอกลักษณ์"
    },
    {
        id: 3,
        name: "HK416 Delta Custom",
        category: "rifle",
        price: 14500,
        brand: "VFC",
        model: "HK-416D",
        image: "assets/images/3.jpg",
        desc: "หน่วยรบพิเศษเลือกใช้ ระบบไฟฟ้า High Torque ยิงรัวสะใจ วัสดุเกรดพรีเมียม"
    },
    {
        id: 4,
        name: "SCAR-L CQC",
        category: "rifle",
        price: 11200,
        brand: "WE Tech",
        model: "SCAR-L",
        image: "assets/images/4.jpg",
        desc: "พับพานท้ายได้ เหมาะสำหรับที่แคบ สี Tan สวยงาม ปรับโหมดยิงได้ 3 ระดับ"
    },
    {
        id: 5,
        name: "AUG A3 Bullpup",
        category: "rifle",
        price: 9200,
        brand: "JG Works",
        model: "AUG-A3",
        image: "assets/images/5.jpg",
        desc: "ทรง Bullpup ลำกล้องยาวแต่ตัวปืนสั้น ทำให้แม่นยำสูงในขณะที่ยังคล่องตัว"
    },

    // --- หมวด 2: PISTOL (ปืนสั้น) ---
    {
        id: 6,
        name: "Glock 17 Gen 5",
        category: "pistol",
        price: 4200,
        brand: "Umarex",
        model: "G17-G5",
        image: "assets/images/6.jpg",
        desc: "ปืนสั้นมาตรฐานโลก ทนทาน อะไหล่หาง่าย ระบบแก๊สโบลวแบ็ค สไลด์โลหะ"
    },
    {
        id: 7,
        name: "Hi-Capa 5.1 Gold Match",
        category: "pistol",
        price: 5500,
        brand: "Tokyo Marui",
        model: "HC-51",
        image: "assets/images/7.jpg",
        desc: "แต่งซิ่งจากโรงงาน ไกเบา สไลด์เจาะพอร์ต สีทองตัดดำ หรูหราและแม่นยำ"
    },
    {
        id: 8,
        name: "M1911 A1 Classic",
        category: "pistol",
        price: 3800,
        brand: "KJW",
        model: "M1911-A1",
        image: "assets/images/8.jpg",
        desc: "คลาสสิคตลอดกาล โลหะทั้งกระบอก เสียงสไลด์กระแทกเพราะมาก ด้ามจับลายไม้"
    },
    {
        id: 9,
        name: "Desert Eagle .50AE",
        category: "pistol",
        price: 6200,
        brand: "Cybergun",
        model: "DE-50",
        image: "assets/images/9.jpg",
        desc: "ปืนสั้นที่ใหญ่ที่สุด แรงถีบหนักหน่วง สะใจขาโหด ใครชอบความแรงต้องกระบอกนี้"
    },
    {
        id: 10,
        name: "Beretta M9A1",
        category: "pistol",
        price: 4000,
        brand: "WE Tech",
        model: "M9A1",
        image: "assets/images/10.jpg",
        desc: "ปืนพระเอก ยิงแม่น จุกระสุนได้เยอะ ระบบเซฟตี้ดีเยี่ยม งานประกอบแข็งแรง"
    },

    // --- หมวด 3: GEAR (อุปกรณ์) ---
    {
        id: 11,
        name: "Red Dot Sight",
        category: "gear",
        price: 1200,
        brand: "Aimpoint Replica",
        model: "T1-Micro",
        image: "assets/images/11.jpg",
        desc: "ช่วยเล็งจับเป้าไว ปรับสีแดง/เขียวได้ ทนแรงรีคอยล์ ติดตั้งง่ายกับราง 20mm"
    },
    {
        id: 12,
        name: "Tactical Vest JPC",
        category: "gear",
        price: 1800,
        brand: "Emerson",
        model: "JPC-2.0",
        image: "assets/images/12.jpg",
        desc: "เวสเกราะอ่อน ทรง JPC น้ำหนักเบา ระบายอากาศดี คล่องตัวสุดๆ ใส่แม็กกาซีนได้ 3 ซอง"
    },
    {
        id: 13,
        name: "Fast Helmet",
        category: "gear",
        price: 950,
        brand: "FMA",
        model: "FAST-BJ",
        image: "assets/images/13.jpg",
        desc: "หมวกกันน็อคทรง Fast ปรับขนาดได้ มีรางข้างสำหรับติดหูฟังหรือไฟฉาย ใส่สบาย"
    },
    {
        id: 14,
        name: "Green Gas (High Pressure)",
        category: "gear",
        price: 350,
        brand: "Smart Gas",
        model: "1000ml",
        image: "assets/images/14.jpg",
        desc: "แก๊สแรงดันสูง ผสมซิลิโคน รักษาโอริง เพิ่มความแรงให้ปืนแก๊สของคุณ"
    },
    {
        id: 15,
        name: "BB Bullet 0.25g",
        category: "gear",
        price: 280,
        brand: "Golden Ball",
        model: "0.25g-3000",
        image: "assets/images/15.jpg",
        desc: "ลูกกระสุนเกรดแข่งขัน ผิวขัดมัน ไร้รอยต่อ ถุงละ 3000 นัด น้ำหนัก 0.25g แม่นยำสูง"
    }
];