import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        if (!res.body.message || res.body.message !== 'Perriturno API funcionando') {
          throw new Error('Expected message "Perriturno API funcionando"');
        }
      });
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        if (res.body.status !== 'ok') {
          throw new Error('Expected status "ok"');
        }
        if (res.body.service !== 'perriturno-backend') {
          throw new Error('Expected service "perriturno-backend"');
        }
        if (typeof res.body.timestamp !== 'string') {
          throw new Error('Expected timestamp to be a string');
        }
        // Validar que sea una fecha válida
        const timestamp = new Date(res.body.timestamp);
        if (isNaN(timestamp.getTime())) {
          throw new Error('Expected timestamp to be a valid date');
        }
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
