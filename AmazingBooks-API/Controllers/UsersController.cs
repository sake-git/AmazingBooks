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
using System.Text;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Net;

namespace AmazingBooks_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICommonRepository<User> _repository;
        private readonly IConfiguration _config;

        public UsersController(ICommonRepository<User> repository, IMapper mapper, IConfiguration config)
        {
            _repository = repository;
            _mapper = mapper;
            _config = config;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            List<User> users = _repository.GetRecords().Result.ToList();
            List<UserDto> usersDto = _mapper.Map<List<UserDto>>(users);
            return Ok(usersDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUser(int id)
        {
            User user = _repository.GetRecordsByFilter(record => record.Id == id ).Result.FirstOrDefault();
            if (user == null)
            {
                return NotFound("User Not Found");
            }
            UserDto userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        // GET: api/Users/5
        [HttpPost]
        [Route("Authenticate")]
        public async Task<ActionResult<UserDto>> GetUser([FromBody]UserDto userDto)
        {
            if (userDto == null || userDto.LoginId == null || userDto.Password ==null) { 
                return BadRequest("Login Id or Password missing");
            }

            byte[] encryptedPwd = EncryptPassword(userDto.Password);
            User user = _repository
                .GetRecordsByFilter(record => record.LoginId == userDto.LoginId && record.Password == encryptedPwd && record.IsActive == true).Result.FirstOrDefault();

            if (user == null)
            {
                return NotFound("User Id or Login Invalid");
            }

            UserDto userDto1 = _mapper.Map<UserDto>(user);
            userDto1.Password = "";
            return userDto1;
        }


        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserDto>> PostUser(UserDto userDto)
        {
            if(userDto == null)
            {
                return BadRequest("Input missing");
            }
            User user = _repository.GetRecordsByFilter(data => data.LoginId == userDto.LoginId).Result.FirstOrDefault();
            if(user != null)
            {
                return BadRequest("Login Id already exists");
            }

            user = _mapper.Map<User>(userDto);
            user.Password = EncryptPassword(userDto.Password);
            user.IsActive = true;
            user =  _repository.CreateRecord(user).Result;

            return CreatedAtAction("GetUser", new { id = user.Id }, userDto);
        }
        /*
        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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



        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }*/


        private byte[] EncryptPassword(string password)
        {
            SHA256 sha256 = SHA256.Create();
            byte[] hashvalue;
            UTF8Encoding utfEncoding = new UTF8Encoding();
            hashvalue = sha256.ComputeHash(utfEncoding.GetBytes(password));
            return hashvalue;
        }

        private string GenerateToken(UserDto userDto)
        {
            SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim("Name",userDto.Name),
                new Claim("LoginId",userDto.LoginId),
                new Claim("Email",userDto.Email)
            };
            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);

        }

    }
}
