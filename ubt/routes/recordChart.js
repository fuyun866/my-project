var express = require('express');
const ChartController = require('../controllers/chartController');
var router = express.Router();

//发送消息
router.post("/uploadChartImg", ChartController.uploadChartImg)
// 聊天信息提交数据库
router.post("/chartInfoSubmit",ChartController.chartInfoSubmit)
// 获取聊天信息
router.post("/getChartInfo",ChartController.getChartInfo)

module.exports = router;
