using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.Repository
{
    public interface IOrderRepository :ICommonRepository<Order>
    {
        public Task<Order> GetOrderDetails(int id);
        public Task<List<Order>> GetOrders(int userId,int orderId, int id);

        public Task<Order> SaveOrderDetails(Order order);
        //public Task<Order> CreateOrderAndOrderLine(Order order);
    }
}


