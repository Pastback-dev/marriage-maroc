-- ============================================
-- Arsi Wedding App - Supabase Migration SQL
-- Paste this into: Supabase Dashboard > SQL Editor > New Query
-- Then click RUN
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL DEFAULT '',
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  service_category TEXT,
  city TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS providers (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  price_min INTEGER NOT NULL,
  price_max INTEGER NOT NULL,
  images TEXT[] NOT NULL,
  packages JSONB NOT NULL,
  rating INTEGER DEFAULT 5,
  contact_info TEXT
);

CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  guest_count INTEGER NOT NULL,
  total_budget INTEGER NOT NULL,
  city TEXT NOT NULL,
  wedding_style TEXT NOT NULL,
  selected_providers JSONB,
  total_cost INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  plan_id INTEGER,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price_per_guest INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mood_boards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mood_board_items (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_photos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Session store table (for express-session)
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);

-- Users
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (1, 'rozaki2234@gmail.com', '10235872b3b1b57529151c7618476c656876b62d682230f5cbea9c47cc3637a77ab8544ac5e2ae6bc898dc015a204588e7141ee488bcf3b3c19d4b5974617d30.4dd2af3c1475eda903b727bba94b223e', 'zaki', 'client', NULL, NULL, FALSE, '2026-02-18T16:25:02.258Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (2, 'Ahmedd', 'e444df4e2defb3220c113b1adea6ac7535c9b8e9ba5605d85c8f956e712246c8af9ff3b696099cbbf36899a48df769ec6dfa2ad69c105218d897dd75f496e31b.59a34b58399a69ba45f33d12dafc19f3', 'Ahmedal', 'client', NULL, NULL, FALSE, '2026-02-28T15:38:38.472Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (3, 'C-2022-000945', 'eb631e607df0c1488319176498b5bf2bbfabf257d7accd85c5d80c55fb7ad134497607f133966f52c48cf410bb3c06a2614cbf87b3e2fc1e06984b5cc8b555c3.5a7d492d2decb5a4dba7dfa2e01dd923', 'ghfty7576dft', 'client', NULL, NULL, FALSE, '2026-02-28T16:07:19.647Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (4, 'Suissiis', 'ea25c44221cb08920e97b49eac458834cfad71a2f31d3159cbe9014db8b6d1d79b900db38e806831398144b8193cd852adc3318834de8d11a88114c8a6bdd957.0d8c1de471f10060c7bde2e4e1c5e341', 'Dkdkskkd', 'client', NULL, NULL, FALSE, '2026-02-28T22:41:26.040Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (37, 'zakariaelrhanmi@gmail.com', 'dcb36116dabad313a194c34cf3c5e19e80ef075a7904130d1094b51554c4b97684cb3041ba57b77487e2903d5ac1964362fa0dd43d3d9daf6db24c34a2cee78a.fa33f4af21c240ab9412992aba0283f6', 'zaki figo', 'client', NULL, NULL, TRUE, '2026-02-28T23:17:01.612Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (38, 'admin', 'df18e2866c893b2fe2a8248889ce2f3a7d99824829967536f7a7f2e58f7dcf4f2ed78361e529f5dc2ee747a313fbd7057c4378440c447bca34e2bd2de36cea1e.61e19caa24110ba7e802016defe82ba2', 'zakaria elrhanmi', 'client', NULL, NULL, TRUE, '2026-02-28T23:23:57.709Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (39, 'testuser_1772373230890@example.com', '896f7c9d62996f1cced3c6d2b03a589707051b076709c6dac9777d8235a074a7e105be31ac681d767f9d79320b1c3453de8461d1ab9af61e43532616efb6dea6.1951c4cc95fcd00725b3b2b5293cd6fb', 'Test User', 'client', NULL, NULL, FALSE, '2026-03-01T13:54:36.883Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (40, 'tfttt@gmail.com', 'd6510f891a1fdf0f452b5df86f34b67e5a78bdb2f07e7f0f2e36c4a90896f177383d9d21ee70e1f1d856038200712e2db85252f9df44e5e50f73fbc1170a5391.d395b28616f9c1e0a53ae93f97faec2b', 'ghfty7576dft', 'client', NULL, NULL, FALSE, '2026-03-01T13:57:31.255Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (41, 'freshuser_1772373769323@example.com', '65bcd016ffb8ae17fc3a4c511458ad86c06901f18335c39e8c86b9d7a974570f33913da834350c8a96e49fd20b0187f5915c4627cb38fcb0084f39d9ec8cf785.a18d1de07d869c544abdb90a17c76ad4', 'Fresh User', 'client', NULL, NULL, FALSE, '2026-03-01T14:03:22.471Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (42, 'fapivay590@naobk.com', '2ae46cf7f992d3c5971d60687dd4f22cc00238f54b2866b6ee9261f5c11152ddf99c2800fd85ed32765090bafe00c18d34d9a812109b4c058a86a2a5fc3d873e.9b8a91d1307a8e14e0bd2c4b20ce3b1e', 'John Leau', 'client', NULL, NULL, FALSE, '2026-03-01T14:03:42.258Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (43, 'provider_1772378488295@test.com', 'e3ca65a9eaa8d4d58ef39c86c763d8391811581598734e9ccc3e34def9346c875340dff06e1d5206d8ad6487be813f706e0ff1bcbe56da2b6126f3f399fbfd87.0a4d2cef4990aa5a810be895e63eb69d', 'Test Catering', 'provider', NULL, NULL, FALSE, '2026-03-01T15:22:23.020Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (44, 'providerlogin_1772378638471@test.com', '2bd60fe960e3d24823e206419bddd9d706def17c181c176dbcc7a0843c566042ebdc79a305cf55a90867f996568ffb3afda576ddd4d17d7ddfb63177e2896897.7b37669fabfbad0700666c5b0e6813c4', 'My Wedding Hall', 'provider', NULL, NULL, FALSE, '2026-03-01T15:24:26.171Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (45, 'fafas764789@scubalm.com', '31f37b559f736cbd11124ee1abbb803de57d4a31f30ff654a8529bb1769da9021f64716de001ac59bb3231d97a19212dbac9ed72db558b62e92d652f0cd78138.18b0d71b8cb4a3397350906ddc832790', 'John Leau', 'provider', NULL, NULL, FALSE, '2026-03-01T15:25:38.340Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (46, 'caterer_1772381242319@test.com', 'f78a6b91418c11a87c1c225716eaddea8612773b85d185608d83702c747cd7c6fef4b0881da4a894c95f8ea9c59ea027b7ce7848bbd05bfed1dc905b09654762.8e84e0116028710f13d6531130bc3ac9', 'My Catering Co', 'provider', NULL, NULL, FALSE, '2026-03-01T16:07:54.139Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (47, 'fapivay5901@naobk.com', 'bf5d62473287323540331196c172c88a75f0f7eef7ab111426465ff35587f6f20d6e57751b62356faf5cc9eef1550a1ddad9c887c7c8ad82065f3fba63a6439a.5eaf05fde46711885cf94dd964eb3287', 'John Leauee', 'provider', 'traiteur', 'Settat', FALSE, '2026-03-01T16:09:30.753Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, username, password, display_name, role, service_category, city, is_admin, created_at) VALUES (48, 'fapivay5901@anaobk.com', '04e574a795d008d525961a6b4c86180988302ee534d3c227c902e170836b2ba0565ee11a4fbb2ed62221a35954dda454bfc8212ccd7c307fe94e531475144835.71ecb4cd5f7d611b1e255046c4a3d4a6', 'Asta Need', 'provider', 'decoration', NULL, FALSE, '2026-03-01T16:31:36.074Z') ON CONFLICT (id) DO NOTHING;
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Providers
INSERT INTO providers (id, category, name, description, city, price_min, price_max, images, packages, rating, contact_info) VALUES (1, 'traiteur', 'Traiteur Maghreb Feasts', 'Authentic Moroccan cuisine with royal service.', 'Casablanca', 300, 800, '{"https://images.unsplash.com/photo-1555244162-803834f70033?w=800","https://images.unsplash.com/photo-1547573854-ea9427f85d29?w=800"}', '{[object Object]}', 5, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO providers (id, category, name, description, city, price_min, price_max, images, packages, rating, contact_info) VALUES (2, 'hall', 'Palais des Roses', 'Luxurious hall with crystal chandeliers.', 'Rabat', 15000, 40000, '{"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800","https://images.unsplash.com/photo-1519225421980-715cb0202128?w=800"}', '{[object Object]}', 5, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO providers (id, category, name, description, city, price_min, price_max, images, packages, rating, contact_info) VALUES (3, 'dj', 'DJ Youssef Ambiance', 'Best Chaabi and Sharqi mixes.', 'Marrakech', 2000, 5000, '{"https://images.unsplash.com/photo-1571266028243-371695063ad6?w=800"}', '{[object Object]}', 5, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO providers (id, category, name, description, city, price_min, price_max, images, packages, rating, contact_info) VALUES (4, 'cameraman', 'Lens Memories', 'Cinematic 4K wedding films.', 'Tangier', 4000, 10000, '{"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"}', '{[object Object]}', 5, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO providers (id, category, name, description, city, price_min, price_max, images, packages, rating, contact_info) VALUES (5, 'traiteur', 'Atlas Catering', 'Modern touch on traditional dishes.', 'Marrakech', 250, 600, '{"https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800"}', '{[object Object]}', 5, NULL) ON CONFLICT (id) DO NOTHING;
SELECT setval('providers_id_seq', (SELECT MAX(id) FROM providers));

-- Plans
INSERT INTO plans (id, user_id, guest_count, total_budget, city, wedding_style, selected_providers, total_cost, created_at) VALUES (1, 1, 100, 50000, 'Casablanca', 'Traditional', '{"dj":3,"hall":2,"traiteur":5,"cameraman":4}', 46000, '2026-02-18T16:25:08.395Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO plans (id, user_id, guest_count, total_budget, city, wedding_style, selected_providers, total_cost, created_at) VALUES (2, 3, 100, 50000, 'Casablanca', 'Royal', '{"dj":3,"hall":2,"traiteur":5,"cameraman":4}', 46000, '2026-02-28T16:07:29.100Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO plans (id, user_id, guest_count, total_budget, city, wedding_style, selected_providers, total_cost, created_at) VALUES (3, 4, 100, 50000, 'Casablanca', 'Traditional', '{"dj":3,"hall":2,"traiteur":5,"cameraman":4}', 46000, '2026-02-28T22:41:32.435Z') ON CONFLICT (id) DO NOTHING;
SELECT setval('plans_id_seq', (SELECT MAX(id) FROM plans));

-- Mood Boards
INSERT INTO mood_boards (id, user_id, title, created_at) VALUES (1, 47, 'test', '2026-03-01T16:17:25.313Z') ON CONFLICT (id) DO NOTHING;
SELECT setval('mood_boards_id_seq', (SELECT MAX(id) FROM mood_boards));

