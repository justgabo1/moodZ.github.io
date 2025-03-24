const express = require("express");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const dotenv = require("dotenv");
const session = require("express-session");

dotenv.config();

const app = express();

// Session setup
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));

// Passport setup
passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_REDIRECT_URI,
}, function (accessToken, refreshToken, expires_in, profile, done) {
    return done(null, { profile, accessToken });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Login with Spotify
app.get("/login/spotify", passport.authenticate("spotify", {
    scope: ["user-read-private", "user-read-email"],
}));

// Callback after Spotify authentication
app.get("/callback", passport.authenticate("spotify", {
    failureRedirect: "/login",
}), function (req, res) {
    res.redirect("/profile"); // Redirect to user profile or home
});

// User profile page
app.get("/profile", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.send(`<h1>Hello ${req.user.profile.displayName}</h1>`); // Display user's name
});

// Logout
app.get("/logout", (req, res) => {
    req.logout((err) => {
        res.redirect("/"); // Redirect to home
    });
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
