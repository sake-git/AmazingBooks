using AmazingBooks_API.Configuration.DTOs;
using AmazingBooks_API.WebApi.ShippoResponseDto;
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
        public async Task<dynamic> ValidateAddressAsync(AddressDto address)
        {
            var requestUrl = $"https://api.goshippo.com/v2/addresses/validate?address_line_1={address.AddressLine1}" +
                $"&city_locality={address.City}&state_province={address.State}&postal_code={address.Zip}" +
                $"&country_code={address.Country}&address_line_2={address.AddressLine2}";
            var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
           
            request.Headers.Add("Authorization", _apiToken);

            var response = await _httpClient.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<AddressValidationResponseDto>(responseData);
            }
            else
            {
                // Handle errors appropriately
                return null;

            }
        }
    }
}



