const crypto = require('crypto');

const createAdminUser = async (username, email, password) => {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  const apiKey = crypto.randomBytes(32).toString('hex'); // Generate a secure API key

  const newUser = await User.create({
    username,
    email,
    password: passwordHash,
    isAdmin: true,
    apiKey,
  });

  console.log("Admin user created with API key:", apiKey);
  return newUser;
};