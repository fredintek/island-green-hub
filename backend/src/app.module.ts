import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PageModule } from './page/page.module';
import { SectionModule } from './section/section.module';
import { ProjectHouseModule } from './project-house/project-house.module';
import { CommunicationModule } from './communication/communication.module';
import { FaqModule } from './faq/faq.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';
import jwtConfig from './config/jwt.config';
import mailConfig from './config/mail.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { RoleGuard } from './auth/guards/role/role.guard';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import cloudinaryConfig from './config/cloudinary.config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env.production' : `.env.${ENV}`,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        mailConfig,
        cloudinaryConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        autoLoadEntities: true,
        synchronize: false,
        port: +configService.get('database.port'),
        host: configService.get('database.host'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.databaseName'),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
          issuer: configService.get<string>('jwt.issuer'),
          audience: configService.get<string>('jwt.audience'),
        },
      }),
      global: true,
    }),
    PageModule,
    SectionModule,
    ProjectHouseModule,
    CommunicationModule,
    FaqModule,
    AuthModule,
    UserModule,
    MailModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AccessTokenGuard,
    RoleGuard,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
  ],
})
export class AppModule {}
