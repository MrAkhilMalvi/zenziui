const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isVerified: true,
        provider: true,
      },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id }
    });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with this email
    user = await prisma.user.findUnique({
      where: { email: profile.emails[0].value }
    });

    if (user) {
      // Link the Google account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profile.id,
          provider: 'google',
          avatar: user.avatar || profile.photos[0]?.value,
          isVerified: true,
        }
      });
      return done(null, user);
    }

    // Create new user
    const username = profile.emails[0].value.split('@')[0];
    let uniqueUsername = username;
    let counter = 1;
    
    // Ensure username is unique
    while (await prisma.user.findUnique({ where: { username: uniqueUsername } })) {
      uniqueUsername = `${username}${counter}`;
      counter++;
    }

    user = await prisma.user.create({
      data: {
        email: profile.emails[0].value,
        username: uniqueUsername,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0]?.value,
        googleId: profile.id,
        provider: 'google',
        isVerified: true,
        role: 'user', // Default role
        password: crypto.randomBytes(16).toString('hex')
      }
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `/api/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this GitHub ID
    let user = await prisma.user.findUnique({
      where: { githubId: profile.id }
    });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with this email (if email is available)
    const email = profile.emails?.[0]?.value;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email }
      });

      if (user) {
        // Link the GitHub account to existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            githubId: profile.id,
            provider: 'github',
            avatar: user.avatar || profile.photos[0]?.value,
            github: profile.profileUrl,
            isVerified: true,
          }
        });
        return done(null, user);
      }
    }

    // Create new user
    let uniqueUsername = profile.username;
    let counter = 1;
    
    // Ensure username is unique
    while (await prisma.user.findUnique({ where: { username: uniqueUsername } })) {
      uniqueUsername = `${profile.username}${counter}`;
      counter++;
    }

    user = await prisma.user.create({
      data: {
        email: email || `${profile.username}@github.local`,
        username: uniqueUsername,
        firstName: profile.displayName?.split(' ')[0],
        lastName: profile.displayName?.split(' ').slice(1).join(' '),
        avatar: profile.photos[0]?.value,
        githubId: profile.id,
        github: profile.profileUrl,
        provider: 'github',
        isVerified: true,
        role: 'user', // Default role
        password: crypto.randomBytes(16).toString('hex')
      }
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

module.exports = passport;
