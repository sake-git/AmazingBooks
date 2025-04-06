using AmazingBooks_API.Configuration.Repository;
using AmazingBooks_API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmazingBooks_API.Configuration.Repository
{
    public class OrderRepository : CommonRepository<Order>, IOrderRepository
    {

        private readonly AmazingBookDbContext _dbContext;
        public OrderRepository(AmazingBookDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Order> GetOrderDetails(int id)
        {
            Order order = _dbContext.Orders
                .Include(x => x.FkshippingAddressNavigation)
                .Include(x => x.OrderLines)
                .Where(x => x.Id == id)
                .FirstOrDefault();
            return order;
        }
       /* public Task<Order> CreateOrderAndOrderLine(Order order)
        {


            return order;
        }*/
    }
}




   