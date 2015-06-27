using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MasterMind.Controllers
{
    public class Score
    {
        public int SameColor { get; set; }
        public int SameColorAndLoc { get; set; }
        public bool Win { get; set; }
    }
    public class Step
    {
        public string GameId { get; set; }
        public string SelectedColors { get; set; }
    }

   
    public class MasterMindController : ApiController
    {

        [HttpGet]
        public IHttpActionResult Initialize(string gameId=null)
        {
            var board = new MasterMindBoard()
            {
                ColorCount = 5,
                ColumnCount = 5,
                InitialRowsCount = 2,
                ColorPlate = GetGameColors(gameId,5).ToList()
            };
            return Ok(board);
        }
        public IHttpActionResult  Play(Step step)
        {
            try
            {
                var score = CalculateScore(step);
                return Ok(score);
            }
            catch
            {
                return InternalServerError();
            }
        }

        private Score CalculateScore(Step step)
        {
          
           var colors= step.SelectedColors.Split(new  char[]{';'}, StringSplitOptions.RemoveEmptyEntries).ToArray();
           string[] gameColors = this.GetGameColors(step.GameId, colors.Length);
            bool[] isConsiderd= new bool[colors.Length];
           if (colors.Length != gameColors.Length)
               throw new ArgumentException("Game Crashed");

           int sameCL = 0;
           int sameC = 0;
           for (int index = 0; index < colors.Length; index++)
           {
               if (string.Compare(gameColors[index], colors[index], true) == 0)
               {
                   sameCL++;
                   isConsiderd[index] = true;
               }
           }

           for (int index = 0; index < colors.Length; index++)
            {
                for (int gIndex = 0; gIndex < gameColors.Length; gIndex++)
                {
                    if (string.Compare(gameColors[gIndex], colors[index], true) == 0 && !isConsiderd[gIndex])
                    {
                        isConsiderd[gIndex] = true;
                        sameC++;
                    }
                }
            }

           return new Score { SameColor = sameC, SameColorAndLoc = sameCL, Win= (sameCL==colors.Length) };

        }

        private string[] GetGameColors(string gameId,int colorsCount)
        {
            var availableColors =new List<string> { "RED", "YELLOW", "BLUE", "GREEN", "ORANGE" ,"BLACK"};
            if (colorsCount > availableColors.Count || colorsCount < 2)
                throw new Exception("Invalid Color count");
            string[] gameColors = availableColors.Take(colorsCount).ToArray();
            return gameColors;
        }
    }
}
