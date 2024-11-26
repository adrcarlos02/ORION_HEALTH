import request from "supertest";
import app from "../server.js";
import { mockUsers } from "./mockData.js";

describe("User Authentication Tests", () => {
  test("Login with valid credentials", async () => {
    const validUser = mockUsers[0];

    const response = await request(app).post("/api/user/login").send({
      email: validUser.email,
      password: "correct-password", // replace with your test input
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  test("Login with invalid credentials", async () => {
    const invalidUser = {
      email: "nonexistent@example.com",
      password: "wrong-password",
    };

    const response = await request(app).post("/api/user/login").send(invalidUser);

    expect(response.statusCode).toBe(401); // assuming you send a 401 for invalid credentials
    expect(response.body.success).toBe(false);
    expect(response.body.token).toBeUndefined();
  });
});