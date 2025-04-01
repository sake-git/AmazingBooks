using System;
using System.Collections.Generic;

namespace AmazingBooks_API.Entities;

public partial class OrderLine
{
    public int Id { get; set; }

    public decimal Amount { get; set; }

    public int Quantity { get; set; }

    public decimal? Weight { get; set; }

    public int FkorderId { get; set; }

    public int FkbookId { get; set; }

    public virtual Book Fkbook { get; set; } = null!;

    public virtual Order Fkorder { get; set; } = null!;
}
