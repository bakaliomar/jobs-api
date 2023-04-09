import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthDto, SigninAuthDto } from '@/auth/dto';
import * as pactum from 'pactum';
import * as FormData from 'form-data-lite';
import * as fs from 'fs';

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
    pactum.sleep(2000);
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
    describe('Create Speciality', () => {
      it('should not create a specilaity as a user', () => {
        return pactum
          .spec()
          .post('/specialities')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            name: 'dev info',
          })
          .expectStatus(403);
      });
      it('should create a specilaity as a manager', () => {
        return pactum
          .spec()
          .post('/specialities')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .withBody({
            name: 'reseau info',
          })
          .expectStatus(201)
          .stores('specialityId2', 'id');
      });
      it('should create a specilaity as a admin', () => {
        return pactum
          .spec()
          .post('/specialities')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withBody({
            name: 'dev info',
          })
          .expectStatus(201)
          .stores('specialityId', 'id');
      });
    });
    describe('Read all Specialites', () => {
      it('should not show all specilaities as a user', () => {
        return pactum
          .spec()
          .get('/specialities')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(403);
      });
      it('should show all specilaities as a manager', () => {
        return pactum
          .spec()
          .get('/specialities')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .expectStatus(200);
      });
      it('should should show all specilaities as an admin', () => {
        return pactum
          .spec()
          .get('/specialities')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Read a Speciality', () => {
      it('should not show a specilaity as a user', () => {
        return pactum
          .spec()
          .get('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .expectStatus(403);
      });
      it('should show a specilaity as a manager', () => {
        return pactum
          .spec()
          .get('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .expectStatus(200);
      });
      it('should should show a specilaity as an admin', () => {
        return pactum
          .spec()
          .get('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .expectStatus(200);
      });
    });
    describe('Update a Speciality', () => {
      it('should not update a specilaity as a user', () => {
        return pactum
          .spec()
          .patch('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .withBody({
            name: 'devops',
          })
          .expectStatus(403);
      });
      it('should update a specilaity as a manager', () => {
        return pactum
          .spec()
          .patch('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .withBody({
            name: 'devops',
          })
          .expectStatus(200);
      });
      it('should update a specilaity as an admin', () => {
        return pactum
          .spec()
          .patch('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .withBody({
            name: 'devops',
          })
          .expectStatus(200);
      });
    });
    describe('Update a Speciality', () => {
      it('should not update a specilaity as a user', () => {
        return pactum
          .spec()
          .patch('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .withBody({
            name: 'devops',
          })
          .expectStatus(403);
      });
      it('should update a specilaity as a manager', () => {
        return pactum
          .spec()
          .patch('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .withBody({
            name: 'devops',
          })
          .expectStatus(200);
      });
      it('should update a specilaity as an admin', () => {
        return pactum
          .spec()
          .patch('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .withBody({
            name: 'devops',
          })
          .expectStatus(200);
      });
    });

    describe('Delete a Speciality', () => {
      it('should not delete a specilaity as a user', () => {
        return pactum
          .spec()
          .delete('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .expectStatus(403);
      });
      it('should delete a specilaity as a manager', () => {
        return pactum
          .spec()
          .delete('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{managerAt}',
          })
          .withPathParams('id', '$S{specialityId}')
          .expectStatus(200);
      });
      it('should delete a specilaity as an admin', () => {
        return pactum
          .spec()
          .delete('/specialities/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withPathParams('id', '$S{specialityId2}')
          .expectStatus(200);
      });
    });
  });
  describe('Concour', () => {
    let speciality: { name: string; id: string };
    beforeAll(async () => {
      speciality = await prisma.speciality.create({
        data: {
          name: 'dev info',
        },
        select: {
          id: true,
          name: true,
        },
      });
    });
    describe('create concour', () => {
      const formData = new FormData();
      formData.append(
        'file',
        fs.readFileSync(`${process.cwd()}/test/sample.pdf`),
        {
          filename: 'sample.pdf',
        },
      );
      formData.append('name', 'test concour');
      formData.append('description', 'test description <div>tesf</div>');
      formData.append('location', 'tanger');
      formData.append('closingDate', new Date().toISOString());
      formData.append('concourDate', new Date().toISOString());
      formData.append('positionsNumber', 8);
      // it('should not create a concour as a user', () => {
      //   formData.append('specialities[]', speciality.id);
      //   return pactum
      //     .spec()
      //     .post('/concours')
      //     .withHeaders({
      //       Authorization: 'Bearer $S{userAt}',
      //     })
      //     .withMultiPartFormData(formData)
      //     .expectStatus(403);
      // });
      it('should create a concour as an admin', () => {
        formData.append('specialities[]', speciality.id);
        return pactum
          .spec()
          .post('/concours')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withMultiPartFormData(formData)
          .expectStatus(201)
          .stores('concourId', 'id');
      });
    });
    describe('read all concours', () => {
      it('should not be able to read any concour as a user', () => {
        return pactum
          .spec()
          .get('/concours')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(403);
      });
      it('should read all concours as an admin', () => {
        return pactum
          .spec()
          .get('/concours')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .expectStatus(200);
      });
    });
    describe('read all published concours', () => {
      it('should be able to read any concour as a guest user', () => {
        return pactum.spec().get('/concours/published').expectStatus(200);
      });
    });
    describe('get concour file', () => {
      it('should  be able to get a concours file as guest user', () => {
        return pactum
          .spec()
          .get('/concours/{id}/anounce')
          .withPathParams('id', '$S{concourId}')
          .expectStatus(200)
          .inspect();
      });
    });
    describe('read a concour', () => {
      it('should not be able to read a concour as a user', () => {
        return pactum
          .spec()
          .get('/concours/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{concourId}')
          .expectStatus(403);
      });
      it('should read a concour as an admin', () => {
        return pactum
          .spec()
          .get('/concours/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withPathParams('id', '$S{concourId}')
          .expectStatus(200);
      });
    });

    describe('update concour', () => {
      const formData = new FormData();
      formData.append(
        'file',
        fs.readFileSync(`${process.cwd()}/test/sample.pdf`),
        {
          filename: 'sample.pdf',
        },
      );
      formData.append('name', 'test concour');
      formData.append('description', 'test description <div>tesf</div>');
      formData.append('location', 'tanger');
      formData.append('closingDate', new Date().toISOString());
      formData.append('concourDate', new Date().toISOString());
      formData.append('positionsNumber', 8);
      it('should update a concour as an admin', () => {
        formData.append('specialities[]', speciality.id);
        return pactum
          .spec()
          .patch('/concours/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withPathParams('id', '$S{concourId}')
          .withMultiPartFormData(formData)
          .expectStatus(200);
      });
    });

    describe('delete a concour', () => {
      it('should not be able to delete a concour as a user', () => {
        return pactum
          .spec()
          .delete('/concours/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{concourId}')
          .expectStatus(403);
      });
      it('should delete a concour as an admin', () => {
        return pactum
          .spec()
          .delete('/concours/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{adminAt}',
          })
          .withPathParams('id', '$S{concourId}')
          .expectStatus(200);
      });
    });
  });
});
