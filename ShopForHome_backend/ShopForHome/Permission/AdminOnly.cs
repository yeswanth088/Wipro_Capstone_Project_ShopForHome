using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ShopForHome.Models;

namespace ShopForHome.Permission
{
    public class AdminOnly
    {
        public class AdminOnlyAttribute : Attribute, IAuthorizationFilter
        {
            public void OnAuthorization(AuthorizationFilterContext context)
            {
                var db = context.HttpContext.RequestServices.GetService(typeof(ShopContext)) as ShopContext;
                if (db == null) return;

                var userId = context.HttpContext.Request.Query["userId"].ToString();

                if (string.IsNullOrEmpty(userId))
                {
                    context.Result = new UnauthorizedObjectResult("UserId required");
                    return;
                }

                var user = db.Users.Find(Convert.ToInt32(userId));

                if (user == null || user.Role != Role.Admin)
                {
                    context.Result = new UnauthorizedObjectResult("Admin access only");
                }
            }
        }
    }
}
