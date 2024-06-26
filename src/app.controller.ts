import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect()
  getIndex() {
    return { url: '/graphql' };
  }
}
