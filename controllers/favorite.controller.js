import db from '../db.js';
import ApiError from '../error/ApiError.js';

class FavoriteController {
  async create(req, res) {
    const { userId, movieId } = req.body;
    const favorite = await db.query(
      'INSERT INTO favorites (movie_id, user_id) values ($1, $2) RETURNING *',
      [movieId, userId]
    );
    return res.json(favorite.rows[0]);
  }

  async getFavoritesByUser(req, res) {
    const id = req.query.id;
    const favoritesByUser = await db.query(
      'SELECT * FROM favorites WHERE user_id = $1',
      [id]
    );
    return res.json(favoritesByUser.rows);
  }

  async delete(req, res) {
    const id = req.params.id;
    const favorite = await db.query(
      'DELETE FROM favorites WHERE id = $1 RETURNING *',
      [id]
    );
    return res.json(favorite.rowCount);
  }
}

export default new FavoriteController();
