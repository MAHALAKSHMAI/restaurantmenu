const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});

    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@pos.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create Cashier
    const cashierPassword = await bcrypt.hash('cashier123', 10);
    await User.create({
      name: 'Cashier One',
      email: 'cashier@pos.com',
      password: cashierPassword,
      role: 'cashier'
    });

    // Create Kitchen
    const kitchenPassword = await bcrypt.hash('kitchen123', 10);
    await User.create({
      name: 'Kitchen Chef',
      email: 'kitchen@pos.com',
      password: kitchenPassword,
      role: 'kitchen'
    });

    // Seed Menu Items
    const items = [
      { 
        name: 'Paneer Butter Masala', 
        price: 280, 
        category: 'Main Course', 
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Butter Chicken', 
        price: 350, 
        category: 'Main Course', 
        image: 'https://images.unsplash.com/photo-1603894584202-933259bb7982?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Hyderabadi Veg Biryani', 
        price: 240, 
        category: 'Main Course', 
        image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Butter Garlic Naan', 
        price: 60, 
        category: 'Bread', 
        image: 'https://images.unsplash.com/photo-1626132646529-5003375a954e?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Masala Dosa', 
        price: 120, 
        category: 'Breakfast', 
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Mango Lassi', 
        price: 90, 
        category: 'Beverages', 
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Gulab Jamun (2pcs)', 
        price: 80, 
        category: 'Dessert', 
        image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Chicken Tikka', 
        price: 320, 
        category: 'Starters', 
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Chole Bhature', 
        price: 180, 
        category: 'Breakfast', 
        image: 'https://images.unsplash.com/photo-1626132646529-5003375a954e?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Samosa (2pcs)', 
        price: 40, 
        category: 'Starters', 
        image: 'https://images.unsplash.com/photo-1601050633647-81a35d37c3c1?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Veg Hakka Noodles', 
        price: 220, 
        category: 'Main Course', 
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Cold Coffee with Ice Cream', 
        price: 110, 
        category: 'Beverages', 
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400' 
      },
      { 
        name: 'Kesar Rasmalai', 
        price: 100, 
        category: 'Dessert', 
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=400' 
      }
    ];
    await MenuItem.insertMany(items);

    console.log('Database seeded!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
