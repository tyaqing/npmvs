export const query2Tags = (query: string) => {
  return query.split("-vs-");
};

export const tags2query = (tags: string[]) => {
  return tags.join("-vs-");
};
