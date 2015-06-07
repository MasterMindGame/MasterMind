using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MasterMind.Controllers
{
    public class MasterMindBoard
    {
        public int ColorCount { get; set; }

        public int ColumnCount { get; set; }

        public int InitialRowsCount { get; set; }


        public List<string> ColorPlate { get; set; }

    }
    public class GameController : Controller
    {
       
        // GET: MasterMind
        public ActionResult MasterMind()
        {
            var board = new MasterMindBoard()
            {
                ColorCount = 5,
                ColumnCount = 5,
                InitialRowsCount = 5,
                ColorPlate = new List<string>() {"Red","Blue","Green","Yellow" ,"Orange"}
            };
            return View(board);
        }
    }
}