--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE nest;




--
-- Drop roles
--

DROP ROLE postgres;


--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'md524bb002702969490e41e26e1a454036c';






--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.10 (Debian 13.10-1.pgdg110+1)
-- Dumped by pg_dump version 13.10 (Debian 13.10-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO postgres;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "nest" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.10 (Debian 13.10-1.pgdg110+1)
-- Dumped by pg_dump version 13.10 (Debian 13.10-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: nest; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE nest WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE nest OWNER TO postgres;

\connect nest

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: CandidatureState; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CandidatureState" AS ENUM (
    'UNTREATED',
    'SHORTLISTED',
    'REFUSED',
    'ADMITTED'
);


ALTER TYPE public."CandidatureState" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'MANAGER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: candidatures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidatures (
    id uuid NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "currentJob" text,
    "graduationYear" integer NOT NULL,
    "graduationCountry" text NOT NULL,
    establishment text NOT NULL,
    "establishmentName" text NOT NULL,
    "degreeLevel" text NOT NULL,
    "degreeSpeciality" text NOT NULL,
    "degreeTitle" text NOT NULL,
    state public."CandidatureState" DEFAULT 'UNTREATED'::public."CandidatureState" NOT NULL,
    motive text,
    "isArchived" boolean NOT NULL,
    "dossierLink" text NOT NULL,
    "concourId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    "specialityId" uuid NOT NULL
);


ALTER TABLE public.candidatures OWNER TO postgres;

--
-- Name: concour_specialities_speciality; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.concour_specialities_speciality (
    "concourId" uuid NOT NULL,
    "specialityId" uuid NOT NULL
);


ALTER TABLE public.concour_specialities_speciality OWNER TO postgres;

--
-- Name: concours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.concours (
    id uuid NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    description text,
    location text,
    "positionsNumber" integer NOT NULL,
    "closingDate" timestamp(3) without time zone NOT NULL,
    "concourDate" timestamp(3) without time zone NOT NULL,
    closed boolean DEFAULT false NOT NULL,
    anounce text NOT NULL
);


ALTER TABLE public.concours OWNER TO postgres;

--
-- Name: specialities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specialities (
    id uuid NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    "nameArabic" text NOT NULL
);


ALTER TABLE public.specialities OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    email text NOT NULL,
    "userName" text,
    password text,
    "hashedRt" text,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    title text,
    cin text NOT NULL,
    phone text,
    "firstNameArabic" text,
    "lastNameArabic" text,
    "birthDate" timestamp(3) without time zone,
    "birthPlace" text,
    "birthPlaceArabic" text,
    address text,
    "addressArabic" text,
    city text,
    "cityArabic" text,
    "codePostal" text,
    roles public."Role" DEFAULT 'USER'::public."Role" NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: candidatures candidatures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatures
    ADD CONSTRAINT candidatures_pkey PRIMARY KEY (id);


--
-- Name: concour_specialities_speciality concour_specialities_speciality_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concour_specialities_speciality
    ADD CONSTRAINT concour_specialities_speciality_pkey PRIMARY KEY ("concourId", "specialityId");


--
-- Name: concours concours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concours
    ADD CONSTRAINT concours_pkey PRIMARY KEY (id);


--
-- Name: specialities specialities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specialities
    ADD CONSTRAINT specialities_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: candidatures_userId_specialityId_concourId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "candidatures_userId_specialityId_concourId_key" ON public.candidatures USING btree ("userId", "specialityId", "concourId");


--
-- Name: cin_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cin_idx ON public.users USING btree (cin);


--
-- Name: cnc_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cnc_id_idx ON public.concour_specialities_speciality USING btree ("concourId");


--
-- Name: cnd_cnc_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cnd_cnc_id_idx ON public.candidatures USING btree ("concourId");


--
-- Name: cnd_etbl_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cnd_etbl_idx ON public.candidatures USING btree (establishment);


--
-- Name: eml_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX eml_idx ON public.users USING btree (email);


--
-- Name: frst_nm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX frst_nm_idx ON public.users USING btree ("firstName");


--
-- Name: lst_nm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lst_nm_idx ON public.users USING btree ("lastName");


--
-- Name: spc_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spc_id_idx ON public.concour_specialities_speciality USING btree ("specialityId");


--
-- Name: specialities_nameArabic_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "specialities_nameArabic_key" ON public.specialities USING btree ("nameArabic");


--
-- Name: specialities_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX specialities_name_key ON public.specialities USING btree (name);


--
-- Name: users_cin_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_cin_key ON public.users USING btree (cin);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_phone_key ON public.users USING btree (phone);


--
-- Name: users_userName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_userName_key" ON public.users USING btree ("userName");


--
-- Name: candidatures candidatures_concourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatures
    ADD CONSTRAINT "candidatures_concourId_fkey" FOREIGN KEY ("concourId") REFERENCES public.concours(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: candidatures candidatures_specialityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatures
    ADD CONSTRAINT "candidatures_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES public.specialities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: candidatures candidatures_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidatures
    ADD CONSTRAINT "candidatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: concour_specialities_speciality concour_specialities_speciality_concourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concour_specialities_speciality
    ADD CONSTRAINT "concour_specialities_speciality_concourId_fkey" FOREIGN KEY ("concourId") REFERENCES public.concours(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: concour_specialities_speciality concour_specialities_speciality_specialityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.concour_specialities_speciality
    ADD CONSTRAINT "concour_specialities_speciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES public.specialities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.10 (Debian 13.10-1.pgdg110+1)
-- Dumped by pg_dump version 13.10 (Debian 13.10-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

