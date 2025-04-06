using AmazingBooks_API.Entities;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;
namespace AmazingBooks_API.Configuration.Repository
{
    public class CartRepository : CommonRepository<Cart>, ICartRepository
    {
        private readonly AmazingBookDbContext _dbContext;
        public CartRepository(AmazingBookDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
            
        public async Task<IEnumerable<Cart>>GetBooksFromCart(int userId)
        {
            List<Cart> cartList =  _dbContext.Carts.Include(x => x.Fkbook).Where(x => x.FkuserId == userId).ToList();
            return cartList;
        }
               
    }
}
