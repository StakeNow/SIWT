#
# SPDX-FileCopyrightText: Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
# SPDX-FileCopyrightText: Copyright (C) 2021, Spruce Systems, Inc.
#
# SPDX-License-Identifier: MIT
#

# frozen_string_literal: true

DiscourseSiwt::Engine.routes.draw do
  get '/auth' => 'auth#index'
  get '/message' => 'auth#message'
end
