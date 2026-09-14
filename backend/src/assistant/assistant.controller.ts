import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssistantService } from './assistant.service';
import { ChatMessageDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('AI Travel Assistant')
@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Public()
  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI Travel Assistant (supports both registered users and guests)' })
  async chat(@Req() req: any, @Body() chatDto: ChatMessageDto) {
    const user = req.user || null;
    return this.assistantService.processChat(user, chatDto);
  }
}
