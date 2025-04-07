using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.DTOs
{
    public class OrderLineDto
    {
        public int Id { get; set; }

        public decimal Amount { get; set; }

        public int Quantity { get; set; }

        public decimal? Weight { get; set; }

        public int? FkorderId { get; set; }

        public int? FkbookId { get; set; }

        public BookDto? Fkbook{ get; set; } = null!;
       
    }
}
