create table if not exists "user"
(
    id            serial
    constraint "PK_cace4a159ff9f2512dd42373760"
    primary key,
    first_name    varchar,
    last_name     varchar,
    email_address varchar              not null
    constraint "UQ_a8979f71f59cb66a8b03bde38c1"
    unique,
    password      varchar              not null,
    is_active     boolean default true not null
);

create table if not exists vehicle
(
    id         serial
    constraint "PK_187fa17ba39d367e5604b3d1ec9"
    primary key,
    user_id    integer                 not null,
    updated_at timestamp default now() not null,
    created_at timestamp default now() not null,
    year       integer                 not null,
    make       varchar(64)             not null,
    model      varchar(64)             not null,
    trim       varchar(64)             not null,
    mileage    integer                 not null
    );

create table if not exists oil
(
    id         serial
    constraint "PK_7687c431233413581eb1c765504"
    primary key,
    user_id    integer                 not null,
    updated_at timestamp default now() not null,
    created_at timestamp default now() not null,
    brand      varchar,
    weight     varchar,
    type       varchar,
    vehicle_id integer                 not null
    constraint "REL_815cb68098e6f6f0574b44b3a5"
    unique
    constraint "FK_815cb68098e6f6f0574b44b3a5e"
    references vehicle
    );

create table if not exists oil_filter
(
    id         serial
    constraint "PK_fb1d0257a8adb7bf12151f2a797"
    primary key,
    user_id    integer                 not null,
    updated_at timestamp default now() not null,
    created_at timestamp default now() not null,
    brand      varchar,
    model      varchar,
    vehicle_id integer
    constraint "REL_14811abd4209a92cd1fee04de2"
    unique
    constraint "FK_14811abd4209a92cd1fee04de2a"
    references vehicle
    );

create table if not exists tire
(
    id         serial
    constraint "PK_45e4e3dc25457543cb901dbdbeb"
    primary key,
    user_id    integer                 not null,
    updated_at timestamp default now() not null,
    created_at timestamp default now() not null,
    brand      varchar,
    size       varchar,
    vehicle_id integer
    constraint "REL_515b7f6843ad0206ab3a74d040"
    unique
    constraint "FK_515b7f6843ad0206ab3a74d0404"
    references vehicle
    );

create table if not exists service_log
(
    id            serial
    constraint "PK_3b684c97d80dde904ffee56d11d"
    primary key,
    user_id       integer                 not null,
    updated_at    timestamp default now() not null,
    created_at    timestamp default now() not null,
    mileage       integer,
    description   varchar,
    "serviceDate" date                    not null,
    vehicle_id    integer
    constraint "FK_9234aaed16d549b1ed4a8f17532"
    references vehicle,
    service_type  varchar                 not null,
    repair_cost   integer   default 0     not null
    );