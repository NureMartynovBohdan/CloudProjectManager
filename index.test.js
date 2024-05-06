const request = require("supertest");
const { app, connectDB, closeServer } = require("./index");
const { ObjectId } = require("mongodb");

let server;

beforeAll(async () => {
  await connectDB();
  server = app.listen(4000);
});

afterAll(() => {
  closeServer();
});

describe("GET /user/:id", () => {
  it("повинен повернути дані користувача для дійсного ідентифікатора", async () => {
    const validId = new ObjectId().toString();
    const res = await request(server).get(`/user/${validId}`);
    expect(res.statusCode).toEqual(404);
  });

  it("404 для недійсного ідентифікатора", async () => {
    const invalidId = "invalid_id";
    const res = await request(server).get(`/user/${invalidId}`);
    expect(res.statusCode).toEqual(404);
  });

  it("404 для неіснуючого маршруту", async () => {
    const res = await request(server).get("/nonexistent_route");
    expect(res.statusCode).toEqual(404);
  });
});
