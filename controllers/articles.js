const {
  fetchArticleById,
  patchArticle,
  postCommentToArticle,
  fetchCommentsByArticleId,
  fetchAllArticles,
  checkExists
} = require("../models/articles");

exports.sendArticles = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
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
  fetchCommentsByArticleId(article_id, req.query)
    .then(comments => {
      const articleExists = article_id
        ? checkExists(article_id, "articles", "article_id")
        : null;
      return Promise.all([articleExists, comments]);
    })
    .then(([articleExists, comments]) => {
      if (articleExists === false)
        return Promise.reject({
          status: 404,
          msg: `Invalid article_id: ${article_id}`
        });
      else res.status(200).send({ comments });
    })
    .catch(err => {
      next(err);
    });
};

exports.sendAllArticles = (req, res, next) => {
  const { topic, author } = req.query;
  fetchAllArticles(req.query)
    .then(articles => {
      const topicExists = topic ? checkExists(topic, "topics", "slug") : null;
      const authorExists = author
        ? checkExists(author, "users", "username")
        : null;
      return Promise.all([topicExists, authorExists, articles]);
    })
    .then(([topicExists, authorExists, articles]) => {
      if (topicExists === false || authorExists === false)
        return Promise.reject({ status: 404, msg: "Resource Not Found" });
      else res.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};
