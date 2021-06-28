import { Request, Response, NextFunction } from "express"

export default function EnsureAuth(req: Request, res: Response, next: NextFunction)
{
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error_msg", "Please login");
    return res.redirect("/login");
}