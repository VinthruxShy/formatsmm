// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    // ปลดล็อกระบบความปลอดภัย CORS ให้บราวเซอร์ปล่อยผ่านชัวร์
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Origin', '*');
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

        // ⚡ ปรับโครงสร้างการยิงข้อมูลให้ตรงตามสเปก curl จริงของคุณเป๊ะๆ
        const options = {
            method: 'GET', // เปลี่ยนเป็น GET ตาม curl
            url: 'https://tiktok-scraper7.p.rapidapi.com/', // ลิงก์ตรงที่ถูกต้อง
            params: {
                url: url, // ส่งลิงก์ tiktok ที่เพื่อนๆ กรอกเข้ามา
                hd: '1'
            },
            headers: {
                'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
                'x-rapidapi-key': 'ae5e0d0718msha21c8c8facfcb43p18db91jsn57dd5d660839' // คีย์ของคุณจากใน curl
            }
        };

        const response = await axios.request(options);
        
        // แกะโครงสร้างการตอบกลับของเจ้านี้ (อ้างอิงตามโครงสร้างของเจ้า tikwm)
        if (response.data && response.data.data) {
            const videoInfo = response.data.data;
            return res.status(200).json({
                views: videoInfo.play_count || 0,
                description: videoInfo.title || ""
            });
        } else {
            return res.status(400).json({ error: 'ดึงข้อมูลสำเร็จ แต่โครงสร้าง API ไม่ตรง' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง: ' + error.message });
    }
};
