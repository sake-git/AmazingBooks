using AmazingBooks_API.Configuration.DTOs;
using AmazingBooks_API.Entities;
using Newtonsoft.Json;

namespace AmazingBooks_API.WebApi
{
    public class AddressValidation
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiToken;

        public AddressValidation(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _apiToken = configuration["ShippoSettings:ApiToken"];
        }
        public async Task<AddressValidationResponse> ValidateAddressAsync(AddressDto address)
        {
            var requestUrl = $"https://api.goshippo.com/v2/addresses/validate?address_line_1={address.AddressLine1}" +
                $"&city_locality={address.City}&state_province={address.State}&postal_code={address.Zip}" +
                $"&country_code={address.Country}&address_line_2={address.AddressLine2}";
            var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
           /*{
                Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "address_line_1", address.AddressLine1 },
                    { "address_line_2", address.AddressLine2 },
                    { "city_locality", address.City },
                    { "state_province", address.State },
                    { "postal_code", address.Zip },
                    { "country_code", address.Country },
                    { "validate", "true" }
                })
            };*/
            request.Headers.Add("Authorization", _apiToken);

            var response = await _httpClient.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<AddressValidationResponse>(responseData);
            }
            else
            {
                // Handle errors appropriately
                return null;

            }
        }
    }
}

public class AddressValidationResponse
{
    [JsonProperty("original_address")]
    public AddressShippo original_address { get; set; }
    [JsonProperty("recommended_address")]
    public AddressShippo recommended_address { get; set; }
    [JsonProperty("analysis")]
    public Analysis analysis { get; set; }
    
}

public class Analysis
{
    [JsonProperty("validation_result")]
    public ValidationResult validation_result { get; set; }

}
public class ValidationResult
{
    [JsonProperty("value")]
    public string value { get; set; }
    [JsonProperty("reasons")]
    public Reason[] reason { get; set; }
    
}

public class AddressShippo
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

public class Reason
{
    [JsonProperty("code")]
    public string code { get; set; }
    [JsonProperty("description")]
    public string description { get; set; }
}

