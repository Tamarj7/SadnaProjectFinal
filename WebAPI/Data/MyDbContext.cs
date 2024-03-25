using SadnaProject.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace SadnaProject.Data;

// Define the DbContext class that extends IdentityDbContext with UserModel as the user model
public class MyDbContext : IdentityDbContext<UserModel>
{
    /*Users table*/
    public DbSet<UserModel> Users{ get; set; }

    /*TopScore table*/
    public DbSet<TopScoreModel> TopScores { get; set; }

    // Constructor for MyDbContext that takes DbContextOptions as input
    public MyDbContext(DbContextOptions<MyDbContext> options)
         : base(options)
    {
    }

    // Override the OnModelCreating method to customize the default behavior
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        base.OnModelCreating(modelBuilder);

        // Rename the user data table to "Users"
        modelBuilder.Entity<UserModel>().ToTable("Users");
        // Rename the users role table to "Userrole"
        modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRole");

        /*2 keys for top scores table*/
        modelBuilder.Entity<TopScoreModel>()
            .HasKey(ts => new { ts.Username, ts.GridSize });

    }

}