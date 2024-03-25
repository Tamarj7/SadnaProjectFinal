using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SadnaProject.Data;
using SadnaProject.Models;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Net;
using System.Security.Claims;

namespace SadnaProject.Controllers
{
    // ApiController attribute
    [ApiController]
    [Route("[controller]")]
    public class TopScoresDBController : ControllerBase
    {
        // Define a private field for the database context
        private readonly MyDbContext _dbContext; // Add a reference to DbContext

        // Constructor injection to provide an instance of MyDbContext
        public TopScoresDBController(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Retrieves the top scores from the database for the leaderboard.
        /// </summary>
        /// <returns>
        /// Returns an HTTP response containing the formatted leaderboard data.
        /// - If there are top scores available, a status code of 200 (OK) is returned along with the leaderboard data.
        /// </returns>        [HttpGet]
        public IActionResult GetTopScores()
        {
            // Retrieve top scores from the database and format them for the leaderboard
            var leaderBoardData = _dbContext.TopScores
                .OrderByDescending(score => score.GridSize)
                .GroupBy(score => new { score.GridSize })
                .Select(group => new LeaderBoardData
                {
                    GridSize = group.Key.GridSize,
                    TopScores = group.OrderByDescending(s => s.TopScore)
                                    .Take(5)
                                    .Select(score => new ScoreData
                                    {
                                        Username = score.Username,
                                        TopScore = score.TopScore,
                                        Date = score.DatePlayed.ToString("dd/MM/yyyy"),
                                        NumberOfMines = score.NumberOfMines,
                                    })
                                    .ToList()
                }).ToArray();

            return Ok(leaderBoardData);// Return the formatted leaderboard data
        }

        /// <summary>
        /// Updates the top score in the database based on the user's input.
        /// </summary>
        /// <param name="topScore">The top score model to update.</param>
        /// <returns>
        /// Returns an HTTP response indicating the result of the top score update attempt.
        /// - If the update is successful, a status code of 200 (OK) is returned along with a success message.
        /// - If the user's top score is not greater than the existing top score, a status code of 200 (OK) is returned along with a message.
        /// - If an error occurs during the update, a status code of 500 (Internal Server Error) is returned along with an error message.
        /// </returns>
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("AddTopScore")]
        public IActionResult UpdateTopScore(TopScoreModel topScore)
        {
            try
            {
                var username = User.Identity.Name; // Access the username of the authenticated user

                // Check if an existing top score exists for the user
                var existingTopScore = _dbContext.TopScores.FirstOrDefault(ts => ts.Username == username && ts.GridSize == topScore.GridSize);

                if (existingTopScore == null)
                {
                    // If no existing top score is found, create a new one
                    topScore.Username = username;
                    _dbContext.TopScores.Add(topScore);
                    _dbContext.SaveChanges();

                    return Ok("Top score added successfully");// Return success message
                }
                else
                {
                    // Update the existing top score if the new score is higher
                    if (topScore.TopScore > existingTopScore.TopScore)
                    {
                        existingTopScore.TopScore = topScore.TopScore;
                        existingTopScore.NumberOfMines = topScore.NumberOfMines;
                        existingTopScore.PlayingTime = topScore.PlayingTime;
                        existingTopScore.DatePlayed = topScore.DatePlayed;

                        _dbContext.SaveChanges();// Save the changes to the database

                        return Ok("Top score updated successfully");// Return success message
                    }
                    else
                    {
                        return Ok("Top score is not greater than the existing top score");// Return success message
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");// Return error status code and message
            }
        }


    }
}
