process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
const connection = require("../db/connection");

chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/topics", () => {
    it("GET status: 200, responds with an array of 'topics' objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("Array");
          expect(topics[0]).to.be.an("Object");
          expect(topics[0]).to.contain.keys("slug", "description");
        });
    });
  });

  describe("/users", () => {
    describe("/:username", () => {
      it("GET status: 200, responds with an array of 'users'", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.be.an("Object");
            expect(user.username).to.equal("butter_bridge");
            expect(user).to.contain.keys("username", "avatar_url", "name");
          });
      });
      it("GET status: 404, responds with a 404 error when passed a non-existent username", () => {
        return request(app)
          .get("/api/users/invalidsluggingtonian")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Invalid username: invalidsluggingtonian"
            );
          });
      });
    });
  });

  describe("/articles", () => {
    describe("/:article_id", () => {
      it("GET status: 200, responds with an array of 'articles' - each article object containing the correct properties", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.an("Object");
            expect(article.article_id).to.eql(1);
            expect(article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("GET status: 404, responds with a 404 'Not Found' error when passed a non-existent article", () => {
        return request(app)
          .get("/api/articles/1234567890")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid article_id: 1234567890");
          });
      });
      it("GET status: 400, responds with a 400 'Bad Request' error when passed an invalid article_id data type", () => {
        return request(app)
          .get("/api/articles/invalidId")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'invalid input syntax for integer: "invalidId"'
            );
          });
      });
      it("PATCH status: 200, responds with an object containing an updated 'votes' property on the specified article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: 8
          })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.article_id).to.equal(1);
            expect(article).to.be.an("Object");
            expect(article.votes).to.equal(108);
            expect(article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes"
            );
          });
      });
      it("PATCH status: 200, responds with an updated 'votes' property, ignoring additional properties included in the request", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 2, name_of_voter: "me" })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(102);
            expect(article.article_id).to.eql(1);
            expect(article).to.be.an("Object");
            expect(article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes"
            );
          });
      });
      it("PATCH status: 404, responds with a '404' Not Found error when passed a non-existent article", () => {
        return request(app)
          .patch("/api/articles/99999")
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid article_id: 99999");
          });
      });
      it("PATCH status: 400, responds with a '400' Bad Request error when passed an invalid article_id data type", () => {
        return request(app)
          .patch("/api/articles/notanarticle")
          .send({ inc_votes: 31 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'invalid input syntax for integer: "notanarticle"'
            );
          });
      });
      it("PATCH status: 400, responds with a '400' Bad Request error when passed a malformed body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'invalid input syntax for integer: "NaN"'
            );
          });
      });

      describe("/comments", () => {
        it("POST status: 201, responds with the posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "rogersop", body: "An enlightening read" })
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment.body).to.equal("An enlightening read");
              expect(comment.article_id).to.equal(1);
            });
        });
        it("POST status: 400, responds with 'Bad Request' when passed a malformed body", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              user_id: "rogersop",
              body_of_comment: "An englightening read"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'column "body_of_comment" of relation "comments" does not exist'
              );
            });
        });
        it("POST status: 400, responds with 'Bad Request' when passed a property that fails schema validation", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: 12345, body: "An enlightening read" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'insert or update on table "comments" violates foreign key constraint "comments_author_foreign"'
              );
            });
        });
        it("GET status: 200, responds with an array of 'comments' for the given 'article_id', sorted by the 'created_at' property", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=created_at")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.descendingBy("created_at");
              expect(comments).to.be.an("Array");
              expect(comments[0].article_id).to.equal(1);
              expect(comments[0]).to.contain.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
            });
        });
        it("GET status: 404, responds with a 404 'Not Found' error when passed a non-existent article", () => {
          return request(app)
            .get("/api/articles/1234567890/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid article_id: 1234567890");
            });
        });
        it("GET status: 400, responds with a 400 'Bad Request' error when passed an invalid article_id data type", () => {
          return request(app)
            .get("/api/articles/invalidId/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'invalid input syntax for integer: "invalidId"'
              );
            });
        });
        it("GET status: 400, responds with a 400 'Bad Request' error when passed an invalid query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=banana")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('column "banana" does not exist');
            });
        });
      });
    });
    it("GET status: 200, responds with an array of 'articles' objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an("Array");
          expect(articles[0]).to.be.an("Object");
          expect(articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "comment_count",
            "topic",
            "created_at",
            "votes"
          );
        });
    });
    it("GET status: 200, responds with an array of 'articles' objects sorted by the 'created_at' property", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("created_at");
          expect(articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "comment_count",
            "topic",
            "created_at",
            "votes"
          );
        });
    });
    it("GET status: 200, responds with an array of 'articles' objects sorted by an 'author' query", () => {
      return request(app)
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].author).to.equal("rogersop");
          expect(articles).to.be.descendingBy("created_at");
          expect(articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "comment_count",
            "topic",
            "created_at",
            "votes"
          );
        });
    });
    it("GET status: 200, responds with an array of 'articles' objects sorted by a 'topic' query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0].topic).to.equal("mitch");
          expect(articles).to.be.descendingBy("created_at");
          expect(articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "comment_count",
            "topic",
            "created_at",
            "votes"
          );
        });
    });
    it("GET status: 404, responds with 404 when passed an non-existent topic query", () => {
      return request(app)
        .get("/api/articles?author=banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Resource Not Found");
        });
    });
    it("GET status: 404, responds with 404 when passed an non-existent author query", () => {
      return request(app)
        .get("/api/articles?topic=banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Resource Not Found");
        });
    });
    it("GET status: 400, responds with a 400 'Bad Request' error when passed an invalid query", () => {
      return request(app)
        .get("/api/articles?sort_by=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('column "banana" does not exist');
        });
    });
  });

  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("PATCH status: 200, responds with an object containing an updated 'votes' property on the specified comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({
            inc_votes: 10
          })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.comment_id).to.equal(1);
            expect(comment.votes).to.equal(26);
            expect(comment).to.be.an("Object");
            expect(comment).to.contain.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
          });
      });
      it("PATCH status: 200, responds with an updated 'votes' property, ignoring additional properties included in the request", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 2, name_of_voter: "me" })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(18);
            expect(comment.comment_id).to.eql(1);
            expect(comment).to.be.an("Object");
            expect(comment).to.contain.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
          });
      });
      it("PATCH status: 404, responds with a '404' Not Found error when passed a non-existent article", () => {
        return request(app)
          .patch("/api/comments/99999")
          .send({ inc_votes: 100 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid comment_id: 99999");
          });
      });
      it("PATCH status: 400, responds with a '400' Bad Request error when passed an invalid article_id data type", () => {
        return request(app)
          .patch("/api/comments/notanarticle")
          .send({ inc_votes: 31 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'invalid input syntax for integer: "notanarticle"'
            );
          });
      });
      it("PATCH status: 400, responds with a '400' Bad Request error when passed a malformed body", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'invalid input syntax for integer: "NaN"'
            );
          });
      });
      it("DELETE status: 204 when passed a valid comment_id", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("DELETE status: 404, responds with 404 when provided a valid, but non-existent, comment_id", () => {
        return request(app)
          .delete("/api/comments/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment with id 9999 not found");
          });
      });
    });
  });
});
