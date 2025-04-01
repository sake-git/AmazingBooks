namespace AmazingBooks_API.Configuration.DTOs
{
    public class BookDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Author { get; set; } = null!;

        public decimal Price { get; set; }

        public DateTime? PublicationDate { get; set; }

        public string? ImgUrl { get; set; }

        public string? Description { get; set; }

        public string? Language { get; set; }

        public string? Isbn { get; set; }

        public int? Pages { get; set; }

        public bool? Hardcover { get; set; }

        public decimal? Weight { get; set; }

        public int? Quantity { get; set; }

        public string? Genre { get; set; }

    }
}
