import axios from "axios";
import { flatten } from "lodash-es";

export type NpmHot = {
  content: string;
};

export const getCount = async () => {
  console.log(process.env.VUE_APP_CMS_API);
  const { data } = await axios({
    url: `${process.env.VUE_APP_CMS_API}/api/v1.0/npm-hot`,
    method: "get",
    params: {
      limit: 1,
      fields: {
        content: 1,
      },
    },
  });
  return data.total;
};

export const getRelated = async (keys: string[]): Promise<string[]> => {
  const { data } = await axios({
    url: `${process.env.VUE_APP_CMS_API}/api/v1.0/npm-hot/find`,
    method: "post",
    params: {
      limit: 4,
      fields: {
        content: 1,
      },
    },
    data: {
      query: {
        content: {
          $regex: keys.join("|"),
        },
      },
    },
  });
  return flatten<string>(
    data.data.map((item: NpmHot) => item.content.split(" "))
  ).slice(0, 8);
};
