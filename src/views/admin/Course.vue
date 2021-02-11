<template>
  <v-container class="p a-10">
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn text color="secondary"></v-btn> -->
      <v-btn outlined color="primary" to="/admin/course/create">
        新增课程
      </v-btn>
    </v-card-actions>
    <div class="ma-5" style="font-size:17px;">版主列表：</div>
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">昵称</th>
            <th style="font-size:15px;" class="text-left">负责板块</th>
            <th style="font-size:15px;" class="text-left">状态</th>
            <th style="font-size:15px;" class="text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(moderator, index) in moderatorList" :key="index">
            <td>{{ moderator.moderatorProfile.nickname }}</td>
            <td>{{ moderator.plateIds | plateFilter }}</td>
            <td>
              <v-switch
                v-model="moderator.status"
                color="success"
                :label="moderator.status ? '正常' : '禁用'"
                @change="updateModerator(moderator.userId, moderator.status)"
              ></v-switch>
            </td>
            <td>
              <v-btn
                text
                color="error"
                @click="deleteModerator(moderator.userId)"
                >删除</v-btn
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
import global from "../../assets/global";
export default {
  name: "Point",
  data() {
    return {
      moderatorList: [],
    };
  },
  methods: {
    getModeratorList() {
      this.$api
        .getModeratorList()
        .then((res) => {
          if (res.data.code == 200) {
            this.moderatorList = res.data.data;
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
    updateModerator(userId, status) {
      this.$api
        .updateModerator({
          userId: userId,
          status: status,
        })
        .then((res) => {
          if (res.data.code == 200) {
            console.log("修改成功！");
          } else {
            console.log("修改失败！");
          }
        })
        .catch((err) => {
          console.log("修改失败！");
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
    deleteModerator(userId) {
      console.log(userId);
      this.$api
        .deleteModerator({ userId: userId })
        .then((res) => {
          if (res.data.code == 200) {
            console.log("删除成功！");
          } else {
            console.log("删除失败！");
          }
        })
        .catch((err) => {
          console.log("删除失败！");
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
    this.getModeratorList();
  },
  filters: {
    plateFilter(value) {
      let plateIds = value;
      let plateIdList = plateIds.split(",");
      let plateList = [];
      plateIdList.forEach((item) => {
        plateList.push(global.plateList1[item].title);
      });
      return plateList.join(",");
    },
  },
};
</script>
