/**
 * Advanced Seed script – creates many demo users for BMSIT Connect
 * Run: node seed.js  (from the server/ directory)
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharva', 'Kabir', 'Rishi', 'Ananya', 'Diya', 'Aditi', 'Riya', 'Sneha', 'Kavya', 'Neha', 'Pooja', 'Shruti', 'Anushka', 'Tara', 'Ishita', 'Meera', 'Roshni', 'Kriti'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Rao', 'Reddy', 'Desai', 'Joshi', 'Menon', 'Nair', 'Iyer', 'Pillai', 'Chauhan'];
const branches = ['CSE','ISE','ECE','EEE','MECH','CIVIL','AIDS','AIML'];
const interestsList = ['Music','Movies','Gaming','Travel','Fitness','Reading','Coding','Food','Art','Sports','Memes','Photography', 'Fashion', 'Anime', 'Tech', 'Dance', 'Startups'];
const modes = ['dating', 'bff', 'bizz'];

const generateUsers = (num) => {
  const users = [];
  for (let i = 0; i < num; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = ['male', 'female', 'other'][Math.floor(Math.random() * 3)];
    
    // Pick 3-5 random interests
    const shuffledInterests = interestsList.sort(() => 0.5 - Math.random());
    const interests = shuffledInterests.slice(0, Math.floor(Math.random() * 3) + 3);

    // Random avatar URL based on a seed
    const photoId = Math.floor(Math.random() * 1000);
    // Use pravatar for realistic-ish faces
    const photoUrl = `https://i.pravatar.cc/600?img=${photoId % 70}`; 

    users.push({
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@bmsit.in`,
      password: 'Demo@1234',
      gender: gender,
      branch: branches[Math.floor(Math.random() * branches.length)],
      year: Math.floor(Math.random() * 4) + 1,
      interests: interests,
      mode: modes[Math.floor(Math.random() * modes.length)],
      photos: [photoUrl] // Inject random photo
    });
  }
  return users;
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  const usersToSeed = generateUsers(25); // Generate 25 users

  for (const u of usersToSeed) {
    const exists = await User.findOne({ email: u.email });
    if (exists) continue; 
    
    const hashed = await bcrypt.hash(u.password, 12);
    await User.create({ ...u, password: hashed });
    console.log(`✅ Created: ${u.name} (${u.email})`);
  }

  console.log(`\n🎉 Successfully seeded 25 new users with random photos!`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
