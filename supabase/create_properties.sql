-- =============================================
-- propertiesテーブル作成 & RLS設定
-- Supabase の SQL Editor でこのファイルを実行してください
-- =============================================

-- propertiesテーブルの作成
CREATE TABLE properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT        NOT NULL,              -- 物件名
  rent        INTEGER     NOT NULL CHECK (rent >= 0), -- 家賃（円）
  area        TEXT        NOT NULL,              -- エリア名
  floor_plan  TEXT        NOT NULL,              -- 間取り（例: 1LDK）
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security（RLS）の有効化
-- =============================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 自分が登録した物件のみ参照できる
CREATE POLICY "自分の物件のみ参照可能" ON properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- 自分のuser_idでのみ登録できる
CREATE POLICY "自分の物件のみ登録可能" ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
CREATE POLICY "自分の物件のみ更新可能" ON properties
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
CREATE POLICY "自分の物件のみ削除可能" ON properties
  FOR DELETE
  USING (auth.uid() = user_id);
