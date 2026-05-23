// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
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

        // 🔒 อัปเดตคีย์และโฮสต์ให้ถูกต้องตรงตามคำสั่งจริงของคุณเป๊ะๆ
        const options = {
            method: 'GET',
            url: 'https://tiktok-scraper7.p.rapidapi.com/',
            params: {
                url: url,
                hd: '1'
            },
            headers: {
                'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
                // แก้ไขตัวเลขคีย์หลักให้ตรงตามหน้าจอของคุณแล้วครับ
                'x-rapidapi-key': 'ae5e0d0718msha21c8c8facfcb43p18db91jsn57dd5d660839'
            }
        };

        const response = await axios.request(options);
        
        if (response.data && response.data.data) {
            const videoInfo = response.data.data;
            return res.status(200).json({
                views: videoInfo.play_count || 0,
                description: videoInfo.title || ""
            });
        } else {
            return res.status(400).json({ error: 'โครงสร้างข้อมูลไม่ถูกต้อง' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'เซิร์ฟเวอร์ขัดข้อง: ' + error.message });
    }
};
