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

namespace AmazingBooks_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICartRepository _repository;

        public CartsController(ICartRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/Carts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CartDto>> GetCart(int id)
        {
            Cart cart =  _repository.GetRecord(data => data.Id == id).Result;

            if (cart == null)
            {
                return NotFound($"Cart item with id - {id} not found");
            }

            CartDto cartDto = _mapper.Map<CartDto>(cart);

            return cartDto;
        }

        // GET: api/Carts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<List<CartDto>>>> GetCarts()
        {
            List<Cart> cart = _repository.GetRecords().Result.ToList();
            List<CartDto> cartDtos = _mapper.Map<List<CartDto>>(cart);
            return Ok(cartDtos);
        }

        [HttpGet("GetUserCart/{userId}")]
        public async Task<ActionResult<IEnumerable<List<CartDto>>>> GetUserCart(int userId)
        {
            List<Cart> cartRecords = _repository.GetBooksFromCart(userId).Result.ToList();
            List<CartDto> cartDtoRecords= _mapper.Map<List<CartDto>>(cartRecords);
            return Ok(cartDtoRecords);
        }


        // POST: api/Carts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CartDto>> PostCart(CartDto cartDto)
        {
            if (cartDto == null)
            {
                return BadRequest("Cart Details missing");
            }
            
            Cart cart = _repository.GetRecord(data => data.FkbookId == cartDto.FkbookId).Result;

            if (cart == null)
            {
                cart = _mapper.Map<Cart>(cartDto);  
                _repository.CreateRecord(cart);                
            }
            else
            {
                cart.Quantity += cartDto.Quantity;
                _repository.UpdateRecord(cart);                
            }

            return CreatedAtAction("GetCart", new { id = cart.Id }, cartDto);
        }

        // DELETE: api/Carts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            Cart cart = _repository.GetRecord(data => data.Id == id).Result;

            if (cart == null)
            {
                return NotFound($"Cart item with id - {id} not found");
            }

            _repository.DeleteRecord(cart);

            return NoContent();
        }
                        

        // PUT: api/Carts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCart(CartDto cartDto)
        {
            if (cartDto == null)
            {
                return BadRequest("Cart Details missing");
            }

            Cart cart = _repository.GetRecord(data => data.Id == cartDto.Id).Result;

            if (cart == null)
            {
                return NotFound($"Cart item with id - {cartDto.Id} not found");
            }

            _repository.UpdateRecord(cart);
            return NoContent();
        }

        /*
        private bool CartExists(int id)
        {
            return _context.Carts.Any(e => e.Id == id);
        }*/
    }
}
