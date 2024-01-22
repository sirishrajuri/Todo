using AppToDo.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppToDo.Services
{
    public class ToDoService : IToDoService
    {
        // ToDo Category enum values
        public enum ToDoCategory
        {
            Low,
            Medium,
            High
        }

        public enum ToDoStatus
        {
            InProgress,
            Pending,
            Skipped,
            Completed
        }
        private readonly ToDoDbContext _context;
        public ToDoService(ToDoDbContext context)
        {
            _context = context;
        }
        public List<ToDoModel> GetAllToDoItems()
        {
            return _context.ToDos.ToList();
        }

        public bool NewToDoItem(ToDoModel newItem)
        {
            try
            {
                _context.ToDos.Add(newItem);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {                
                return false;
            }            
        }

        public bool EditToDoItem(ToDoModel editItem)
        {
            ToDoModel _model = _context.ToDos.ToList().Find(x => x.ItemNo == editItem.ItemNo);

            if (_model == null)
                return false;

            _model.Remarks = editItem.Remarks;            
            _model.deadline = editItem.deadline;            
            _model.Category = editItem.Category;
            _model.Description = editItem.Description;
            _model.Status = editItem.Status;

            _context.SaveChanges();

            return true;
        }

        public bool DeleteToDoItem(int itemNum)
        {
            ToDoModel _model = _context.ToDos.ToList().Find(x => x.ItemNo == itemNum);

            if (_model == null)
                return false;
            
            _context.ToDos.Remove(_model);
            _context.SaveChanges();
            return true;
        }

        public ToDoModel ViewToDoItem(int itemNum)
        {
            return _context.ToDos.ToList().Find(x => x.ItemNo == itemNum);
        }
    }
}
