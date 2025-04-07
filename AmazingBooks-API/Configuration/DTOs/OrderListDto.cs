using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.DTOs
{
    public class OrderListDto
    {
        public int Id { get; set; }

        public DateTime OrderDate { get; set; }

        public decimal Total { get; set; }

        public string Status { get; set; } = null!;

        public int FkuserId { get; set; }
        public AddressDto FkshippingAddressNavigation { get; set; } = null!;


    }
}
