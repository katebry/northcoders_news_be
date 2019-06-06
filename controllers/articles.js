const { fetchArticlesById } = require("../models/articles");

exports.sendArticles = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Invalid article_id: ${article_id}`
        });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(err => {
      next(err);
    });
};
