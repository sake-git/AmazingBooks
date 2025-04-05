using Newtonsoft.Json;

namespace AmazingBooks_API.WebApi.ShippoResponseDto
{
    public class AnalysisDto
    {
    
            [JsonProperty("validation_result")]
            public ValidationResultDto validation_result { get; set; }

    }
    public class ValidationResultDto
    {
        [JsonProperty("value")]
        public string value { get; set; }
        [JsonProperty("reasons")]
        public ReasonDto[] reason { get; set; }
    }

    public class ReasonDto
    {
        [JsonProperty("code")]
        public string code { get; set; }
        [JsonProperty("description")]
        public string description { get; set; }
    }
}
