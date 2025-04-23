using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace AmazingBooks_API.Entities;

public partial class AmazingBookDbContext : DbContext
{
    public AmazingBookDbContext(DbContextOptions<AmazingBookDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderLine> OrderLines { get; set; }

    public virtual DbSet<Request> Requests { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Address__3214EC07E36DE09A");

            entity.ToTable("Address");

            entity.Property(e => e.AddressLine1)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.AddressLine2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Country)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.FkuserId).HasColumnName("FKUserId");
            entity.Property(e => e.IsActive).HasDefaultValueSql("('Y')");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.State)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.Zip)
                .HasMaxLength(15)
                .IsUnicode(false);

            entity.HasOne(d => d.Fkuser).WithMany(p => p.Addresses)
                .HasForeignKey(d => d.FkuserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Address__FKUserI__286302EC");
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Book__3214EC072A1EC23C");

            entity.ToTable("Book");

            entity.Property(e => e.Author)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Description)
                .HasMaxLength(800)
                .IsUnicode(false);
            entity.Property(e => e.Genre)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ImgUrl)
                .HasMaxLength(350)
                .IsUnicode(false);
            entity.Property(e => e.Isbn)
                .HasMaxLength(13)
                .IsUnicode(false);
            entity.Property(e => e.Language)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Price).HasColumnType("decimal(6, 2)");
            entity.Property(e => e.PublicationDate).HasColumnType("datetime");
            entity.Property(e => e.Weight).HasColumnType("decimal(5, 2)");
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cart__3214EC07FEB4D1EB");

            entity.ToTable("Cart");

            entity.Property(e => e.FkbookId).HasColumnName("FKBookId");
            entity.Property(e => e.FkuserId).HasColumnName("FKUserId");

            entity.HasOne(d => d.Fkbook).WithMany(p => p.Carts)
                .HasForeignKey(d => d.FkbookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cart__FKBookId__2F10007B");

            entity.HasOne(d => d.Fkuser).WithMany(p => p.Carts)
                .HasForeignKey(d => d.FkuserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cart__FKUserId__2E1BDC42");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Orders__3214EC074A3E2CB2");

            entity.Property(e => e.CancellationDate).HasColumnType("datetime");
            entity.Property(e => e.FkshippingAddress).HasColumnName("FKShippingAddress");
            entity.Property(e => e.FkuserId).HasColumnName("FKUserId");
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Shipping).HasColumnType("decimal(6, 2)");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SubTotal).HasColumnType("decimal(6, 2)");
            entity.Property(e => e.Tax).HasColumnType("decimal(6, 2)");
            entity.Property(e => e.Total).HasColumnType("decimal(6, 2)");
            entity.Property(e => e.Weight).HasColumnType("decimal(6, 2)");

            entity.HasOne(d => d.FkshippingAddressNavigation).WithMany(p => p.Orders)
                .HasForeignKey(d => d.FkshippingAddress)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orders__FKShippi__31EC6D26");

            entity.HasOne(d => d.Fkuser).WithMany(p => p.Orders)
                .HasForeignKey(d => d.FkuserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orders__FKUserId__32E0915F");
        });

        modelBuilder.Entity<OrderLine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__OrderLin__3214EC071D538258");

            entity.ToTable("OrderLine");

            entity.Property(e => e.Amount).HasColumnType("decimal(6, 2)");
            entity.Property(e => e.FkbookId).HasColumnName("FKBookId");
            entity.Property(e => e.FkorderId).HasColumnName("FKOrderId");
            entity.Property(e => e.Weight).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Fkbook).WithMany(p => p.OrderLines)
                .HasForeignKey(d => d.FkbookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderLine__FKBoo__36B12243");

            entity.HasOne(d => d.Fkorder).WithMany(p => p.OrderLines)
                .HasForeignKey(d => d.FkorderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderLine__FKOrd__35BCFE0A");
        });

        modelBuilder.Entity<Request>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Request__3214EC07D3240378");

            entity.ToTable("Request");

            entity.Property(e => e.Author)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.SelfLink)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.FkUserNavigation).WithMany(p => p.Requests)
                .HasForeignKey(d => d.FkUser)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Request__FkUser__72C60C4A");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC073C54CC20");

            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValueSql("('Y')");
            entity.Property(e => e.LoginId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(32)
                .IsFixedLength();
            entity.Property(e => e.Phone)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.RefreshToken)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Role)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("Customer");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
