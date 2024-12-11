import { Test, TestingModule } from '@nestjs/testing';
import { ServiceLogController } from './service-log.controller';
import { ServiceLogService } from './service-log.service';

describe('ServiceLogController', () => {
  let controller: ServiceLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceLogController],
      providers: [ServiceLogService],
    }).compile();

    controller = module.get<ServiceLogController>(ServiceLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
