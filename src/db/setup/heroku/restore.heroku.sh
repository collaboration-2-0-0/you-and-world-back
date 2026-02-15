echo 'start'

# prod
# DATABASE=postgresql-graceful-47367
# APP=you-and-world

# dev
DATABASE=postgresql-elliptical-53696
APP=you-and-world-dev

heroku pg:psql $DATABASE --app $APP -f create.heroku.sql
# heroku pg:psql $DATABASE --app $APP -f ../backup.sql
heroku pg:psql $DATABASE --app $APP -f ../../../../.local/net_init_1.sql

echo 'end'
