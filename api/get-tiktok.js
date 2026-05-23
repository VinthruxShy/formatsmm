// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    // ปลดล็อกระบบความปลอดภัย CORS ให้หน้าเว็บเดิมดึงข้อมูลได้ปกติ
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // แกะ URL ที่หน้าเว็บเดิมของพี่ส่งมา
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'กรุณาส่งลิงก์ URL มาด้วยครับ' });
        }

        // ยิงคำสั่งดึงข้อมูลตามสเปก curl จริงของพี่
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
        
        // ⚡ จุดแก้ไขจากการทดสอบระบบจริง: ส่งตัวแปรชื่อดั้งเดิมกลับไปหาหน้าเว็บพี่
        if (response.data && response.data.data) {
            const videoInfo = response.data.data;
            
            // ส่งกลับด้วยชื่อ 'play_count' และ 'title' เพื่อให้ตรงล็อกกับโค้ดหน้าเว็บดั้งเดิมของพี่เป๊ะๆ
            return res.status(200).json({
                play_count: videoInfo.play_count || 0,
                title: videoInfo.title || ""
            });
        } else {
            // ดักจับกรณี API ขัดข้อง ส่งเลข 0 กลับไปหน้าเว็บจะได้ไม่ค้าง
            return res.status(200).json({ play_count: 0, title: "" });
        }

    } catch (error) {
        // ดักจับกรณีเออร์เรอร์/โควตาหมด ส่งค่ากลับไปเพื่อให้ระบบหน้าบ้านทำงานต่อได้ ไม่ค้างเติ่ง
        return res.status(200).json({ play_count: 0, title: "Error Network" });
    }
};
