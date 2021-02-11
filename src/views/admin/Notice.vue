<template>
  <v-container>
    <div class="ma-5" style="font-size:17px;">版主申请列表:</div>
    <v-expansion-panels>
      <v-expansion-panel v-for="(apply, index) in applyList" :key="index">
        <v-expansion-panel-header>
          <v-row no-gutters style="font-size:15px;line-height:32px">
            <v-col cols="3">用户:{{ apply.applicantProfile.nickname }}</v-col>
            <v-col cols="3">
              <span key="1"
                >申请板块：{{ plateList[apply.plateId - 1].title }}</span
              >
            </v-col>
            <v-col cols="3">
              <span key="1">{{ apply.createTime | DateFormat }}</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="2">
              <v-chip :color="apply.status | colorFormat">{{
                apply.status | statusFormat
              }}</v-chip>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          理由：{{ apply.reason }}
          <v-row>
            <v-spacer></v-spacer>
            <v-col style="text-align:right">
              <v-btn
                text
                color="success"
                @click="updateApply(apply.id, true)"
                v-if="apply.status == 0"
                >同意</v-btn
              >
              <v-btn
                text
                color="error"
                @click="updateApply(apply.id, false)"
                v-if="apply.status == 0"
                >拒绝</v-btn
              >
              <v-btn text color="secondary" @click="deleteApply(apply.id)"
                >删除</v-btn
              >
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import global from "../../assets/global";
export default {
  name: "Notice",
  data() {
    return {
      applyList: [],
      plateList: global.plateList1,
    };
  },
  methods: {
    getApplyList() {
      this.$api
        .getApplyList()
        .then((res) => {
          if (res.data.code == 200) {
            this.applyList = res.data.data;
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
    updateApply(id, pass) {
      this.$api
        .updateApply({
          id: id,
          pass: pass,
        })
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
            this.getApplyList();
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "出现异常",
            timeout: 3000,
            x: "right",
            y: "top",
          });
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
    deleteApply(id) {
      this.$api
        .deleteApply({ id: id })
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
            this.getApplyList();
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top",
            });
          }
        })
        .catch((err) => {
          this.$toast({
            color: "error",
            mode: "",
            snackbar: true,
            text: "失败！",
            timeout: 3000,
            x: "right",
            y: "top",
          });
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
  },
  mounted() {
    this.getApplyList();
  },

  filters: {
    colorFormat(value) {
      if (value == 0) {
        return "secondary";
      } else if (value == 1) {
        return "success";
      } else if (value == 2) {
        return "error";
      }
    },
    statusFormat(value) {
      if (value == 0) {
        return "未审核";
      } else if (value == 1) {
        return "已通过";
      } else if (value == 2) {
        return "已拒绝";
      }
    },
  },
};
</script>
