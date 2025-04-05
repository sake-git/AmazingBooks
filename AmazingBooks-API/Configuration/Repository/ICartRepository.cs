using AmazingBooks_API.Entities;


namespace AmazingBooks_API.Configuration.Repository
{
    public interface ICartRepository: ICommonRepository<Cart>
    { 
        public Task<IEnumerable<Cart>> GetBooksFromCart(int userId);    
    }
}
