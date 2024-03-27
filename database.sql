CREATE TABLE IF NOT EXISTS public."Shelves"
(
    id integer NOT NULL DEFAULT nextval('"Shelves_id_seq"'::regclass),
    shelf_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Shelves_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Shelves"
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public."Products"
(
    id integer NOT NULL DEFAULT nextval('"Products_id_seq"'::regclass),
    product character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "Products_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Products"
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public."ProductsShelves"
(
    id integer NOT NULL DEFAULT nextval('"ProductsShelves_id_seq"'::regclass),
    product_id integer NOT NULL,
    shelf_id integer NOT NULL,
    main_shelf boolean NOT NULL,
    CONSTRAINT "ProductsShelves_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ProductsShelves"
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public."Orders"
(
    id integer NOT NULL DEFAULT nextval('"Orders_id_seq"'::regclass),
    "order" integer NOT NULL,
    product_id integer,
    quantity integer NOT NULL,
    CONSTRAINT "Orders_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Orders"
    OWNER to postgres;