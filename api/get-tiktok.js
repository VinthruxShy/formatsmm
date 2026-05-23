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

        const options = {
            method: 'GET',
            url: 'https://tiktok-scraper7.p.rapidapi.com/',
            params: { url: url, hd: '1' },
            headers: {
                'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
                'x-rapidapi-key': 'ae5e0d0718msha21c8c8facfcb43p18db91jsn57dd5d660839'
            },
            timeout: 4000 // หาก API ดึงข้อมูลช้าเกิน 4 วินาที ให้ตัดเข้าแผนสำรองหน้าเว็บทันที
        };

        const response = await axios.request(options);
        
        if (response.data && response.data.data) {
            return res.status(200).json({
                views: response.data.data.play_count || 0
            });
        } else {
            return res.status(200).json({ views: 0 }); // ส่ง 0 เพื่อให้หน้าบ้านใช้แผนสำรอง
        }

    } catch (error) {
        // หาก API บล็อกหรือโควตาหมด ส่งยอดวิว 0 เพื่อให้หน้าบ้านทำงานต่อได้ทันที
        return res.status(200).json({ views: 0 });
    }
};
