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

        public async Task<List<Order>> GetOrders(int userId,int orderId, int id)
        {
            List<Order> orders = null;
            if (orderId == 0)
            {
                orders = _dbContext.Orders
                .Include(x => x.FkshippingAddressNavigation)
                .Where(data => data.FkuserId == userId && data.Id >= id)
                .OrderBy(data => data.Id)
                .ToList();
            }
            else
            {
                 orders = _dbContext.Orders
                .Include(x => x.FkshippingAddressNavigation)
                .Where(data => data.FkuserId == userId && data.Id >= id && data.Id == orderId)
                .OrderBy(data => data.Id)
                .ToList();
            }
            
            return orders;
        }
        public async Task<Order> GetOrderDetails(int id)
        {
            Order order = _dbContext.Orders
                .Include(x => x.FkshippingAddressNavigation)
                .Include(x => x.OrderLines).ThenInclude(x=> x.Fkbook)
                .Where(x => x.Id == id)
                .FirstOrDefault();
            return order;
        }

        public async Task<Order> SaveOrderDetails(Order order)
        {
            _dbContext.Orders.Add(order);      
            await _dbContext.Carts.Where(data => data.FkuserId == order.FkuserId).ForEachAsync(
                cart => _dbContext.Carts.Remove(cart)
            );


            await _dbContext.SaveChangesAsync();
            
            return order;
        }
       /* public Task<Order> CreateOrderAndOrderLine(Order order)
        {


            return order;
        }*/
    }
}




   