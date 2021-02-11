<template>
  <v-snackbar
    absolute
    v-model="snackbar"
    :top="y === 'top'"
    :bottom="y === 'bottom'"
    :left="x === 'left'"
    :right="x === 'right'"
    :multi-line="mode === 'multi-line'"
    :color="color"
  >
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn color="white" small text v-bind="attrs" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {};
  },
  methods: {},
};
</script>
