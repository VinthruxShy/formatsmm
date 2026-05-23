// api/get-tiktok.js
module.exports = async (req, res) => {
    // ปลดล็อกระบบความปลอดภัยเพื่อให้หน้าบ้านคุยกับหลังบ้านได้ไร้รอยต่อ
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

    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'กรุณาส่งลิงก์ URL มาด้วยครับ' });
        }

        // ยิงไปหา RapidAPI ด้วยคำสั่ง fetch มาตรฐาน (ตัดปัญหาโค้ดพังเงียบ)
        const response = await fetch('https://tiktok-scraper7.p.rapidapi.com/api/video/info', {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'ae5e0d0718msha21c8cfacfcb43p18db91jsn57dd5d660839',
                'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com'
            },
            body: new URLSearchParams({ url: url, hd: '1' })
        });

        const responseData = await response.json();
        
        if (responseData && responseData.data) {
            return res.status(200).json({
                views: responseData.data.play_count || 0,
                description: responseData.data.title || ""
            });
        }
        
        return res.status(400).json({ error: 'โครงสร้างข้อมูลผู้ให้บริการไม่ถูกต้อง' });

    } catch (error) {
        return res.status(500).json({ error: 'เซิร์ฟเวอร์หลังบ้านทำงานขัดข้อง: ' + error.message });
    }
};
