import { injectable } from 'inversify';
import transporter from '../../config/nodemailer.config';
import { IMailService } from '../interfaces/mail-service.interface';
import { AppError } from '../../utils/appError';
import HttpStatus from '../../common/constants/httpStatus';
import logger from '../../utils/logger';
import { env } from '../../config/env';

@injectable()
export default class MailService implements IMailService {
  async sendMail(options: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    try {
      await transporter.sendMail(options);
      logger.info(`Email sent to ${options.to}`);
    } catch (error) {
      logger.error('Failed to send email', { error: (error as Error).message });
      throw new AppError(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sendInviteEmail(
    email: string,
    code: string,
    teamId: string
  ): Promise<void> {
    const inviteLink = `http://localhost:3000/teams/${teamId}/join?code=${code}`; // Adjust for production
    const mailOptions = {
      from: env.EMAIL_USER || '',
      to: email,
      subject: 'Team Invitation',
      text: `You have been invited to join a team. Use this code: ${code}\nOr click this link to join: ${inviteLink}\nThis invitation expires in 24 hours.`,
    };

    await this.sendMail(mailOptions);
  }
}
