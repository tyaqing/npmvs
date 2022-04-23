<template>
  <div class="flex flex-wrap">
    <div class="w-240px">
      <SearchInput :selectedPkg="props.selectedPkg"></SearchInput>
    </div>
    <div
      v-for="(item, index) of props.selectedPkg"
      :key="item"
      class="text-gray-1 rounded-2 py-2 px-3 shadow flex border-2px border-solid items-center cursor-pointer mr-4 mb-4 h-38px"
      :class="[
        {
          'ml-4': index === 0,
        },
        `border-[${color[index % color.length]}]`,
      ]"
    >
      <span class="font-bold">{{ item }}</span>
      <CloseCircleFilled
        class="ml-2 h-20px w-20px text-gray-3 hover:text-gray-2 transition text-20px"
        type="close-circle"
        @mousedown.stop="remove(item)"
      />
    </div>
    <div
      :key="item"
      v-for="(item, index) of without(npmRelated, ...props.selectedPkg)"
      class="text-gray-3 rounded-2 hover:text-gray-2 py-2 px-3 flex items-center cursor-pointer mr-4 mb-4 h-38px"
      :class="[
        {
          'ml-4': index === 0,
        },
        `border-[${color[index % color.length]}]`,
      ]"
      @mousedown.stop="add(item)"
    >
      <span class="font-bold">{{ item }}</span>
      <PlusOutlined class="ml-1 h-14px w-14px transition text-14px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons-vue";
import { color } from "@/utils/color";
import { getRelated } from "@/composables/fetch";
import { onMounted, ref, defineProps, watch } from "vue";
import { useRouter } from "vue-router";
import SearchInput from "@/components/SearchInput.vue";
import { without } from "lodash-es";

interface Props {
  selectedPkg: string[];
}

const props = defineProps<Props>();

const router = useRouter();
const npmRelated = ref<string[]>([]);

watch(
  () => props.selectedPkg,
  async () => {
    npmRelated.value = await getRelated(props.selectedPkg);
  }
);

onMounted(async () => {
  npmRelated.value = await getRelated(props.selectedPkg);
});
const remove = (val: string) => {
  const newSelectedPkg = props.selectedPkg.filter((item) => item !== val);
  const path = newSelectedPkg.join("-vs-");
  console.log(path);
  router.push("/" + path);
};
const add = (val: string) => {
  const newSelectedPkg = [...props.selectedPkg, val];
  const path = newSelectedPkg.join("-vs-");
  router.push("/" + path);
};
</script>
