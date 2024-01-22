using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppToDo
{
    public class ToDoModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ItemNo { get; set; }
        public string Description { get; set; }
        public DateTime date { get; set; }
        public DateTime deadline { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public string Category { get; set; }
    }
}
