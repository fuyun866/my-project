const multer = require("multer")
const path = require("path")
const conn = require("../model/conn")
const moment = require("moment")


//上传文件
const storage = multer.diskStorage({
  //存储位置
  destination: function (req, file, cb) {
    console.log(file);
    let filePath = path.resolve(__dirname, "../public/images/chartImgs");
    cb(null, filePath)
  },
  //文件名字
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage }).single("file")


// 存储聊天消息到数据库
const handerchartInfo = ({uid,source,time,content},callback) => {
  var newContent = JSON.stringify(content).replace(/\"/g,"'").slice(1);
  newContent = newContent.substring(0,newContent.length-1);
  let newTime =  moment(time).format('YYYY-MM-DD HH:mm:ss')
  let sql_insert = `INSERT INTO chatrecord (msg_send,msg_time,msg_content,msg_talker) VALUES(${source},"${newTime}","${newContent}",'${uid}')`;
  conn.query(sql_insert,(err,result)=>{
    if(err){
      console.log(err);
      callback({code:0,data:"消息发送失败"})
    }else{
      console.log(result);
      callback({code:1,data:"消息发送成功"})
    }
  })
}

// 获取聊天消息
const handerGetChartInfo = ({uid},callback)=>{
  console.log(uid);
  let sql_select = `SELECT * FROM chatrecord WHERE msg_talker='${uid}'`;
  conn.query(sql_select,(err,result)=>{
    if(err){
      console.log(err);
      callback({code:0,msg:"消息获取失败"})
    }else{
      // console.log(result);
      callback({code:1,data:result,msg:"消息获取成功"})
    }
  })
}


module.exports = {
  upload,
  handerchartInfo,
  handerGetChartInfo
}