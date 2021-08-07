import { Request, Response, NextFunction } from "express"

/**
 * @description
 * Ensures a user is auth.
 */
export default function EnsureAuth(req: Request, res: Response, next: NextFunction)
{
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", "Please login");
    return res.redirect("/login");
}