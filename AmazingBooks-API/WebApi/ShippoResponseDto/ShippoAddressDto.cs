using Newtonsoft.Json;

namespace AmazingBooks_API.WebApi.ShippoResponseDto
{
    public class ShippoAddressDto
    {       
            [JsonProperty("address_line_1")]
            public string AddressLine1 { get; set; }
            [JsonProperty("address_line_2")]
            public string AddressLine2 { get; set; }
            [JsonProperty("city_locality")]
            public string CityLocality { get; set; }
            [JsonProperty("state_province")]
            public string StateProvince { get; set; }
            [JsonProperty("postal_code")]
            public string PostalCode { get; set; }
            [JsonProperty("country_code")]
            public string CountryCode { get; set; }
    }
}
