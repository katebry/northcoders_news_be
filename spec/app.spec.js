process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const { expect } = require("chai");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/topics", () => {
    it("GET status: 200, responds with an array of 'topics' objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("Object");
          expect(topics).to.contain.keys("slug", "description");
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
      it("GET status: 400, responds with a 400 'Bad Request' error when passed an invalid data type", () => {
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
            expect(article.article_id).to.eql(1);
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
      it("PATCH status: 400, responds with a '400' Bad Request error when passed an invalid data type", () => {
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
    });
  });
});
