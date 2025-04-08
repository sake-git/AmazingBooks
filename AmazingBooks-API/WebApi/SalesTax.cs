using AmazingBooks_API.WebApi.SalesTaxDto;
using Newtonsoft.Json;

namespace AmazingBooks_API.WebApi
{
    public class SalesTax
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiToken;

        public SalesTax(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _apiToken = config["SalesTaxSetting:ApiToken"];
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<SalesTaxResponse[]> GetSalesTax(string zipcode)
        {
            string url = $"https://api.api-ninjas.com/v1/salestax?zip_code={zipcode}";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("X-Api-Key", _apiToken);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode) {
                var responseData = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<SalesTaxResponse[]>(responseData);

            }
            else
            {
                //Error
                return null;
            }
        }

    }
}
