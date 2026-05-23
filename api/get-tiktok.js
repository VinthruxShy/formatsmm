// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    // ปลดล็อก CORS ดักหน้าหลังบ้าน เพื่อให้เว็บบราวเซอร์ยอมปล่อยผ่าน
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'กรุณาส่งลิงก์ URL มาด้วยครับ' });
        }

        // หลังบ้านเป็นคนยิงไปหา RapidAPI เอง บราวเซอร์จะไม่บล็อก
        const options = {
            method: 'POST',
            url: 'https://tiktok-scraper7.p.rapidapi.com/api/video/info', 
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'ae5e0d0718msha21c8cfacfcb43p18db91jsn57dd5d660839',
                'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com'
            },
            data: new URLSearchParams({ url: url, hd: '1' })
        };

        const response = await axios.request(options);
        
        if (response.data && response.data.data) {
            return res.status(200).json({
                views: response.data.data.play_count || 0,
                description: response.data.data.title || ""
            });
        }
        
        return res.status(400).json({ error: 'โครงสร้างข้อมูลผิดพลาด' });

    } catch (error) {
        return res.status(500).json({ error: 'ติดต่อ API หลักไม่สำเร็จ' });
    }
};
