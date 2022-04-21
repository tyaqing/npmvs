<template>
  <div id="container" class="min-h-400px mt-5"></div>
</template>

<script lang="ts">
import { Line } from "@antv/g2plot";
import { thousand } from "@/utils/number";
import axios from "axios";
import { proxyWrap } from "@/utils/request";
import dayjs from "dayjs";
import { defineComponent, nextTick, ref, watch } from "vue";
import { color } from "@/utils/color";

export type DataItemType = {
  day: string;
  downloads: string;
  package: string;
};

export default defineComponent({
  name: "DownloadGraph",
  props: {
    selectedPkg: {
      default: [],
    },
  },
  setup({ selectedPkg }) {
    let line: any;
    const downloadsData = ref<DataItemType[]>([]);
    watch(downloadsData, () => {
      render();
    });
    //
    const fetchData = async (val: string) => {
      const { data } = await axios.get(
        proxyWrap(
          `https://api.npmjs.org/downloads/range/${dayjs()
            .add(-1, "year")
            .format("YYYY-MM-DD")}:${dayjs().format("YYYY-MM-DD")}/` + val
        )
      );
      const downloadDataList = data.downloads;
      let cun = 0;
      // 获取本日星期
      const weekOfToday = dayjs().day();
      const newList: DataItemType[] = [];
      downloadDataList.forEach((item: any) => {
        // eslint-disable-next-line prefer-const
        let { day, downloads } = item;

        if (dayjs(day).day() === weekOfToday) {
          downloads += cun;
          const record = {
            day,
            downloads,
            package: val,
          };
          cun = 0;
          newList.push(record);
        } else cun += downloads;
      });

      return newList;
    };
    const init = async () => {
      const p: any[] = [];
      selectedPkg.forEach((pkg) => {
        p.push(fetchData(pkg));
      });
      const resArr = await Promise.all(p);
      downloadsData.value = resArr.flat(1);
    };
    init();
    nextTick(() => {
      line = new Line("container", {
        data: [],
        xField: "day",
        yField: "downloads",
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: thousand,
          },
        },
        seriesField: "package",
        smooth: true,
        lineStyle: {
          lineWidth: 4,
        },
        color,
      });
    });
    const render = () => {
      line.update({
        data: downloadsData.value,
      });
    };
  },
});
</script>
