export interface IMailService {
  sendMail(options: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<void>;
  sendInviteEmail(email: string, code: string, teamId: string): Promise<void>;
}
