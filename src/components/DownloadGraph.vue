<template>
  <Spin :spinning="spinning">
    <div id="container" class="min-h-400px mt-5"></div>
  </Spin>
</template>

<script lang="ts" setup>
import { Line } from "@antv/g2plot";
import { thousand } from "@/utils/number";
import axios from "axios";
import { proxyWrap } from "@/utils/request";
import dayjs from "dayjs";
import { nextTick, ref, watch } from "vue";
import { color } from "@/utils/color";
import { useGlobalStore } from "@/store";
import { Spin } from "ant-design-vue";
import { useSpinning } from "@/composables";

export type DataItemType = {
  day: string;
  downloads: string;
  package: string;
};

const globalStore = useGlobalStore();
const { spinning, showSpinning, hideSpinning } = useSpinning();

let line: Line;

const downloadsData = ref<DataItemType[]>([]);
watch(downloadsData, () => {
  render();
});
//
const fetchData = async (val: string) => {
  showSpinning();
  // TODO 请求错误兜底
  const { data } = await axios.get(
    proxyWrap(
      `https://api.npmjs.org/downloads/range/${dayjs()
        .add(-6, "year")
        .format("YYYY-MM-DD")}:${dayjs().format("YYYY-MM-DD")}/` + val
    )
  );
  const downloadDataList = data.downloads;
  let cun = 0;
  // 获取本日星期
  const weekOfToday = dayjs().day();
  const newList: DataItemType[] = [];
  downloadDataList.forEach((item: DataItemType) => {
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
    } else cun += +downloads;
  });
  return newList;
};
const init = async () => {
  const p: Promise<DataItemType[]>[] = [];
  globalStore.selectedPkg.forEach((pkg) => {
    p.push(fetchData(pkg));
  });
  const resArr = await Promise.allSettled(p);
  // 寻找查询失败
  const errorPkg = resArr
    .map((item, index) => {
      if (item.status === "rejected") return index;
    })
    .filter((item) => item !== undefined)
    .map((index) =>
      index !== undefined ? globalStore.selectedPkg[index] : ""
    );
  globalStore.errorPkg = [...errorPkg, ...globalStore.errorPkg];
  downloadsData.value = resArr
    .filter((item) => {
      return item.status === "fulfilled";
    })
    .map((item: any) => item.value)
    .flat(1);
};
watch(
  () => globalStore.selectedPkg,
  () => {
    init();
  }
);

nextTick(() => {
  line = new Line("container", {
    data: [],
    seriesField: "package",
    xField: "day",
    yField: "downloads",
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: thousand,
      },
    },
    legend: {
      itemName: {
        style: {
          fontSize: 16, // 字号
          fill: "black", // 字体颜色
          opacity: 0.8, // 字体透明度
        },
      },
      itemSpacing: 2,
      marker: {
        symbol: "circle",
      },
      position: "top",
      flipPage: false,
    },
    xAxis: {
      tickCount: 12,
      grid: {
        line: {
          style: {
            stroke: "#eee",
            lineDash: [4, 2],
          },
        },
        alternateColor: "rgba(0,0,0,0.01)",
      },
      nice: true,
    },
    smooth: true,
    lineStyle: {
      lineWidth: 4,
    },
    tooltip: {
      domStyles: {
        "g2-tooltip-title": {
          fontSize: "14px",
          fontWeight: "bold",
        },
        "g2-tooltip-list-item": {
          fontSize: "14px",
        },
      },
      customItems: (originalItems) => {
        return originalItems.sort((a, b) => {
          return Number(b.value) - Number(a.value);
        });
      },
    },
    color,
  });
});
const render = () => {
  line.update({
    data: downloadsData.value,
  });
  hideSpinning();
};
</script>
