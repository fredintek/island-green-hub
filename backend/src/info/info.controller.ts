import { Body, Controller, Post } from '@nestjs/common';
import { InfoService } from './providers/info.service';
import { SendNewsLetterDto } from './dtos/send-news-letter.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { CareerApplicationDto } from './dtos/career-application.dto';
import { ConsultExpertDto } from './dtos/consult-expert.dto';

@Controller('info')
export class InfoController {
  constructor(
    /**
     * Injecting the info service
     */
    private readonly infoService: InfoService,
  ) {}

  // send news letter
  @Auth(AuthType.None)
  @Post('newsletter')
  sendNewsLetter(@Body() sendNewsLetterDto: SendNewsLetterDto) {
    return this.infoService.sendNewsLetter(sendNewsLetterDto);
  }

  @Auth(AuthType.None)
  @Post('careers-apply')
  careerApplication(@Body() careerApplicationDto: CareerApplicationDto) {
    return this.infoService.careerApplication(careerApplicationDto);
  }

  @Auth(AuthType.None)
  @Post('consult-expert')
  consultExpert(@Body() consultExpertDto: ConsultExpertDto) {
    return this.infoService.consultExpert(consultExpertDto);
  }
}
