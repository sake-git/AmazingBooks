using System.Net.Mail;
using System.Net;


namespace AmazingBooks_API.Services
{
    public class EmailService : IEmailService
    {
        static string smtpAddress;
        static int portNumber;
        static string emailFromAddress;
        static string password;
        private IConfiguration _config;

        public EmailService(IConfiguration config) 
        {
            _config = config;
            smtpAddress = config["GmailSetting:SmtpAddress"];
            portNumber = Convert.ToInt32(config["GmailSetting:Port"]);
            emailFromAddress = config["GmailSetting:EmailId"];
            password  = config["GmailSetting:Password"];
       
        }

        public void SendEmail(string emailToAddress, string subject, string body)
        {
            
            using (MailMessage mail = new MailMessage())
            {
                mail.From = new MailAddress(emailFromAddress);
                mail.To.Add(emailToAddress);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;
                //mail.Attachments.Add(new Attachment("D:\\TestFile.txt"));//--Uncomment this to send any attachment  
                using (SmtpClient smtp = new SmtpClient(smtpAddress, portNumber))
                {
                    smtp.Credentials = new NetworkCredential(emailFromAddress, password);
                    smtp.EnableSsl = true;
                    smtp.Send(mail);
                }
            }
        }
    }
    
}