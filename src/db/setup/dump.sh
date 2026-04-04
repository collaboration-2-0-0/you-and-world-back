echo 'start'

read -p "Enter filename: " FILE
echo ${FILE}.sql

export PGCLIENTENCODING=utf8
DATABASE=you_and_world
# USER=you_and_world
USER=postgres

export PGPASSWORD=postgres

pg_dump -U $USER -d $DATABASE -f $FILE

echo 'end'
