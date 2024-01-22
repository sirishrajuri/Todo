using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppToDo.Contexts
{
    public class ToDoDbContext : DbContext
    {
        public DbSet<ToDoModel> ToDos { get; set; }
        public ToDoDbContext(DbContextOptions<ToDoDbContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
