using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazingBooks_API.Entities;
using AutoMapper;
using NuGet.Protocol.Core.Types;
using AmazingBooks_API.Configuration.DTOs;
using AmazingBooks_API.Configuration.Repository;

namespace AmazingBooks_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICommonRepository<Request> _repository;

        public RequestsController(ICommonRepository<Request> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/Requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RequestDto>>> GetRequests(string status)
        {
            List<Request> requests = null;
            if (status == "All")
            {
                requests = _repository.GetRecords().Result.ToList();
            }
            else
            {
                requests = _repository.GetRecordsByFilter(data => data.Status == status).Result.ToList();
            }

            List<RequestDto> result = _mapper.Map<List<RequestDto>>(requests);

            return Ok(result);
        }

        // GET: api/Requests/ByUser/5
        [HttpGet("ByUser/{userid}")]
        public async Task<ActionResult<List<RequestDto>>> GetRequestsByUser(int userid)
        {
            List<Request> requests = _repository.GetRecordsByFilter(data => data.FkUser == userid).Result.ToList();

            List<RequestDto> requestDtos = _mapper.Map<List<RequestDto>>(requests);

            return Ok(requestDtos);
        }


        // GET: api/Requests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RequestDto>> GetRequest(int id)
        {
            Request request = _repository.GetRecord(data => data.Id == id).Result;

            if (request == null)
            {
                return NotFound($"Request with id {id} not found");
            }

            RequestDto requestDto = _mapper.Map<RequestDto>(request);

            return requestDto;
        }

        // PUT: api/Requests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutRequest(RequestDto requestDto)
        {
            if (requestDto == null || requestDto.Id == 0)
            {
                return BadRequest("Input missing for request");
            }

            Request request = _repository.GetRecord(data => data.Id == requestDto.Id).Result;

            if (request == null)
            {
                return NotFound($"Request with id {requestDto.Id} not found");
            }

            request = _mapper.Map<Request>(requestDto);

            request = await _repository.UpdateRecord(request);
            if (request == null)
            {
                return Problem($"Error Updating Request table with id {requestDto.Id}");
            }

            return NoContent();
        }

        // POST: api/Requests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Request>> PostRequest(RequestDto requestDto)
        {
            Request request = _mapper.Map<Request>(requestDto);
            request = await _repository.CreateRecord(request);


            return CreatedAtAction("GetRequest", new { id = request.Id }, requestDto);
        }

        // DELETE: api/Requests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            Request request = _repository.GetRecord(data => data.Id == id).Result;

            if (request == null)
            {
                return NotFound($"Request with id {id} not found");
            }

            await _repository.DeleteRecord(request);
            return NoContent();
        }

    }
}
