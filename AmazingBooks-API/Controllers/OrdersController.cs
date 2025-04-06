using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazingBooks_API.Entities;
using AmazingBooks_API.Configuration.Repository;
using AutoMapper;
using AmazingBooks_API.Configuration.DTOs;
using Order = AmazingBooks_API.Entities.Order;

namespace AmazingBooks_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _repository;

        public OrdersController(IOrderRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderListDto>>> GetOrders()
        {
            List<OrderListDto> orderListDto = _repository.GetRecords().Result.Select(
                data => new OrderListDto()
                {
                    Id = data.Id,
                    Total = data.Total,
                    Status = data.Status,
                    OrderDate = data.OrderDate,
                    FkuserId = data.FkuserId
                }).ToList();

            return Ok(orderListDto);            
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
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
        [HttpPut()]
        public async Task<IActionResult> PutOrder(OrderDto orderDto)
        {
            if (orderDto == null)
            {
                return BadRequest("Input Order missing details");
            }

            Order order = _repository.GetOrderDetails(orderDto.Id).Result;
            if(order == null)
            {
                return NotFound("Order not found");
            }
            await _repository.UpdateRecord(order);
           
            return NoContent();
        }

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(OrderDto orderDto)
        {
            if (orderDto == null)
            { 
                return BadRequest("Input Order missing details");
            }

            Order order = _mapper.Map<Order>(orderDto);
            await _repository.CreateRecord(order);

            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
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
