using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazingBooks_API.Entities;
using AutoMapper;
using AmazingBooks_API.Configuration.Repository;
using AmazingBooks_API.Configuration.DTOs;
using static System.Reflection.Metadata.BlobBuilder;

namespace AmazingBooks_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICommonRepository<Book> _repository;

        public BooksController(ICommonRepository<Book> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookListDto>>> GetBooks()
        {
            List<BookListDto> bookDtos = _repository.GetRecords().Result.Select(record =>

                new BookListDto()
                {
                    Id = record.Id,
                    Name = record.Name,
                    ImgUrl = record.ImgUrl,
                    Price = record.Price,
                    Quantity = record.Quantity
                }

            ).ToList();
           

            return Ok(bookDtos);
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            Book book =  _repository.GetRecord( book => book.Id == id ).Result;

            if (book == null)
            {
                return NotFound();
            }
            var bookDto = _mapper.Map<List<BookDto>>(book);
            return Ok(bookDto);
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutBook(BookDto bookDto)
        {
            if (bookDto == null || bookDto.Id == 0)
            {
                return BadRequest("Input missing");
            }

            Book book = _repository.GetRecord(book=> book.Id == bookDto.Id).Result;

            if (book == null)
            {
                return NotFound("Data not found");
            }

           book = _mapper.Map<Book>(bookDto);
            _repository.PutRecord(book);           

            return NoContent();
        }

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BookDto>> PostBook(BookDto bookDto)
        {
            Book book = _mapper.Map<Book>(bookDto);
            book = _repository.PostRecord(book).Result;

            return CreatedAtAction("GetBook", new { id = book.Id }, bookDto);
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            Book book = _repository.GetRecord(book => book.Id == id).Result;
            if (book == null)
            {
                return NotFound();
            }

            var result = _repository.DeleteRecord(book).Result;

            return NoContent();
        }      
    }
}
