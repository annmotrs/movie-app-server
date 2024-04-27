import { Favorite } from '../models/models.js';
import ApiError from '../error/ApiError.js';

class FavoriteController {
  async create(req, res) {
    const { userId, movieId } = req.body;
    const favorite = await Favorite.create({ userId, movieId });
    return res.json(favorite);
  }

  async getFavoritesByUser(req, res) {
    const id = req.query.id;
    const favoritesByUser = await Favorite.findAll({
      where: {
        userId: id,
      },
    });
    return res.json(favoritesByUser);
  }

  async delete(req, res) {
    const id = req.params.id;
    const favorite = await Favorite.destroy({
      where: {
        id: id,
      },
    });
    return res.json(favorite);
  }
}

export default new FavoriteController();
