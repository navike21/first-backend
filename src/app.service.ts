import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const PORT = process.env.NEST_SECRET_KEY;
    return PORT;
  }
}
