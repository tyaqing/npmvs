<template>
  <AutoComplete
    v-model:value="searchKey"
    :dropdownMatchSelectWidth="670"
    :options="optional"
    :backfill="true"
    @select="handleChange"
  >
    <Input class="shadow rounded-2" size="large" v-model:value="searchKey">
      <template #suffix>
        <LoadingOutlined v-if="spinning"></LoadingOutlined>
        <search-outlined v-else />
      </template>
    </Input>
    <template #option="{ name, description }">
      <div class="text-base font-bold">{{ name }}</div>
      <div class="text-gray-2">{{ description }}</div></template
    >
  </AutoComplete>
</template>

<script lang="ts" setup>
import { Input, AutoComplete } from "ant-design-vue";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { debounce } from "lodash-es";
import axios from "axios";
import { proxyWrap } from "@/utils/request";
import { ref, watch, defineProps, withDefaults } from "vue";
import { useRouter } from "vue-router";
import { useSpinning } from "@/composables";

const { spinning, hideSpinning, showSpinning } = useSpinning();

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

type SearchResultItem = {
  name: string;
  description: string;
};

interface Props {
  selectedPkg: string[];
}

const props = withDefaults(defineProps<Props>(), {
  selectedPkg: () => [],
});

const optional = ref<SearchResultItem[]>([]);
const router = useRouter();
const searchKey = ref<string>("");
const handleSearch = debounce(
  async () => {
    // 校验
    if (searchKey.value.length === 0) {
      optional.value = [];
      return;
    }
    // TODO 时序问题仍然有bug
    source.cancel();
    // controller.abort();
    // 获取选项
    showSpinning();
    const { data } = await axios.get(
      proxyWrap(
        `https://api.npms.io/v2/search/suggestions?q=${searchKey.value}&size=5`
      ),
      {}
    );
    hideSpinning();
    optional.value = [
      ...data.map((item: { package: SearchResultItem }) => {
        const { name, description } = item.package;
        return {
          name,
          value: name,
          description,
        };
      }),
    ];
  },
  300,
  {
    leading: true,
  }
);

watch(searchKey, () => {
  searchKey.value = searchKey.value.replace(/[^a-zA-Z0-9-_]/g, "");
  handleSearch();
});

// 添加了对比包
const handleChange = (key: string) => {
  searchKey.value = "";
  if (props.selectedPkg.includes(key)) return;
  const path = [...props.selectedPkg, key].join("-vs-");
  router.push("/" + path);
};
</script>
