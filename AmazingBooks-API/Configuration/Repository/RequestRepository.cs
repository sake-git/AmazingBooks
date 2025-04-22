using AmazingBooks_API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmazingBooks_API.Configuration.Repository
{
    public class RequestRepository:CommonRepository<Request>, IRequestRepository
    {
        private readonly AmazingBookDbContext _dbContext;
        public RequestRepository(AmazingBookDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Request> GetRequestUser(int id)
        {
            Request request = await _dbContext.Requests.AsNoTracking().Include(data => data.FkUserNavigation).Where(data => data.Id == id).FirstOrDefaultAsync();
            return request;
        }
    }
}
