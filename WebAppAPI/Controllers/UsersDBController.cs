using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SadnaProject.Controllers;
using SadnaProject.Data;
using SadnaProject.Models;
using System.Data;
using System.Net;
using System.Security.Claims;
using Microsoft.Extensions.Logging;




// Define the namespace
namespace SadnaProject.Controllers
{
    
    // ApiController attribute
    [ApiController]
    [Route("[controller]")]
    public class UsersDBController : ControllerBase
    {
        // Define private fields for the database context, user manager, sign-in manager, role manager, JWT utilities, and logger
        private readonly MyDbContext _dbContext;    /*db context*/
        private readonly UserManager<UserModel> _userManager;       /*user amanager*/
        private readonly SignInManager<UserModel> _signInManager;   /*sign in manager*/
        private readonly RoleManager<IdentityRole> _roleManager; // Add RoleManager
        private readonly JwtUtils _jwtUtils;    /*managing acces tokes*/

        // Constructor injection to provide instances of MyDbContext, UserManager, SignInManager, JwtUtils, ILogger, and RoleManager
        public UsersDBController(
            MyDbContext dbContext,
            UserManager<UserModel> userManager,
            SignInManager<UserModel> signInManager,
            JwtUtils jwtUtils,
            RoleManager<IdentityRole> roleManager) 

        {
            _dbContext = dbContext;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _jwtUtils = jwtUtils;
        }

        /// <summary>
        /// Authenticates the user.
        /// </summary>
        /// <returns>
        /// Returns an HTTP response containing the user's role.
        /// - If the user is authenticated, a status code of 200 (OK) is returned along with the user's role.
        /// - If the user is not found or not authenticated, a status code of 404 (Not Found) is returned.
        /// - error in other case
        /// </returns>
        [HttpGet("authenticate")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> Authenticate()
        {
            
            try
            {
                var userName = User.FindFirst(ClaimTypes.Name)?.Value;

                var user = await _userManager.FindByNameAsync(userName);

                if (user == null)
                {
                    return NotFound();
                }

                var userRoles = await _userManager.GetRolesAsync(user);

                if (userRoles == null || !userRoles.Any())
                {
                    return NotFound("User does not have a role.");
                }

                return Ok(new { role = userRoles.FirstOrDefault() }); // Return the user's role in the response
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }




        /// <summary>
        /// Retrieves the authenticated user's details.
        /// </summary>
        /// <returns>
        /// Returns an HTTP response containing the user's details.
        /// - If the user is found, a status code of 200 (OK) is returned along with the user's details.
        /// - If the user is not found, a status code of 404 (Not Found) is returned.
        /// </returns>
        [HttpGet("profile")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<UserWithoutRoleModel>> Get()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            var user = await _dbContext.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                return NotFound();
            }

            var userWithRole = new UserWithoutRoleModel
            {
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
            };

            return userWithRole;
        }

        [HttpPut("profileEdit")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> UpdateUserProfile(UserWithoutRoleModel updatedUser)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Update other user properties
            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.Phone = updatedUser.Phone;

           
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "User profile updated successfully." }); // Return a success response
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating user profile: {ex.Message}" }); // Return a failure response with an error message
            }
        }

        /// <summary>
        /// Retrieves a list of all registered users.
        /// </summary>
        /// <remarks>
        /// This endpoint allows administrators to retrieve a list of all users registered with the application.
        /// </remarks>
        /// <returns>
        /// Returns an HTTP response containing the list of users.
        /// - If there are registered users, a status code of 200 (OK) is returned along with the list of users.
        /// - If there are no registered users, a status code of 404 (Not Found) is returned.
        /// </returns>
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<IEnumerable<UserWithRoleModel>>> GetAllUsers()
        {
            var users = await _dbContext.Users.ToArrayAsync();

            if (users.Length == 0)
            {
                return NotFound();
            }

            var usersWithRoles = new List<UserWithRoleModel>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                var userWithRole = new UserWithRoleModel
                {
                    UserName = user.UserName,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Phone = user.Phone,
                    Role = roles.First() 
                };

                usersWithRoles.Add(userWithRole);
            }

            return Ok(usersWithRoles);
        }


        /// <summary>
        /// Updates a user's details by an admin.
        /// </summary>
        /// <param name="updatedUser">The updated user information.</param>
        /// <returns>
        /// Returns an HTTP response indicating the result of the user update attempt.
        /// - If the update is successful, a status code of 200 (OK) is returned along with a success message.
        /// - If the user is not found or the update fails, a status code of 404 (Not Found) or 400 (Bad Request)
        ///   is returned along with an error message.
        /// </returns>
        [Authorize(Roles = "admin")]
        [HttpPut("adminEditUser")]
        public async Task<ActionResult> UpdateUser(UserWithRoleModel updatedUser)
        {
            var user = await _userManager.FindByNameAsync(updatedUser.UserName);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Check if the updatedUser.Role is a valid role
            if (!await _roleManager.RoleExistsAsync(updatedUser.Role))
            {
                return BadRequest(new { message = "Invalid role." });
            }

            // Remove existing roles
            var existingRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, existingRoles);

            // Add the new role
            await _userManager.AddToRoleAsync(user, updatedUser.Role);

            // Update other user properties if needed
            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.Phone = updatedUser.Phone;

            try
            {
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "User updated successfully." }); // Return a success response
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating user: {ex.Message}" }); // Return a failure response with an error message
            }
        }



        /// <summary>
        /// Registers a new user with the application.
        /// </summary>
        /// <remarks>
        /// This endpoint allows users to create a new account by providing registration details.
        /// </remarks>
        /// <param name="newUser">The registration information for the new user.</param>
        /// <returns>
        /// Returns an HTTP response indicating the result of the registration attempt.
        /// - If registration is successful, a status code of 200 (OK) is returned along with a success message.
        /// - If the registration data is invalid or conflicts with an existing user, a status code of 400 (Bad Request)
        ///   is returned along with error details.
        /// - If an unexpected error occurs during registration, a status code of 500 (Internal Server Error) is returned
        ///   along with an error message.
        /// </returns>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> CreateUser(RegistrationModel newUser)
        {
            // Check if a user with the same username already exists
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == newUser.UserName);
            if (existingUser != null)
            {

                return new ObjectResult(new { error = new[] { $"Username {newUser.UserName} Already Exists" } })
                {
                    StatusCode = (int)HttpStatusCode.Conflict // Set the desired status code
                };
            }

            // Create a new UserModel
            var userModel = new UserModel
            {
                NormalizedUserName = newUser.UserName,
                UserName = newUser.UserName,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Email = newUser.Email,
                Phone = newUser.Phone,
            };

            try
            {
                // Create the user in the Identity system
                var result = await _userManager.CreateAsync(userModel, newUser.Password);

                await _userManager.AddToRoleAsync(userModel, "user");

                if (result.Succeeded)
                {
                    // User successfully registered

                    // Sign in the user
                    await _signInManager.SignInAsync(userModel, isPersistent: false);

                    // Return a success response or redirect to a dashboard
                    return Ok(new { message = "Registration successful" });
                }
                else
                {
                    // Handle the case where Identity user creation failed
                    // You can return a BadRequest or another appropriate response
                    return BadRequest(result.Errors);
                }
            }
            catch (DbUpdateException ex)
            {
                // Handle the case where a database error occurred (e.g., duplicate username)
                // You can return a Conflict or another appropriate response
                return new ObjectResult(new { error = new[] { $"Error: {ex.Message.ToString()}" } })
                {
                    StatusCode = (int)HttpStatusCode.Conflict 
                };
            }
            catch (Exception ex)
            {
                return new ObjectResult(new { error = new[] { "An error occurred during registration." } })
                {
                    StatusCode = (int)HttpStatusCode.InternalServerError //status code (500)
                };

            }
        }

        /// <summary>
        /// Handles user login.
        /// </summary>
        /// <param name="model">The login information provided by the user.</param>
        /// <returns>
        /// Returns an HTTP response containing the result of the login attempt.
        /// - If the login is successful, a status code of 200 (OK) is returned along with a JWT token and the user's role.
        /// - If the login fails, a status code of 401 (Unauthorized) is returned along with an error message.
        /// </returns>
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            //_logger.LogError("User not found during authentication.");
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                // User authentication is successful
                var userRole = await _userManager.GetRolesAsync(user);

                // Generate a JWT token
                var jwtToken = _jwtUtils.GenerateJwtToken(user.Id, user.UserName, userRole.First());

                return Ok(new { token = jwtToken , role = userRole.FirstOrDefault()});
            }
            else
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }
        }

        /// <summary>
        /// Deletes a user by username.
        /// </summary>
        /// <param name="userName">The username of the user to be deleted.</param>
        /// <returns>
        /// Returns an HTTP response indicating the result of the user deletion attempt.
        /// - If the deletion is successful, a status code of 200 (OK) is returned along with a success message.
        /// - If the user is not found or the deletion fails, a status code of 404 (Not Found) or 400 (Bad Request)
        ///   is returned along with an error message.
        /// </returns>
        [Authorize(Roles = "admin")]
        [HttpDelete("deleteUser/{userName}")]
        public async Task<ActionResult> DeleteUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            try
            {
                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    return Ok(new { message = "User deleted successfully." }); // Return a success response
                }
                else
                {
                    return BadRequest(new { message = "Error deleting user." }); // Return a failure response with an error message
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error deleting user: {ex.Message}" }); // Return a failure response with an error message
            }
        }



        /// <summary>
        /// Resets the password of the current authenticated user.
        /// </summary>
        /// <param name="newPassword">The new password for the user and username.</param>
        /// <returns>
        /// Returns an HTTP response indicating the result of the password reset attempt.
        /// - If the password reset is successful, a status code of 200 (OK) is returned along with a success message.
        /// - If the password reset fails, a status code of 400 (Bad Request) is returned along with an error message.
        /// </returns>
        [HttpPut("passwordReset")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> ResetPassword(LoginModel newPassword)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            try
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, newPassword.Password);

                if (result.Succeeded)
                {
                    return Ok(new { message = "Password reset successful." }); // Return a success response
                }
                else
                {
                    return BadRequest(new { message = "Error resetting password." }); // Return a failure response with an error message
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error resetting password: {ex.Message}" }); // Return a failure response with an error message
            }
        }



        /// <summary>
        /// Resets the password of a user by the admin.
        /// </summary>
        /// <param name="newPassword">The new password for the user and username.</param>
        /// <returns>
        /// Returns an HTTP response indicating the result of the password reset attempt.
        /// - If the password reset is successful, a status code of 200 (OK) is returned along with a success message.
        /// - If the user is not found or the password reset fails, a status code of 404 (Not Found) or 400 (Bad Request)
        ///   is returned along with an error message.
        /// </returns>
        [Authorize(Roles = "admin")]
        [HttpPut("passwordResetAdmin")]
        public async Task<ActionResult> ResetPasswordByAdmin(LoginModel newPassword)
        {
            var user = await _userManager.FindByNameAsync(newPassword.UserName);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            try
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, newPassword.Password);

                if (result.Succeeded)
                {
                    return Ok(new { message = "Password reset successful." }); // Return a success response
                }
                else
                {
                    return BadRequest(new { message = "Error resetting password." }); // Return a failure response with an error message
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error resetting password: {ex.Message}" }); // Return a failure response with an error message
            }
        }

    }
}

