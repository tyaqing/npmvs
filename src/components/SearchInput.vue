<template>
  <Dropdown class="shadow rounded-2 h-38px" :visible="dropdownVisible">
    <Input
      size="large"
      v-model:value="searchKey"
      @focus="searchKey !== '' && showDropdown()"
      @blur="hideDropdown"
    >
      <template #suffix>
        <search-outlined />
      </template>
    </Input>
    <template #overlay>
      <Menu class="w-670px rounded-2">
        <MenuList v-if="!optional.length && !spinning">
          <Empty class="text-gray-2 text-center" />
        </MenuList>
        <MenuList
          @mousedown="handleChange(d.name)"
          v-for="d in optional"
          :key="d.name"
        >
          <div class="text-base font-bold">{{ d.name }}</div>
          <div class="text-gray-2">{{ d.description }}</div>
        </MenuList>
        <MenuList v-if="spinning">
          <Spin>
            <div class="h-32px"></div>
          </Spin>
        </MenuList>
      </Menu>
    </template>
  </Dropdown>
</template>

<script lang="ts" setup>
import { Dropdown, Input, Menu, Spin, Empty } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { debounce } from "lodash-es";
import axios from "axios";
import { proxyWrap } from "@/utils/request";
import { ref, watch, defineProps, withDefaults } from "vue";
import { useRouter } from "vue-router";
import { useSpinning } from "@/composables";

const { spinning, hideSpinning, showSpinning } = useSpinning();

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const MenuList = Menu.Item;
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
const dropdownVisible = ref<boolean>(false);
const searchKey = ref<string>("");
const handleSearch = debounce(
  async () => {
    // 校验
    if (searchKey.value.length === 0) {
      dropdownVisible.value = false;
      optional.value = [];
      return;
    }
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
  showDropdown();
  handleSearch();
});

const hideDropdown = () => {
  dropdownVisible.value = false;
};
const showDropdown = () => {
  dropdownVisible.value = true;
};
// 添加了对比包
const handleChange = (key: string) => {
  if (props.selectedPkg.includes(key)) return;
  const path = [...props.selectedPkg, key].join("-vs-");
  router.push("/" + path);
};
</script>
