<template>
  <div class="flex flex-wrap">
    <div class="w-240px">
      <SearchInput :selectedPkg="selectedPkg"></SearchInput>
    </div>
    <router-link
      :to="`${item}`"
      v-for="(item, index) of selectedPkg"
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
    </router-link>
    <template v-for="(item, index) of npmRelated">
      <div
        :key="index"
        v-if="!selectedPkg.includes(item)"
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
    </template>
  </div>
</template>

<script lang="ts">
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons-vue";
import { color } from "@/utils/color";
import { getRelated } from "@/composables/fetch";
import { defineComponent, onMounted, PropType, ref } from "vue";
import { useRouter } from "vue-router";
// import { useFetchHot, useFetchRelated } from '~/composition/fetch';
// import { flatten } from 'lodash-es';
import SearchInput from "@/components/SearchInput.vue";
export default defineComponent({
  components: { CloseCircleFilled, SearchInput, PlusOutlined },
  props: {
    selectedPkg: {
      default: () => [],
      type: Array as PropType<string[]>,
    },
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({ selectedPkg }) {
    const router = useRouter();
    const npmRelated = ref<string[]>([]);
    onMounted(async () => {
      npmRelated.value = await getRelated(selectedPkg);
    });
    const remove = (val: string) => {
      const newSelectedPkg = selectedPkg.filter((item) => item !== val);
      const path = newSelectedPkg.join("-vs-");
      router.push("/" + path);
    };
    const add = (val: string) => {
      const newSelectedPkg = [...selectedPkg, val];
      const path = newSelectedPkg.join("-vs-");
      router.push("/" + path);
    };
    return {
      remove,
      add,
      color,
      npmRelated,
    };
  },
});
</script>
