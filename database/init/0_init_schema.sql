CREATE TABLE test (
    id serial PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
    test (first_name, last_name)
VALUES
    ('First_test', 'Last_test');

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

CREATE EXTENSION IF NOT EXISTS postgis_topology;

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

CREATE EXTENSION IF NOT EXISTS postgis_raster;

CREATE EXTENSION IF NOT EXISTS postgis_sfcgal;

CREATE EXTENSION IF NOT EXISTS address_standardizer;

-- BASE SCHEMA --
CREATE TABLE "favorite_brewery" (
    "id" UUID NOT NULL,
    "brewery_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "liked_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE "favorite_brewery"
ADD PRIMARY KEY ("id");

CREATE TABLE "favorite_beer" (
    "id" UUID NOT NULL,
    "beer_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "liked_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE "favorite_beer"
ADD PRIMARY KEY ("id");

CREATE TABLE "address" (
    "id" UUID NOT NULL,
    "line_1" TEXT NOT NULL,
    "line_2" TEXT NULL,
    "postal_code" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "GPS" geography NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE "address"
ADD PRIMARY KEY ("id");

CREATE TABLE "user_detail" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "image" TEXT NOT NULL,
    "ARR_color" VARCHAR(255) CHECK ("ARR_color" IN ('')) NOT NULL,
    "ARR_style" VARCHAR(255) CHECK ("ARR_style" IN ('')) NOT NULL,
    "beer_level" VARCHAR(255) CHECK ("beer_level" IN ('')) NOT NULL,
    "address_id" UUID NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

ALTER TABLE "user_detail"
ADD PRIMARY KEY ("id");

CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "paiement_method" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "role" VARCHAR(255) CHECK ("role" IN ('')) NOT NULL
);

ALTER TABLE "user"
ADD PRIMARY KEY ("id");

CREATE TABLE "brewery_owner" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address_id" UUID NOT NULL,
    "birth_date" DATE NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "role" VARCHAR(255) CHECK ("role" IN ('')) NOT NULL
);

ALTER TABLE "brewery_owner"
ADD PRIMARY KEY ("id");

CREATE TABLE "brewery_detail" (
    "id" UUID NOT NULL,
    "brewery_id" UUID NOT NULL,
    "has_taproom" BOOLEAN NOT NULL,
    "image" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "social_link" TEXT NOT NULL,
    "taproom_hours" TEXT NULL,
    "opening_hours" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

ALTER TABLE "brewery_detail"
ADD PRIMARY KEY ("id");

CREATE TABLE "brewery" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "RIB" TEXT NOT NULL,
    "siren" TEXT NOT NULL,
    "address_id" UUID NOT NULL,
    "brewery_owner_id" UUID NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

ALTER TABLE "brewery"
ADD PRIMARY KEY ("id");

CREATE TABLE "order_detail" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "beer_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "is_ready" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

ALTER TABLE "order_detail"
ADD PRIMARY KEY ("id");

CREATE TABLE "order" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "brewery_id" UUID NOT NULL,
    "final_price" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(255) CHECK ("status" IN ('')) NOT NULL,
    "pickup_day" DATE NOT NULL,
    "pickup_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

ALTER TABLE "order"
ADD PRIMARY KEY ("id");

CREATE TABLE "beer_color" (
    "id" UUID NOT NULL,
    "label" VARCHAR(255) CHECK ("label" IN ('')) NOT NULL,
    "ARR_beer_level" VARCHAR(255) CHECK ("ARR_beer_level" IN ('')) NOT NULL
);

ALTER TABLE "beer_color"
ADD PRIMARY KEY ("id");

CREATE TABLE "beer_beer_style" (
    "id" UUID NOT NULL,
    "beer_id" UUID NOT NULL,
    "beer_style_id" UUID NOT NULL
);

ALTER TABLE "beer_beer_style"
ADD PRIMARY KEY ("id");

CREATE TABLE "beer_style" (
    "id" UUID NOT NULL,
    "label" VARCHAR(255) CHECK ("label" IN ('')) NOT NULL,
    "ARR_beer_level" VARCHAR(255) CHECK ("ARR_beer_level" IN ('')) NOT NULL
);

ALTER TABLE "beer_style"
ADD PRIMARY KEY ("id");

CREATE TABLE "beer" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "beer_color_id" UUID NOT NULL,
    "brewery_id" UUID NOT NULL,
    "abv_rate" DOUBLE PRECISION NOT NULL,
    "ibu_rate" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

ALTER TABLE "beer"
ADD PRIMARY KEY ("id");

ALTER TABLE "order_detail"
ADD CONSTRAINT "order_detail_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "order" ("id");

ALTER TABLE "order_detail"
ADD CONSTRAINT "order_detail_beer_id_foreign" FOREIGN KEY ("beer_id") REFERENCES "beer" ("id");

ALTER TABLE "brewery_owner"
ADD CONSTRAINT "brewery_owner_address_id_foreign" FOREIGN KEY ("address_id") REFERENCES "address" ("id");

ALTER TABLE "beer_beer_style"
ADD CONSTRAINT "beer_beer_style_beer_id_foreign" FOREIGN KEY ("beer_id") REFERENCES "beer" ("id");

ALTER TABLE "favorite_brewery"
ADD CONSTRAINT "favorite_brewery_brewery_id_foreign" FOREIGN KEY ("brewery_id") REFERENCES "brewery" ("id");

ALTER TABLE "order"
ADD CONSTRAINT "order_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "order"
ADD CONSTRAINT "order_brewery_id_foreign" FOREIGN KEY ("brewery_id") REFERENCES "brewery" ("id");

ALTER TABLE "brewery_detail"
ADD CONSTRAINT "brewery_detail_brewery_id_foreign" FOREIGN KEY ("brewery_id") REFERENCES "brewery" ("id");

ALTER TABLE "favorite_brewery"
ADD CONSTRAINT "favorite_brewery_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "favorite_beer"
ADD CONSTRAINT "favorite_beer_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "beer"
ADD CONSTRAINT "beer_beer_color_id_foreign" FOREIGN KEY ("beer_color_id") REFERENCES "beer_color" ("id");

ALTER TABLE "beer"
ADD CONSTRAINT "beer_brewery_id_foreign" FOREIGN KEY ("brewery_id") REFERENCES "brewery" ("id");

ALTER TABLE "brewery"
ADD CONSTRAINT "brewery_brewery_owner_id_foreign" FOREIGN KEY ("brewery_owner_id") REFERENCES "brewery_owner" ("id");

ALTER TABLE "user_detail"
ADD CONSTRAINT "user_detail_address_id_foreign" FOREIGN KEY ("address_id") REFERENCES "address" ("id");

ALTER TABLE "beer_beer_style"
ADD CONSTRAINT "beer_beer_style_beer_style_id_foreign" FOREIGN KEY ("beer_style_id") REFERENCES "beer_style" ("id");

ALTER TABLE "brewery"
ADD CONSTRAINT "brewery_address_id_foreign" FOREIGN KEY ("address_id") REFERENCES "address" ("id");

ALTER TABLE "favorite_beer"
ADD CONSTRAINT "favorite_beer_beer_id_foreign" FOREIGN KEY ("beer_id") REFERENCES "beer" ("id");

ALTER TABLE "user_detail"
ADD CONSTRAINT "user_detail_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id");