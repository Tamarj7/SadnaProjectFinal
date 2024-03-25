using System;
using System.ComponentModel.DataAnnotations;

namespace SadnaProject.Models
{
    /// <summary>
    /// Represents a data structure for storing top scores of users for specific grids.
    /// </summary>
    public class TopScoreModel
    {
        /// <summary>
        /// Gets or sets the username of the user achieving the top score.
        /// </summary>
        [Key]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the grid size for which the top score is recorded.
        /// </summary>
        [Key]
        public int GridSize { get; set; }

        /// <summary>
        /// Gets or sets the top score achieved by the user for the specific grid.
        /// </summary>
        public int TopScore { get; set; }

        /// <summary>
        /// Gets or sets the number of mines present in the game when the top score was achieved.
        /// </summary>
        public int NumberOfMines { get; set; }

        /// <summary>
        /// Gets or sets the playing time (duration) of the game when the top score was achieved.
        /// </summary>
        public string PlayingTime { get; set; } = null!;

        /// <summary>
        /// Gets or sets the date when the top score was achieved.
        /// </summary>
        public DateTime DatePlayed { get; set; }
    }
}
