<template>
  <GlobalLayout>
    <div class="text-center text-xl font-bold">比较npm下载趋势</div>
    <div class="my-5 text-center text-base text-gray-3 font-bold">
      输入需要比较的npm包名
    </div>
    <div class="w-670px <lg:w-full mx-auto">
      <SearchInput :selectedPkg="[]" class="mx-auto w-full justify-center" />
      <div class="text-lg font-bold my-5">热门VS</div>
      <div
        class="first:mt-0 mt-2"
        v-for="(item, index) of npmHots"
        :key="index"
      >
        <router-link class="text-base" :to="'/' + tags2query(item)">
          <span v-for="(pkg, index) of item" :key="pkg">
            {{ index === 0 ? "" : " vs" }}
            <span class="font-bold">{{ pkg }}</span>
          </span>
        </router-link>
      </div>
    </div>
  </GlobalLayout>
</template>

<script lang="ts" setup>
import SearchInput from "@/components/SearchInput.vue";
import GlobalLayout from "@/components/GlobalLayout.vue";
import { onMounted, ref } from "vue";
import { tags2query } from "@/utils/string";
import { request } from "@/utils/request";

const npmHots = ref([]);
onMounted(() => {
  document.title = "npmvs";
});
const init = async () => {
  const { data } = await request.get(
    `${process.env.VUE_APP_ABFREE_API}/npmhots`
  );
  npmHots.value = data.map((item: string) => item.split(" "));
};
init();
</script>
