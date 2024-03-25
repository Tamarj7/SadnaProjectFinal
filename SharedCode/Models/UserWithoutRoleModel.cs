using System.ComponentModel.DataAnnotations;

namespace SadnaProject.Models
{
    /// <summary>
    /// Represents a user model for storing user account information with model included but without password and private data.
    /// </summary>
    /// 
    public class UserWithoutRoleModel 
    {
        /// <summary>
        /// Gets or sets the user name of the user.
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets the first name of the user.
        /// </summary>
        [Required(ErrorMessage = "The FirstName field is required.")]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name of the user.
        /// </summary>
        [Required(ErrorMessage = "The LastName field is required.")]
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the email address of the user.
        /// </summary>
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        [Required(ErrorMessage = "The Email field is required.")]
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the phone number of the user.
        /// </summary>
        [Phone(ErrorMessage = "Invalid Phone Number")]
        [Required(ErrorMessage = "The Phone field is required.")]
        public string Phone { get; set; }

    }
}
