using System;
using System.Collections.Generic;

namespace AmazingBooks_API.Entities;

public partial class Request
{
    public int Id { get; set; }

    public int FkUser { get; set; }

    public string? SelfLink { get; set; }

    public string Title { get; set; } = null!;

    public string Author { get; set; } = null!;

    public string Status { get; set; } = null!;

    public virtual User FkUserNavigation { get; set; } = null!;
}
