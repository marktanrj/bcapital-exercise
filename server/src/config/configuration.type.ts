export interface AppConfig {
  port: number;
  environment: string;
  sessionSecret: string;
  database: DatabaseConfig;
  cache: CacheConfig;
  anthropic: AnthropicConfig;
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

export interface CacheConfig {
  host: string;
  port: number;
}

export interface AnthropicConfig {
  apiKey: string;
  model: string; // https://docs.anthropic.com/en/docs/about-claude/models
}
