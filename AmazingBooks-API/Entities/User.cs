using System;
using System.Collections.Generic;

namespace AmazingBooks_API.Entities;

public partial class User
{
    public int Id { get; set; }

    public string? LoginId { get; set; }

    public byte[]? Password { get; set; }

    public string? Name { get; set; }

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Role { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
