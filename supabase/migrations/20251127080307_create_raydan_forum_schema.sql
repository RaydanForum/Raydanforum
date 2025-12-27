/*
  # إنشاء قاعدة بيانات منتدى ريدان للعلاقات الاستراتيجية

  ## الجداول الجديدة
  
  ### 1. sections (الأقسام الرئيسية)
    - `id` (uuid, primary key)
    - `title_ar` (text) - عنوان القسم بالعربية
    - `title_en` (text) - عنوان القسم بالإنجليزية
    - `description_ar` (text) - وصف القسم بالعربية
    - `description_en` (text) - وصف القسم بالإنجليزية
    - `slug` (text, unique) - معرف فريد للقسم
    - `icon` (text) - أيقونة القسم
    - `order_index` (integer) - ترتيب العرض
    - `is_active` (boolean) - حالة القسم
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 2. categories (التصنيفات الفرعية)
    - `id` (uuid, primary key)
    - `section_id` (uuid, foreign key)
    - `title_ar` (text)
    - `title_en` (text)
    - `description_ar` (text)
    - `description_en` (text)
    - `slug` (text, unique)
    - `order_index` (integer)
    - `is_active` (boolean)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 3. articles (المقالات والمحتوى)
    - `id` (uuid, primary key)
    - `category_id` (uuid, foreign key)
    - `author_id` (uuid, foreign key)
    - `title_ar` (text)
    - `title_en` (text)
    - `content_ar` (text)
    - `content_en` (text)
    - `excerpt_ar` (text)
    - `excerpt_en` (text)
    - `slug` (text, unique)
    - `featured_image` (text)
    - `is_featured` (boolean)
    - `views_count` (integer)
    - `published_at` (timestamptz)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 4. users (المستخدمين)
    - `id` (uuid, primary key, references auth.users)
    - `full_name_ar` (text)
    - `full_name_en` (text)
    - `bio_ar` (text)
    - `bio_en` (text)
    - `avatar_url` (text)
    - `role` (text) - admin, editor, author, user
    - `is_active` (boolean)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 5. comments (التعليقات)
    - `id` (uuid, primary key)
    - `article_id` (uuid, foreign key)
    - `user_id` (uuid, foreign key)
    - `content` (text)
    - `is_approved` (boolean)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## الأمان
    - تفعيل RLS على جميع الجداول
    - سياسات قراءة عامة للمحتوى المنشور
    - سياسات كتابة محدودة للمستخدمين المصرح لهم
*/

-- إنشاء جدول الأقسام
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  description_ar text DEFAULT '',
  description_en text DEFAULT '',
  slug text UNIQUE NOT NULL,
  icon text DEFAULT 'folder',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول التصنيفات
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  title_ar text NOT NULL,
  title_en text NOT NULL,
  description_ar text DEFAULT '',
  description_en text DEFAULT '',
  slug text UNIQUE NOT NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name_ar text DEFAULT '',
  full_name_en text DEFAULT '',
  bio_ar text DEFAULT '',
  bio_en text DEFAULT '',
  avatar_url text DEFAULT '',
  role text DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'author', 'user')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول المقالات
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text DEFAULT '',
  content_en text DEFAULT '',
  excerpt_ar text DEFAULT '',
  excerpt_en text DEFAULT '',
  slug text UNIQUE NOT NULL,
  featured_image text DEFAULT '',
  is_featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول التعليقات
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS على جميع الجداول
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- سياسات الأقسام (قراءة عامة للأقسام النشطة)
CREATE POLICY "Anyone can view active sections"
  ON sections FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage sections"
  ON sections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- سياسات التصنيفات (قراءة عامة للتصنيفات النشطة)
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins and editors can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  );

-- سياسات المستخدمين
CREATE POLICY "Anyone can view active user profiles"
  ON users FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- سياسات المقالات (قراءة عامة للمقالات المنشورة)
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Authors can manage own articles"
  ON articles FOR ALL
  TO authenticated
  USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  );

-- سياسات التعليقات
CREATE POLICY "Anyone can view approved comments"
  ON comments FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments"
  ON comments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  );

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_categories_section ON categories(section_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- إدراج بيانات تجريبية للأقسام (مستوحاة من مركز صنعاء)
INSERT INTO sections (title_ar, title_en, slug, description_ar, description_en, icon, order_index, is_active) VALUES
  ('المنشورات', 'Publications', 'publications', 'التقارير والأبحاث والتحليلات الاستراتيجية', 'Reports, research, and strategic analysis', 'file-text', 1, true),
  ('البرامج', 'Programs', 'programs', 'البرامج والمشاريع الاستراتيجية', 'Strategic programs and projects', 'briefcase', 2, true),
  ('الأخبار والفعاليات', 'News & Events', 'news-events', 'آخر الأخبار والفعاليات والمؤتمرات', 'Latest news, events, and conferences', 'calendar', 3, true),
  ('البودكاست', 'Podcasts', 'podcasts', 'حلقات صوتية عن القضايا الاستراتيجية', 'Audio episodes on strategic issues', 'radio', 4, true),
  ('الترجمات', 'Translations', 'translations', 'ترجمات المقالات والأبحاث الهامة', 'Translations of important articles and research', 'languages', 5, true),
  ('عن المنتدى', 'About Us', 'about', 'معلومات عن منتدى ريدان ورؤيته ورسالته', 'Information about Raydan Forum, its vision and mission', 'info', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- إدراج تصنيفات فرعية
INSERT INTO categories (section_id, title_ar, title_en, slug, description_ar, description_en, order_index) 
SELECT 
  s.id,
  'التحليلات',
  'Analysis',
  'analysis',
  'تحليلات معمقة للأوضاع السياسية والاستراتيجية',
  'In-depth analysis of political and strategic situations',
  1
FROM sections s WHERE s.slug = 'publications'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (section_id, title_ar, title_en, slug, description_ar, description_en, order_index) 
SELECT 
  s.id,
  'التقارير الدورية',
  'Periodic Reports',
  'periodic-reports',
  'تقارير دورية عن التطورات الإقليمية',
  'Periodic reports on regional developments',
  2
FROM sections s WHERE s.slug = 'publications'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (section_id, title_ar, title_en, slug, description_ar, description_en, order_index) 
SELECT 
  s.id,
  'أوراق السياسات',
  'Policy Papers',
  'policy-papers',
  'أوراق سياسات وتوصيات استراتيجية',
  'Policy papers and strategic recommendations',
  3
FROM sections s WHERE s.slug = 'publications'
ON CONFLICT (slug) DO NOTHING;