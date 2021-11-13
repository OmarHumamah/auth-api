'use strict';

const { db } = require("../src/models/index");
const { server } = require("../src/server");
const supertest = require("supertest");
const mockRequest = supertest(server);

describe("Testing units", () => {
  beforeAll(async () => {
    await db.drop();
    await db.sync();
  });
  afterAll(async () => {
    await db.drop();
  });
  it("singUp new USER", async () => {
    const res = await mockRequest.post("/signup").send({
      username: "Omar",
      password: "test",
      role: "user",
    });
    expect(res.status).toBe(201);
  });
  it("singIn the USER", async () => {
    const res = await mockRequest.post("/signin").auth("Omar", "test");
    const token = res.body.token;
    expect(res.status).toBe(200);
    expect(token).toBeDefined();
  });
  
});
