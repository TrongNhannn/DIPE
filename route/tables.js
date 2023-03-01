const express = require('express');
const router = express.Router()
const Table = require('../Model/Table');
const { TablesController } = require('../controller/tables-controller');

// Xem tất cả bảng
router.get('/getall', (req, res) => {
    const Tables = new TablesController();
    Tables.getall(({ success, tables }) => {
        if (success) {
           
            res.status(200).json({ success: true, content: "Thành công", data: tables });

        } else {
            res.status(500).json({ success: false, content: "Thất bại" });
        }
    })
})
/// Xem bảng theo Crendertial_string
router.get('/getall_credential/:credential_string', (req, res) => {
    const credential_string = req.params.credential_string
        const Tables = new TablesController();
    Tables.getAllUsingCredentialString(credential_string, ({ success, tables }) => {
        if (success) {
            const data = tables.map(table => table.get());
            res.status(200).json({ success: true, content: "Thành công", data: data });

        } else {
            res.status(500).json({ success: false, content: "Không tìm thấy" });
        }
    })
})
// router.get('/',function(req,res){
//      const Tables = new TablesController();
//     Tables.getall(function(err,count){

//     if(err){ return res.status(500).json({ success: false, error: err });

//     } else{
//         return res.status(201).json({ data: count });
//     }
// });
// });
///xem bảng theo table_id
router.get('/table/:table_id', (req, res) => {
    const Tables = new TablesController();

    const criteria = [{
        field: "table_id",
        value: req.params.table_id,
        fomula: "="
    }]
    Tables.getone(criteria, ({ success, table, content }) => {
        if (success) {
            res.send(200, { table: table.get() })
        } else {
            res.send(404, { content })
        }
    })
})

router.post('/create', (req, res) => {
    const Tables = new TablesController();
    const { table_name, credential_string } = req.body;
    Tables.createTable({table_name, credential_string}, ({ success, table }) => {
        if (success) {
            res.status(200).json({ success: true, content: "Thành công", data: table });
        }
        else {
            res.status(200).json({ success: false, content: "Thất bại" });
        }
    })
})
router.put('/modify', function (req, res) {
    Table.table_modify(req.body, function (err, count) {

        if (err) {
            return res.status(500).json({ success: false, content: "Thất bại!" });

        } else {
            return res.status(201).json({ success: true, content: "Thành công" });
        }
    });
});



router.delete('/delete/all', (req, res) => {
    const Tables = new TablesController();

    Tables.dropAllTables((result) => {
        const { success, content } = result;
        if (success) {
            res.send(200, { success, content })
        }
    })
})

module.exports = { router }