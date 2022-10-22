var express = require('express');
const BuyerorderController = require('../controllers/BuyerorderController');
var router = express.Router();

/* GET users listing. */
//添加
router.post("/", BuyerorderController.addOrder)
//更新
router.put("/:id", BuyerorderController.updateOrder) 
//删除
router.delete("/:id", BuyerorderController.deleteOrder)
//查询
router.get("/book_id/:id", BuyerorderController.getOrder_bookId)
router.get("/buyer_id/:id", BuyerorderController.getOrder_buyerId)
router.get("/seller_id/:id", BuyerorderController.getOrder_sellerId)
router.post("/status", BuyerorderController.getOrder_status)

module.exports = router;
