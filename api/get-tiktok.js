// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    // รองรับ CORS ให้หน้าเว็บดึงข้อมูลได้
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
        // แกะเอา ID วิดีโอจากลิงก์ TikTok
        const match = url.match(/video\/(\d+)/);
        if (!match) {
            return res.status(400).json({ error: 'รูปแบบลิงก์ TikTok ไม่ถูกต้อง' });
        }
        const videoId = match[1];

        // เรียกใช้งานดึงข้อมูลจาก RapidAPI (เปลี่ยน URL และ Key ตามบริการที่คุณเลือกใช้)
        const options = {
            method: 'GET',
            url: 'https://tiktok-all-in-one-downloader.p.rapidapi.com/video/info', 
            params: { video_id: videoId },
            headers: {
                'X-RapidAPI-Key': 'ae5e0d0718msha21c8c8facfcb43p18db91jsn57dd5d660839
',
                'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        const videoData = response.data;

        // ดึงค่ายอดวิว และ ข้อความแฮชแท็ก สดๆ จาก TikTok
        // (โครงสร้างการตอบกลับของ JSON อาจเปลี่ยนไปตาม API แต่ละเจ้า ให้ปรับตามจริง)
        const liveViews = videoData.play_count || videoData.views || 0;
        const description = videoData.title || videoData.description || "";

        return res.status(200).json({
            views: liveViews,
            description: description
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลจาก TikTok ได้ในขณะนี้' });
    }
};
