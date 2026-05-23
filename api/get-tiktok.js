// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    // ปลดล็อก CORS ให้หน้าเว็บเดิมของคุณคุยกับหลังบ้านได้ปกติ ไม่ติดบล็อกความปลอดภัย
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'กรุณาส่งลิงก์ URL มาด้วยครับ' });
        }

        // ยิงคำสั่ง GET ไปหาลิงก์ตรงตามสเปก curl จริงของคุณ
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
        
        // 🔥 จุดที่ซ่อม: แกะข้อมูลให้ตรงตามล็อกของตัว TikTok Scraper ตัวนี้เป๊ะๆ
        if (response.data && response.data.data) {
            const videoInfo = response.data.data;
            
            // ส่งค่ากลับไปในชื่อตัวแปรที่หน้าเว็บเดิมของคุณรอรับอยู่ (views และ description)
            return res.status(200).json({
                views: videoInfo.play_count || 0,        // ยอดวิวสดจริงของคลิปนั้น
                description: videoInfo.title || ""       // ข้อความหัวคลิปและแฮชแท็ก
            });
        } else {
            return res.status(400).json({ error: 'โครงสร้างข้อมูลจาก API ไม่ถูกต้อง' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'ระบบหลังบ้านขัดข้อง: ' + error.message });
    }
};
