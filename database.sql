create table users (
    user_id serial primary key,
    user_name varchar(50) NOT NULL,
    user_email varchar(255) NOT NULL,
    user_password varchar(255) NOT NULL
);

create table orders (
    order_id serial primary key,
    user_id integer references users(user_id) not null,
    active boolean not null
)

create table products (
    product_id serial primary key,
    price money not null,
    name varchar(255) not null,
    description varchar(255) not null
)

create table order_details (
    order_details_id serial primary key,
    order_id integer references orders(order_id) not null,
    product_id integer references products(product_id) not null,
    quantity integer not null,
    total money not null
)