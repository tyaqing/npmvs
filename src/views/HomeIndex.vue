<template>
  <GlobalLayout>
    <div class="text-center text-xl font-bold">比较npm下载趋势</div>
    <div class="my-5 text-center text-base text-gray-3 font-bold">
      输入需要比较的npm包名
    </div>
    <div class="w-670px <lg:w-full mx-auto">
      <SearchInput class="mx-auto w-full justify-center" />
      <div class="text-lg font-bold my-5">热门VS</div>
      <div
        class="first:mt-0 mt-2"
        v-for="(item, index) of npmHots"
        :key="index"
      >
        <router-link class="text-base" :to="genNav(item)">
          <span v-for="(pkg, index) of item" :key="pkg">
            {{ index === 0 ? "" : " vs" }}
            <span class="font-bold">{{ pkg }}</span>
          </span>
        </router-link>
      </div>
    </div>
  </GlobalLayout>
</template>

<script lang="ts">
import { getCount, NpmHot } from "@/composables/fetch";
import SearchInput from "@/components/search-input.vue";
import GlobalLayout from "@/components/GlobalLayout.vue";
import { random } from "lodash-es";
import { defineComponent, ref } from "vue";
import axios from "axios";
export default defineComponent({
  components: { SearchInput, GlobalLayout },
  setup() {
    const npmHots = ref([]);

    const init = async () => {
      const total = await getCount();
      const skip = random(0, total - 5);
      console.log(skip);
      const { data } = await axios({
        url: `${process.env.VUE_APP_CMS_API}/api/v1.0/npm-hot`,
        method: "get",
        params: {
          skip,
          limit: 5,
          fields: {
            content: 1,
          },
        },
      });
      npmHots.value = data.data.map((item: NpmHot) => item.content.split(" "));
    };
    init();

    const genNav = (val: string[]) => {
      return val.join("-vs-");
    };
    return {
      genNav,
      npmHots,
    };
  },
});
</script>
