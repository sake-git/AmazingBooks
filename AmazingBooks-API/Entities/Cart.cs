using System;
using System.Collections.Generic;

namespace AmazingBooks_API.Entities;

public partial class Cart
{
    public int Id { get; set; }

    public int FkuserId { get; set; }

    public int FkbookId { get; set; }

    public int? Quantity { get; set; }

    public virtual Book Fkbook { get; set; } = null!;

    public virtual User Fkuser { get; set; } = null!;
}
