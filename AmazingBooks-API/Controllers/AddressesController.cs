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
using AmazingBooks_API.WebApi.ShippoResponseDto;

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
            Address address = _repository.GetRecordsByFilter(record => record.Id == id && record.IsActive==true).Result.FirstOrDefault();
            if (address == null) {
                return NotFound("Address Not Found");
            }
            AddressDto addressDto = _mapper.Map<AddressDto>(address);
            return Ok(addressDto);
        }

        [HttpGet("ByUser/{userId}")]        
        public async Task<ActionResult<List<AddressDto>>>GetAddressByUser(int userId)
        {
            List<Address> address = _repository.GetRecordsByFilter(record => record.FkuserId == userId).Result.ToList();
            if (address == null)
            {
                return NotFound("Address Not Found");
            }
            List<AddressDto> addressDto = _mapper.Map<List<AddressDto>>(address);
            return Ok(addressDto);
        }


        // POST: api/Addresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("Validate")]
        public async Task<ActionResult> ValidateAddress(AddressDto addressDto)
        {
            if (addressDto == null)
            {
                return BadRequest("Invalid Request, Input missing");
            }

            AddressValidation shippo = new AddressValidation(this._httpClient, this._config);

            AddressValidationResponseDto response = shippo.ValidateAddressAsync(addressDto).Result;
            if (response.analysis.validation_result.value == "valid")
            {
                return Ok(true);
            }
            else if (response.recommended_address != null)
            {
                AddressDto recommendedAddress = new AddressDto()
                {
                    AddressLine1 = response.recommended_address.AddressLine1,
                    AddressLine2 = response.recommended_address.AddressLine2,
                    City = response.recommended_address.CityLocality,
                    State = response.recommended_address.StateProvince,
                    Zip = response.recommended_address.PostalCode,
                    Country = response.recommended_address.CountryCode,
                };
                return Ok(recommendedAddress);
            }
            else
            {
                return NotFound(response.analysis.validation_result.reason[0].description);
            }

        }
        // POST: api/Addresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostAddress(AddressDto addressDto)
        {
            Address address = _mapper.Map<Address>(addressDto);
            address.IsActive = true;
            address = _repository.CreateRecord(address).Result;

            return CreatedAtAction("GetAddress", new { id = address.Id }, addressDto);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{addrId}")]
        public async Task<IActionResult> DeleteAddress(int addrId)
        {
            Address address = _repository.GetRecord(data=> data.Id == addrId).Result;


            if (address == null)
            {
                return NotFound("Address not present");
            }           
            await _repository.DeleteRecord(address);
            
            return NoContent();
        }

        
        // PUT: api/Addresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutAddress( AddressDto addressDto)
        {
            if (addressDto == null)
            {
                return BadRequest("Input missing");
            }

            Address address = _repository.GetRecord(data => data.Id == addressDto.Id && data.IsActive == true).Result;

            if (address == null)
            {
                return NotFound("Address not present");
            }

            address.IsActive = false;
            await _repository.UpdateRecord(address);

            return NoContent();
        }   

        /*
        private bool AddressExists(int id)
        {
            return _context.Addresses.Any(e => e.Id == id);
        }*/
    }
}
