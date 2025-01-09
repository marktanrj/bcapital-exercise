export interface AppConfig {
  port: number;
  environment: string;
  database: DatabaseConfig;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl:
    | {
        rejectUnauthorized: boolean;
        ca: string;
      }
    | boolean;
}
