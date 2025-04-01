using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.DTOs
{    public class UserDto
    {
        public int Id { get; set; }

        public string? LoginId { get; set; }

        public byte[]? Password { get; set; }

        public string? Name { get; set; }

        public string Email { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public string? Role { get; set; }

        public bool? IsActive { get; set; }                
    }
}
