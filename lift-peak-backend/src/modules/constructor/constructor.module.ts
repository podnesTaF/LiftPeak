import { Module } from '@nestjs/common';
import { ConstructorService } from './constructor.service';
import { ConstructorController } from './constructor.controller';

@Module({
  controllers: [ConstructorController],
  providers: [ConstructorService],
})
export class ConstructorModule {}
