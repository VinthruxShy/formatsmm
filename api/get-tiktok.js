// api/get-tiktok.js
const axios = require('axios');

module.exports = async (req, res) => {
    // ปลดล็อกระบบรักษาความปลอดภัย CORS ดักไว้ทุกทางเพื่อให้หน้าเว็บเดิมของคุณใช้งานได้ชัวร์
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Content-Type');

    // จัดการกรณีบราวเซอร์ตรวจสอบสิทธิ์ก่อนส่งข้อมูล (Preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // ดึงลิงก์จากหน้าบ้านดั้งเดิมของคุณที่ส่งมาในรูปแบบ JSON POST
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'กรุณาส่งลิงก์ URL มาด้วยครับ' });
        }

        // 🚀 ยิงตรงเข้า Endpoint หลักตามโครงสร้างคำสั่ง curl ที่ตรวจสอบแล้วว่าทำงานได้จริง
        const options = {
            method: 'GET',
            url: 'https://tiktok-scraper7.p.rapidapi.com/',
            params: {
                url: url,
                hd: '1'
            },
            headers: {
                'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
                // 🔒 ซ่อมแซมคีย์ให้ถูกต้องตรงตามคำสั่ง curl ล่าสุดของคุณแบบตัวต่อตัวอักษรแล้วครับ
                'x-rapidapi-key': 'ae5e0d0718msha21c8c8facfcb43p18db91jsn57dd5d660839'
            }
        };

        const response = await axios.request(options);
        
        // ตรวจสอบและแกะกล่องข้อมูลจากตัวแปรของเจ้านี้
        if (response.data && response.data.data) {
            const videoInfo = response.data.data;
            
            // ส่งค่ากลับไปในชื่อตัวแปรที่หน้าเว็บเดิมของคุณรอรับอยู่เป๊ะๆ (views และ description)
            return res.status(200).json({
                views: videoInfo.play_count || 0,        // ยอดวิวสดของคลิป
                description: videoInfo.title || ""       // ข้อความหัวคลิป/แฮชแท็ก
            });
        } else {
            // หากดึงข้อมูลสำเร็จแต่โครงสร้างข้างในเปลี่ยนไป ให้ส่งกลับเพื่อไม่ให้โค้ดหน้าเว็บค้าง
            return res.status(200).json({ views: 0, description: "" });
        }

    } catch (error) {
        // ดักจับเออร์เรอร์ทุกกรณีเพื่อส่งข้อมูลกลับไปหน้าบ้าน ป้องกันไม่ให้หน้าบ้านค้างเติ่ง
        return res.status(200).json({ views: 0, description: "ระบบเครือข่ายขัดข้อง" });
    }
};
