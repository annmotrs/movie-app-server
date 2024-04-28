import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';

class UserController {
  async registration(req, res) {
    const { firstname, lastname, nickname, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 5);
    const result = await db.query(
      'INSERT INTO users (firstname, lastname, nickname, email, password) values ($1, $2, $3, $4, $5) RETURNING *',
      [firstname, lastname, nickname, email, hashPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, firstname, lastname, nickname, email },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    const user = result.rows[0];
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

    const count = await db.query(
      'SELECT COUNT(*) FROM users WHERE email = $1',
      [email]
    );

    return res.json(+count.rows[0].count);
  }

  async checkUniqueNickname(req, res) {
    const { nickname } = req.body;

    const count = await db.query(
      'SELECT COUNT(*) FROM users WHERE nickname = $1',
      [nickname]
    );

    return res.json(+count.rows[0].count);
  }

  async updateUser(req, res) {
    const { id, firstname, lastname, nickname, email, password } = req.body;

    const result1 = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result1.rows[0];
    const hashPassword =
      password.length !== 0 ? await bcrypt.hash(password, 5) : user.password;

    const result2 = await db.query(
      'UPDATE users SET firstname = $1, lastname = $2, nickname = $3, email = $4, password = $5 WHERE id = $6 RETURNING *',
      [firstname, lastname, nickname, email, hashPassword, id]
    );

    const updatedUser = result2.rows[0];

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
