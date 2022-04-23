<template>
  <GlobalLayout>
    <PackageTags :selectedPkg="selectedPkg"></PackageTags>
    <!--  下载视图  -->
    <template #suffixIcon>
      <SearchOutlined />
    </template>

    <div id="infoPicture" class="bg-white p-10 rounded-3 mt-5 border shadow">
      <div class="flex items-center">
        <h1 class="text-2xl m-0 flex-1 truncate">{{ title }}下载趋势</h1>
        <Tooltip class="mr-4">
          <template v-slot:title>复制链接</template>
          <LinkOutlined
            @click="copyLink"
            class="text-2xl cursor-pointer hover:text-red transition"
          />
        </Tooltip>
        <Tooltip>
          <template v-slot:title>下载报告截图</template>
          <CameraFilled
            @click="downloadReportImage"
            class="text-2xl cursor-pointer hover:text-yellow transition"
          />
        </Tooltip>
      </div>
      <DownloadGraph :selectedPkg="selectedPkg" class="min-h-400px mt-5" />
      <InfoTable :selectedPkg="selectedPkg" class="flex-1 mt-5" />
    </div>
  </GlobalLayout>
</template>

<script lang="ts">
import { message, Tooltip } from "ant-design-vue";
import {
  SearchOutlined,
  LinkOutlined,
  CameraFilled,
} from "@ant-design/icons-vue";
import html2canvas from "html2canvas";
import copy from "@/utils/clipboard";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import GlobalLayout from "@/components/GlobalLayout.vue";
import PackageTags from "@/components/PackageTags.vue";
import DownloadGraph from "@/components/DownloadGraph.vue";
import InfoTable from "@/components/InfoTable.vue";
export default defineComponent({
  components: {
    Tooltip,
    SearchOutlined,
    CameraFilled,
    GlobalLayout,
    PackageTags,
    DownloadGraph,
    InfoTable,
    LinkOutlined,
  },
  name: "PackagesVs",
  setup() {
    const route = useRoute();
    const selectedPkg = route.path.substring(1).split("-vs-");
    const title = selectedPkg.join(" vs ");
    // 下载报告截图
    const downloadReportImage = () => {
      const target = document.getElementById("infoPicture");
      if (target) {
        html2canvas(target, {
          backgroundColor: null,
        }).then(function (canvas: any) {
          let link = document.createElement("a");
          link.href = canvas.toDataURL(); //下载链接
          link.setAttribute("download", `${title}.png`);
          link.style.display = "none"; //a标签隐藏
          document.body.appendChild(link);
          link.click();
          message.success("下载成功");
        });
      }
    };
    const copyLink = () => {
      copy(location.href);
    };

    return {
      selectedPkg,
      title,
      downloadReportImage,
      copyLink,
    };
  },
  head: {
    titleTemplate() {
      return (
        this.$route.path.substring(1).split("-vs-").join(" vs ") + " | npmvs"
      );
    },
  },
});
</script>
