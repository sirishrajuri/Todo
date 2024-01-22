using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AppToDo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AppToDo.Controllers
{
    [ApiController]
    [Route("ToDo")]
    public class ToDoController : ControllerBase
    {
        private readonly ILogger<ToDoController> _logger;
        private readonly IToDoService _toDoService;

        public ToDoController(ILogger<ToDoController> logger, IToDoService toDoService)
        {
            _logger = logger;
            _toDoService = toDoService;
        }

        [HttpGet("AllToDoItems")]
        public List<ToDoModel> GetAllItems()
        {
            return _toDoService.GetAllToDoItems();
        }

        [HttpPost("InsertToDo")]
        public bool NewToDoItem(ToDoModel newItem)
        {
            return _toDoService.NewToDoItem(newItem);
        }

        [HttpPost("UpdateToDo")]
        public bool EditToDoItem(ToDoModel editItem)
        {
            return _toDoService.EditToDoItem(editItem);
        }

        [HttpDelete("DeleteToDo")]
        public bool DeleteToDoItem(int itemNum)
        {
            return _toDoService.DeleteToDoItem(itemNum);
        }

        [HttpPost("ViewToDo")]
        public ToDoModel ViewToDoItem(int itemNum)
        {
            return _toDoService.ViewToDoItem(itemNum);
        }
    }
}
