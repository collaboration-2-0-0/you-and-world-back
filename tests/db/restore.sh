echo 'start'

cd tests/db

export PGCLIENTENCODING=utf8
DATABASE=you_and_world
USER=you_and_world

export PGPASSWORD=postgres
psql -f create.sql -U postgres

export PGPASSWORD=you_and_world
psql -d $DATABASE -f ../../src/db/setup/backup.sql -U $USER

echo 'end'
