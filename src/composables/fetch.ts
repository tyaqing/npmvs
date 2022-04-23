import axios from "axios";
import { flatten } from "lodash-es";
export const getRelated = async (keys: string[]): Promise<string[]> => {
  const { data } = await axios({
    url: `${process.env.VUE_APP_ABFREE_API}/npmhots`,
    method: "get",
    params: {
      keys: keys.join("|"),
    },
  });
  return flatten<string>(data.map((item: string) => item.split(" "))).slice(
    0,
    8
  );
};
