echo 'start'

export PGCLIENTENCODING=utf8
export PGPASSWORD=you_and_world
USER=you_and_world
DATABASE=you_and_world

psql -d $DATABASE -f migrations/set.role.sql -U $USER

echo 'end'
