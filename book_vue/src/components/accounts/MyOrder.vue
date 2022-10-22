<template>
  <div class="myOrder">
    <div class="myOrder_wrap">
      <el-tabs v-model="activeName">
        <el-tab-pane label="全部" name="first">
          <li v-for="(item, index) of orderList" :key="index">
            <OrderItem :message="item" />
          </li>
        </el-tab-pane>
        <el-tab-pane label="交易中" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="交易完成" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="已取消" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import OrderItem from "../OrderItem.vue";
export default {
  name: "MyOrder",
  components: { OrderItem },
  data() {
    return {
      activeName: "first",
      orderList: [],
    };
  },
  methods: {},
  async mounted() {
    await this.$axios
      .get(`/node/buyerorder/buyer_id/${this.$store.state.userInfo.user_id}`)
      .then((res) => {
        // console.log(res.data.results);
        this.orderList = res.data.results;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="less" scoped>
.myOrder {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  .myOrder_wrap {
    max-width: 800px;
    margin: 20px auto;
  }
}
</style>