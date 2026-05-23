// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    // เปิดสิทธิ์ CORS ให้หน้าเว็บ Frontend ดึงข้อมูลได้สะดวก
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'อนุญาตเฉพาะ Method POST เท่านั้นครับ' });
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
                // 🔒 คีย์ของคุณจะถูกเก็บไว้ตรงนี้ ปลอดภัย 100% ไม่มีใครแอบดูจากหน้าเว็บได้
                'X-RapidAPI-Key': 'ae5e0d0718msha21c8cfacfcb43p18db91jsn57dd5d660839',
                'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com'
            },
            data: new URLSearchParams({ url: url, hd: '1' })
        };

        const response = await axios.request(options);
        
        if (response.data && response.data.data) {
            const videoInfo = response.data.data;
            return res.status(200).json({
                views: videoInfo.play_count || 0,
                description: videoInfo.title || ""
            });
        } else {
            return res.status(400).json({ error: 'โครงสร้างข้อมูลผู้ให้บริการไม่ถูกต้อง' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์หลักได้' });
    }
};
