const {
  formatTimeStamp,
  changeKey,
  createRef,
  formatCommentsByArticleId
} = require("../utils/seed-functions");

const { expect } = require("chai");

describe("formatTimeStamp", () => {
  it("returns an unmutated array when passed an array", () => {
    const articles = [];
    const timeStamp = [];
    expect(formatTimeStamp(articles)).to.not.equal(timeStamp);
  });
  it("returns an array of one object containing the 'created_at' column, formatted using a timestamp", () => {
    const articles = [{ created_at: 1542284514171 }];
    const output = formatTimeStamp(articles);
    const result = output[0].created_at;
    expect(result).to.be.an.instanceof(Date);
  });
  it("returns an array of multiple objects with the timestamp correctly formatted", () => {
    const articles = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const output = formatTimeStamp(articles);
    output.forEach(article => {
      expect(article.created_at).to.be.an.instanceof(Date);
    });
  });
});

describe("changeKey", () => {
  it("returns an unmutated array when passed an array", () => {
    const input = [];
    const output = [];
    expect(changeKey(input)).to.not.equal(output);
  });
  it("returns the comments array with the 'created_by' key changed to 'author' for a single key-value pair", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        author: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(changeKey(input, "created_by")).to.eql(output);
  });
  it("returns the comments array with the 'created_by' key changed to 'author' for multiple key-value pairs", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        author: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        author: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        author: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    expect(changeKey(input, "created_by")).to.eql(output);
  });
});

describe("createRef", () => {
  it("returns an unmutated array when passed an array", () => {
    const input = [];
    const output = {};
    expect(createRef(input)).to.eql(output);
  });
  it("returns a reference object containing the 'title' and 'article_id' key-value pairs, when an array of a single object is passed in", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        article_id: 1
      }
    ];
    const output = {
      "Living in the shadow of a great man": 1
    };
    expect(createRef(input)).to.eql(output);
  });
  it("returns a reference object containing the 'title' and 'article_id' key-value pairs, when an array of multiple objects are passed in", () => {
    const input = [
      { title: "Living in the shadow of a great man", article_id: 1 },
      { title: "Sony Vaio; or, The Laptop", article_id: 2 },
      { title: "Eight pug gifs that remind me of mitch", article_id: 3 },
      { title: "Student SUES Mitch!", article_id: 4 }
    ];
    const output = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2,
      "Eight pug gifs that remind me of mitch": 3,
      "Student SUES Mitch!": 4
    };
    expect(createRef(input)).to.eql(output);
  });
});

describe("formatCommentsByArticleId", () => {
  it("returns an empty array if no values are passed in", () => {
    expect(formatCommentsByArticleId()).to.eql([]);
  });
  it("returns a single object in an array with the 'belongs_to' key replaced by the 'article_id' key", () => {
    const createRef = {
      "They're not exactly dogs, are they?": 1
    };
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(formatCommentsByArticleId(comments, createRef)).to.eql(output);
  });
  it("returns multiple objects in an array with the 'belongs_to' key replaced by the 'article_id' key", () => {
    const createRef = {
      "They're not exactly dogs, are they?": 1,
      "Living in the shadow of a great man": 2,
      "Living in the shadow of a great man": 2,
      "UNCOVERED: catspiracy to bring down democracy": 3
    };
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        belongs_to: "UNCOVERED: catspiracy to bring down democracy",
        created_by: "icellusedkars",
        votes: 16,
        created_at: 1101386163389
      }
    ];
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 2,
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        article_id: 2,
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        article_id: 3,
        created_by: "icellusedkars",
        votes: 16,
        created_at: 1101386163389
      }
    ];
    expect(formatCommentsByArticleId(comments, createRef)).to.eql(output);
  });
});
