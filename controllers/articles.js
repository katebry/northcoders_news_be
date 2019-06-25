const {
  fetchArticlesById,
  patchArticle,
  postCommentToArticle,
  fetchCommentsByArticleId
} = require("../models/articles");

exports.sendArticles = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then(article => {
      if (!article)
        return Promise.reject({
          status: 404,
          msg: `Invalid article_id: ${article_id}`
        });
      else res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchArticle(article_id, inc_votes)
    .then(article => {
      if (!article)
        return Promise.reject({
          status: 404,
          msg: `Invalid article_id: ${article_id}`
        });
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.newComment = (req, res, next) => {
  const { article_id } = req.params;
  if (req.body.username) req.body.author = req.body.username;
  delete req.body.username;
  postCommentToArticle(article_id, req.body)
    .then(comment => res.status(201).send({ comment }))
    .catch(err => {
      next(err);
    });
};

exports.sendComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then(comments => res.status(200).send({ comments }))
    .catch(err => {
      next(err);
    });
};
