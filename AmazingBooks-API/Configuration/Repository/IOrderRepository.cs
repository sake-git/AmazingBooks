using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.Repository
{
    public interface IOrderRepository :ICommonRepository<Order>
    {
        public Task<Order> GetOrderDetails(int id);
        //public Task<Order> CreateOrderAndOrderLine(Order order);
    }
}


