using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Stripe;
using Microsoft.Extensions.Options;
using Microsoft.CodeAnalysis.Scripting;
using Stripe.Climate;
using AmazingBooks_API.Configuration.DTOs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AmazingBooks_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StripeController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly string _apiKey;

        public StripeController(IConfiguration config)
        {
            _apiKey = config["StripeSetting:ApiToken"];
        }

        // POST api/<CheckoutController>
        [HttpPost("Payment")]
        public ActionResult MakePayment(OrderDto orderDto)
        {
            var origin = $"http://localhost:4200/order/order-details/{orderDto.Id}";
            StripeConfiguration.ApiKey = _apiKey;

            var service = new SessionService();

            var options = new SessionCreateOptions
            {
                Currency = "USD",
                
                LineItems = new List<SessionLineItemOptions>
                {
                  new SessionLineItemOptions
                  {
                /*    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    Price = "order # 1",
                    Quantity = 1,*/

                    PriceData = new SessionLineItemPriceDataOptions()
                    {
                        Currency = "USD",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Order # " + orderDto.Id.ToString(),
                        },
                        UnitAmountDecimal = orderDto.Total * 100
                    },
                    Quantity = 1


                  }

                },
                Mode = "payment",
                SuccessUrl = origin + "?success=true",
                CancelUrl = origin + "?canceled=true",
            };
            
            Session session = service.Create(options);

            // Response.Headers.Add("Location", session.Url);
            // return new StatusCodeResult(303);

             return Ok(new { sessionId = session.Id }); 
            //return Redirect(session.Url);
        }
    }


    
}




