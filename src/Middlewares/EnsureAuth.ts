import { Request, Response, NextFunction } from "express"

export default function EnsureAuth(req: Request, res: Response, next: NextFunction)
{
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", "Please login");
    return res.redirect("/login");
}