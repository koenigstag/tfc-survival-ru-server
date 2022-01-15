rm ../../../src/db/sequelize*.json

cd ../../../

npx sequelize-cli db:migrate

npx sequelize-cli db:seed:all
