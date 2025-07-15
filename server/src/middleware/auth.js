import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

// Middleware to require authentication for protected routes
export const requireAuth = ClerkExpressWithAuth({
  onError: (err, req, res) => {
    console.error("Clerk authentication error:", err);
    res.status(401).json({ error: "Authentication failed" });
  },
});

// Middleware to extract userId from authenticated request
export const extractUserId = (req, res, next) => {
  try {
    // Get userId from Clerk auth
    const userId = req.auth?.userId;

    if (!userId) {
      console.error("No userId found in req.auth:", req.auth);
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Add userId to request object for easy access in routes
    req.userId = userId;

    console.log("User authenticated:", userId);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};
