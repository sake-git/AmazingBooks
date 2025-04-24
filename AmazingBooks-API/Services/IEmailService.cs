namespace AmazingBooks_API.Services
{
    public interface IEmailService
    {
        public void SendEmail(string emailToAddress, string title, string link);
    }
}
