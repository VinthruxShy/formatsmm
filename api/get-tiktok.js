// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    // รองรับ CORS ให้หน้าเว็บเรียกใช้งานได้
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
        // ดึงตัวเลือก Endpoint ของเจ้านี้ (ดึงข้อมูลผ่านแชร์ลิงก์หรือลิงก์วิดีโอ)
        const options = {
            method: 'POST',
            url: 'https://tiktok-scraper7.p.rapidapi.com/api/video/info', // ปรับ endpoint เป็นตัวหลักของ tikwm
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                // 🔥 คีย์ของคุณจากหน้าจอภาพก่อนหน้า
                'X-RapidAPI-Key': 'ae5e0d0718msha21c8cfacfcb43p18db91jsn57dd5d660839',
                'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com'
            },
            data: new URLSearchParams({
                url: url,
                hd: '1'
            })
        };

        const response = await axios.request(options);
        
        // โครงสร้างของข้อมูลจากเจ้า tikwm จะถูกห่อไว้ในวัตถุชื่อ data อีกทีหนึ่ง
        if (response.data && response.data.code === 0 && response.data.data) {
            const videoInfo = response.data.data;
            
            // ดึงยอดวิวปัจจุบัน และข้อความอธิบาย (ซึ่งจะมีแฮชแท็กปนอยู่)
            const liveViews = videoInfo.play_count || 0;
            const description = videoInfo.title || "";

            return res.status(200).json({
                views: liveViews,
                description: description
            });
        } else {
            // หาก API ส่งค่ากลับมาแต่โครงสร้างไม่ถูกต้อง
            return res.status(400).json({ error: response.data.msg || 'โครงสร้าง API ไม่ถูกต้อง' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ RapidAPI ได้' });
    }
};
