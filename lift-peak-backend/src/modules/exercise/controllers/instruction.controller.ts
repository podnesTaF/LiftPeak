import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Roles } from 'src/modules/auth/guards/roles.guard';
import { CreateInstructionDto } from '../dto/create-instruction.dto';
import { InstructionService } from '../services/instruction.service';

@Controller('exercise/:id/instruction')
export class InstructionController {
  constructor(private readonly instructionService: InstructionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async createInstructions(
    @Body() dto: CreateInstructionDto[],
    @Param('id') exerciseId: number,
  ) {
    return this.instructionService.createInstructions(exerciseId, dto);
  }
}
