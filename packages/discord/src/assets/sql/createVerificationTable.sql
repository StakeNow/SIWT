/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

CREATE TABLE IF NOT EXISTS verification (id TEXT PRIMARY KEY, guild_id TEXT, role_id TEXT, discord_user_id TEXT, status TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TRIGGER verification_trigger AFTER UPDATE ON verification
 BEGIN
  update verification SET updated_at = datetime('now') WHERE id = NEW.id;
 END;
