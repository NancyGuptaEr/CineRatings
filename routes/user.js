import { Router } from "express";
import { checkNull, checkString, trimString } from "../helper.js";
import { userDataFuncs } from "../data/index.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import xss from 'xss';
const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });
router.route('/profile')
    .get(async (req, res) => {
        const user = await userDataFuncs.getUser(req.session.user._id);
        res.render('userprofile', { user: user, title: 'profile', hasError: false, isLoggedIn: true })
    })
    .post(upload.single("profilePicInput"), async (req, res) => {
        let postData = req.body;
        postData = JSON.stringify(postData);
        postData = JSON.parse(postData);
        try {
            postData.emailAddressInput = xss(postData.emailAddressInput);
            postData.ageInput = xss(postData.ageInput);
            postData.roleInput = xss(postData.roleInput);
            checkNull(postData.emailAddressInput, 'emailAddress');
            checkNull(postData.ageInput, 'Age');
            checkNull(postData.roleInput, 'Role');
            if (postData.roleInput === 'user') {
                let preferGenres = ["action", "adventure", "comedy", "drama", "fantasy", "horror", "musicals", "mystery", "romance", "science fiction", "sports", "thriller", "western"];
                checkNull(postData.preferGenreInput, 'Prefer Genre')
                postData.preferGenreInput = xss(postData.preferGenreInput);
                postData.preferGenreInput = postData.preferGenreInput.split(',');
                if (!Array.isArray(postData.preferGenreInput)) {
                    throw `Invalid value for prefer genre.`;
                }
                for (let x of postData.preferGenreInput) {
                    checkNull(x, 'genre values');
                    checkString(x, 'genre values');
                    x = trimString(x);
                    x = x.toLowerCase();
                    x = xss(x);
                    if (!preferGenres.includes(x)) {
                        throw `Prefer Genre can have action, adventure, comedy, drama, fantasy, horror, musicals, mystery, romance, science fiction, sports, thriller, and western as the value`;
                    }
                }
                checkNull(postData.preferContentInput, 'Prefer Content');
                checkString(postData.preferContentInput, 'Prefer Content');
                postData.preferContentInput = trimString(postData.preferContentInput);
                postData.preferContentInput = postData.preferContentInput.toLowerCase();
                postData.preferContentInput = xss(postData.preferContentInput);
                if (postData.preferContentInput !== 'g' && postData.preferContentInput !== 'pg' && postData.preferContentInput !== 'pg-13' && postData.preferContentInput !== 'r' && postData.preferContentInput !== '18+') {
                    throw `Prefer Content can either have G, PG, PG-13, R, NC-17 as the value.`;
                }
            }
            if (postData.roleInput === 'admin' && (postData.preferGenreInput || postData.preferContentInput)) {
                throw `Cannot have values for prefer genre and prefer content if role is admin.`
            }
            checkString(postData.emailAddressInput, 'emailAddress');
            postData.emailAddressInput = trimString(postData.emailAddressInput);
            checkString(postData.roleInput, 'role');
            postData.role = trimString(postData.role);
            let match;
            postData.emailAddressInput = postData.emailAddressInput.toLowerCase();
            if (postData.emailAddressInput.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/) !== null)
                match = postData.emailAddressInput.match(/[a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+[.]([a-zA-Z][a-zA-Z][a-zA-Z]*)/)[0];
            if (match === null || match !== postData.emailAddressInput) {
                throw 'email address must be in a valid email format.';
            }
            postData.roleInput = postData.roleInput.toLowerCase();
            if (postData.roleInput !== 'admin' && postData.roleInput !== 'user') {
                throw `Role can either have admin or user as its value.`;
            }
            if (typeof postData.ageInput === 'string') {
                postData.ageInput = trimString(postData.ageInput);
                if (postData.ageInput.length <= 0) {
                    throw `Age must have a valid value and cannot contain only spaces.`;
                }
                if (postData.ageInput.match(/[0-9][0-9]*/) === null) {
                    throw 'Age must be a positive whole number greater than or equal to 18 and less than or equal to 100.';
                }
                postData.ageInput = parseInt(postData.ageInput);
                if (postData.ageInput < 18 || postData.ageInput > 100) {
                    throw `Age must be between 18 and 100.`;
                }
            }
            else {
                postData.ageInput = postData.ageInput.toString();
                postData.ageInput = trimString(postData.ageInput);
                if (postData.ageInput.length <= 0) {
                    throw `Age must have a valid value and cannot contain only spaces.`;
                }
                if (postData.ageInput.match(/[0-9][0-9]*/) === null) {
                    throw 'Age must be a positive whole number greater than or equal to 18 and less than or equal to 100.';
                }
                postData.ageInput = parseInt(postData.ageInput);
                if (postData.ageInput < 18 || postData.ageInput > 100) {
                    throw `Age must be between 18 and 100.`;
                }
            }
            if (postData.profilePicInput !== "") {
                postData.profilePicInput = req.file ? "/uploads/" + req.file.filename : "";
            }
            postData.profilePicInput = xss(postData.profilePicInput);
        } catch (e) {
            console.log(e);
            return res.status(400).render("userprofile", { authUser: "", title: 'profile', hasError: true, error: e, user: { profileImage: postData.profilePicInput, emailAddress: postData.emailAddressInput, age: postData.ageInput } });
        }
        try {
            const success = await userDataFuncs.updateUser(req.session.user._id, postData.profilePicInput, postData.emailAddressInput, postData.ageInput, postData.roleInput, postData.preferGenreInput, postData.preferContentInput);
            if (!success) {
                return res.status(500).render("userprofile", { authUser: "", title: 'profile', hasError: true, error: "Internal Server Error", user: { profileImage: postData.profilePicInput, emailAddress: postData.emailAddressInput, age: postData.ageInput,isLoggedIn:true } });
            }
            return res.render("userprofile", { authUser: "", title: 'profile', hasError: false, user: success })
        } catch (e) {
            console.log(e);
            return res.status(400).render("userprofile", { authUser: "", title: 'profile', hasError: true, error: e, user: { profileImage: postData.profilePicInput, emailAddress: postData.emailAddressInput, age: postData.ageInput } });
        }
    })
export default router;