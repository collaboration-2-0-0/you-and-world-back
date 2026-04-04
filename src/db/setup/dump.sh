echo 'start'

read -p "Enter filename: " FILE
echo ${FILE}.sql

export PGCLIENTENCODING=utf8

HOST=localhost
DATABASE=you_and_world
USER=postgres
export PGPASSWORD=postgres

pg_dump -U $USER -d $DATABASE -h $HOST -f ${FILE}.sql 

echo 'end'
