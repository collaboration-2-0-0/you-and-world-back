echo 'start'

# prod
DATABASE=postgresql-graceful-47367
APP=you-and-world

# dev
# DATABASE=postgresql-elliptical-53696
# APP=you-and-world-dev

heroku pg:psql $DATABASE --app $APP -f create.heroku.sql
heroku pg:psql $DATABASE --app $APP -f ../structure.sql

echo 'end'
