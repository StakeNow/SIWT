/*
 * SPDX-FileCopyrightText: Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 * SPDX-FileCopyrightText: Copyright (C) 2021, Spruce Systems, Inc.
 *
 * SPDX-License-Identifier: MIT
 */

export default function () {
  this.route("siwt-auth", { path: "/discourse-siwt/auth" }, function () {
    this.route("index", { path: "/" });
  });
}
