import { BadRequestException, Injectable } from '@nestjs/common';
import { SendNewsLetterDto } from '../dtos/send-news-letter.dto';
import { MailService } from 'src/mail/providers/mail.service';
import { CareerApplicationDto } from '../dtos/career-application.dto';
import { ConsultExpertDto } from '../dtos/consult-expert.dto';

@Injectable()
export class InfoService {
  constructor(
    /**
     * Inject the custom MailService
     */
    private readonly mailService: MailService,
  ) {}

  public async sendNewsLetter(sendNewsLetterDto: SendNewsLetterDto) {
    // send news letter to email address
    try {
      await this.mailService.recievedNewsletter(sendNewsLetterDto?.email);
      return {
        message: 'You have successfully subscribe to our newsletter',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('failed to send email');
    }
  }

  public async careerApplication(careerApplicationDto: CareerApplicationDto) {
    // send news letter to email address
    try {
      await this.mailService.recievedCareerApplication({
        email: careerApplicationDto?.email,
        name: careerApplicationDto?.name,
      });
      return {
        message: 'Application sent successfully',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('failed to send email');
    }
  }

  public async consultExpert(consultExpertDto: ConsultExpertDto) {
    // send news letter to email address
    try {
      await this.mailService.consultationRequestRecieved({
        email: consultExpertDto?.email,
        name: consultExpertDto?.name,
      });
      return {
        message: 'Consultation sent successfully',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('failed to send email');
    }
  }
}
