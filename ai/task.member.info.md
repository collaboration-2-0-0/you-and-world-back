1. add the following info for member:
member_desire (text), member_goal (text), member_activity (text), member_role (character verying),
create for this separate table members_info with one-to-one relation with members on delete cascade

2. create tabel members_spaces with relation many-to-one with table members on delete cascade
and many-to-one with table spaces_to_spaces with columns:
member_id integer
space_rel_id integer

3. create table spaces with columns:
space_id integer
name character verying
description text

4. create table spaces_to_spaces with columns:
space_rel_id integer
space_id integer
parent_space_id integer or null
with relation many-to-one with table spaces by space_id and parent_space_id

5. create api endpoints:
- to create, get, update and delete member data in table members_data in api/member/info.
- to create, get, update and delete spaces in table spaces and spaces_to_spaces in api/space.
- to get spaces from table spaces_to_spaces by parent_space_id in api/space/space.
- to get spaces from table spaces_to_spaces by space_id with parent and parent of parent spaces in api/space/space

6. create necessary types, schemas, migrations
