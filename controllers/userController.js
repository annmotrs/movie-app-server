import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';
import { User } from '../models/models.js';

class UserController {
  async registration(req, res) {
    const { firstname, lastname, nickname, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      firstname,
      lastname,
      nickname,
      email,
      password: hashPassword,
    });
    const token = jwt.sign(
      { id: user.id, firstname, lastname, nickname, email },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(ApiError.internal('Пользователь не найден!'));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль!'));
    }

    const token = jwt.sign(
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        nickname: user.nickname,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    return res.json({ token });
  }

  async checkAuth(req, res, next) {
    const token = jwt.sign(
      {
        id: req.user.id,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        nickname: req.user.nickname,
        email: req.user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    return res.json({ token });
  }

  async checkUniqueEmail(req, res) {
    const { email } = req.body;

    const count = await User.count({
      where: { email },
    });

    return res.json(count);
  }

  async checkUniqueNickname(req, res) {
    const { nickname } = req.body;

    const count = await User.count({
      where: { nickname },
    });

    return res.json(count);
  }

  async updateUser(req, res) {
    const { id, firstname, lastname, nickname, email, password } = req.body;

    const user = await User.findOne({ where: { id } });

    const hashPassword =
      password.length !== 0 ? await bcrypt.hash(password, 5) : user.password;

    const result = await User.update(
      {
        firstname,
        lastname,
        nickname,
        email,
        password: hashPassword,
      },
      { where: { id }, returning: true }
    );
    const updatedUser = result[1][0];

    const token = jwt.sign(
      {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        nickname: updatedUser.nickname,
        email: updatedUser.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    return res.json({ token });
  }
}

export default new UserController();
