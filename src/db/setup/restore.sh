echo 'start'

read -p "Enter filename: " FILE
echo ${FILE}.sql

export PGCLIENTENCODING=utf8
DATABASE=you_and_world
USER=you_and_world

export PGPASSWORD=postgres
psql -f create.sql -U postgres

export PGPASSWORD=you_and_world
psql -d $DATABASE -f ${FILE}.sql -U $USER

echo 'end'
