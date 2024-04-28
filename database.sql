CREATE TABLE users(
  id SERIAL PRIMARY KEY, 
  firstname VARCHAR(50) NOT NULL, 
  lastname VARCHAR(50) NOT NULL,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, 
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY, 
  movie_id INT NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users (id)
);