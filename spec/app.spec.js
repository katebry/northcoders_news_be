process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const { expect } = require("chai");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/topics", () => {
    it("GET status: 200, responds with an array of 'topics' objects, each topic object containing the properties 'slug' and 'description'", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
          expect(body.topics[0]).to.contain.keys("slug", "description");
        });
    });
  });

  describe("/users", () => {
    it("GET status: 200, responds with an array of users, each user object containing the properties 'username', 'avatar-url' and 'name'", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.be.an("array");
          expect(body.user[0].username).to.eql("butter_bridge");
          expect(body.user[0]).to.contain.keys(
            "username",
            "avatar_url",
            "name"
          );
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
    it("GET status: 200, responds with an array of articles, each article object containing the properties 'author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count'", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.be.an("array");
          expect(article[0].article_id).to.eql(1);
          expect(article[0]).to.contain.keys(
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
    it("GET status: 404, responds with a 404 'not found' error when passed a non-existent article", () => {
      return request(app)
        .get("/api/articles/1234567890")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid article_id: 1234567890");
        });
    });
  });
});
