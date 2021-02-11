<template>
  <v-container class="pa-10">
    <v-simple-table style="background:none">
      <template v-slot:default>
        <thead>
          <tr>
            <th style="font-size:15px;" class="text-left">编号</th>
            <th style="font-size:15px;" class="text-left">名称</th>
            <th style="font-size:15px;" class="text-left">路径</th>
            <th style="font-size:15px;" class="text-left">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plate in plateList" :key="plate.name">
            <td>{{ plate.id }}</td>
            <td>{{ plate.name }}</td>
            <td>{{ plate.path }}</td>
            <td>
              <v-switch
                v-model="plate.status"
                color="success"
                :label="plate.status?'正常':'关闭'"
                @change="updatePlate(plate.id,plate.status)"
              ></v-switch>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script>
export default {
  name: "PlateManage",
  data() {
    return {
      plateList: []
    };
  },
  methods: {
    getPlateList() {
      this.$api
        .getPlateList()
        .then(res => {
          if (res.data.code == 200) {
            this.plateList = res.data.data;
          } else {
            console.log("获取数据失败！");
          }
        })
        .catch(err => {
          console.log("获取数据失败！");
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    },
    updatePlate(plateId, status) {
      this.$api
        .updatePlate({
          id: plateId,
          status: status
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$toast({
              color: "success",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 2000,
              x: "right",
              y: "top"
            });
          } else {
            this.$toast({
              color: "error",
              mode: "",
              snackbar: true,
              text: res.data.msg,
              timeout: 3000,
              x: "right",
              y: "top"
            });
          }
        })
        .catch(err => {
          console.log("修改失败！");
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            // this.loading = false;
          }, 500);
        });
    }
  },
  mounted() {
    this.getPlateList();
  }
};
</script>
