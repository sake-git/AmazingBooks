namespace AmazingBooks_API.Configuration.DTOs
{
    public class BookListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Author { get; set; } = null!;
        public decimal Price { get; set; }
        public string? ImgUrl { get; set; }   
        public int? Quantity { get; set; }
    }
}
