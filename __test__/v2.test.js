"use strict";

const { db } = require("../src/models/index");
const { server } = require("../src/server");
const supertest = require("supertest");
const mockRequest = supertest(server);

let users = {
  admin: { username: "Omar", password: "password", role: "admin" },
  editor: { username: "Ahmed", password: "password", role: "editor" },
  writer: { username: "Sara", password: "password", role: "writer" },
  user: { username: "guest", password: "password", role: "user" },
};
beforeAll(async (done) => {
  await db.sync();
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});

Object.keys(users).forEach((userType) => {
  describe(`${userType} user Test`, () => {
    it("Create fruit item", async () => {
      const res = await mockRequest.post("/signup").send(users[userType]);
      const response = await mockRequest
        .post("/api/v2/food")
        .send({
          name: "apple",
          calories: 0.17,
          type: "fruit",
        })
        .set("Authorization", `Bearer ${res.body.token}`);
      if (userType === "user") {
        expect(response.status).toBe(500);
      } else {
        expect(response.status).toBe(201);
        expect(JSON.parse(response.text).name).toStrictEqual("apple");
      }
    });

    it("Get the food", async () => {
      const res = await mockRequest
        .post("/signin")
        .auth(users[userType].username, users[userType].password);

      const response = await mockRequest
        .get("/api/v2/food")
        .set("Authorization", `Bearer ${res.body.token}`);
      expect(response.status).toBe(200);
    });

    it("Get single food item", async () => {
      const res = await mockRequest
        .post("/signin")
        .auth(users[userType].username, users[userType].password);

      const response = await mockRequest
        .get("/api/v2/food/1")
        .set("Authorization", `Bearer ${res.body.token}`);
      expect(response.status).toBe(200);
      expect(JSON.parse(response.text).id).toStrictEqual(1);
    });

    it("Update food item", async () => {
      const res = await mockRequest
        .post("/signin")
        .auth(users[userType].username, users[userType].password);

      const response = await mockRequest
        .put("/api/v2/food/1")
        .send({
          name: "strawberry",
          calories: 0.2,
          type: "fruit",
        })
        .set("Authorization", `Bearer ${res.body.token}`);

      if (userType === "user" || userType === "writer") {
        expect(response.status).toBe(500);
      } else {
        expect(response.status).toBe(200);
        expect(JSON.parse(response.text).name).toStrictEqual("strawberry");
      }
    });

    it("Delete Models", async () => {
      const res = await mockRequest
        .post("/signin")
        .auth(users[userType].username, users[userType].password);
      const response = await mockRequest
        .delete("/api/v2/food/2")
        .set("Authorization", `Bearer ${res.body.token}`);
      if (userType === "admin") {
        expect(response.status).toBe(200);
      } else {
        expect(response.status).toBe(500);
        expect(JSON.parse(response.text).message).toStrictEqual("Access Denied");
        
      }
    });
  });
});
