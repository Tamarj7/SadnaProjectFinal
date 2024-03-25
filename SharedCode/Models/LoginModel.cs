namespace SadnaProject.Models
{
    /// <summary>
    /// Represents a data structure for user login information.
    /// </summary>
    public class LoginModel
    {
        /// <summary>
        /// Gets or sets the username of the user attempting to log in.
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets the password associated with the user's account.
        /// </summary>
        public string Password { get; set; }

    }
}
