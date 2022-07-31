const getEmbedSnippet = (pollId: string) => {
  const snippet = `<iframe style="width:100%;height:600px;" src="${
    location.origin + '/poll/' + pollId + '/embed'
  }" frameborder="0"></iframe>`;
  return snippet;
};

export default getEmbedSnippet;
