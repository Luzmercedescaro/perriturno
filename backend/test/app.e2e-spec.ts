import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module';
import { User, UserRole } from './../src/users/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
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

  it('flujo de autenticación (e2e)', async () => {
    const email = `e2e.usuario.${Date.now()}@perriturno.test`;
    const password = 'Prueba123*';
    const dataSource = moduleFixture.get<DataSource>(DataSource);

    try {
      // 1. Registro
      const registerRes = await request(app.getHttpServer())
        .post('/users/register')
        .send({ name: 'Usuario E2E', phone: '3001234567', email, password })
        .expect(201);

      if (registerRes.body.email !== email) {
        throw new Error('El correo registrado no coincide');
      }
      if (registerRes.body.role !== 'CLIENTE') {
        throw new Error('El rol esperado es CLIENTE');
      }
      if ('password' in registerRes.body) {
        throw new Error('La respuesta no debe incluir password');
      }

      // 2. Login con contraseña incorrecta → 401
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password: 'wrongpassword' })
        .expect(401);

      // 3. Login con credenciales correctas → 201 y access_token
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password })
        .expect(201);

      const accessToken: string = loginRes.body.access_token;
      if (typeof accessToken !== 'string' || accessToken.length === 0) {
        throw new Error('access_token debe ser un string no vacío');
      }

      // 4. GET /users/profile sin token → 401
      await request(app.getHttpServer())
        .get('/users/profile')
        .expect(401);

      // 5. GET /users/profile con token → 200
      const profileRes = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      if (profileRes.body.email !== email) {
        throw new Error('El correo del perfil no coincide');
      }
      if ('password' in profileRes.body) {
        throw new Error('El perfil no debe incluir password');
      }
    } finally {
      // Limpieza: eliminar el usuario creado
      await dataSource.getRepository(User).delete({ email });
    }
  });

  it('autorización por roles (e2e)', async () => {
    const ts = Date.now();
    const emailCliente = `e2e.cliente.${ts}@perriturno.test`;
    const emailAdmin = `e2e.admin.${ts}@perriturno.test`;
    const password = 'Prueba123*';
    const dataSource = moduleFixture.get<DataSource>(DataSource);
    const userRepo = dataSource.getRepository(User);

    try {
      // 1. Registrar ambos usuarios
      await request(app.getHttpServer())
        .post('/users/register')
        .send({ name: 'Cliente E2E', phone: '3001111111', email: emailCliente, password })
        .expect(201);

      await request(app.getHttpServer())
        .post('/users/register')
        .send({ name: 'Admin E2E', phone: '3002222222', email: emailAdmin, password })
        .expect(201);

      // 2. Promover al segundo usuario a ADMIN directamente en la BD
      await userRepo.update({ email: emailAdmin }, { role: UserRole.ADMIN });

      // 3. Obtener tokens
      const loginCliente = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: emailCliente, password })
        .expect(201);
      const tokenCliente: string = loginCliente.body.access_token;

      const loginAdmin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: emailAdmin, password })
        .expect(201);
      const tokenAdmin: string = loginAdmin.body.access_token;

      // 4. GET /users sin token → 401
      await request(app.getHttpServer())
        .get('/users')
        .expect(401);

      // 5. GET /users con token CLIENTE → 403
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${tokenCliente}`)
        .expect(403);

      // 6. GET /users con token ADMIN → 200
      const adminRes = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(200);

      const users: Record<string, unknown>[] = adminRes.body;

      if (!Array.isArray(users)) {
        throw new Error('La respuesta debe ser un arreglo');
      }

      const emails = users.map((u) => u['email']);
      if (!emails.includes(emailCliente)) {
        throw new Error('El arreglo debe incluir el correo del CLIENTE');
      }
      if (!emails.includes(emailAdmin)) {
        throw new Error('El arreglo debe incluir el correo del ADMIN');
      }

      for (const u of users) {
        if ('password' in u) {
          throw new Error('Ningún usuario debe exponer la propiedad password');
        }
      }
    } finally {
      // Limpieza
      await userRepo.delete({ email: emailCliente });
      await userRepo.delete({ email: emailAdmin });
    }
  });

  afterEach(async () => {
    await app.close();
  });
});
