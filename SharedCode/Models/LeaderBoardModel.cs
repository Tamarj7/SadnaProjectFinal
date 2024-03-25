namespace SadnaProject.Models
{
    /// <summary>
    /// Represents a data structure containing the top scores for different grid sizes.
    /// </summary>
    public class LeaderBoardData
    {
        /// <summary>
        /// Gets or sets the size of the grid for which top scores are recorded.
        /// </summary>
        public int GridSize { get; set; }

        /// <summary>
        /// Gets or sets the list of top scores achieved for the specified grid size.
        /// </summary>
        public List<ScoreData> TopScores { get; set; }
    }

    /// <summary>
    /// Represents a data structure containing user-specific top score information.
    /// </summary>
    public class ScoreData
    {
        /// <summary>
        /// Gets or sets the username of the user who achieved the top score.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Gets or sets the top score achieved by the user.
        /// </summary>
        public int TopScore { get; set; }

        /// <summary>
        /// Gets or sets the date the score was achieved by the user.
        /// </summary>
        public string Date { get; set; }

        /// <summary>
        /// Gets or sets the nuimber f mines on grid played.
        /// </summary>
        public int NumberOfMines { get; set; }
    }
}
