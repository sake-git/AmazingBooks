
using Microsoft.AspNetCore.Mvc;
using AmazingBooks_API.Configuration.Repository;
using AutoMapper;
using AmazingBooks_API.Configuration.DTOs;
using AmazingBooks_API.WebApi;
using AmazingBooks_API.WebApi.SalesTaxDto;
using AmazingBooks_API.Entities;
using Stripe;
using AmazingBooks_API.Services;
using Microsoft.AspNetCore.Authorization;




namespace AmazingBooks_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _repository;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IEmailService _emailService;

        public OrdersController(IOrderRepository repository, IMapper mapper, IConfiguration configuration,
            IHttpClientFactory httpClientFactory, IEmailService emailService)
        {
            _repository = repository;
            _mapper = mapper;
            _config = configuration;
            _httpClientFactory = httpClientFactory;
            _emailService = emailService;
        }

        // GET: api/Orders
        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderListDto>>> GetOrdersByUserId(int userId,int orderId =0, int id =0)
        {
            List<OrderListDto> orderListDto = _repository.GetOrders(userId,orderId, id).Result.Select(
                data => new OrderListDto()
                {
                    Id = data.Id,
                    Total = data.Total,
                    Status = data.Status,
                    OrderDate = data.OrderDate,
                    FkuserId = data.FkuserId,
                    PaymentStatus = data.PaymentStatus,
                    PaymentMethod = data.PaymentMethod,
                    FkshippingAddressNavigation = _mapper.Map<AddressDto>(data.FkshippingAddressNavigation),
                }).ToList();

            return Ok(orderListDto);            
        }
        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            Order order = _repository.GetRecord(data => data.Id == id).Result;

            if (order == null)
            {
                return NotFound($"Order with Id {id} not found");
            }
            OrderDto orderDto = _mapper.Map<OrderDto>(order);
            return orderDto;
        }


        // GET: api/Orders/Details/5
        [HttpGet("Details/{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderDetails(int id)
        {
            Order order = _repository.GetOrderDetails(id).Result;

            if (order == null)
            {
                return NotFound($"Order with Id {id} not found");
            }
            OrderDto orderDto = _mapper.Map<OrderDto>(order);   
            return orderDto;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutOrder(OrderDto orderDto)
        {
            if (orderDto == null)
            {
                return BadRequest("Input Order missing details");
            }

            Order order = _repository.GetRecord(data => data.Id != orderDto.Id).Result;
            if(order == null)
            {
                return NotFound("Order not found");
            }
            order = _mapper.Map<Order>(orderDto);
            await _repository.UpdateRecord(order);

            if (orderDto.Status == "Placed" && orderDto.PaymentMethod == "Online" && orderDto.PaymentStatus == "Paid")
            {
                CreateEmail(orderDto.Id);
            }

            return NoContent();
        }

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderDto>> PostOrder(OrderDto orderDto)
        {
            if (orderDto == null)
            { 
                return BadRequest("Input Order missing details");
            }

            Order order = _mapper.Map<Order>(orderDto);
            await _repository.SaveOrderDetails(order);
            orderDto.Id = order.Id;

            if (orderDto.PaymentMethod == "COD" && orderDto.PaymentStatus == "Pending")
            {
                CreateEmail(orderDto.Id);
            }

            return Ok(orderDto);
        }

        [HttpGet("SalesTax/{zip}")]
        public async Task<ActionResult<decimal>> GetSalesTax(string zip)
        {
            SalesTax salestax = new SalesTax(_config,_httpClientFactory);

            SalesTaxResponse[] response = salestax.GetSalesTax(zip).Result;
            if(response == null || response.Length == 0)
            {
                return NotFound($"Sales Tax not found for zip {zip}");
            }
            else
            {
                return Ok(response[0].taxAmount);
            }            
        }


        private void CreateEmail(int id)
        {           
                Order order = _repository.GetDetails4Mail(id).Result;
                int count = 0;
                string subject = $"Amazing Books Recipt: Order# {order.Id} recieved";
                string body = $"Hello {order.Fkuser.Name},<p> Your order has been recieved and is now processed." +
                    $" Your order Details are as mentioned below:</p> <br> <div> <h3> Order# {order.Id} ( {order.OrderDate.ToShortDateString()} )</h3>" +
                    $"<table style='text-align:center;border:1px solid black;'><th>#</th><th>Title</th><th>Quantity</th><th>Price</th><th>Subtotal</th>";

                foreach (var item in order.OrderLines)
                {
                    body += $"<tr><td width='50px'>{++count}</td><td width='300px'>{item.Fkbook.Name}</td><td width='50px'>{item.Quantity}</td><td width='50px'>{item.Fkbook.Price}" +
                        $"</td><td width='50px'>{Math.Round((decimal)(item.Quantity * item.Fkbook.Price), 2)}</td></tr>";
                }
            body += $"<tr><td colspan='4'>Subtotal</td><td>{order.SubTotal}</td></tr>" +
                $"<tr><td colspan = '4'>Shipping</td ><td >{order.Shipping}</td></tr>" +
                $"<tr><td colspan = '4'>Tax</td ><td >{order.Tax:0.##}</td></tr>" +
                $"<tr><td colspan = '4'>Total</td ><td >{order.Total}</td></tr></table> </div><br><br>" +
                $"<div><h3>Shipping To </h3> <p>{order.FkshippingAddressNavigation.AddressLine1}," +
                $"{order.FkshippingAddressNavigation.AddressLine2}<br>{order.FkshippingAddressNavigation.City} " +
                $"{order.FkshippingAddressNavigation.State} {order.FkshippingAddressNavigation.Zip}</p></div>";
                   

                _emailService.SendEmail(order.Fkuser.Email, subject, body);
            
        }

        /*
        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }*/
    }
}
