import { registerAs } from '@nestjs/config';
import { FileConfig } from '../../files/config/file-config.type';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import validateConfig from '../../utils/validate-config';

enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
}

class EnvironmentVariablesValidator {
  @IsEnum(FileDriver)
  FILE_DRIVER: FileDriver;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  ACCESS_KEY_ID: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  SECRET_ACCESS_KEY: string;
}

export default registerAs<FileConfig>('file', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    driver: process.env.FILE_DRIVER ?? 'local',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    maxFileSize: 5242880, // 5mb
  };
});
