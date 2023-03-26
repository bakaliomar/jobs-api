import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthDto, SigninAuthDto } from '@/auth/dto';
import * as pactum from 'pactum';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    prisma = app.get(PrismaService);
    app.listen(3333);
    await prisma.cleanDB();
    pactum.sleep(500);
    await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$xiT85ZUlQe19dKyLMXPNgg$AoH8IKT+pRNUeVUrRUElmQREMI0DmlLLrOffhaii1vE',
        cin: 'k45849',
        firstName: 'admin',
        lastName: 'test',
        roles: 'ADMIN',
      },
    });
    await prisma.user.create({
      data: {
        email: 'manager@gmail.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$xiT85ZUlQe19dKyLMXPNgg$AoH8IKT+pRNUeVUrRUElmQREMI0DmlLLrOffhaii1vE',
        cin: 'k5849',
        firstName: 'manager',
        lastName: 'test',
        roles: 'MANAGER',
      },
    });
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  pactum.sleep(1000);

  afterAll(() => {
    app.close();
  });

  describe('auth', () => {
    describe('singup', () => {
      const dto: AuthDto = {
        email: 'test245@gmail.com',
        password: '123',
        cin: 'kb45849',
        firstName: 'test',
        lastName: 'test',
      };
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, email: '' })
          .expectStatus(400);
      });
      it('should should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });
      it('should should throw an error if first name is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, firstName: '' })
          .expectStatus(400);
      });
      it('should should throw an error if last name is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, lastName: '' })
          .expectStatus(400);
      });
      it('should should throw an error if cin is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, cin: '' })
          .expectStatus(400);
      });
      it('should should throw an error if empty body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
    });
    describe('signin', () => {
      const dto: SigninAuthDto = {
        userName: 'test245@gmail.com',
        password: '123',
      };
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.userName,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get the current logged in user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
      it('should get the current logged in user', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
    });
    describe('Get All users', () => {
      it('should signin with admin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ userName: 'admin@gmail.com', password: '123' })
          .expectStatus(200)
          .stores('adminAt', 'access_token');
      });
      it('should signin with manager', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ userName: 'manager@gmail.com', password: '123' })
          .expectStatus(200)
          .stores('managerAt', 'access_token');
      });
      it('should get all users as admin', () => {
        return pactum
          .spec()
          .get('/users')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .expectStatus(200);
      });
      it('should get all users as manager', () => {
        return pactum
          .spec()
          .get('/users')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .expectStatus(200);
      });
      it('should not get all users as user', () => {
        return pactum
          .spec()
          .get('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(403);
      });
    });
    describe('create user', () => {
      const user = {
        email: 'test2ds5@gmail.com',
        password: '123',
        cin: 'kb4sad5849',
        firstName: 'test',
        lastName: 'test',
        roles: 'USER',
      };

      it('should not create user as a user', () => {
        return pactum
          .spec()
          .post('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(user)
          .expectStatus(403);
      });

      it('should not create user as a manager', () => {
        return pactum
          .spec()
          .post('/users')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .withBody(user)
          .expectStatus(403);
      });

      it('should create user as an admin', () => {
        return pactum
          .spec()
          .post('/users')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withBody(user)
          .expectStatus(201)
          .stores('userId', 'id');
      });
    });

    describe('edit user', () => {
      it('should not update a user as a user', () => {
        return pactum
          .spec()
          .patch('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({ email: 'test2ds5@gmail.com' })
          .expectStatus(403);
      });
      it('should not update a user as a manager', () => {
        return pactum
          .spec()
          .patch('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .withBody({ email: 'test2ds5@gmail.com' })
          .expectStatus(403);
      });
      it('should not upadate user with the same email as an admin', () => {
        return pactum
          .spec()
          .patch('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .withBody({ email: 'test2ds5@gmail.com' })
          .expectStatus(403);
      });
      it('should update a user as an admin', () => {
        return pactum
          .spec()
          .patch('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withBody({ email: 'test5894@gmail.com' })
          .expectStatus(200);
      });
    });
    describe('delete user', () => {
      it('should not be able to delete a user as a user', () => {
        return pactum
          .spec()
          .delete('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(403);
      });
      it('should not be able to delete a user as a manager', () => {
        return pactum
          .spec()
          .delete('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .expectStatus(403);
      });
      it('should delete a user as an admin', () => {
        return pactum
          .spec()
          .delete('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Speciality', () => {
    it('should get all the specialties', () => {
      return pactum.spec().get('/specailties');
    });
  });
});
