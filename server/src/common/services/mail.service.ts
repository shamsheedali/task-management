import { injectable } from 'inversify';
import transporter from '../../config/nodemailer.config';
import { IMailService } from '../interfaces/mail-service.interface';
import { AppError } from '../../utils/appError';
import HttpStatus from '../../common/constants/httpStatus';
import logger from '../../utils/logger';

@injectable()
export default class MailService implements IMailService {
  async sendMail(mailOptions: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${mailOptions.to}`);
    } catch (error) {
      logger.error('Failed to send email', { error: (error as Error).message });
      throw new AppError(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
