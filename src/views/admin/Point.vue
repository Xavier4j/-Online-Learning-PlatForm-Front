<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="5">
        <v-text-field
          v-model="search"
          solo
          hide-details
          clearable
          prepend-inner-icon="mdi-magnify"
          label="User Search"
          @change="change()"
          @click:clear="clear()"
        />
      </v-col>
    </v-row>

    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">用户名</th>
            <th style="font-size:15px;" class="text-left">角色</th>
            <th style="font-size:15px;" class="text-left">状态</th>
            <th style="font-size:15px;" class="text-left">截至</th>
            <th style="font-size:15px;" class="text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userList" :key="index">
            <td>{{ user.username }}</td>
            <td>{{ user.role | roleFormat }}</td>
            <td>
              <v-chip :color="user.status | colorFormat">{{
                user.status | statusFormat
              }}</v-chip>
            </td>
            <td>
              <v-chip outlined v-if="user.status > 0">{{
                user.deadline
              }}</v-chip>
            </td>
            <td>
              <v-btn
                text
                color="primary"
                v-if="user.status != 1"
                @click="beforeUpdateUser(user.id, 1)"
                >禁言</v-btn
              >
              <v-btn
                text
                color="error"
                v-if="user.status != 2"
                @click="beforeUpdateUser(user.id, 2)"
                >封号</v-btn
              >
              <v-btn
                text
                color="cyan"
                v-if="user.status != 0"
                @click="releaseUser(user.id, 0)"
                >解除</v-btn
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div class="text-center my-3">
      <v-pagination
        v-model="pageNum"
        :length="pages"
        total-visible="10"
        @input="changePage"
      ></v-pagination>
    </div>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">选择截止时间</v-card-title>
        <v-row class="mx-5" justify="center">
          <v-col cols="12">
            <v-radio-group class="my-1" v-model="time">
              <v-radio
                v-for="(time, index) in timeList"
                :key="index"
                :label="time.label"
                :value="time.value"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="commit()">确 定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment/moment";
export default {
  name: "UserManage",
  data() {
    return {
      search: "",
      userList: [],
      dialog: false,
      time: "",
      timeList: [
        {
          label: "1分钟",
          value: 1,
        },
        {
          label: "十分钟",
          value: 10,
        },
        {
          label: "半小时",
          value: 30,
        },
        {
          label: "1小时",
          value: 60,
        },
        {
          label: "1天",
          value: 60 * 24,
        },
        {
          label: "永久",
          value: 60 * 24 * 365 * 79,
        },
      ],
      form: {
        id: "",
        deadline: "",
        status: "",
      },
      //分页
      pageNum: 1,
      pageSize: 10,
      //总页数
      pages: 0,
    };
  },
  methods: {
    getUserList(search) {
      this.$api
        .getUserList({
          likeNickName: search,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then((res) => {
          if (res.data.code == 200) {
            console.log(res.data.data.list);
            this.userList = res.data.data.list;
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
    beforeUpdateUser(userId, status) {
      this.form.id = userId;
      this.form.status = status;
      this.dialog = true;
    },
    releaseUser(userId, status) {
      this.form.id = userId;
      this.form.status = status;
      this.form.deadline = null;
      this.updateUser();
    },
    commit() {
      this.form.deadline = moment()
        .add(this.time, "minutes")
        .format("YYYY-MM-DD HH:mm:ss");
      console.log(this.form.deadline);
      this.updateUser();
    },
    updateUser() {
      this.$api
        .updateUser(this.form)
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
            this.getUserList();
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
          console.log("修改失败！");
          console.log(err);
        })
        .finally(() => {
          this.dialog = false;
        });
    },
    change() {
      console.log("change");
      this.getUserList(this.search);
    },
    clear() {
      console.log("clear");
      this.getUserList(this.search);
    },
    changePage(page) {
      console.log(page);
      this.getUserList(this.search);
    },
  },
  mounted() {
    this.getUserList(this.search);
  },
  filters: {
    roleFormat(value) {
      if (value == 0) {
        return "普通用户";
      } else if (value == 1) {
        return "版主";
      } else if (value == 2) {
        return "管理员";
      } else if (value == 3) {
        return "系统管理员";
      }
    },
    statusFormat(value) {
      if (value == 0) {
        return "正常";
      } else if (value == 1) {
        return "禁言";
      } else if (value == 2) {
        return "封号";
      }
    },
    colorFormat(value) {
      if (value == 0) {
        return "success";
      } else if (value == 1) {
        return "warning";
      } else if (value == 2) {
        return "error";
      }
    },
  },
};
</script>
