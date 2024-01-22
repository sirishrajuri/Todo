using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppToDo.Services
{
    public interface IToDoService
    {
        List<ToDoModel> GetAllToDoItems();
        bool NewToDoItem(ToDoModel newItem);
        bool EditToDoItem(ToDoModel editItem);
        bool DeleteToDoItem(int itemNum);
        ToDoModel ViewToDoItem(int itemNum);
    }
}
