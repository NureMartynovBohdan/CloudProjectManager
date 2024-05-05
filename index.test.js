const request = require("supertest");
const app = require("./index");

describe("GET /user/:id", () => {
  it("should return user data for a valid ID", async () => {
    const res = await request(app).get("/user/valid_id");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user_id");
  });

  it("should return 404 for an invalid ID", async () => {
    const res = await request(app).get("/user/invalid_id");
    expect(res.statusCode).toEqual(404);
  });

  it("should return 404 for a nonexistent route", async () => {
    const res = await request(app).get("/nonexistent_route");
    expect(res.statusCode).toEqual(404);
  });
});
