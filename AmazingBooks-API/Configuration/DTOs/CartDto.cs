using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.DTOs
{
    public class CartDto
    {
        public int Id { get; set; }
        public int FkuserId { get; set; }
        public int FkbookId { get; set; }
        public int? Quantity { get; set; }
        public BookDto? Book { get; set; } = null!;
    }
}
