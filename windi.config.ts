import { defineConfig } from "windicss/helpers";

// 定义图表几个颜色
export const color = [
  "#26C0E2",
  "#FFD66B",
  "#605BFF",
  "#FF6A77",
  "#EF37FF",
  "#3A974C",
  "#5B93FF",
];

interface SP {
  [key: string]: string;
}

const spacing: SP = {};
// 已4为基准
for (let i = 1; i <= 10; ++i) {
  spacing[i] = i * 3 + "px";
}

export default defineConfig({
  extract: {
    include: ["**/*.{vue,html}"],
    exclude: ["node_modules", ".git"],
  },
  preflight: false,
  theme: {
    extend: {
      borderRadius: {
        1: "5px",
        2: "10px",
        3: "15px",
      },
      spacing,
      colors: {
        gray: {
          DEFAULT: "#3A3A3C",
          1: "#3A3A3C",
          2: "#6B7588",
          3: "#8F90A6",
          4: "#C7C9D9",
        },
        red: {
          DEFAULT: "#FF3B3B",
          1: "#E63535",
          2: "#FF3B3B",
          3: "#FF5C5C",
          4: "#FF8080",
        },
        yellow: {
          DEFAULT: "#FFCC00",
          1: "#E6B800",
          2: "#FFCC00",
          3: "#FDDD48",
          4: "#FDED72",
        },
        blue: {
          DEFAULT: "#0063F7",
          1: "#004FC4",
          2: "#0063F7",
          3: "#5B8DEF",
          4: "#9DBFF9",
        },
        green: {
          DEFAULT: "#06C270",
          1: "#05A660",
          2: "#06C270",
          3: "#39D98A",
          4: "#57EBA1",
        },
      },
      boxShadow: {
        DEFAULT: "0 2px 3px rgb(0 0 0 / 6%);",
      },
    },
  },
  shortcuts: {
    "header-1": "text-gray-1 text-36px font-semibold",
    border: "border-1px border-solid border-[rgba(0,0,0,0.15)]",
  },
  safelist: [color.map((c) => `border-[${c}]`), color.map((c) => `bg-[${c}]`)],
});
// console.log(...color.map(c => `bg-[${c}]`));
