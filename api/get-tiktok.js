// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    // ปลดล็อกความปลอดภัย CORS ให้หน้าเว็บเดิมของคุณดึงข้อมูลได้ปกติ ไม่ติดบล็อกบราวเซอร์
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // รองรับช่วงที่บราวเซอร์เช็คสิทธิ์ความปลอดภัยก่อนส่งข้อมูล
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ⚡ ซ่อมแซมจุดนี้: ยอมรับสิทธิ์คำสั่ง POST ดั้งเดิมจากหน้าเว็บของคุณ
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'หน้าเว็บเดิมส่งคำสั่งมาไม่ถูกต้อง' });
    }

    try {
        // แกะลิงก์ที่หน้าเว็บเดิมส่งมาในรูปแบบรูปแบบ JSON Body
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'กรุณาส่งลิงก์ URL มาด้วยครับ' });
        }

        // 🚀 ยิงไปดึงข้อมูลสดจาก RapidAPI ตามสเปก curl จริงที่ใช้งานได้ชัวร์
        const options = {
            method: 'GET',
            url: 'https://tiktok-scraper7.p.rapidapi.com/',
            params: {
                url: url,
                hd: '1'
            },
            headers: {
                'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
                'x-rapidapi-key': 'ae5e0d0718msha21c8c8facfcb43p18db91jsn57dd5d660839'
            }
        };

        const response = await axios.request(options);
        
        // 📦 แกะกล่องข้อมูลส่งกลับไปในชื่อที่หน้าเว็บเดิมของคุณแกะรอรับอยู่เป๊ะๆ
        if (response.data && response.data.data) {
            const videoInfo = response.data.data;
            
            return res.status(200).json({
                views: videoInfo.play_count || 0,        // ส่งยอดวิวสดจริงกลับไป
                description: videoInfo.title || ""       // ส่งข้อความ/แฮชแท็กกลับไป
            });
        } else {
            return res.status(400).json({ error: 'โครงสร้างข้อมูลจาก RapidAPI ไม่ตรงล็อก' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'ระบบหลังบ้านพังชะงัก: ' + error.message });
    }
};
