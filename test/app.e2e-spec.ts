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
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('auth', () => {
    describe('singup', () => {
      const dto: AuthDto = {
        email: 'test245@gmail.com',
        password: '123',
        cin: 'kb45849',
        first_name: 'test',
        last_name: 'test',
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
          .withBody({ ...dto, first_name: '' })
          .expectStatus(400);
      });
      it('should should throw an error if last name is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, last_name: '' })
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
        user_name: 'test245@gmail.com',
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
            email: dto.user_name,
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
  });

  describe('Speciality', () => {
    it('should get all the specialties', () => {
      return pactum.spec().get('/specailties');
    });
  });
});
