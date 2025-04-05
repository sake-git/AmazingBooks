using Newtonsoft.Json;

namespace AmazingBooks_API.WebApi.ShippoResponseDto
{
    public class AddressValidationResponseDto
    {
        [JsonProperty("original_address")]
        public ShippoAddressDto original_address { get; set; }
        [JsonProperty("recommended_address")]
        public ShippoAddressDto recommended_address { get; set; }
        [JsonProperty("analysis")]
        public AnalysisDto analysis { get; set; }
    }
}
