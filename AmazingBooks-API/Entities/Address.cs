using System;
using System.Collections.Generic;

namespace AmazingBooks_API.Entities;

public partial class Address
{
    public int Id { get; set; }

    public string AddressLine1 { get; set; } = null!;

    public string? AddressLine2 { get; set; }

    public string City { get; set; } = null!;

    public string State { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string Zip { get; set; } = null!;

    public string Type { get; set; } = null!;

    public int FkuserId { get; set; }

    public bool? IsActive { get; set; }

    public virtual User Fkuser { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
