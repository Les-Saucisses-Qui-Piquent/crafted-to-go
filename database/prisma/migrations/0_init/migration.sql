-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis_raster";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis_sfcgal";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis_tiger_geocoder";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "address_standardizer";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "address_standardizer_data_us";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis_topology";

-- CreateTable
CREATE TABLE "address" (
    "id" UUID NOT NULL,
    "line_1" TEXT NOT NULL,
    "line_2" TEXT,
    "postal_code" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "GPS" geography,
    "updated_at" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL,
    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0),
    CONSTRAINT "beer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beer_beer_style" (
    "id" UUID NOT NULL,
    "beer_id" UUID NOT NULL,
    "beer_style_id" UUID NOT NULL,
    CONSTRAINT "beer_beer_style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beer_color" (
    "id" UUID NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "ARR_beer_level" VARCHAR(255) NOT NULL,
    CONSTRAINT "beer_color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beer_style" (
    "id" UUID NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "ARR_beer_level" VARCHAR(255) NOT NULL,
    CONSTRAINT "beer_style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brewery" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "RIB" TEXT NOT NULL,
    "siren" TEXT NOT NULL,
    "address_id" UUID NOT NULL,
    "brewery_owner_id" UUID NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0),
    CONSTRAINT "brewery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brewery_detail" (
    "id" UUID NOT NULL,
    "brewery_id" UUID NOT NULL,
    "has_taproom" BOOLEAN NOT NULL,
    "image" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "social_link" TEXT NOT NULL,
    "taproom_hours" TEXT,
    "opening_hours" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0),
    CONSTRAINT "brewery_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brewery_owner" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address_id" UUID NOT NULL,
    "birth_date" DATE NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0),
    "role" VARCHAR(255) NOT NULL,
    CONSTRAINT "brewery_owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_beer" (
    "id" UUID NOT NULL,
    "beer_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "liked_at" TIMESTAMP(0) NOT NULL,
    CONSTRAINT "favorite_beer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_brewery" (
    "id" UUID NOT NULL,
    "brewery_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "liked_at" TIMESTAMP(0) NOT NULL,
    CONSTRAINT "favorite_brewery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "brewery_id" UUID NOT NULL,
    "final_price" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "pickup_day" DATE NOT NULL,
    "pickup_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0),
    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_detail" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "beer_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "is_ready" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0),
    CONSTRAINT "order_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "us_gaz" (
    "id" SERIAL NOT NULL,
    "seq" INTEGER,
    "word" TEXT,
    "stdword" TEXT,
    "token" INTEGER,
    "is_custom" BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT "pk_us_gaz" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "us_lex" (
    "id" SERIAL NOT NULL,
    "seq" INTEGER,
    "word" TEXT,
    "stdword" TEXT,
    "token" INTEGER,
    "is_custom" BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT "pk_us_lex" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "us_rules" (
    "id" SERIAL NOT NULL,
    "rule" TEXT,
    "is_custom" BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT "pk_us_rules" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "paiement_method" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0),
    "role" VARCHAR(255) NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_detail" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "image" TEXT NOT NULL,
    "ARR_color" VARCHAR(255) NOT NULL,
    "ARR_style" VARCHAR(255) NOT NULL,
    "beer_level" VARCHAR(255) NOT NULL,
    "address_id" UUID NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL,
    "updated_at" TIMESTAMP(0),
    CONSTRAINT "user_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "beer"
ADD CONSTRAINT "beer_beer_color_id_foreign" FOREIGN KEY ("beer_color_id") REFERENCES "beer_color" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "beer"
ADD CONSTRAINT "beer_brewery_id_foreign" FOREIGN KEY ("brewery_id") REFERENCES "brewery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "beer_beer_style"
ADD CONSTRAINT "beer_beer_style_beer_id_foreign" FOREIGN KEY ("beer_id") REFERENCES "beer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "beer_beer_style"
ADD CONSTRAINT "beer_beer_style_beer_style_id_foreign" FOREIGN KEY ("beer_style_id") REFERENCES "beer_style" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "brewery"
ADD CONSTRAINT "brewery_address_id_foreign" FOREIGN KEY ("address_id") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "brewery"
ADD CONSTRAINT "brewery_brewery_owner_id_foreign" FOREIGN KEY ("brewery_owner_id") REFERENCES "brewery_owner" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "brewery_detail"
ADD CONSTRAINT "brewery_detail_brewery_id_foreign" FOREIGN KEY ("brewery_id") REFERENCES "brewery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "brewery_owner"
ADD CONSTRAINT "brewery_owner_address_id_foreign" FOREIGN KEY ("address_id") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_beer"
ADD CONSTRAINT "favorite_beer_beer_id_foreign" FOREIGN KEY ("beer_id") REFERENCES "beer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_beer"
ADD CONSTRAINT "favorite_beer_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_brewery"
ADD CONSTRAINT "favorite_brewery_brewery_id_foreign" FOREIGN KEY ("brewery_id") REFERENCES "brewery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorite_brewery"
ADD CONSTRAINT "favorite_brewery_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order"
ADD CONSTRAINT "order_brewery_id_foreign" FOREIGN KEY ("brewery_id") REFERENCES "brewery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order"
ADD CONSTRAINT "order_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail"
ADD CONSTRAINT "order_detail_beer_id_foreign" FOREIGN KEY ("beer_id") REFERENCES "beer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_detail"
ADD CONSTRAINT "order_detail_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_detail"
ADD CONSTRAINT "user_detail_address_id_foreign" FOREIGN KEY ("address_id") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_detail"
ADD CONSTRAINT "user_detail_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
