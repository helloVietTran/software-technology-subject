import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../config/config';

type ExpiresInType = number | `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

class TokenHelper {
  private readonly secretKey: Secret;
  private readonly refreshSecretKey: Secret;
  private readonly accessTokenExpiration: ExpiresInType;
  private readonly refreshTokenExpiration: ExpiresInType;

  constructor(
    secretKey: string,
    refreshSecretKey: string,
    accessTokenExpiration: ExpiresInType,
    refreshTokenExpiration?: ExpiresInType
  ) {
    this.secretKey = secretKey;
    this.refreshSecretKey = refreshSecretKey;
    this.accessTokenExpiration = accessTokenExpiration;
    this.refreshTokenExpiration = refreshTokenExpiration || '3d';
  }

  async generateToken(payload: any): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.accessTokenExpiration });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return jwt.sign(payload, this.refreshSecretKey, { expiresIn: this.refreshTokenExpiration });
  }
}

export const tokenHelper = new TokenHelper(config.jwtSecret, config.refreshSecret, '2h', '3d');
