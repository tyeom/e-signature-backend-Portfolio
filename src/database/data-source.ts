/// * typeorm migration:create ./src/database/migrations/init
/// 01. pnpm build
/// 02. typeorm migration:generate ./src/database/migrations/init -d ./dist/database/data-source.js
/// ★★★ 생성된 마이그레이션 파일에서 "web"."UserMaster" 테이블 관련 코드 모두 수동 제거 ★★★
/// 03. pnpm build
/// 04. typeorm migration:run -d ./dist/database/data-source.js

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: 'esign',
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
});
