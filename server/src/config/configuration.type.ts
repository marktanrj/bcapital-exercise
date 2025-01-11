export interface AppConfig {
  port: number;
  environment: string;
  sessionSecret: string;
  database: DatabaseConfig;
  cache: CacheConfig;
  anthropic: AnthropicConfig;
}

export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface CacheConfig {
  url: string;
  host: string;
  port: number;
}

export interface AnthropicConfig {
  apiKey: string;
  model: string; // https://docs.anthropic.com/en/docs/about-claude/models
}
