// models/user.model.js

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'mongoDB', 'users.json');

function readUsersFile() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

function writeUsersFile(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function getAllUsers() {
  return readUsersFile();
}

function getUserById(id) {
  const users = readUsersFile();
  return users.find((u) => u.id === id);
}

function getUserByEmail(email) {
  const users = readUsersFile();
  return users.find((u) => u.email === email);
}

function createUser(userData) {
  const users = readUsersFile();

  const newId =
    users.length > 0
      ? String(
          Math.max(
            ...users.map((u) => {
              const num = Number(u.id);
              return Number.isNaN(num) ? 0 : num;
            })
          ) + 1
        )
      : '1';

  const now = new Date().toISOString();

  const newUser = {
    id: newId,
    name: userData.name || '',
    email: userData.email,
    passwordHash: userData.passwordHash,
    providerId: userData.providerId || null,
    createdAt: now,
    updatedAt: now
  };

  users.push(newUser);
  writeUsersFile(users);

  return newUser;
}

function updateUser(id, userData) {
  const users = readUsersFile();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return null;
  }

  const updatedUser = {
    ...users[index],
    ...userData,
    id,
    updatedAt: new Date().toISOString()
  };

  users[index] = updatedUser;
  writeUsersFile(users);

  return updatedUser;
}

function deleteUser(id) {
  const users = readUsersFile();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return false;
  }

  users.splice(index, 1);
  writeUsersFile(users);

  return true;
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
};
