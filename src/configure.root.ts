import { ConfigModule } from '@nestjs/config/dist/config.module';

const environment = process.env.NODE_ENV || 'development';

export const ConfigureModule = ConfigModule.forRoot({
    envFilePath: `.env.${environment}`,
    isGlobal: true,
  })