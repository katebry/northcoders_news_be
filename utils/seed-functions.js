exports.formatTimeStamp = articles => {
  const timeStampArray = articles.map(article => {
    article.created_at = new Date(article.created_at);
    return article;
  });
  return timeStampArray;
};

exports.changeKey = (comments, keyToChange) => {
  const spreadComments = comments.map(({ [keyToChange]: author, ...rest }) => ({
    author,
    ...rest
  }));
  return spreadComments;
};

exports.createRef = articles => {
  const spreadArticles = [...articles];
  const refObj = {};
  spreadArticles.forEach(article => {
    refObj[article.title] = article.article_id;
  });
  return refObj;
};

exports.formatCommentsByArticleId = (comments, createRef) => {
  if (!comments) return [];
  const commentsArr = [];
  comments.map(comment => {
    const { belongs_to, ...restOfComments } = comment;
    const article_id = createRef[belongs_to];
    commentsArr.push({ ...restOfComments, article_id });
  });
  console.log(commentsArr);
  return commentsArr;
};
