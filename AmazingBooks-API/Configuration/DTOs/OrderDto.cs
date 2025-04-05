using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }

        public DateTime OrderDate { get; set; }

        public decimal SubTotal { get; set; }

        public decimal? Tax { get; set; }

        public decimal? Shipping { get; set; } 

        public decimal Total { get; set; }

        public string Status { get; set; } = null!;

        public DateTime? CancellationDate { get; set; }

        public decimal? Weight { get; set; }

        public int FkshippingAddress { get; set; }

        public int FkuserId { get; set; }     

        public virtual ICollection<OrderLine> OrderLines { get; set; } = new List<OrderLine>();
    }
}
