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
using AmazingBooks_API.WebApi;

namespace AmazingBooks_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressesController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICommonRepository<Address> _repository;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClient;
        public AddressesController(ICommonRepository<Address> repository, IMapper mapper,
            IConfiguration config, IHttpClientFactory httpClient)
        {
            _repository = repository;
            _mapper = mapper;
            _config = config;
            _httpClient = httpClient;   
        }

        // GET: api/Addresses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressDto>>> GetAddresses()
        {
            List<Address> addressess = _repository.GetRecords().Result.ToList();
            List<AddressDto> addressessDto = _mapper.Map<List<AddressDto>>(addressess);
            return Ok(addressessDto);
        }

        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AddressDto>> GetAddress(int id)
        {
            Address address = _repository.GetRecordsByFilter(record => record.Id == id).Result.FirstOrDefault();
            if (address == null) {
                return NotFound("Address Not Found");
            }
            AddressDto addressDto = _mapper.Map<AddressDto>(address);
            return Ok(addressDto);
        }


        // POST: api/Addresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AddressDto>> PostAddress(AddressDto addressDto)
        {
            if (addressDto == null) {
                return BadRequest("Invalid Request, Input missing");
            }

            AddressValidation shippo = new AddressValidation(this._httpClient, this._config);

             var data = shippo.ValidateAddressAsync(addressDto).Result;
            if(data.analysis.validation_result.value == "valid")
            {
                return Ok(true);
            }
            else if(data.recommended_address != null)
            {
                AddressDto recommendedAddress = new AddressDto()
                {
                    AddressLine1 = data.recommended_address.AddressLine1,
                    AddressLine2 = data.recommended_address.AddressLine2,
                    City = data.recommended_address.CityLocality,
                    State = data.recommended_address.StateProvince,
                    Zip = data.recommended_address.PostalCode,
                    Country = data.recommended_address.CountryCode,
                };
                return Ok(recommendedAddress);
            }
            else
            {
                return NotFound(data.analysis.validation_result.reason);
            }
            

           /* Address address = _mapper.Map<Address>(addressDto);
            address = _repository.PostRecord(address).Result;

            return CreatedAtAction("GetBook", new { id = address.Id }, addressDto);*/           
        }

        

        /*
        // PUT: api/Addresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAddress(int id, Address address)
        {
            if (id != address.Id)
            {
                return BadRequest();
            }

            _context.Entry(address).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddressExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
      

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null)
            {
                return NotFound();
            }

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AddressExists(int id)
        {
            return _context.Addresses.Any(e => e.Id == id);
        }*/
    }
}
