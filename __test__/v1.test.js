'use strict';

const { db } = require("../src/models/index");
const { server } = require("../src/server");
const supertest = require("supertest");
const request = supertest(server);

describe("Testing units", () => {
  beforeAll(async () => {
    await db.sync();
  });
  afterAll(async () => {
    await db.drop();
  });

  it("Create new Clothes item", async () => {
    const res = await request.post("/api/v1/clothes").send({
      name: "shirt",
      color: "blue",
      size: "medium",
    });
    const { id, name, color, size } = JSON.parse(res.text);
    expect(res.status).toBe(201);
    expect({ id, name, color, size }).toStrictEqual({
      id: 1,
      name: "shirt",
      color: "blue",
      size: "medium",
    });
  });

  it("Get the clothes", async () => {
    const res = await request.get("/api/v1/clothes");
    const { id, name, color, size } = JSON.parse(res.text)[0];
    expect(res.status).toBe(200);
    expect({ id, name, color, size }).toStrictEqual({
      id: 1,
      name: "shirt",
      color: "blue",
      size: "medium",
    });
  });

  it("Get single clothes item", async () => {
    const res = await request.get("/api/v1/clothes/1");
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text).id).toBe(1);
  });

  it("Update clothes item", async () => {
    const res = await request.put("/api/v1/clothes/1").send({
      name: "jacket",
      color: "red",
      size: "large",
    });

    const { id, name, color, size } = res.body;
    expect(res.status).toBe(200);
    expect({ id, name, color, size }).toStrictEqual({
      id: 1,
      name: "jacket",
      color: "red",
      size: "large",
    });
  });

  it("delete clothes item", async () => {
    const res = await request.delete("/api/v1/clothes/1");
    expect(res.status).toBe(200);
  });

  it("Get deleted clothes", async () => {
    const res = await request.get("/api/v1/clothes/1");
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toBe(null);
  });

});
