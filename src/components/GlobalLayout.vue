<template>
  <div
    class="w-1162px <xl:w-1024px <lg:w-788px <md:w-600px <sm:w-380px h-full mx-auto flex flex-col"
  >
    <header
      class="my-6"
      :class="{
        'text-center !mt-100px': isHomePage,
      }"
    >
      <router-link to="/" class="text-4xl font-bold relative">
        <img class="w-60px h-60px" src="@/assets/logo.png" alt="" />
        <!--        <Tag color="cyan" class="absolute -right-55px -top-5px">beta</Tag>-->
      </router-link>
    </header>
    <div class="flex-1">
      <slot></slot>
    </div>
    <div class="text-center py-30px">
      <a href="https://github.com/tyaqing/npmvs" target="_blank">
        <GithubOutlined></GithubOutlined>
        Github</a
      >
      |
      <a href="https://abfree.com" target="_blank">ABFree</a>
      | Npm VS | v1.0
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import { GithubOutlined } from "@ant-design/icons-vue";

import { useRoute } from "vue-router";

dayjs.locale("zh-cn"); // 全局使用简体中文
dayjs.extend(relativeTime);
const route = useRoute();
const isHomePage = route.path === "/";
</script>
