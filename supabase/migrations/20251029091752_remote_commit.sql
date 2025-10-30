


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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."guide_status" AS ENUM (
    'Draft',
    'Published',
    'Archived',
    'Approved'
);


ALTER TYPE "public"."guide_status" OWNER TO "postgres";


CREATE TYPE "public"."skill_level" AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced'
);


ALTER TYPE "public"."skill_level" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."bump_guides_search_on_steps"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE public.guides g
     SET search_vec = NULL -- will be recomputed by BEFORE trigger on UPDATE below
   WHERE g.id = NEW.guide_id;
  RETURN NEW;
END$$;


ALTER FUNCTION "public"."bump_guides_search_on_steps"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."freshness_bucket"("ts" timestamp with time zone) RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  SELECT CASE
    WHEN ts >= now() - INTERVAL '30 days' THEN 'Last 30 days'
    WHEN ts >= now() - INTERVAL '90 days' THEN 'Last 90 days'
    WHEN ts >= now() - INTERVAL '365 days' THEN 'Last 12 months'
    ELSE 'Older'
  END
$$;


ALTER FUNCTION "public"."freshness_bucket"("ts" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rpc_guides_search"("q" "text" DEFAULT NULL::"text", "p_type" "text"[] DEFAULT NULL::"text"[], "p_audience" "text"[] DEFAULT NULL::"text"[], "p_topic" "text"[] DEFAULT NULL::"text"[], "p_tool" "text"[] DEFAULT NULL::"text"[], "p_skill" "text"[] DEFAULT NULL::"text"[], "p_time" "text"[] DEFAULT NULL::"text"[], "p_format" "text"[] DEFAULT NULL::"text"[], "p_freshness" "text"[] DEFAULT NULL::"text"[], "p_popularity" "text"[] DEFAULT NULL::"text"[], "p_lang" "text"[] DEFAULT NULL::"text"[], "p_sort" "text" DEFAULT 'relevance'::"text", "p_page" integer DEFAULT 1, "p_page_size" integer DEFAULT 12) RETURNS TABLE("items" "jsonb", "total" bigint, "facets" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE _offset INT := GREATEST((p_page - 1) * p_page_size, 0);
BEGIN
  RETURN QUERY
  WITH base AS (
    SELECT
      g.*,
      public.time_bucket(g.estimated_time_min) AS time_bucket,
      public.freshness_bucket(g.last_updated_at) AS freshness
    FROM public.guides g
    WHERE g.status = 'Published'
  ),
  searched AS (
    SELECT b.*,
      CASE WHEN q IS NULL OR trim(q) = ''
           THEN 0.0
           ELSE ts_rank_cd(b.search_vec, plainto_tsquery('simple', q))
      END AS relevance
    FROM base b
  ),
  j AS (
    SELECT s.*,
      f.name AS format_name,
      -- arrays for OR filters
      (SELECT array_agg(aud.slug) FROM public.guide_audience_xref ax
        JOIN public.guide_audiences aud ON aud.id = ax.audience_id
       WHERE ax.guide_id = s.id) AS audiences,
      (SELECT array_agg(top.slug) FROM public.guide_topic_xref tx
        JOIN public.guide_topics top ON top.id = tx.topic_id
       WHERE tx.guide_id = s.id) AS topics,
      (SELECT array_agg(t.slug) FROM public.guide_tool_xref kx
        JOIN public.guide_tools t ON t.id = kx.tool_id
       WHERE kx.guide_id = s.id) AS tools,
      (SELECT array_agg(lang.slug) FROM public.guide_language_xref lx
        JOIN public.guide_languages lang ON lang.id = lx.language_id
       WHERE lx.guide_id = s.id) AS languages
    FROM searched s
    LEFT JOIN public.guide_format_xref fx ON fx.guide_id = s.id
    LEFT JOIN public.guide_formats f ON f.id = fx.format_id
  ),
  filtered AS (
    SELECT * FROM j
    WHERE
      (p_audience IS NULL OR audiences && p_audience)
      AND (p_topic    IS NULL OR topics    && p_topic)
      AND (p_tool     IS NULL OR tools     && p_tool)
      AND (p_skill    IS NULL OR skill_level::text = ANY (p_skill))
      AND (p_time     IS NULL OR time_bucket = ANY (p_time))
      AND (p_format   IS NULL OR format_name = ANY (p_format))
      AND (p_freshness IS NULL OR freshness = ANY (p_freshness))
      AND (p_lang     IS NULL OR languages && p_lang)
      AND (p_type     IS NULL OR format_name = ANY (p_type))
      AND (q IS NULL OR trim(q) = '' OR relevance > 0)
  ),
  counted AS (SELECT COUNT(*) AS total FROM filtered),
  ordered AS (
    SELECT * FROM filtered
    ORDER BY
      CASE WHEN p_sort = 'editorsPick' THEN (CASE WHEN is_editors_pick THEN 0 ELSE 1 END) END NULLS LAST,
      CASE WHEN p_sort = 'downloads' THEN download_count END DESC NULLS LAST,
      CASE WHEN p_sort = 'updated'   THEN last_updated_at END DESC NULLS LAST,
      CASE WHEN p_sort = 'relevance' THEN relevance END DESC NULLS LAST,
      last_updated_at DESC, id DESC
    OFFSET _offset LIMIT p_page_size
  ),
  facet_lang AS (
    SELECT lang.slug AS key, COUNT(*)::int AS ct
    FROM filtered f
    JOIN public.guide_language_xref lx ON lx.guide_id = f.id
    JOIN public.guide_languages lang ON lang.id = lx.language_id
    GROUP BY lang.slug ORDER BY ct DESC
  ),
  facet_audience AS (
    SELECT aud.slug, COUNT(*)::int AS ct
    FROM filtered f
    JOIN public.guide_audience_xref ax ON ax.guide_id = f.id
    JOIN public.guide_audiences aud ON aud.id = ax.audience_id
    GROUP BY aud.slug ORDER BY ct DESC
  ),
  facet_topic AS (
    SELECT t.slug, COUNT(*)::int AS ct
    FROM filtered f
    JOIN public.guide_topic_xref tx ON tx.guide_id = f.id
    JOIN public.guide_topics t ON t.id = tx.topic_id
    GROUP BY t.slug ORDER BY ct DESC
  ),
  facet_tool AS (
    SELECT tl.slug, COUNT(*)::int AS ct
    FROM filtered f
    JOIN public.guide_tool_xref kx ON kx.guide_id = f.id
    JOIN public.guide_tools tl ON tl.id = kx.tool_id
    GROUP BY tl.slug ORDER BY ct DESC
  ),
  facet_format AS (
    SELECT coalesce(f.name,'(none)') AS key, COUNT(*)::int AS ct
    FROM filtered fl
    LEFT JOIN public.guide_format_xref fx ON fx.guide_id = fl.id
    LEFT JOIN public.guide_formats f ON f.id = fx.format_id
    GROUP BY 1 ORDER BY ct DESC
  ),
  facet_skill AS (
    SELECT skill_level::text AS key, COUNT(*)::int AS ct
    FROM filtered GROUP BY 1 ORDER BY ct DESC
  ),
  facet_time AS (
    SELECT time_bucket AS key, COUNT(*)::int AS ct
    FROM filtered GROUP BY 1 ORDER BY ct DESC
  ),
  facet_freshness AS (
    SELECT freshness AS key, COUNT(*)::int AS ct
    FROM filtered GROUP BY 1 ORDER BY ct DESC
  ),
  facet_popularity AS (
    SELECT key, ct FROM (
      SELECT 'Editor’s Pick'::text AS key, COUNT(*)::int AS ct FROM filtered WHERE is_editors_pick
      UNION ALL
      SELECT 'Most Used', COUNT(*)::int FROM filtered WHERE download_count > 0
      UNION ALL
      SELECT 'Trending', COUNT(*)::int FROM filtered WHERE download_count > 0
        AND last_updated_at >= now() - INTERVAL '30 days'
    ) s
  ),
  items_json AS (
    SELECT jsonb_agg(jsonb_build_object(
      'id', o.id,
      'slug', o.slug,
      'title', o.title,
      'summary', o.summary,
      'heroImageUrl', o.hero_image_url,
      'skillLevel', o.skill_level,
      'estimatedTimeMin', o.estimated_time_min,
      'lastUpdatedAt', o.last_updated_at,
      'authorName', o.author_name,
      'authorOrg', o.author_org,
      'isEditorsPick', o.is_editors_pick,
      'downloadCount', o.download_count,
      'timeBucket', o.time_bucket,
      'freshness', o.freshness,
      'format', o.format_name,
      'audiences', (SELECT COALESCE(jsonb_agg(aud.slug), '[]'::jsonb)
                    FROM public.guide_audience_xref ax
                    JOIN public.guide_audiences aud ON aud.id = ax.audience_id
                    WHERE ax.guide_id = o.id),
      'topics', (SELECT COALESCE(jsonb_agg(t.slug), '[]'::jsonb)
                 FROM public.guide_topic_xref tx
                 JOIN public.guide_topics t ON t.id = tx.topic_id
                 WHERE tx.guide_id = o.id),
      'tools', (SELECT COALESCE(jsonb_agg(tl.slug), '[]'::jsonb)
                FROM public.guide_tool_xref kx
                JOIN public.guide_tools tl ON tl.id = kx.tool_id
                WHERE kx.guide_id = o.id),
      'languages', (SELECT COALESCE(jsonb_agg(lang.slug), '[]'::jsonb)
                    FROM public.guide_language_xref lx
                    JOIN public.guide_languages lang ON lang.id = lx.language_id
                    WHERE lx.guide_id = o.id),
      'hasTemplates', EXISTS (SELECT 1 FROM public.guide_templates gt WHERE gt.guide_id = o.id),
      'hasAttachments', EXISTS (SELECT 1 FROM public.guide_attachments ga WHERE ga.guide_id = o.id)
    )) AS items
    FROM ordered o
  ),
  facets_json AS (
    SELECT jsonb_build_object(
      'language', COALESCE((SELECT jsonb_agg(jsonb_build_object('key', key, 'count', ct)) FROM facet_lang), '[]'::jsonb),
      'audience', COALESCE((SELECT jsonb_agg(jsonb_build_object('key', slug, 'count', ct)) FROM facet_audience), '[]'::jsonb),
      'topic',    COALESCE((SELECT jsonb_agg(jsonb_build_object('key', slug, 'count', ct)) FROM facet_topic), '[]'::jsonb),
      'tool',     COALESCE((SELECT jsonb_agg(jsonb_build_object('key', slug, 'count', ct)) FROM facet_tool), '[]'::jsonb),
      'format',   COALESCE((SELECT jsonb_agg(jsonb_build_object('key', key,  'count', ct)) FROM facet_format), '[]'::jsonb),
      'skill',    COALESCE((SELECT jsonb_agg(jsonb_build_object('key', key,  'count', ct)) FROM facet_skill), '[]'::jsonb),
      'time',     COALESCE((SELECT jsonb_agg(jsonb_build_object('key', key,  'count', ct)) FROM facet_time), '[]'::jsonb),
      'freshness',COALESCE((SELECT jsonb_agg(jsonb_build_object('key', key,  'count', ct)) FROM facet_freshness), '[]'::jsonb),
      'popularity',COALESCE((SELECT jsonb_agg(jsonb_build_object('key', key, 'count', ct)) FROM facet_popularity), '[]'::jsonb)
    ) AS facets
  )
  SELECT
    COALESCE((SELECT items FROM items_json), '[]'::jsonb) AS items,
    (SELECT total FROM counted),
    (SELECT facets FROM facets_json);
END;
$$;


ALTER FUNCTION "public"."rpc_guides_search"("q" "text", "p_type" "text"[], "p_audience" "text"[], "p_topic" "text"[], "p_tool" "text"[], "p_skill" "text"[], "p_time" "text"[], "p_format" "text"[], "p_freshness" "text"[], "p_popularity" "text"[], "p_lang" "text"[], "p_sort" "text", "p_page" integer, "p_page_size" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."time_bucket"("minutes" integer) RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $$
  SELECT CASE
    WHEN minutes IS NULL THEN NULL
    WHEN minutes < 10 THEN 'Quick'
    WHEN minutes BETWEEN 10 AND 30 THEN 'Short'
    WHEN minutes BETWEEN 31 AND 60 THEN 'Medium'
    ELSE 'Deep Dive'
  END
$$;


ALTER FUNCTION "public"."time_bucket"("minutes" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_guides_search_vec"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  steps_text TEXT := '';
BEGIN
  -- Concatenate steps into one text blob
  SELECT string_agg(coalesce(s.title,'') || ' ' || coalesce(s.body,''), ' ')
    INTO steps_text
  FROM public.guide_steps s
  WHERE s.guide_id = NEW.id;

  NEW.search_vec :=
    setweight(to_tsvector('simple', coalesce(unaccent(NEW.title),'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(unaccent(NEW.summary),'')), 'B') ||
    setweight(to_tsvector('simple', coalesce(unaccent(steps_text),'')), 'C');

  RETURN NEW;
END$$;


ALTER FUNCTION "public"."update_guides_search_vec"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."guide_attachments" (
    "id" bigint NOT NULL,
    "guide_id" "uuid" NOT NULL,
    "kind" "text" NOT NULL,
    "title" "text" NOT NULL,
    "url" "text" NOT NULL,
    "size" "text",
    CONSTRAINT "guide_attachments_kind_check" CHECK (("kind" = ANY (ARRAY['file'::"text", 'link'::"text"])))
);


ALTER TABLE "public"."guide_attachments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."guide_attachments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."guide_attachments_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."guide_attachments_id_seq" OWNED BY "public"."guide_attachments"."id";



CREATE TABLE IF NOT EXISTS "public"."guide_audience_xref" (
    "guide_id" "uuid" NOT NULL,
    "audience_id" bigint NOT NULL
);


ALTER TABLE "public"."guide_audience_xref" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guide_audiences" (
    "id" bigint NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."guide_audiences" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."guide_audiences_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."guide_audiences_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."guide_audiences_id_seq" OWNED BY "public"."guide_audiences"."id";



CREATE TABLE IF NOT EXISTS "public"."guide_format_xref" (
    "guide_id" "uuid" NOT NULL,
    "format_id" bigint
);


ALTER TABLE "public"."guide_format_xref" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guide_formats" (
    "id" bigint NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."guide_formats" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."guide_formats_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."guide_formats_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."guide_formats_id_seq" OWNED BY "public"."guide_formats"."id";



CREATE TABLE IF NOT EXISTS "public"."guide_language_xref" (
    "guide_id" "uuid" NOT NULL,
    "language_id" bigint NOT NULL
);


ALTER TABLE "public"."guide_language_xref" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guide_languages" (
    "id" bigint NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."guide_languages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."guide_languages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."guide_languages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."guide_languages_id_seq" OWNED BY "public"."guide_languages"."id";



CREATE TABLE IF NOT EXISTS "public"."guide_steps" (
    "id" bigint NOT NULL,
    "guide_id" "uuid" NOT NULL,
    "position" integer NOT NULL,
    "title" "text" NOT NULL,
    "body" "text" NOT NULL
);


ALTER TABLE "public"."guide_steps" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."guide_steps_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."guide_steps_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."guide_steps_id_seq" OWNED BY "public"."guide_steps"."id";



CREATE TABLE IF NOT EXISTS "public"."guide_templates" (
    "id" bigint NOT NULL,
    "guide_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "url" "text" NOT NULL,
    "size" "text"
);


ALTER TABLE "public"."guide_templates" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."guide_templates_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."guide_templates_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."guide_templates_id_seq" OWNED BY "public"."guide_templates"."id";



CREATE TABLE IF NOT EXISTS "public"."guide_tool_xref" (
    "guide_id" "uuid" NOT NULL,
    "tool_id" bigint NOT NULL
);


ALTER TABLE "public"."guide_tool_xref" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guide_tools" (
    "id" bigint NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."guide_tools" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."guide_tools_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."guide_tools_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."guide_tools_id_seq" OWNED BY "public"."guide_tools"."id";



CREATE TABLE IF NOT EXISTS "public"."guide_topic_xref" (
    "guide_id" "uuid" NOT NULL,
    "topic_id" bigint NOT NULL
);


ALTER TABLE "public"."guide_topic_xref" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guide_topics" (
    "id" bigint NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."guide_topics" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."guide_topics_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."guide_topics_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."guide_topics_id_seq" OWNED BY "public"."guide_topics"."id";



CREATE TABLE IF NOT EXISTS "public"."guides" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "summary" "text",
    "hero_image_url" "text",
    "skill_level" "public"."skill_level" DEFAULT 'Beginner'::"public"."skill_level" NOT NULL,
    "estimated_time_min" integer,
    "last_updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_published_at" timestamp with time zone,
    "status" "public"."guide_status" DEFAULT 'Draft'::"public"."guide_status" NOT NULL,
    "author_name" "text",
    "author_org" "text",
    "is_editors_pick" boolean DEFAULT false NOT NULL,
    "download_count" integer DEFAULT 0 NOT NULL,
    "language" "text" DEFAULT 'English'::"text" NOT NULL,
    "search_vec" "tsvector",
    "domain" "text",
    "guide_type" "text",
    "function_area" "text",
    "complexity_level" "text",
    "document_url" "text",
    "body" "text",
    CONSTRAINT "guides_estimated_time_min_check" CHECK (("estimated_time_min" >= 0))
);


ALTER TABLE "public"."guides" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_guide_detail" AS
 SELECT "id",
    "slug",
    "title",
    "summary",
    "hero_image_url",
    "skill_level",
    "estimated_time_min",
    "last_updated_at",
    "last_published_at",
    "status",
    "author_name",
    "author_org",
    "is_editors_pick",
    "download_count",
    "language",
    "search_vec",
    "public"."time_bucket"("estimated_time_min") AS "time_bucket",
    "public"."freshness_bucket"("last_updated_at") AS "freshness",
    ( SELECT "jsonb_agg"("jsonb_build_object"('position', "s"."position", 'title', "s"."title", 'body', "s"."body") ORDER BY "s"."position") AS "jsonb_agg"
           FROM "public"."guide_steps" "s"
          WHERE ("s"."guide_id" = "g"."id")) AS "steps",
    ( SELECT "jsonb_agg"("jsonb_build_object"('kind', "a"."kind", 'title', "a"."title", 'url', "a"."url", 'size', "a"."size")) AS "jsonb_agg"
           FROM "public"."guide_attachments" "a"
          WHERE ("a"."guide_id" = "g"."id")) AS "attachments",
    ( SELECT "jsonb_agg"("jsonb_build_object"('title', "t"."title", 'url', "t"."url", 'size', "t"."size")) AS "jsonb_agg"
           FROM "public"."guide_templates" "t"
          WHERE ("t"."guide_id" = "g"."id")) AS "templates",
    ( SELECT "jsonb_agg"("aud"."slug") AS "jsonb_agg"
           FROM ("public"."guide_audience_xref" "ax"
             JOIN "public"."guide_audiences" "aud" ON (("aud"."id" = "ax"."audience_id")))
          WHERE ("ax"."guide_id" = "g"."id")) AS "audiences",
    ( SELECT "jsonb_agg"("top"."slug") AS "jsonb_agg"
           FROM ("public"."guide_topic_xref" "tx"
             JOIN "public"."guide_topics" "top" ON (("top"."id" = "tx"."topic_id")))
          WHERE ("tx"."guide_id" = "g"."id")) AS "topics",
    ( SELECT "jsonb_agg"("t"."slug") AS "jsonb_agg"
           FROM ("public"."guide_tool_xref" "kx"
             JOIN "public"."guide_tools" "t" ON (("t"."id" = "kx"."tool_id")))
          WHERE ("kx"."guide_id" = "g"."id")) AS "tools",
    ( SELECT "f"."name"
           FROM ("public"."guide_format_xref" "fx"
             JOIN "public"."guide_formats" "f" ON (("f"."id" = "fx"."format_id")))
          WHERE ("fx"."guide_id" = "g"."id")) AS "format"
   FROM "public"."guides" "g"
  WHERE ("status" = 'Published'::"public"."guide_status");


ALTER VIEW "public"."v_guide_detail" OWNER TO "postgres";


ALTER TABLE ONLY "public"."guide_attachments" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."guide_attachments_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."guide_audiences" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."guide_audiences_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."guide_formats" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."guide_formats_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."guide_languages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."guide_languages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."guide_steps" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."guide_steps_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."guide_templates" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."guide_templates_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."guide_tools" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."guide_tools_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."guide_topics" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."guide_topics_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."guide_attachments"
    ADD CONSTRAINT "guide_attachments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guide_audience_xref"
    ADD CONSTRAINT "guide_audience_xref_pkey" PRIMARY KEY ("guide_id", "audience_id");



ALTER TABLE ONLY "public"."guide_audiences"
    ADD CONSTRAINT "guide_audiences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guide_audiences"
    ADD CONSTRAINT "guide_audiences_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."guide_format_xref"
    ADD CONSTRAINT "guide_format_xref_pkey" PRIMARY KEY ("guide_id");



ALTER TABLE ONLY "public"."guide_formats"
    ADD CONSTRAINT "guide_formats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guide_formats"
    ADD CONSTRAINT "guide_formats_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."guide_language_xref"
    ADD CONSTRAINT "guide_language_xref_pkey" PRIMARY KEY ("guide_id", "language_id");



ALTER TABLE ONLY "public"."guide_languages"
    ADD CONSTRAINT "guide_languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guide_languages"
    ADD CONSTRAINT "guide_languages_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."guide_steps"
    ADD CONSTRAINT "guide_steps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guide_templates"
    ADD CONSTRAINT "guide_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guide_tool_xref"
    ADD CONSTRAINT "guide_tool_xref_pkey" PRIMARY KEY ("guide_id", "tool_id");



ALTER TABLE ONLY "public"."guide_tools"
    ADD CONSTRAINT "guide_tools_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guide_tools"
    ADD CONSTRAINT "guide_tools_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."guide_topic_xref"
    ADD CONSTRAINT "guide_topic_xref_pkey" PRIMARY KEY ("guide_id", "topic_id");



ALTER TABLE ONLY "public"."guide_topics"
    ADD CONSTRAINT "guide_topics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guide_topics"
    ADD CONSTRAINT "guide_topics_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."guides"
    ADD CONSTRAINT "guides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guides"
    ADD CONSTRAINT "guides_slug_key" UNIQUE ("slug");



CREATE INDEX "idx_attach_guide" ON "public"."guide_attachments" USING "btree" ("guide_id");



CREATE INDEX "idx_guide_language_xref_guide" ON "public"."guide_language_xref" USING "btree" ("guide_id");



CREATE INDEX "idx_guide_language_xref_lang" ON "public"."guide_language_xref" USING "btree" ("language_id");



CREATE INDEX "idx_guides_domain_type_func" ON "public"."guides" USING "btree" ("domain", "guide_type", "function_area");



CREATE INDEX "idx_guides_language" ON "public"."guides" USING "btree" ("language");



CREATE INDEX "idx_guides_last_updated" ON "public"."guides" USING "btree" ("last_updated_at" DESC);



CREATE INDEX "idx_guides_published" ON "public"."guides" USING "btree" ("id") WHERE ("status" = 'Published'::"public"."guide_status");



CREATE INDEX "idx_guides_search_vec" ON "public"."guides" USING "gin" ("search_vec");



CREATE INDEX "idx_guides_status" ON "public"."guides" USING "btree" ("status");



CREATE INDEX "idx_guides_updated" ON "public"."guides" USING "btree" ("last_updated_at" DESC);



CREATE INDEX "idx_steps_guide" ON "public"."guide_steps" USING "btree" ("guide_id", "position");



CREATE INDEX "idx_tmpl_guide" ON "public"."guide_templates" USING "btree" ("guide_id");



CREATE OR REPLACE TRIGGER "trg_guides_search" BEFORE INSERT OR UPDATE ON "public"."guides" FOR EACH ROW EXECUTE FUNCTION "public"."update_guides_search_vec"();



CREATE OR REPLACE TRIGGER "trg_steps_bump_search" AFTER INSERT OR DELETE OR UPDATE ON "public"."guide_steps" FOR EACH ROW EXECUTE FUNCTION "public"."bump_guides_search_on_steps"();



ALTER TABLE ONLY "public"."guide_attachments"
    ADD CONSTRAINT "guide_attachments_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_audience_xref"
    ADD CONSTRAINT "guide_audience_xref_audience_id_fkey" FOREIGN KEY ("audience_id") REFERENCES "public"."guide_audiences"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_audience_xref"
    ADD CONSTRAINT "guide_audience_xref_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_format_xref"
    ADD CONSTRAINT "guide_format_xref_format_id_fkey" FOREIGN KEY ("format_id") REFERENCES "public"."guide_formats"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."guide_format_xref"
    ADD CONSTRAINT "guide_format_xref_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_language_xref"
    ADD CONSTRAINT "guide_language_xref_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_language_xref"
    ADD CONSTRAINT "guide_language_xref_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."guide_languages"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."guide_steps"
    ADD CONSTRAINT "guide_steps_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_templates"
    ADD CONSTRAINT "guide_templates_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_tool_xref"
    ADD CONSTRAINT "guide_tool_xref_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_tool_xref"
    ADD CONSTRAINT "guide_tool_xref_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "public"."guide_tools"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_topic_xref"
    ADD CONSTRAINT "guide_topic_xref_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guide_topic_xref"
    ADD CONSTRAINT "guide_topic_xref_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."guide_topics"("id") ON DELETE CASCADE;



ALTER TABLE "public"."guide_language_xref" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "guide_language_xref_public_select" ON "public"."guide_language_xref" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."guides" "g"
  WHERE (("g"."id" = "guide_language_xref"."guide_id") AND ("g"."status" = 'Published'::"public"."guide_status")))));



ALTER TABLE "public"."guide_languages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "guide_languages_public_select" ON "public"."guide_languages" FOR SELECT USING (true);



ALTER TABLE "public"."guides" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "guides_public_select" ON "public"."guides" FOR SELECT USING (("status" = 'Approved'::"public"."guide_status"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."bump_guides_search_on_steps"() TO "anon";
GRANT ALL ON FUNCTION "public"."bump_guides_search_on_steps"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."bump_guides_search_on_steps"() TO "service_role";



GRANT ALL ON FUNCTION "public"."freshness_bucket"("ts" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."freshness_bucket"("ts" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."freshness_bucket"("ts" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."rpc_guides_search"("q" "text", "p_type" "text"[], "p_audience" "text"[], "p_topic" "text"[], "p_tool" "text"[], "p_skill" "text"[], "p_time" "text"[], "p_format" "text"[], "p_freshness" "text"[], "p_popularity" "text"[], "p_lang" "text"[], "p_sort" "text", "p_page" integer, "p_page_size" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."rpc_guides_search"("q" "text", "p_type" "text"[], "p_audience" "text"[], "p_topic" "text"[], "p_tool" "text"[], "p_skill" "text"[], "p_time" "text"[], "p_format" "text"[], "p_freshness" "text"[], "p_popularity" "text"[], "p_lang" "text"[], "p_sort" "text", "p_page" integer, "p_page_size" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."rpc_guides_search"("q" "text", "p_type" "text"[], "p_audience" "text"[], "p_topic" "text"[], "p_tool" "text"[], "p_skill" "text"[], "p_time" "text"[], "p_format" "text"[], "p_freshness" "text"[], "p_popularity" "text"[], "p_lang" "text"[], "p_sort" "text", "p_page" integer, "p_page_size" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "postgres";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "anon";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "service_role";



GRANT ALL ON FUNCTION "public"."show_limit"() TO "postgres";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."time_bucket"("minutes" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."time_bucket"("minutes" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."time_bucket"("minutes" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent"("regdictionary", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_init"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."unaccent_lexize"("internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_guides_search_vec"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_guides_search_vec"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_guides_search_vec"() TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "service_role";


















GRANT ALL ON TABLE "public"."guide_attachments" TO "anon";
GRANT ALL ON TABLE "public"."guide_attachments" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_attachments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."guide_attachments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guide_attachments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guide_attachments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."guide_audience_xref" TO "anon";
GRANT ALL ON TABLE "public"."guide_audience_xref" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_audience_xref" TO "service_role";



GRANT ALL ON TABLE "public"."guide_audiences" TO "anon";
GRANT ALL ON TABLE "public"."guide_audiences" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_audiences" TO "service_role";



GRANT ALL ON SEQUENCE "public"."guide_audiences_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guide_audiences_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guide_audiences_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."guide_format_xref" TO "anon";
GRANT ALL ON TABLE "public"."guide_format_xref" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_format_xref" TO "service_role";



GRANT ALL ON TABLE "public"."guide_formats" TO "anon";
GRANT ALL ON TABLE "public"."guide_formats" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_formats" TO "service_role";



GRANT ALL ON SEQUENCE "public"."guide_formats_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guide_formats_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guide_formats_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."guide_language_xref" TO "anon";
GRANT ALL ON TABLE "public"."guide_language_xref" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_language_xref" TO "service_role";



GRANT ALL ON TABLE "public"."guide_languages" TO "anon";
GRANT ALL ON TABLE "public"."guide_languages" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_languages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."guide_languages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guide_languages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guide_languages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."guide_steps" TO "anon";
GRANT ALL ON TABLE "public"."guide_steps" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_steps" TO "service_role";



GRANT ALL ON SEQUENCE "public"."guide_steps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guide_steps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guide_steps_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."guide_templates" TO "anon";
GRANT ALL ON TABLE "public"."guide_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_templates" TO "service_role";



GRANT ALL ON SEQUENCE "public"."guide_templates_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guide_templates_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guide_templates_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."guide_tool_xref" TO "anon";
GRANT ALL ON TABLE "public"."guide_tool_xref" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_tool_xref" TO "service_role";



GRANT ALL ON TABLE "public"."guide_tools" TO "anon";
GRANT ALL ON TABLE "public"."guide_tools" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_tools" TO "service_role";



GRANT ALL ON SEQUENCE "public"."guide_tools_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guide_tools_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guide_tools_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."guide_topic_xref" TO "anon";
GRANT ALL ON TABLE "public"."guide_topic_xref" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_topic_xref" TO "service_role";



GRANT ALL ON TABLE "public"."guide_topics" TO "anon";
GRANT ALL ON TABLE "public"."guide_topics" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_topics" TO "service_role";



GRANT ALL ON SEQUENCE "public"."guide_topics_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."guide_topics_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."guide_topics_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."guides" TO "anon";
GRANT ALL ON TABLE "public"."guides" TO "authenticated";
GRANT ALL ON TABLE "public"."guides" TO "service_role";



GRANT ALL ON TABLE "public"."v_guide_detail" TO "anon";
GRANT ALL ON TABLE "public"."v_guide_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."v_guide_detail" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


