/// * typeorm migration:create .apps/e-signature/src/database/migrations/init
/// 01. build:data-source  [database/data-source.ts -> js 빌드 목적]
/// 02. typeorm migration:generate ./apps/e-signature/src/database/migrations/init -d ./dist/database/data-source.js  [정의된 엔티티 파일 기준으로 SQL 코드 생성 목적]
/// ★★★ [중요!!!] 생성된 마이그레이션 파일에서 "web"."UserMaster" 테이블 관련 코드 모두 수동 제거 ★★★
/// 03. build:data-source  [SQL 코드가 자동 생성된 파일을 다시 js로 빌드 목적 ]
/// 04. typeorm migration:run -d ./dist/database/data-source.js  [실제 SQL 코드 실행]

import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

dotenv.config({
  path: join(process.cwd(), 'apps', 'e-signature', '.env'),
});

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
