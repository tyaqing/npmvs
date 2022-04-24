<template>
  <ASpin :spinning="spinning">
    <Table
      :scroll="{ x: '100%', y: 700 }"
      class="mt-4"
      row-key="name"
      :pagination="false"
      :data-source="source"
    >
      <TableColumn fixed="left" :maxWidth="200" data-index="name" title="名称">
        <template #default="{ text, index }">
          <div class="flex items-center">
            <div
              class="w-20px h-20px float-left rounded-full mr-2"
              :class="[`bg-[${color[index % color.length]}]`]"
            ></div>
            <span class="font-bold text-base truncate">{{ text }}</span>
          </div>
        </template>
      </TableColumn>
      <TableColumn title="links" data-index="links">
        <template #default="{ record }">
          <div class="flex items-center">
            <Tooltip>
              <template v-slot:title>Npm</template>
              <a target="_blank" :href="record.links.npm">
                <img
                  class="w-28px cursor-pointer"
                  src="@/assets/npm-logo.svg"
                  alt=""
                />
              </a>
            </Tooltip>
            <Tooltip>
              <template v-slot:title>Github</template>
              <a
                class="text-gray-3"
                target="_blank"
                :href="record.links.repository"
              >
                <GithubFilled
                  style="font-size: 24px"
                  class="hover:fill-red-1 fill-cyan-500 cursor-pointer ml-3"
                />
              </a>
            </Tooltip>
            <Tooltip>
              <template v-slot:title>项目主页</template>
              <a
                class="text-gray-3"
                target="_blank"
                :href="record.links.homepage"
              >
                <CompassOutlined class="ml-3" style="font-size: 24px" />
              </a>
            </Tooltip>
          </div>
        </template>
      </TableColumn>

      <TableColumn title="Star" data-index="stargazers_count">
        <template #default="{ text }">
          {{ text }}
        </template>
      </TableColumn>
      <TableColumn title="Issue" data-index="open_issues">
        <template #default="{ text }">
          {{ text }}
        </template>
      </TableColumn>
      <TableColumn title="版本" data-index="version">
        <template #default="{ text }">
          {{ text }}
        </template>
      </TableColumn>
      <TableColumn title="最后更新" data-index="updated_at">
        <template #default="{ text }">
          {{ dayjs(text).fromNow() }}
        </template>
      </TableColumn>
      <TableColumn title="创建于" data-index="created_at">
        <template #default="{ text }">
          {{ dayjs(text).fromNow() }}
        </template>
      </TableColumn>
    </Table>
  </ASpin>
</template>

<script lang="ts" setup>
import { Table, Tooltip } from "ant-design-vue";
import { GithubFilled, CompassOutlined } from "@ant-design/icons-vue";
import { proxyWrap } from "@/utils/request";
import dayjs from "dayjs";
import { thousand } from "@/utils/number";
import { color } from "@/utils/color";
import { ref, watch } from "vue";
import axios from "axios";
import { useGlobalStore } from "@/store";
import { useSpinning } from "@/composables";

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
const TableColumn = Table.Column;

const globalStore = useGlobalStore();
const source = ref<SourceItemType[]>([]);
const { spinning, showSpinning, hideSpinning } = useSpinning();

const init = async () => {
  const p: any[] = [];
  globalStore.selectedPkg.forEach((pck) => {
    p.push(getInfoLoop(pck));
  });
  showSpinning();
  const res = await Promise.allSettled(p);
  const errorPkg = res
    .map((item, index) => {
      if (item.status === "rejected") return index;
    })
    .filter((item) => item)
    .map((index) => (index ? globalStore.selectedPkg[index] : ""));
  globalStore.errorPkg = [...errorPkg, ...globalStore.errorPkg];
  const ddd = res
    .filter((item) => item.status === "fulfilled")
    .map((item: any) => item.value);
  source.value = ddd;

  hideSpinning();
};
watch(
  () => globalStore.selectedPkg,
  () => {
    init();
  }
);
async function getNpmInfo(val: string) {
  // 获取npm基本信息
  const { data } = await axios.get(
    proxyWrap("https://api.npms.io/v2/package/" + encodeURIComponent(val))
  );
  return data;
}
const getGithubInfo = async (val: string) => {
  // 获取npm基本信息
  const { data } = await axios.get(
    proxyWrap("https://api.github.com/repos/" + val)
  );
  return data;
};
async function getInfoLoop(val: string) {
  const npmInfo = await getNpmInfo(val);
  const { collected } = npmInfo;
  const { metadata } = collected;
  const { repository } = metadata;
  const repoMatch = (repository.url as string).match(/([\w.-]+\/[\w.-]+).git/);
  let extra = {};
  if (repoMatch) {
    const [, repo] = repoMatch;
    const githubInfo = await getGithubInfo(repo);
    const { created_at, updated_at, stargazers_count, open_issues, homepage } =
      githubInfo;
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
}
</script>
