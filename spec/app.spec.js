process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
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
    it("GET status: 200, responds with an array of users", () => {
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
          expect(body.msg).to.equal("Invalid username: invalidsluggingtonian");
        });
    });
  });

  describe("/articles", () => {
    it("GET status: 200, responds with an array of articles - each article object containing the correct properties", () => {
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
  });
});
