<template>
  <Table
    :scroll="{ x: '100%', y: 700 }"
    class="mt-4"
    row-key="name"
    :pagination="false"
    :data-source="source"
    :columns="npmInfoColumns"
  >
    <div slot-scope="name, _, index" class="flex items-center" slot="name">
      <div
        class="w-20px h-20px float-left rounded-full mr-2"
        :class="[`bg-[${color[index % color.length]}]`]"
      ></div>
      <span class="font-bold text-base truncate">{{ name }}</span>
    </div>
    <div class="flex items-center" slot-scope="_, val" slot="links">
      <Tooltip>
        <template v-slot:title>Npm</template>
        <a target="_blank" :href="val.links.npm">
          <img class="w-28px cursor-pointer" src="/npm-logo.svg" alt="" />
        </a>
      </Tooltip>
      <Tooltip>
        <template v-slot:title>Github</template>
        <a class="text-gray-3" target="_blank" :href="val.links.repository">
          <GithubFilled
            style="font-size: 24px"
            class="hover:fill-red-1 fill-cyan-500 cursor-pointer ml-3"
          />
        </a>
      </Tooltip>
      <Tooltip>
        <template v-slot:title>项目主页</template>
        <a class="text-gray-3" target="_blank" :href="val.links.homepage">
          <CompassOutlined class="ml-3" style="font-size: 24px" />
        </a>
      </Tooltip>
    </div>
    <div slot-scope="updated_at" slot="updated_at">
      {{ dayjs(updated_at).fromNow() }}
    </div>
    <div slot-scope="created_at" slot="created_at">
      {{ dayjs(created_at).fromNow() }}
    </div>
  </Table>
</template>

<script lang="ts">
import { Table, Tooltip } from "ant-design-vue";
import { GithubFilled, CompassOutlined } from "@ant-design/icons-vue";
import { proxyWrap } from "@/utils/request";
import dayjs from "dayjs";
import { thousand } from "@/utils/number";
import { color } from "@/utils/color";
import { defineComponent, ref } from "vue";
import { npmInfoColumns } from "@/business/const";
import axios from "axios";

type SourceItemType = {
  name: string;
  version: string;
  links: string;
  star: string;
  issue: string;
  created: string;
  modified: string;
  github?: string;
  homepage?: string;
};
export default defineComponent({
  props: {
    selectedPkg: {
      default: [],
    },
  },
  components: { Table, GithubFilled, Tooltip },
  setup({ selectedPkg }) {
    const source = ref<SourceItemType[]>([]);

    const init = async () => {
      const p: any[] = [];
      selectedPkg.forEach((pck) => {
        p.push(getInfoLoop(pck));
      });
      source.value = await Promise.all(p);
    };
    init();
    const getNpmInfo = async (val: string) => {
      // 获取npm基本信息
      const { data } = await axios.get(
        proxyWrap("https://api.npms.io/v2/package/" + encodeURIComponent(val))
      );
      return data;
    };
    const getGithubInfo = async (val: string) => {
      // 获取npm基本信息
      const { data } = await axios.get(
        proxyWrap("https://api.github.com/repos/" + val)
      );
      return data;
    };
    const getInfoLoop = async (val: string) => {
      const npmInfo = await getNpmInfo(val);
      const { collected } = npmInfo;
      const { metadata } = collected;
      const { repository } = metadata;
      const repoMatch = (repository.url as string).match(
        /([\w.-]+\/[\w.-]+).git/
      );
      let extra = {};
      if (repoMatch) {
        const [, repo] = repoMatch;
        const githubInfo = await getGithubInfo(repo);
        const {
          created_at,
          updated_at,
          stargazers_count,
          open_issues,
          homepage,
        } = githubInfo;
        extra = {
          created_at,
          updated_at,
          stargazers_count: thousand(stargazers_count),
          open_issues: thousand(open_issues),
          homepage,
        };
      }
      return {
        name: collected.metadata.name,
        version: collected.metadata.version,
        links: collected.metadata.links,
        ...extra,
        // created,
        // modified,
      };
    };
    // process.server && console.log('fetchState', fetchState);
    return {
      color,
      npmInfoColumns,
      dayjs,
      source,
    };
  },
});
</script>
