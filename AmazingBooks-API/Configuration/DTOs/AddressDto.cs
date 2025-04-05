using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.DTOs
{
    public class AddressDto
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string AddressLine1 { get; set; } = null!;

        public string? AddressLine2 { get; set; }

        public string City { get; set; } = null!;

        public string State { get; set; } = null!;

        public string Country { get; set; } = null!;

        public string Zip { get; set; } = null!;

        public string Type { get; set; } = null!;

        public int FkuserId { get; set; }
        
    }
}
