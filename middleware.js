/*
You can choose to define all your middleware functions here, 
export them and then import them into your app.js and attach them that that.
add.use(myMiddleWare()). you can also just define them in the app.js if you like as seen in lecture 10's lecture code example. If you choose to write them in the app.js, you do not have to use this file. 
*/

  export const isAdminAuthenticated = async (req, res, next) => {
    if (!req.session.user) {
      return res.status(403).json({ error: "Unauthorized:Please log in first!" });
    }
    if (!req.session.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Access forbidden. You are not an admin." });
    }
    next();
  };