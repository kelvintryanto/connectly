const app = require(`../app`);
const request = require(`supertest`);
const { sequelize } = require("../models");
const { hash } = require("../helpers/bcrypt");

beforeAll(async () => {
  //seeding users
  const users = require("../data/users.json");
  users.forEach((el) => {
    el.password = hash(el.password);
    el.updatedAt = el.createdAt = new Date();
  });

  //   //seeding games
  //   const categories = require("../data/categories.json");
  //   categories.forEach((el) => {
  //     el.updatedAt = el.createdAt = new Date();
  //   });

  //   //seeding events
  //   const cuisines = require("../data/cuisines.json");
  //   cuisines.forEach((el) => {
  //     el.updatedAt = el.createdAt = new Date();
  //   });

  await sequelize.queryInterface.bulkInsert("Users", users, {});

  //   await sequelize.queryInterface.bulkInsert("Categories", categories, {});
  //   await sequelize.queryInterface.bulkInsert("Cuisines", cuisines, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete(`Users`, null, { truncate: true, cascade: true, restartIdentity: true });
  //   await sequelize.queryInterface.bulkDelete(`Categories`, null, { truncate: true, cascade: true, restartIdentity: true });
  //   await sequelize.queryInterface.bulkDelete(`Cuisines`, null, { truncate: true, cascade: true, restartIdentity: true });
});

describe(`POST /login`, () => {
  describe(`POST /login - success`, () => {
    test(`should be return an object with message`, async () => {
      const body = { email: `raga@mail.com`, password: `123456` };
      const response = await request(app).post(`/login`).send(body);
      console.log(response.status);

      expect(response.status).toBe(200); // testing code status
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
      expect(response.body).toHaveProperty("access_token", expect.any(String)); /// testing key value
    });
  });

  describe(`POST /login - fail`, () => {
    test(`should be return an object with error message`, async () => {
      //error bila email kosong
      const body = { email: ``, password: `abugubaga` };

      const response = await request(app).post(`/login`).send(body);
      expect(response.status).toBe(400); // testing code status error if ( invalid username or invalid passwrod)
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
      expect(response.body).toHaveProperty("message", expect.any(String));
      // console.log(response.body);
    });

    test(`should be return an object with error message`, async () => {
      //error bila password kosong
      const body = { email: `josa@mail.com`, password: `` };

      const response = await request(app).post(`/login`).send(body);
      expect(response.status).toBe(400); // testing code status error if ( invalid username or invalid passwrod)
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
      expect(response.body).toHaveProperty("message", expect.any(String));
      //   console.log(response);
    });
    test(`should be return an object with error message`, async () => {
      //error bila invalid email
      const body = { email: `josa@mails.com`, password: `adudud` };

      const response = await request(app).post(`/login`).send(body);
      expect(response.status).toBe(401); // testing code status error if ( invalid username or invalid passwrod)
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
      expect(response.body).toHaveProperty("message", expect.any(String));
      //   console.log(response);
    });
    test(`should be return an object with error message`, async () => {
      //error bila invalid password
      const body = { email: `jose@mail.com`, password: `adudud` };

      const response = await request(app).post(`/login`).send(body);
      expect(response.status).toBe(401); // testing code status error if ( invalid username or invalid passwrod)
      expect(response.body).toBeInstanceOf(Object); //  testing tipe data
      expect(response.body).toHaveProperty("message", expect.any(String));
      //   console.log(response);
    });
  });
});

describe(`POST / register`, () => {
  describe(`POST /register / success `, () => {
    test(`should be return an object with message`, async () => {
      const body = { email: `raga2@mail.com`, username: "testing", password: "123456" };
      const response = await request(app).post(`/register`).send(body);

      expect(response.status).toBe(201); ///testing already create
      expect(response.body).toBeInstanceOf(Object);
    });
  });
  describe(`POST /register / FAIL `, () => {
    test(`should be return an object with message with no username `, async () => {
      const body = { email: `raga2@mail.com`, username: "", password: "123456" };
      const response = await request(app).post(`/register`).send(body);

      expect(response.status).toBe(400); ///ERROR
      expect(response.body).toBeInstanceOf(Object);
    });
    test(`should be return an object with message with no email `, async () => {
      const body = { email: ``, username: "", password: "123456" };
      const response = await request(app).post(`/register`).send(body);

      expect(response.status).toBe(400); ///ERROR INPUT
      expect(response.body).toBeInstanceOf(Object);
    });
    test(`should be return an object with message with no password `, async () => {
      const body = { email: `raga2@mail.com`, username: "", password: "" };
      const response = await request(app).post(`/register`).send(body);

      expect(response.status).toBe(400); //ERRROR
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});
