import { Response } from 'express';

export enum StatusCode {
  OK = 200,
  CREATED = 201
}

export enum ReasonStatusCode {
  OK = 'Success',
  CREATED = 'Created!'
}

interface SuccessResponseConfig<T> {
  message?: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata?: T;
}

class SuccessResponse<T = any> {
  public message: string;
  public status: number;
  public metadata: T | {};

  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {} as T
  }: SuccessResponseConfig<T>) {
    // Nếu không có message truyền vào, lấy mặc định từ reasonStatusCode
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  public send(res: Response, headers: Record<string, string> = {}): Response {
    return res.status(this.status).json(this);
  }
}

class OK<T = any> extends SuccessResponse<T> {
  constructor({ message, metadata }: { message?: string; metadata?: T }) {
    super({ message, metadata });
  }
}

class CREATED<T = any> extends SuccessResponse<T> {
  constructor({ message, metadata, options = {} }: { message?: string; metadata?: T; options?: object }) {
    super({
      message,
      statusCode: StatusCode.CREATED,
      reasonStatusCode: ReasonStatusCode.CREATED,
      metadata
    });
  }
}

export { OK, CREATED };
