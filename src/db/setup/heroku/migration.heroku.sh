echo 'start'

# prod
DATABASE=postgresql-graceful-47367
APP=you-and-world

# dev
# DATABASE=postgresql-elliptical-53696
# APP=you-and-world-dev

heroku pg:psql $DATABASE --app $APP -f ../migrations/set.role.sql

echo 'end'
