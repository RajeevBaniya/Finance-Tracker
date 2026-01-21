import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

export const requireAuth = ClerkExpressWithAuth({
  onError: (err, req, res) => {
    console.error("Clerk authentication error:", err);
    res.status(401).json({ error: "Authentication failed" });
  },
});

export const extractUserId = (req, res, next) => {
  try {

    const userId = req.auth?.userId;

    if (!userId) {
      console.error("No userId found in req.auth:", req.auth);
      return res.status(401).json({ error: "User not authenticated" });
    }

    req.userId = userId;

    console.log("User authenticated:", userId);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};
