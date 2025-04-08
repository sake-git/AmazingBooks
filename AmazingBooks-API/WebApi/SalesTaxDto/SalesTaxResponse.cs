using Newtonsoft.Json;

namespace AmazingBooks_API.WebApi.SalesTaxDto
{
    public class SalesTaxResponse
    {
        [JsonProperty("zip_code")]
        public string zip {  get; set; }
        [JsonProperty("state_rate")]
        public decimal taxAmount { get; set; }
    }
}
