using AmazingBooks_API.Configuration.DTOs;
using AmazingBooks_API.Entities;
using AutoMapper;

namespace AmazingBooks_API.Configuration.AutoMapper
{
    public class AutoMapperConfig: Profile
    {
        public AutoMapperConfig() 
        {
            CreateMap<BookDto, Book>().ReverseMap();
            CreateMap<UserDto, User>().ForMember(record => record.Password, data => data.Ignore()).ReverseMap();
            CreateMap<AddressDto, Address>().ReverseMap();
          /*  CreateMap<OrderDto, Order>().ReverseMap();
            CreateMap<CartDto, Cart>().ReverseMap();
            CreateMap<OrderLineDto, OrderLine>().ReverseMap();*/

        }
    }
}
