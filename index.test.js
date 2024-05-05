const request = require("supertest");
const { app, client } = require("./index");

let server;

beforeAll(async () => {
  await client.connect();
  server = app.listen(4000);
});

afterAll(async () => {
  await client.close();
  await server.close();
});

describe("GET /user/:id", () => {
  it("should return user data for a valid ID", async () => {
    const res = await request(server).get("/user/valid_id");
    console.log("Response for valid ID: ", res.statusCode, res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user_id");
  });

  it("should return 404 for an invalid ID", async () => {
    const res = await request(server).get("/user/invalid_id");
    console.log("Response for invalid ID: ", res.statusCode, res.body);
    expect(res.statusCode).toEqual(404);
  });

  it("should return 404 for a nonexistent route", async () => {
    const res = await request(server).get("/nonexistent_route");
    console.log("Response for nonexistent route: ", res.statusCode, res.body);
    expect(res.statusCode).toEqual(404);
  });
});
