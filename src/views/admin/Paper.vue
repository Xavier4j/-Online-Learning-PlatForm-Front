<template>
  <v-container>
    <v-chip class="my-3" color="orange" label text-color="white"
      >敏感词过滤记录：</v-chip
    >
    <v-expansion-panels>
      <v-expansion-panel v-for="(filter, index) in filterList" :key="index">
        <v-expansion-panel-header>
          <v-row no-gutters>
            <v-col cols="3">用户: {{ filter.userProfile.nickname }}</v-col>
            <v-col cols="3">
              <span key="1">敏感词个数：{{ filter.sNum }}</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="4">
              <span key="1">{{ filter.createTime }}</span>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content
          >过滤内容：{{ filter.sWords }}</v-expansion-panel-content
        >
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="text-center my-3">
      <v-pagination
        v-model="pageNum"
        :length="pages"
        :page="pageNum"
        total-visible="10"
        @input="changePage"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Sensitive",
  data() {
    return {
      filterList: [],
      //分页
      pageNum: 1,
      pageSize: 10,
      //总页数
      pages: 0,
    };
  },
  methods: {
    getFilterList() {
      this.$api
        .getFilterList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.filterList = res.data.data.list;
            this.pages = res.data.data.pages;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {});
    },
    changePage() {
      this.getFilterList();
    },
  },
  mounted() {
    this.getFilterList();
  },
};
</script>
