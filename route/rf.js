const express = require('express');
const router = express.Router()
//nhận dữ liệu từ RFID
router.post('/rfid-data', (req, res) => {
    // Nhận dữ liệu từ request body
    const { rfid_id, timestamp } = req.body;
    if (rfid_id && timestamp) {
        console.log(`Nhận được dữ liệu RFID: ${rfid_id}, timestamp: ${timestamp}`);

        // Thực hiện các tác vụ xử lý dữ liệu ở đây, ví dụ lưu dữ liệu vào cơ sở dữ liệu
        // ...

        res.status(200).send({ success: true, message: 'Dữ liệu RFID đã được xử lý thành công.' });
    } else {
        res.status(400).send({ success: false, message: 'Dữ liệu RFID không hợp lệ.' });
    }
});
//   function parseEPC(epc) {
//     // Giả sử mã EPC có định dạng: 8-bit Header, 28-bit EPC Manager, 24-bit Object Class, và 36-bit Serial Number
//     const header = parseInt(epc.slice(0, 2), 16); // 8 bit
//     const epcManager = parseInt(epc.slice(2, 9), 16); // 28 bit
//     const objectClass = parseInt(epc.slice(9, 15), 16); // 24 bit
//     const serialNumber = parseInt(epc.slice(15, 24), 16); // 36 bit
//     return {
//         header,
//         epcManager,
//         objectClass,
//         serialNumber,
//     };
// }
// const epc = "303402AABBCCDDEEFF112233"; // Giả sử đây là chuỗi EPC
// const parsedEPC = parseEPC(epc);
// console.log(parsedEPC);


    // const data = [

    //     {

    //         id1678430036615: 'KH01',
    //         id1678430936389: 'Bé Công nè',
    //         id1678689833828: true,
    //         id1678690718781: '2001-12-29',
    //         id1678416813109: '1',
    //         id1678416827260: 'KH01',
    //         id1678416928605: '2023-03-15T16:36'
    //     },
    //     {

    //         id1678430036615: 'KH02',
    //         id1678430936389: 'Bé Thông nè',
    //         id1678689833828: false,
    //         id1678690718781: '2000-01-02',
    //         id1678416813109: '2',
    //         id1678416827260: 'KH02',
    //         id1678416928605: '2023-03-15T16:36'
    //     },
    //     {

    //         id1678430036615: 'KH01',
    //         id1678430936389: 'Bé Công nè',
    //         id1678689833828: true,
    //         id1678690718781: '2001-12-29',
    //         id1678416813109: '1',
    //         id1678416827260: 'KH01',
    //         id1678416928605: '2023-03-15T16:36'
    //     },
    //     {

    //         id1678430036615: 'KH02',
    //         id1678430936389: 'Bé Thông nè',
    //         id1678689833828: false,
    //         id1678690718781: '2000-01-02',
    //         id1678416813109: '2',
    //         id1678416827260: 'KH02',
    //         id1678416928605: '2023-03-15T16:36'
    //     },
    //     {

    //         id1678430036615: 'KH01',
    //         id1678430936389: 'Bé Công nè',
    //         id1678689833828: true,
    //         id1678690718781: '2001-12-29',
    //         id1678416813109: '1',
    //         id1678416827260: 'KH01',
    //         id1678416928605: '2023-03-15T16:36'
    //     },
    //     {
    //         id1678430036615: 'KH02',
    //         id1678430936389: 'Bé Thông nè',
    //         id1678689833828: false,
    //         id1678690718781: '2000-01-02',
    //         id1678416813109: '2',
    //         id1678416827260: 'KH02',
    //         id1678416928605: '2023-03-15T16:36'
    //     }
    // ];
    // function removeDuplicates(data) {
    //     const processedKeys = {};

    //     const uniqueData = data.filter((item) => {
    //         const key = item.id1678430036615;
    //         if (!processedKeys.hasOwnProperty(key)) {
    //             processedKeys[key] = true;
    //             return true;
    //         }
    //         return false;
    //     });
    //     return uniqueData;
    // }
    // const uniqueData = removeDuplicates(data);
    // console.log(uniqueData.length)
    // console.log(uniqueData);
module.exports = router;