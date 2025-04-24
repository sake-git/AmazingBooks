using AmazingBooks_API.Entities;

namespace AmazingBooks_API.Configuration.Repository
{
    public interface IRequestRepository: ICommonRepository<Request>
    {
        public Task<Request> GetRequestUser(int id);
    }
}
