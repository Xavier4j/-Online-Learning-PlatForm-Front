<template>
  <v-container style="min-height:600px">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-row class="ma-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" outlined dark v-bind="attrs" v-on="on">
            创建知识点测试
          </v-btn>
        </v-row>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">知识点测试</span>
        </v-card-title>
        <v-card-text class="mt-3">
          <v-text-field
            class="my-2"
            v-model="test.title"
            outlined
            clearable
            :counter="16"
            prepend-inner-icon="mdi-format-title"
            label="测试名称"
            required
          ></v-text-field>
          <v-select
            v-model="test.pointId"
            :items="pointList"
            item-text="point"
            item-value="id"
            label="选择知识点"
            outlined
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="release">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card
      color="#385F73"
      class="my-3"
      dark
      v-for="(test, index) in testList"
      :key="index"
    >
      <v-card-title class="headline">
        {{ test.title }}
      </v-card-title>

      <v-card-subtitle>
        {{ test.startTime | DateFormat }} --- {{ test.endTime | DateFormat }}
      </v-card-subtitle>

      <v-card-actions>
        <v-btn
          text
          outlined
          :to="'test/view/' + test.id"
          v-if="!test.done"
          :disabled="isEffectiveDate(test.startTime, test.endTime) != 0"
        >
          {{ isEffectiveDate(test.startTime, test.endTime) | statusFilter }}
        </v-btn>
        <v-btn text outlined :to="'test/result/' + test.id" v-else>
          查看测试结果
        </v-btn>
      </v-card-actions>
    </v-card>
    <div class="text-center my-3">
      <v-pagination
        v-model="current"
        :length="pages"
        total-visible="10"
        @input="changePage"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment/moment";
export default {
  name: "Test",
  computed: {
    ...mapState(["token"]),
  },
  data() {
    return {
      //创建相关
      dialog: false,
      test: {
        title: "",
        pointId: "",
      },
      pointList: [],
      //列表
      testList: [],
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    isEffectiveDate(startTime, endTime) {
      if (moment().isBefore(moment(startTime))) {
        return -1;
      } else if (moment().isAfter(moment(endTime))) {
        return 1;
      } else {
        return 0;
      }
    },
    getPointList() {
      this.$api
        .getPointList()
        .then((res) => {
          if (res.data.code == 200) {
            this.pointList = res.data.data.records;
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "加载知识点列表失败,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {});
    },
    release() {
      if (!this.test.pointId) {
        return;
      }
      this.test.isTest = true;
      this.$api
        .releasePaper(this.test)
        .then((res) => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
            this.getTestList();
          } else {
            console.log("获取数据失败！");
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "创建失败，请稍后重试！",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
    getTestList() {
      this.$api
        .getPaperList({
          isTest: true,
          userId: this.token,
          current: this.current,
          size: this.size,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.testList = res.data.data.records;
            this.pages = res.data.data.pages;
          } else {
            console.log("获取数据失败！");
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "系统异常，请稍后重试！",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
    changePage(page) {
      console.log(page);
      this.getTestList();
    },
  },
  created() {},
  mounted() {
    this.getTestList();
    this.getPointList();
  },
  filters: {
    statusFilter(value) {
      switch (value) {
        case -1:
          return "测试未开始";
        case 0:
          return "开始测试";
        case 1:
          return "测试已结束";
      }
    },
  },
};
</script>
