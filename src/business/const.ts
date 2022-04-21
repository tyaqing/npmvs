export const color = [
  "#26C0E2",
  "#FFD66B",
  "#605BFF",
  "#FF6A77",
  "#EF37FF",
  "#3A974C",
  "#5B93FF",
];

export const npmInfoColumns = [
  {
    title: "名称",
    dataIndex: "name",
    scopedSlots: {
      customRender: "name",
    },
    fixed: "left",
    width: 200,
  },
  {
    key: "links",
    scopedSlots: {
      customRender: "links",
    },
    width: 150,
  },
  {
    title: "Stars",
    dataIndex: "stargazers_count",
    width: 100,
  },
  {
    title: "Issues/问题",
    dataIndex: "open_issues",
    width: 110,
  },
  {
    title: "Version/版本",
    dataIndex: "version",
    width: 120,
  },
  {
    title: "最后更新",
    dataIndex: "updated_at",
    scopedSlots: {
      customRender: "updated_at",
    },
    width: 100,
  },
  {
    title: "创建于",
    dataIndex: "created_at",
    scopedSlots: {
      customRender: "created_at",
    },
    width: 100,
  },
];
