using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SadnaProject.Models
{
    /// <summary>
    /// Represents a user model for storing user account information.
    /// </summary>
    /// 
    [Table("Users")]
    public class UserModel : IdentityUser
    {
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
        public override string Email { get; set; }

        /// <summary>
        /// Gets or sets the phone number of the user.
        /// </summary>
        [Phone(ErrorMessage = "Invalid Phone Number")]
        [Required(ErrorMessage = "The Phone field is required.")]
        public string Phone { get; set; }



        // Navigation property to represent the user's roles
        public ICollection<IdentityUserRole<string>> Roles { get; } = new List<IdentityUserRole<string>>();


    }
}
