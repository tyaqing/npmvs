<template>
  <Dropdown class="shadow rounded-2" :visible="dropdownVisible">
    <Input
      v-model:value="searchKey"
      @focus="searchKey !== '' && showDropdown"
      @blur="hideDropdown"
    >
      <template #addonAfter>
        <search-outlined />
      </template>
    </Input>
    <template #overlay>
      <Menu class="w-670px rounded-2">
        <MenuList
          @mousedown="handleChange(d.name)"
          v-for="d in optional"
          :key="d.name"
        >
          <div class="text-base font-bold">{{ d.name }}</div>
          <div class="text-gray-2">{{ d.description }}</div>
        </MenuList>
      </Menu>
    </template>
  </Dropdown>
</template>

<script lang="ts">
import { Dropdown, Input, Menu } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { debounce } from "lodash-es";
import axios from "axios";
import { proxyWrap } from "@/utils/request";
import { defineComponent, PropType, ref, watch } from "vue";
import { useRouter } from "vue-router";

type SearchResultItem = {
  name: string;
  description: string;
};

export default defineComponent({
  name: "SearchInput",
  components: {
    SearchOutlined,
    Dropdown,
    Input,
    Menu,
    MenuList: Menu.Item,
  },
  props: {
    selectedPkg: {
      default: () => [],
      type: Array as PropType<string[]>,
    },
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({ selectedPkg }) {
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
        // 获取选项
        const { data } = await axios.get(
          proxyWrap(
            `https://api.npms.io/v2/search/suggestions?q=${searchKey.value}&size=5`
          )
        );
        optional.value = [
          ...data.map((item: { package: SearchResultItem }) => {
            const { name, description } = item.package;
            return {
              name,
              description,
            };
          }),
        ];
        dropdownVisible.value = true;
      },
      300,
      {
        leading: true,
      }
    );

    watch(searchKey, () => {
      searchKey.value = searchKey.value.replace(/[^a-zA-Z0-9]/g, "");
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
      if (selectedPkg.includes(key)) return;
      const path = [...selectedPkg, key].join("-vs-");
      router.push("/" + path);
    };
    // 失去焦点
    return {
      handleSearch,
      handleChange,
      optional,
      dropdownVisible,
      hideDropdown,
      searchKey,
      showDropdown,
    };
  },
});
</script>
