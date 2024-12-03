const app = require(`../app`);
const request = require(`supertest`);
const { sequelize } = require("../models");
const { hash } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

let access_token;

beforeAll(async () => {
  //seeding users
  const users = require("../data/users.json");
  users.forEach((el) => {
    el.password = hash(el.password);
    el.updatedAt = el.createdAt = new Date();
  });

  //seeding cateogry
  const roomchats = require("../data/roomchat.json");
  roomchats.forEach((el) => {
    el.updatedAt = el.createdAt = new Date();
  });

  await sequelize.queryInterface.bulkInsert("Users", users, {});
  await sequelize.queryInterface.bulkInsert("RoomChats", roomchats, {});

  // access token
  const payload = {
    userId: 1,
    email: "raga@mail.com",
    username: "raga raga",
    password: "123456",
    socket: null,
  };

  access_token = signToken(payload);
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete(`Users`, null, { truncate: true, cascade: true, restartIdentity: true });
  await sequelize.queryInterface.bulkDelete(`RoomChats`, null, { truncate: true, cascade: true, restartIdentity: true });
  //   await sequelize.queryInterface.bulkDelete(`Cuisines`, null, { truncate: true, cascade: true, restartIdentity: true });
});

describe(`get /roomchat/total`, () => {
  describe(`get /roomchat/total - success`, () => {
    test(`should be return an object with message`, async () => {
      const response = await request(app).get(`/roomchat/total`).set("Authorization", `Bearer ${access_token}`);
      //   console.log(response.status);

      expect(response.status).toBe(200); // testing code status
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
    });
  });
  describe(`get /roomchat/total - fail`, () => {
    test(`should be return an object with message`, async () => {
      const response = await request(app).get(`/roomchat/total`).set("Authorization", `Bearer ${access_token}1`);

      expect(response.status).toBe(401); // testing code status
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
    });
  });
});

describe(`post /roomchat/join/:id`, () => {
  describe(`post /roomchat/join/:id - success`, () => {
    test(`should be return an object with message`, async () => {
      const response = await request(app).post(`/roomchat/join/1`).set("Authorization", `Bearer ${access_token}`);
      //   console.log(response.status);

      expect(response.status).toBe(200); // testing code status
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
    });
  });
  describe(`post /roomchat/join/:id - fail`, () => {
    test(`should be return an object with message`, async () => {
      const response = await request(app).post(`/roomchat/total`).set("Authorization", `Bearer ${access_token}1`);

      expect(response.status).toBe(401); // testing code status
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
    });
  });
});

describe(`get /roomchat/:id`, () => {
  describe(`get /roomchat/join/:id - success`, () => {
    test(`should be return an object with message`, async () => {
      const response = await request(app).get(`/roomchat/1`).set("Authorization", `Bearer ${access_token}`);
      //   console.log(response.status);

      expect(response.status).toBe(200); // testing code status
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
    });
  });
  describe(`get /roomchat/:id - fail`, () => {
    test(`should be return an object with message`, async () => {
      const response = await request(app).get(`/roomchat/1`).set("Authorization", `Bearer ${access_token}1`);

      expect(response.status).toBe(401); // testing code status
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
    });
  });
});


