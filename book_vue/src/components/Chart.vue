<template>
  <div class="chart" ref="chart">
    <div class="header_wrap">
      <!-- 聊天页面头部 -->
      <div class="header">
        <img
          src="@/assets/imgs/leftArrow.png"
          @click="$router.push({ path: '/' })"
          alt=""
        />
        <p>客服热线:19566677788</p>
        <p>服务时间:6:00-22:00</p>
      </div>
    </div>
    <!-- 中间的对话列表 -->
    <div class="center_wrap">
      <ul class="center_wrap_list" v-show="message_list[0] !== null">
        <li v-for="(item, index) of message_list" :key="index" >
          <!-- <img :src="item.imgUrl" alt="" /> -->
          <div :class="item.msg_send == 0 ? className[0] : className[1]">
            <div class="avatar"><img :src="item.imgUrl" alt="" /></div>
            <div class="message_content" ref="message_content"></div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 发送信息框 -->
    <div class="message">
      <div class="message_wrap">
        <el-upload
          class="upload-demo"
          action="/node/chart/uploadChartImg"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
          multiple
          :limit="3"
        >
          <i class="el-icon-circle-plus-outline upload_img"></i>
        </el-upload>
        <span class="img_test"></span>
        <div class="editable_scroll">
          <div ref="editable" class="editable" contenteditable="true"></div>
        </div>
        <button class="message_bth" @click="handerHtml">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          name: "food.jpg",
          url: require("../assets/imgs/girl.webp"),
        },
      ],
      imgUrl: require("../assets/imgs/girl.webp"),
      className: ["center_wrap_item left", "center_wrap_item right"],
      message_list: [],
    };
  },
  methods: {
    // 文件成功上传的回调
    handleAvatarSuccess(obj, res, file) {
      console.log(obj, res, file);
      let imageUrl = "/node/images/chartImgs/" + res.response.data.filename;
      this.$refs.editable.innerHTML += `<img src=${imageUrl} style="max-width:100px" alt="">`;
    },
    // 点击发送按钮
    async handerHtml() {
      console.log(this.$refs.editable.innerHTML);
      let content = this.$refs.editable.innerHTML;
      this.message_list.push({
        msg_send: 0,
        imgUrl: require("../assets/imgs/girl2.jpg"),
        message: `${content}`,
      });
      // 
      let that = this;
      setTimeout(function () {
        console.log(that.$refs.message_content);
        that.$refs.message_content[
          that.message_list.length - 1
        ].innerHTML = `${content}`;
      }, 100);
      that.$refs.editable.innerHTML = ``;
      let { data } = await this.$axios.post("/node/chart/chartInfoSubmit", {
        uid: this.$store.state.userInfo.uid,
        source: 0,
        time: new Date(),
        content: content,
      });
      if (!data.code) this.$message.error(data.data);
      console.log(data);
    },
    // 文件上传的限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
  },
  async mounted() {
    let that = this;
    setTimeout(async function () {
      // 聊天整天布局的设置，聊天主题高度自适应
      const resizeObserver = new ResizeObserver((entries) => {
        let height = entries[0].borderBoxSize[0].blockSize;
        if (that.$refs.chart) {
          console.log("检查高度");
          that.$refs.chart.style.paddingBottom = `${height}px`;
        }
      });
      resizeObserver.observe(document.querySelector(".message"));
      console.log(that.$store.state.userInfo.uid, "身份");
      // 获取所有聊天信息
      let { data } = await that.$axios.post("/node/chart/getChartInfo", {
        uid: that.$store.state.userInfo.uid,
      });

      for(let i=0;i<data.data.length;i++){
        that.message_list.push({});
      }

      setTimeout(function () {
        if (data.code) {
          console.log(data.data,data.data[0], "消息");
          let newData=data.data.map((item) => {
            if (item.msg_send == 0) {
              item = { ...item, imgUrl: that.$store.state.userInfo.user_image };
            }
            return item;
          });
          that.message_list = newData;
          that.message_list.map((item, index) => {
            that.$refs.message_content[index].innerHTML = item.msg_content;
          });
        } else {
          that.$message.error(data.msg);
        }
      }, 100);
    }, 200);

  },
};
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  position: relative;
  padding-top: 70px;
  padding-bottom: 70px;
  box-sizing: border-box;
  .header_wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    .header {
      position: relative;
      width: 100%;
      height: 70px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #333;
      background: #409eff;
      img {
        position: absolute;
        top: 20px;
        left: 10px;
        width: 30px;
        cursor: pointer;
      }
      p {
        color: #333;
        font-family: "Courier New", Courier, monospace;
      }
      p:nth-of-type(2) {
        margin-top: 6px;
      }
    }
  }
  // 中间的对话列表
  .center_wrap {
    width: 100%;
    height: calc(100%);
    padding: 10px;
    box-sizing: border-box;
    background: #ff6700;
    margin: 0 auto;
    overflow-y:scroll;
    overflow-x:hidden;
    .center_wrap_list {
      width: 100%;
      // height: 100%;
      li {
        // min-height: 100px;
        margin-top:20px;
        // background: #eee;
        // clear: both;
        overflow: hidden;
        .center_wrap_item {
          min-width: 200px;
          min-height: 100px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .avatar {
            width: 50px;
            height: 50px;
            // border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .message_content {
            width: 120px;
            background: #eee;
            max-width: 120px;
            min-height: 20px;
            line-height: 20px;
            border-radius: 10px;
            padding: 5px;
            box-sizing: border-box;
            border: 1px solid #333;
          }
        }
      }
    }
  }
  // 发送信息框
  .message {
    position: fixed;
    bottom: 0px;
    left: 0;
    width: 100%;
    min-height: 70px;
    padding: 10px 0;
    box-sizing: border-box;
    background: #eee;
    .upload_img {
      position: absolute;
      bottom: 10px;
      left: 20px;
      font-size: 40px;
      color: #333;
      text-align: center;
    }
    .message_wrap {
      width: 680px;
      min-height: 70px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .send_img {
      position: absolute;
      bottom: 14px;
      left: 10px;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }

    .editable_scroll {
      min-width: 500px;
      max-width: 500px;
      min-height: 40px;
      box-sizing: border-box;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }
    .editable {
      min-width: calc(100% + 16px);
      max-width: calc(100% + 16px);
      padding: 11px 15px;
      box-sizing: border-box;
      max-height: 300px;
      overflow-y: scroll;
      overflow-x: hidden;
      border: none;
      font-size: 18px;
      border-radius: 20px;
      line-height: 18px;
      outline: none;
      background: #fff;
    }
    .send_input {
      position: relative;
      width: 700px;
      min-height: 40px;
      max-height: 300px;
      overflow: scroll;
      border: 1px solid #333;
      border-radius: 20px;
      padding: 0 10px;
      box-sizing: border-box;
      margin-left: 20px;
      background: url("../assets/imgs/girl.webp") no-repeat 10% center;
      background-size: 30px;
    }
    .message_bth {
      position: absolute;
      bottom: 14px;
      right: 0;
      width: 80px;
      height: 40px;
      border: 1px solid #b0b0b0;
      border-radius: 20px;
      background: #409eff;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>