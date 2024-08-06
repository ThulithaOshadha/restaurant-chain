export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontEndAdminDomain?: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
  sendGridApiKey: string,
  sendGridVerifiedSender: string,
  redisHost: string,
};
