// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'กรุณาส่งลิงก์ URL มาด้วยครับ' });
    }

    try {
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
            const videoInfo = response.data.data;
            
            // 🔥 ส่งตัวแปรกลับไปให้หน้าเว็บตรงตามที่ index.html ต้องการ
            return res.status(200).json({
                views: videoInfo.play_count || 0,
                description: videoInfo.title || ""
            });
        } else {
            return res.status(400).json({ error: 'โครงสร้างข้อมูลไม่สมบูรณ์' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'ติดต่อ API ไม่สำเร็จ' });
    }
};
