const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public")); // Serves frontend files
app.use(
    session({
        secret: "moodz-secret",
        resave: false,
        saveUninitialized: true
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/spotify/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Spotify Auth Routes
app.get("/auth/spotify", passport.authenticate("spotify"));

app.get(
    "/auth/spotify/callback",
    passport.authenticate("spotify", { failureRedirect: "/login.html" }),
    (req, res) => {
        res.redirect("/account.html"); // Redirect after successful login
    }
);

// Logout
app.get("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy();
        res.redirect("/login.html");
    });
});

// Get User Data
app.get("/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

// Start Server
app.listen(3000, () => console.log(`Server running on http://localhost:${3000}`));
