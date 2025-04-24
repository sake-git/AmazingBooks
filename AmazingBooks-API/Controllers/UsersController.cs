using Microsoft.AspNetCore.Mvc;
using AmazingBooks_API.Entities;
using AmazingBooks_API.Configuration.Repository;
using AutoMapper;
using AmazingBooks_API.Configuration.DTOs;
using System.Text;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;




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

        // GET: api/Users/Authenticate
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
            userDto1.Token = GenerateToken(userDto1);
            userDto1.RefreshToken = GenerateRefreshToken();
            user.RefreshToken = userDto1.RefreshToken;
            await _repository.UpdateRecord(user);

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
        
        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("RevokeToken")]
        public async Task<IActionResult> PutUser( UserDto userDto)
        {
            if (userDto == null)
            {
                return BadRequest("User Details Missing");
            }

            User user = _repository.GetRecord(data => data.Id == userDto.Id).Result;
            
            user.RefreshToken = null;
            await _repository.UpdateRecord(user);           

            return NoContent();
        }
       


        private byte[] EncryptPassword(string password)
        {
            SHA256 sha256 = SHA256.Create();
            byte[] hashvalue;
            UTF8Encoding utfEncoding = new UTF8Encoding();
            hashvalue = sha256.ComputeHash(utfEncoding.GetBytes(password));
            return hashvalue;
        }

        [HttpPost("RefreshToken")]
        public async Task<ActionResult<UserDto>>Refresh(UserDto userDto) 
        {
            var newAccessToken = GenerateAccessTokenFromRefreshToken(userDto);
            if (newAccessToken == null)
            {
                return Unauthorized("Unauthorised access");
            }

            userDto.Token = newAccessToken;
            return Ok(userDto);
        }

        private string GenerateToken(UserDto userDto)
        {
            SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {                
                new Claim(ClaimTypes.Role,userDto.Role),
                new Claim("Name",userDto.Name),
                new Claim("LoginId",userDto.LoginId),
                new Claim("Email",userDto.Email)
            };

            var token = new JwtSecurityToken(_config["JWT:Issuer"],
                _config["JWT:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GenerateRefreshToken()
        {
            byte[] randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private string GenerateAccessTokenFromRefreshToken(UserDto userDto)
        {
            // Implement logic to generate a new access token from the refresh token
            // Verify the refresh token and extract necessary information (e.g., user ID)
            // Then generate a new access token
            // For demonstration purposes, return a new token with an extended expiry

            User user = _repository.GetRecord(data => data.Id == userDto.Id).Result;

            if (user.RefreshToken == userDto.RefreshToken)
            {
                SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
                SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                var claims = new[]
                {
                    new Claim(ClaimTypes.Role,userDto.Role),
                    new Claim("Name",userDto.Name),
                    new Claim("LoginId",userDto.LoginId),
                    new Claim("Email",userDto.Email)
                };

                var token = new JwtSecurityToken(_config["JWT:Issuer"],
                _config["JWT:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            return null;
        }
    }
}
