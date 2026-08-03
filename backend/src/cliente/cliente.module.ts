import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { DeudaReminderService } from './deuda-reminder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService, DeudaReminderService],
  imports: [TypeOrmModule.forFeature([Cliente])],
})
export class ClienteModule {}
