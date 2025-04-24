using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.DTOs
{
    public class RequestDto
    {
        public int Id { get; set; }

        public int FkUser { get; set; }

        public string? SelfLink { get; set; }
     
        public string Title { get; set; } = null!;

        public string Author { get; set; } = null!;

        public string? Status { get; set; }
    }
}
