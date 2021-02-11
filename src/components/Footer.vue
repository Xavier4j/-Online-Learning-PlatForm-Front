<template>
  <v-footer>
    <v-container>
      <v-row no-gutters>
        <v-col cols="12">
          <div class="font-weight-light text-center">
            &copy; 2019, made with
            <v-icon class="mr-1" size="18">mdi-heart</v-icon>by
            <v-chip class="mr-1" text-color="cyan" small color="#0000" label>Xavier</v-chip>for a better web.
          </div>
        </v-col>
        <v-col cols="12">
          <div class="font-weight-light text-center">
            <a target="_blank" href="http://www.beian.miit.gov.cn/" style="text-decoration:none">
              <v-chip class="mr-1" text-color="orange" small color="#0000" label>豫ICP备20011397号</v-chip>
            </a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",

  data: () => ({
    links: [
      {
        href: "#",
        text: "Creative Tim"
      },
      {
        href: "#",
        text: "About Us"
      },
      {
        href: "#",
        text: "Blog"
      },
      {
        href: "#",
        text: "Licenses"
      }
    ]
  })
};
</script>

<style lang="sass">
</style>
