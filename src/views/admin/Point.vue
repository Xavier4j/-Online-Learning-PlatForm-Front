<template>
  <v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn text color="secondary"></v-btn> -->
      <v-btn outlined color="primary" @click="createPointDialog = true">
        新增知识点
      </v-btn>
    </v-card-actions>
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">知识点</th>
            <th style="font-size:15px;" class="text-left">创建时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in pointList" :key="index">
            <td>{{ p.point }}</td>
            <td>
              {{ p.createTime }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- 分页 -->
    <div class="text-center my-3">
      <v-pagination
        v-model="current"
        :length="pages"
        total-visible="10"
        @input="changePage"
      ></v-pagination>
    </div>

    <v-dialog v-model="createPointDialog" width="500">
      <v-card class="pt-10">
        <v-card-text class="pa-5">
          <v-text-field
            v-model="point"
            clearable
            outlined
            prepend-inner-icon="mdi-lightbulb-on-outline"
            label="知识点"
            required
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="savePoint">
            确定
          </v-btn>
          <v-btn color="info" text @click="createPointDialog = false">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "Point",
  data() {
    return {
      pointList: [],
      createPointDialog: false,
      point: "",
      //分页
      current: 1,
      size: 15,
      //总页数
      pages: 0,
    };
  },
  methods: {
    getPointList() {
      this.$api
        .getPointList({ current: this.current, size: this.size })
        .then((res) => {
          if (res.data.code == 200) {
            this.pointList = res.data.data.records;
            this.pages = res.data.data.pages;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch((err) => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
    savePoint() {
      if (!this.point) {
        this.$toast({
          color: "error",
          mode: "",
          snackbar: true,
          text: "请输入！",
          timeout: 2000,
          x: "right",
          y: "top",
        });
        return;
      }
      this.$api
        .savePoint({ point: this.point })
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
            this.getPointList();
            this.createPointDialog = false;
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
            text: "新增知识点失败,请稍后重试!",
            timeout: 2000,
            x: "right",
            y: "top",
          });
        })
        .finally(() => {
          this.point = "";
        });
    },
    changePage(page) {
      console.log(page);
      this.getPointList();
    },
  },
  mounted() {
    this.getPointList();
  },
};
</script>
