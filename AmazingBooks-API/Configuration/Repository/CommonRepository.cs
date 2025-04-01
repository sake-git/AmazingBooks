using AmazingBooks_API.Configuration.DTOs;
using AmazingBooks_API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace AmazingBooks_API.Configuration.Repository
{
    public class CommonRepository<T> : ICommonRepository<T> where T : class
    {
        private readonly AmazingBookDbContext _dbContext;
        private DbSet<T> _table;
        public CommonRepository(AmazingBookDbContext dbContext)
        {
            _dbContext = dbContext;
            _table = _dbContext.Set<T>();
        }

        public async Task<IEnumerable<T>> GetRecords()
        {            
                return await _table.ToListAsync();
        }

        public async Task<IEnumerable<T>> GetRecordsByFilter(Expression<Func<T,bool>> filter)
        {
            return await _table.Where(filter).ToListAsync();
        }

        public async Task<T> GetRecord(Expression<Func<T, bool>> filter)
        {
            var record = await _table.AsNoTracking().Where(filter).FirstOrDefaultAsync();
            return record;
        }


        public async Task<T> PutRecord(T record)
        {
            _table.Update(record);
            await _dbContext.SaveChangesAsync();           

            return record;
        }


        public async Task<T> PostRecord(T record)
        {
            _table.Add(record);
            await _dbContext.SaveChangesAsync();

            return record;
        }

        public async Task<bool> DeleteRecord(T record)
        {
            _table.Remove(record);
            await _dbContext.SaveChangesAsync();

            return true;
        }
        
    }
}
