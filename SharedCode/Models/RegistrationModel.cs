
using System.ComponentModel.DataAnnotations;

namespace SadnaProject.Models
{
    /// <summary>
    /// Represents a data structure for user registration information.
    /// </summary>
    public class RegistrationModel :UserModel
    {
        /// <summary>
        /// Gets or sets the username chosen by the user for registration.
        /// </summary>
        [Required(ErrorMessage = "The Username field is required.")]
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets the password chosen by the user for registration.
        /// </summary>
        [Required(ErrorMessage = "The Password field is required.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }



    }
}
